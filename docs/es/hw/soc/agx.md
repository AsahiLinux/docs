---
title: GPU de Apple (AGX)
summary:
  Notas de ingeniería inversa de Lina sobre AGX, la GPU derivada de PowerVR de Apple
---

# Notas de AGX de Lina

Lector, ten cuidado, aquí hay dragones. Dragones con forma de puntero. Muchos de ellos.

Este documento se centra en la arquitectura AGX desde el punto de vista de un controlador del kernel. No discutirá aspectos que son puramente de interés del espacio de usuario, como sombreadores, muestreo de texturas, codificadores de comandos de pipeline, etc.

## Descripción General

AGX es un diseño de GPU *muy* inspirado en PowerVR (pero en gran parte personalizado). La interfaz del sistema operativo está mediada casi exclusivamente a través de un coprocesador ASC (ARM64), que ejecuta firmware de Apple. Toda la comunicación ocurre a través de memoria compartida y algunos mensajes de doorbell de buzón. Toda la memoria es coherente hasta donde podemos decir (no hemos usado una sola instrucción de gestión de caché y todo sigue funcionando).

Las capas involucradas en obtener un triángulo en la pantalla son aproximadamente:

* UAT (MMU)
* Inicialización del Firmware
* Canales GPU
* Contextos GPU
* Colas de Trabajo
* Elementos de Trabajo
* Micro Secuencias
* Gestión del buffer del Tiler
* Gestión de Eventos
* (Todo el material del espacio de usuario va aquí)

### UAT (Unified Address Translator)

El UAT es el MMU de AGX. Es esencialmente el MMU ARM64, y usa tablas de páginas idénticas. De hecho, el ASC de AGX literalmente configura las bases de las tablas de páginas UAT como sus registros TTBR0/1. *Puede* haber algún matiz en cómo la GPU propiamente interpreta los permisos de página y otros atributos en comparación con cómo lo haría una CPU; esto aún está en gran parte sin explorar.

Las VAs de GPU son de 40 bits, con el bit superior extendido con signo a 64 bits. Como con ARM64, hay una división del espacio de direcciones kernel/usuario. Las páginas son siempre de 16K.

Hay una página global y fija de memoria que contiene las direcciones base de las tablas de páginas del contexto GPU. Hay hasta 16 contextos (TODO: verificar que este límite es real y no controlado por el controlador), cada uno con dos registros base para las tablas de páginas kernel/usuario.

macOS siempre usa el contexto 0 solo para el kernel (sin páginas de usuario para ese) y comparte la mitad del kernel de las tablas de páginas para todos los contextos. El espacio de direcciones VA de usuario es único por contexto.

El espacio de direcciones del kernel literalmente mapea también el firmware ASC, ya que *es* la tabla de páginas de la CPU del ASC. Esto está en un rango de VA que el firmware controla por sí mismo, y configura durante la inicialización. El sistema operativo host es responsable del resto de las tablas de páginas en esta mitad del espacio de direcciones, que es donde van todas las estructuras de control de la GPU.

Nota: el firmware es cargado por el bootloader y protegido contra escritura. Si bien secuestrar las tablas de páginas para tomar el control completo del firmware AGX es plausible con el diseño actual, claramente la intención y dirección de Apple es que los firmwares ASC estén endurecidos contra la toma de control, por lo que no consideraremos usar nuestro propio firmware en este momento. Hablar con el firmware de Apple para hacer que esta GPU funcione se considera no negociable.

TODO: Invalidación TLB de UAT. Hay algo de memoria compartida involucrada y tocar el firmware.

### Inicialización del Firmware

La comunicación del firmware usa el framework RTKit común a otros ASCs, que no se cubrirá aquí. Solo la gestión de memoria/buffer es diferente (otros ASCs usan IOMMUs DART, filtros de dirección SART, o solo pueden acceder a SRAM dedicada).

Para inicializar la GPU, se envía un único mensaje que contiene un puntero a una estructura de datos de inicialización. Esta es una estructura de datos anidada compleja con más punteros, que contiene cosas como:

* Punteros al área de control del buffer anular del canal y área del buffer anular
* Datos de gestión de energía incluyendo estados DVFS
* Regiones de memoria compartida que contienen varios datos (en gran parte desconocidos)
* Coeficientes de conversión de espacio de color
* Lista de mapeo MMIO (el SO es responsable de mapear las regiones MMIO que el ASC necesita acceder)
* Información de diseño UAT
* Varios buffers desconocidos

Estructuras de datos: ver [initdata.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/initdata.py)

### Canales

La comunicación con el firmware ocurre a través de buffers anulares de canal. Los canales contienen mensajes pequeños de tamaño fijo entregados en línea en los buffers anulares. Una estructura de control tiene los punteros de lectura/escritura del buffer y el tamaño, alineados a línea de caché para que la GPU/CPU no reboten cosas todo el tiempo. Hay canales en ambas direcciones.

Estructuras de datos: ver [channels.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/channels.py)

#### Canales CPU->GPU

* Canales de Trabajo: cuatro grupos (0-3), cada uno con tres canales, uno por tipo de trabajo GPU
  * TA (Tile Accelerator; procesamiento de vértices)
  * 3D (3D; procesamiento de píxeles)
  * CP (Compute)
   
  TODO: probablemente hay algún esquema de prioridad para el trabajo enviado a diferentes canales.

* Canal DeviceControl, para mensajes de todo el dispositivo (por ejemplo, inicialización de GPU y presumiblemente cosas relacionadas con la gestión de energía)

#### Canales GPU->CPU

* Evento: notificaciones de eventos relacionados con el trabajo
  * Eventos de bandera de finalización de trabajo
    * Estos tienen un array de 128 bits que indica qué índices de evento se están activando
  * Notificaciones de fallo
    * Los fallos de GPU parecen manejarse bastante mal como un proceso de detención del mundo; macOS en realidad se va volcando registros MMIO de GPU directamente, y el firmware parece estar bastante desorientado sobre qué hacer.
* Mensajes de estadísticas
  * Ignoramos estos. El firmware se quejará una vez si el buffer se desborda, pero es inofensivo.
* Syslogs del firmware
  * Este es extraño en que hay múltiples subcanales por alguna razón, con estructuras de control dispuestas contiguamente.
* Un canal desconocido (¿trazado?)

### Contextos GPU

Los contextos GPU se mapean a algunas estructuras compartidas pequeñas, algunas pobladas por el ASC. Esto está mayormente aún por determinar.

### Colas de Trabajo

Una cola de trabajo contiene elementos de trabajo de un tipo específico. Generalmente hay múltiples colas de trabajo por contexto (por ejemplo, al menos 3D y TA para renderizado 3D). Las colas de trabajo están representadas por algunas estructuras, principalmente una estructura principal inicializada por la CPU y gestionada por la GPU, con punteros a estructuras de contexto, un buffer anular, un bloque de punteros de buffer anular, y otros. El buffer anular es un array de punteros a elementos individuales (no en línea).

Para procesar una cola de trabajo, el SO envía un mensaje en un canal de trabajo con un puntero a la estructura de gestión de la cola de trabajo y el puntero de escritura más reciente del buffer anular, más un índice de evento para señalar la finalización del trabajo, y una bandera que indica si esta es la primera presentación de una nueva cola de trabajo.

Estructuras de datos: ver [cmdqueue.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/cmdqueue.py)

### Elementos de Trabajo

Los elementos de trabajo representan trabajo de GPU u operaciones relacionadas. Estos son buffers bastante grandes que contienen subestructuras incrustadas en un diseño particular (existen punteros a algunas de estas subestructuras, pero el firmware asume la incrustación de una manera particular, por lo que se debe respetar el diseño).

Estructuras de datos: ver [cmdqueue.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/cmdqueue.py)

### Micro Secuencias

El firmware ASC contiene un secuenciador de comandos que puede ejecutar "scripts" bastante complejos como parte de comandos de trabajo, pero generalmente se usa de una manera bastante básica. Estas secuencias son buffers empaquetados de comandos que se ejecutan como parte de un elemento de trabajo. La secuencia típica es:

* Inicio (3D/TA/CP)
* Escribir Marca de Tiempo
* Esperar Por Inactividad
* Escribir Marca de Tiempo
* Finalizar (3D/TA/CP)

Estructuras de datos: ver [microsequence.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/microsequence.py)

### Gestión del buffer del Tiler

El tiler de la GPU necesita un buffer para almacenar datos de atributos de vértice y primitivas. Esto se hace a través de algunos buffers de tamaño fijo proporcionados por el controlador, y un montón que el firmware de la GPU asigna a su discreción. El montón se gestiona a través de un objeto gestor de buffer y algunos buffers a los que apunta, donde la CPU proporciona una lista de bloques (4 páginas) y páginas (32K cada una, alineadas en espacio VA (!)).

El proceso de desbordamiento del buffer del tiler / almacenamiento parcial / recarga está completamente gestionado por el firmware ASC.

Estructuras de datos: ver BufferManager* en [microsequence.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/microsequence.py)

### Gestión de Eventos

La finalización del trabajo se señala escribiendo valores en objetos stamp, que son palabras de 32 bits en RAM. Típicamente inicializados en 0 e incrementados en 0x100 por cada elemento de trabajo procesado. Cada elemento de trabajo también está asociado con un ID de evento (0-127), y una estructura de gestión de eventos. La estructura se comparte entre 3D/TA para un solo usuario, y contiene el valor base de barrera y (?) un umbral de número de eventos. Cuando se alcanza el umbral, se activan los ID(s) de evento correspondientes en un mensaje Event al CPU. Cómo funciona/cuenta esto aún no está claro, ya que la misma estructura se comparte entre diferentes colas usando diferentes objetos de barrera que se incrementan en sincronización, pero cada uno solo se incrementa en uno mientras que el umbral necesita ser 2 para obtener ambos eventos... Por determinar.

## Dibujando un frame 3D

Para dibujar un frame primero necesitas estas cosas:

* Un par de canales 3D/TA para usar
* Un par de índices de evento para notificación de finalización
* Un par de WorkQueues
* Un ID de contexto para el UAT
* Una estructura de contexto compartida
* Buffers estáticos del Tiler
* Gestor de montón del Tiler y buffers/listas asociados
* Cuatro objetos stamp

### Buffers del Tiler

* (U) Array de tiles TVB (depende del conteo de tiles)
* (U) Array de lista TVB (¿depende del conteo de tiles?)
* (U) Bloque de metadatos del montón TVB (¿tamaño fijo?)
* (K) Gestor del montón TVB y (U) montón (tamaño arbitrario >= 3 bloques de 128K, la CPU puede ajustar dinámicamente en respuesta a desbordamientos para frames futuros)

macOS asigna estos en el kernel. ¿Queremos hacerlo en el kernel o en el espacio de usuario? El espacio de usuario probablemente debería controlar el tamaño al menos? Podría dejar que el kernel decida, o tener que el espacio de usuario done páginas al gestor de buffer. El kernel necesita manejar al menos la estructura del gestor del montón.

### Objetos stamp y gestión de eventos

Hay 128 índices de evento. Un render necesita 4 objetos stamp, 2 cada uno para TA/3D. La teoría actual es que un stamp indica la finalización del trabajo, el otro indica que el evento de finalización fue entregado al CPU (¿el trabajo fue cosechado?)

### Trabajo TA

El trabajo TA generalmente se ve así:

#### Inicializar Gestor de Montón

Necesario la primera vez o cuando cambia el tamaño del montón. Le dice a la GPU que la CPU reinicializó la estructura de gestión.

Hay un ID relacionado con el contexto desconocido involucrado. ¿Podría ser un ID del gestor de montón? También se pasa el valor del stamp TA (nuevo).

#### Ejecutar TA

Nota: esto está todo resumido y pasa por alto toneladas de números desconocidos/fijos/mágicos

* ID de contexto UAT para este trabajo
* Puntero a estructura de gestión de eventos
* Puntero a estructura del gestor de montón
* Puntero a algún tipo de descriptor de buffer relacionado (?)
* Puntero a buffer desconocido (vacío)
* Puntero a marca de tiempo 1
* Puntero a marca de tiempo 2
* Puntero a marca de tiempo 3
* Buffer desconocido 2 (vacío)
* Estructuras incrustadas:
  * Parámetros del Tiler (conteos de tiles/etc)
  * Estructura de trabajo TA 2
    * Puntero a mapa de tiles TVB
    * Puntero a lista TVB
    * Tres buffers pequeños pasados desde el espacio de usuario (alyssa los llama "deflake")
    * Puntero al codificador de comandos (es decir, pipeline gfx real a ejecutar, desde el espacio de usuario)
    * Base de ventana de pipeline (ventana de 4GiB en VAs usadas para punteros de sombreador de 32 bits)
  * Estructura de trabajo TA 3
    * Uno de los punteros deflake
    * ID de codificador (ID único, la GPU probablemente no se preocupa)
    * "Buffer desconocido" (el que tiene números incrementales, desde el espacio de usuario)
    * Puntero a barrera TA 1 y 2
    * Valor de stamp a escribir en finalización
    * Algún UUID
* Punteros a micro secuencia
* Valor de stamp de finalización de nuevo
* Número de evento asignado a 3D (¿para coordinación TA/3D en desbordamientos TVB?)
* Array de tiles TVB de nuevo y tamaño

### Micro Secuencia TA

La micro secuencia es apuntada por el trabajo TA y tiene estos comandos:

#### Iniciar TA

* Puntero a parámetros de tiling
* Puntero a estructura de trabajo TA 2
* Puntero a gestor de montón
* Puntero a cosa descriptor de buffer
* Algún puntero a un array en los datos de inicialización compartidos de GPU (?)
* Puntero de vuelta a la estructura de control de cola de trabajo involucrada
* ID de contexto UAT
* Ese otro ID relacionado con el contexto (¿id del gestor de montón?)
* Puntero a estructura de trabajo TA 3
* Puntero a uno de los buffers desconocidos en Ejecutar TA
* UUID

#### Marca de Tiempo

* Bandera=1
* Apunta a tres punteros de marca de tiempo en Ejecutar TA: #1, #2, #2
* UUID

#### Esperar Por Inactividad
* Args: 1, 0, 0

#### Marca de Tiempo

* Bandera=0
* Apunta a tres punteros de marca de tiempo en Ejecutar TA: #1, #2, #3 (nota diferencia)
* UUID

#### Finalizar TA
* Puntero a esa cosa buffer
* Puntero a gestor de montón
* Mismo puntero a datos de inicialización que en Iniciar TA
* Puntero de vuelta a cola de trabajo
* ID de contexto UAT
* Puntero a Estructura TA 3
* UUID
* Puntero a stamp TA 2
* Valor de stamp a escribir
* Offset de vuelta al comando micro de Iniciar TA (¿presumiblemente para reiniciar para renders parciales?)

### Trabajo 3D

#### Barrera (Esperar por Stamp)

Esto bloquea 3D hasta que TA termine. No está claro qué magia negra hace funcionar los renders parciales.

* Puntero a stamp TA #2
* Valor a esperar
* Valor a esperar de nuevo (¿rango?)
* Índice de evento TA (presumiblemente esto señala el sondeo real)
* UUID

#### Ejecutar 3D

* ID de Contexto UAT
* Puntero a estructura de gestión de eventos
* Puntero a gestor de montón del Tiler
* Puntero a esa cosa descriptor de buffer
* Buffer desconocido vacío
* Puntero a array de tiles TVB
* Más buffers desconocidos vacíos
* Puntero a marca de tiempo 1
* Puntero a marca de tiempo 2
* Puntero a marca de tiempo 3
* Estructuras incrustadas:
  * Estructura de trabajo 3D 1
    * ¿Algunos floats?
    * Valor de limpieza de profundidad
    * Valor de limpieza de stencil
    * Puntero a array de sesgo de profundidad
    * Puntero a array de scissor

(sin terminar)


# Volcado de información de GPU M1x de phire

(Movido aquí desde `phire-gpu-infodump.md`)

Todo mi trabajo se realizó en mi T6000 14" M1 Max con MacOS 12.2

Hasta ahora, esto es principalmente una aventura para encontrar cómo se envía el trabajo a la GPU.

## UAT iommu (también conocido como Unified Address Translator)

Hay una implementación razonablemente completa de UAT en m1n1/hw/uat.py

Es una tabla de páginas de 4 niveles:

 * L0: 2 entradas
 * L1: 8 entradas
 * L2: 2048 entradas
 * L3: 2048 entradas

Las páginas tienen un tamaño fijo de 16KB

El diseño (ligeramente extraño) permite que las regiones VM compartidas (por encima de `0xf80_00000000`) estén en L0[1] y
todas las asignaciones por contexto estén en L0[0], lo que facilita la constricción de tablas L0 para nuevos contextos.

No he encontrado un registro TTBR, ni ningún registro. Parece que gfx-asc tiene el control total de este iommu.
Configura sus propias tablas de páginas para la región IO privada.

Esto tiene implicaciones de seguridad, gfx-asc tiene acceso a cada página física individual, y algunos (si no todos)
los registros MMIO. Los mensajes de pánico del kernel de MacOS sugieren que podría haber un "microPPL" ejecutándose en
el coprocesador gfx-asc, similar al PPL en MacOS, y con suerte esa es la única parte que puede
modificar las tablas de páginas.

El kernel de MacOS tiene una opción útil del kernel, `iouat_debug=1` que registra todas las asignaciones y
desasignaciones en este espacio de direcciones.

Ver m1n1.hw.PTE para detalles sobre el formato PTE

## Espacio de Direcciones Virtual de GPU

MacOS (al menos en mi máquina) usa VAs de GPU en los siguientes rangos:

`0x015_00000000`: La mayoría de las asignaciones del espacio de usuario  
`0x011_00000000`: Algunas asignaciones adicionales del espacio de usuario  
`0x06f_ffff8000`: No tengo idea. Solo una página
`0xf80_00000000`: Región VM privada del ASC, que asigna por sí mismo. Principalmente contiene el firmware del ASC  
Esta región coincide con `/arm-io/sgx/rtkit-private-vm-region-base`

`0xf80_10000000`: Región IO mapeada por el firmware ASC. Solo contiene los registros de buzón del ASC.  
`0xfa0_00000000`: Región donde el kernel de macos asigna cosas  
`0xfa0_10000000`: Región IO mapeada por MacOS.  
Apunta a regiones ASC, registros PMRG, registros MCC (¿y más?)

Los punteros a veces se extienden con signo, por lo que a veces verás punteros en el rango
`0xffffff80_00000000` o `0xffffffa0_00000000`, pero en realidad solo hay
40 bits de espacio de direcciones. Los registros del kernel generalmente reportan 44 bits, de ahí la dirección `0xfa_00000000`

UAT está en control de este espacio de direcciones.

## gfx-asc

La interfaz ASC parece que sería la interfaz natural para enviar trabajo.

Sin embargo, hay sorprendentemente poco tráfico en esta interfaz, especialmente cuando
se compara con lo que he visto de DCP.

### Endpoints

 0x0: Gestión Estándar, no vi nada extraño aquí.  
 0x1: Endpoint estándar de Crashlog
0x20: Llamé a esto Pong. Recibe "pongs" regulares  
0x21: Llamé a esto Kick.  

#### Endpoint de Crashlog

Todo el tráfico es:

    RX 0x0012000000000000
    TX 0x00104fa00c388000

Y ocurre justo alrededor de la inicialización

0xfa00c388000 es una VA de GPU, y apunta a una asignación de una sola página. El firmware gfx llena esto con
un patrón repetitivo durante la inicialización (16KB de byte 0xef repetido), y luego nunca
lo toca de nuevo.

#### Endpoint Pong

*Los crashlogs llaman a este endpoint "User01"*

Probablemente lo nombré mal, el número de mensajes Pong no coincide con los kicks. Podría ser más de
un latido, o podría ser el firmware gfx diciéndole a la cpu que tocó las tablas de páginas.

También hay algo más de inicialización que ocurre en este endpoint después del endpoint Init.

Mensajes:
`RX 0x0042000000000000`: El pong. Nunca establece los bits inferiores a algo diferente de cero.  
`TX 0x00810fa0000b0000`: Inicialización, enviado una vez  

Si envías un puntero nulo como datos de Inicialización, obtienes el siguiente crash sobre Crashlog:

    GFX PANIC - Unable to grab init data from host - agx_background(2)

El painclog muestra las siguientes tareas activas:

 * rtk_ep_work
 * power
 * agx_background

Y el pánico ocurre en agx_background. *¿Significa esto que este endpoint pertenece a agx_background?*

Una vez que se han proporcionado los datos de inicialización, no logré hacer que este endpoint se bloqueara enviándole
mensajes

##### Inicialización de Pong

 Esto también contiene una VA de GPU, apuntando a una estructura de datos que está prefijada por la cpu:

    >>> chexdump32(gfx.uat.ioread(0, 0xfa0000b0000, 0x4000))
    00000000  000b8000 ffffffa0 00000000 00000000 0c338000 ffffffa0 00020000 ffffffa0
    00000020  000c0000 ffffffa0 030e4000 240e0e08 40000008 00000001 00000000 ffffc000
    00000040  000003ff 00000000 00000070 190e0e08 40000800 00000001 00000000 ffffc000
    00000060  000003ff fe000000 0000000f 0e0e0e08 40000800 00000001 00000000 ffffc000
    00000080  000003ff 01ffc000 00000000 00000000 00000000 00000000 00000000 00000000
    000000a0  00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
    000000c0  00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000

Llamé a esto ControlStruct en mi código m1n1/trace/agx.py.

Después de la inicialización, la CPU nunca toca esto.

¿unkptr_18 parece ser un montón o pila usado por el firmware asc?

#### Kick

*Los crashlogs llaman a este endpoint "User02"*

**Mensajes:**  

`0x83000000000000`: Enviar canal TA
`0x83000000000001`: Enviar canal 3D
`0x83000000000002`: Enviar canal CL
`0x83000000000010`: Kick Firmware
`0x83000000000011`: Control de Dispositivo

Estos Kicks podrían estar activando el envío de trabajo, pero con solo 5 bits de entropía, la información real
debe estar en alguna parte en memoria compartida. Pero en este punto no he encontrado memoria compartida que
se altere entre kicks. También es posible que lo haya etiquetado mal, y los kicks son en realidad invalidación TLB

Enviar mensajes `0x0083000000000000` con kicks fuera de rango no causa un crash
tipos de mensaje 0x84 y 0x85 

### Canales

#### Canal 0

Usado por `0x83000000000000`: Enviar canal TA

00000000 0c000000 ffffffa0 00000002 00000000 00000001
00000000 0c3a8000 ffffffa0 00000002 00000002 00000001
00000000 0c000000 ffffffa0 00000003 00000000 00000000
00000000 0c3a8000 ffffffa0 00000003 00000002 00000000
00000000 0c3a8000 ffffffa0 00000004 00000002 00000000
00000000 0c3a8000 ffffffa0 00000005 00000002 00000000

#### Canal 1

Usado por `0x83000000000001`: Enviar canal 3D

00000001 0c002cc0 ffffffa0 00000002 00000001 00000001
00000001 0c3aacc0 ffffffa0 00000002 00000003 00000001
00000001 0c002cc0 ffffffa0 00000004 00000001 00000000
00000001 0c3aacc0 ffffffa0 00000004 00000003 00000000
00000001 0c3aacc0 ffffffa0 00000006 00000003 00000000
00000001 0c3aacc0 ffffffa0 00000008 00000003 00000000
00000001 0c002cc0 ffffffa0 00000006 00000001 00000000
00000001 0c3aacc0 ffffffa0 0000000a 00000003 00000000

#### Canal 12

Usado por Control de Dispositivo - `0x83000000000011`

El kernel pone un mensaje en el canal 12 incluso antes de inicializar gfx-asc.

Tipo de Mensaje 0x19

luego

Tipo de Mensaje 0x23

Mensaje 0x17:

    Visto al lanzar mi prueba metal

#### Canal 13

¿Del firmware GPU?

Las transferencias son en realidad de 0x38 bytes de largo, en lugar de los 0x30 regulares

    # chan[13]->ptrB (0xffffffa000031f00..0xffffffa0000350af)
    ffffffa000031f00 00000001 00000001 00000000 00000000 00000000 4b430000 534b5452 4b434154 | ......................CKRTKSTACK
    ffffffa000031f20 534b5452 4b434154 534b5452 4b434154 534b5452 4b434154 00000001 00000002 | RTKSTACKRTKSTACKRTKSTACK........
    ffffffa000031f40 00000000 00000000 00000000 ffff0000 00000080 00000000 000040e8 00000000 | .........................@......
    ffffffa000031f60 00001180 00021300 000040e0 00000000 00000000 00000000 00000000 00000000 | .........@......................

#### Canal 14

¿Una respuesta al canal 12?

Tipo de Mensaje 0x4

#### Canal 16

El canal de marca de tiempo.

Esto podría mostrar las marcas de tiempo de cada función o modo en que el firmware gpu (o la gpu misma) estuvo

Tipo 0xc - No ha pasado nada

### Tareas

Según los crashlogs, gfx-asc está ejecutando las siguientes tareas:

 * rtk_ep_work
 * power
 * agx_background
 * agx_recovery
 * agx_interrupt
 * agx_power
 * agx_sample

## Varios rangos de memoria compartida de /arm-io/sgx

Hablando de memoria compartida, estos son los obvios. Asignados por iboot y listados en ADT

**gpu-region-base:**

Página única que contiene las tablas L0 para UAT. Controlada por CPU.

La L0 para un contexto dado se puede encontrar en `gpu-region-base + context * 0x10`

**gfx-shared-region-base:**

Contiene todas las tablas de páginas privadas que gfx-asc asigna por sí mismo durante la inicialización.

Mayormente controlada por gfx-asc, aunque la cpu controla el PPE `L0[1][2]` y lo apunta a una tabla L2
en su propia memoria.

Parece haber una convención de que el PTE `L0[1]` apuntará al inicio de esta región. 

**gfx-handoff-base:**

`0x10ffffb4000` : u64 - valor mágico microPPL de `0x4b1d000000000002`  
`0x10ffffb4008` : u64 - valor mágico microPPL de `0x4b1d000000000002`  

Corromper este valor resulta en el siguiente pánico:

    panic(cpu 4 caller 0xfffffe0013c5d848): UAT PPL 0xfffffdf030af4160 (IOUAT): 
    Invalid microPPL magic value found in the handoff region. 
    Expected: 0x4b1d000000000002, Actual: 0x0

`0x10ffffb4018` : u32 - Comúnmente leído como u8 - inicializado a 0xffffffff  
`0x10ffffb4038` : u32 - Estado de flush (comúnmente establecido a 0 o 2)  

La CPU tiene un patrón de establecer esto a 2, cambiar algunos de los valores siguientes, y luego
establecerlo de vuelta a 0. Sospecho que esto podría ser un mutex?

Cambiar esto a 2 cuando la cpu no lo espera causará que entre en pánico con:

    panic(cpu 0 caller 0xfffffe0013b6d8c4): UAT PPL 0xfffffdf0429d0160 (IOUAT): 
        Attempted to call prepareFWUnmap() before completing previous cache flush. 
        flush_state: 2 | start_addr: 0x150e540000 | size: 0x730000 | context_id: 1

`0x10ffffb4040` : u64 - La CPU a veces escribe VAs de GPU aquí  
`0x10ffffb4048` : u64 - ¿Tamaño? establecido a números redondos como 0x28000 y 0x8000  
`0x10ffffb4050` : u64 - La CPU a veces escribe VAs de GPU aquí  
`0x10ffffb4058` : u64 - otro tamaño  

`0x10ffffb4098` : u64 - Tratado de la misma manera que 4038, pero cuando toca 40a0  
`0x10ffffb40a0` : u64 - La CPU a veces escribe VAs de GPU aquí, solo he visto esto cuando ejecuto una app metal  
`0x10ffffb40a8` : u64 - ¿tamaño?  

`0x10ffffb4620` : u32 - ?  
`0x10ffffb4638` : u8 - Siempre verificado antes de que 0x4038 sea cambiado.  

La CPU escribe punteros VA de GPU interesantes en este rango. Pasé mucho tiempo pensando que esto debe ser
cómo se envía el trabajo a la GPU. Pero no parece estar relacionado con los Kicks o Pongs. A veces
el kernel sobrescribirá punteros múltiples veces con cero Kicks o Pongs en medio.
Otras veces hará cientos de kicks sin nunca cambiar nada en esta región.

Mi teoría actual es que esta región se usa exclusivamente para rastrear el estado de las actualizaciones de tablas de páginas,
y es accesible tanto para MacOS como para gfx-asc para que puedan sincronizar el acceso para actualizaciones de tablas de páginas

El siguiente mensaje de pánico `GFX PANIC - Host-mapped FW allocations are disabled, but FW only supports enabled`
(visto al establecer el byte 0xa0 de initdata a 0) sugiere que esta "funcionalidad de control de firmware de tablas de páginas" 
en realidad no está habilitada en esta versión del firmware.  
Con suerte, podríamos salirnos con la nuestra sin escribir nada en esta región de handoff en absoluto.

## registros sgx

la CPU nunca escribe en estos registros, solo lee. 

Estos registros se leen una vez, durante la inicialización:

    0x4000 : u32 - ¿número de versión? 0x4042000
    0x4010 : u32 - ¿número de versión? 0x30808
    0x4014 : u32 - ¿número de versión? 0x40404
    0x4018 : u32 - desconocido 0x1320200
    0x401c : u32 - 0x204311
    0x4008 : u32 - 0x40a06
    0x1500 : u32 - 0xffffffff
    0x1514 : u32 - 0x0
    0x8024 : u32 = 0x43ffffe - (esto coincide con sgx/ttbat-phys-addr-base del ADT)

Estos registros de estado son continuamente verificados por *algo* en la CPU

    0x11008 : u32 - Siempre cuenta hacia arriba cuando se hace trabajo
    0x1100c : u32 - Usualmente 0
    0x11010 : u32 - ¿Otro contador de trabajo? cuenta más lento
    0x11014 : u32 - Usualmente 0

No parece haber una buena relación de cuándo se leen estos registros de estado, relativo a
los Pongs y Kicks del ASC. 