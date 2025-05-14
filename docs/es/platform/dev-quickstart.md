---
title: Guía Rápida para Desarrolladores
---

# ESTA GUÍA ESTÁ EN GRAN PARTE OBSOLETA

Esta guía documenta un proceso de instalación manual que solo es necesario para desarrolladores del kernel que estén haciendo ingeniería inversa de drivers de macOS usando el hipervisor m1n1.

Si eres un desarrollador más típico y quieres ayudar a trabajar en el kernel o simplemente experimentar con la plataforma, y estás conforme haciendo arranques atados vía USB (subiendo el kernel desde otra máquina), mira [aquí](../sw/tethered-boot.md).

Si eres un usuario final o de otro modo quieres configurar una instalación independiente, detente ahora. Aún no está lista. Lo estará pronto. Solo ten paciencia.

# Guía Rápida para Desarrolladores

¿Quieres ayudarnos a llevar Linux a los Macs M1? ¡Sigue leyendo! Esta guía describe la configuración recomendada para desarrollar Linux en un M1.

Esta guía está pensada para desarrolladores que quieran hackear Asahi Linux. No representa cómo será el proceso de instalación para usuarios finales. Está dirigida a desarrolladores experimentados de Linux que quizás no sepan nada sobre Macs o máquinas M1.

Es extremadamente improbable que dañes tu computadora siguiendo estos pasos, pero no podemos garantizar nada en este momento. Por favor, procede bajo tu propio riesgo.

Para una idea rápida de los pasos que podrían estar involucrados, mira este [resumen sucinto](https://tg.st/u/asahi.txt) de pasos. Obviamente las cosas avanzan rápido así que los detalles habrán cambiado en la práctica.

## Introducción

### Objetivo

Vamos a configurar un Mac M1 con arranque dual con dos sistemas operativos: una instalación de macOS estándar (opcionalmente con seguridad reducida/permisiva), y una instalación "stub" de macOS con seguridad permisiva que servirá como envoltorio de arranque para Linux (o cualquier otra cosa que queramos ejecutar a través de m1n1). También aprenderás qué opciones hay disponibles para obtener una consola serie de hardware.

### Prerrequisitos

* Una máquina Apple M1
    Recomendamos el Mac Mini como objetivo base.
    * Mac Mini: No requiere alimentación por Type C, tiene hardware PCIe adicional a bordo (Ethernet y xHCI para puertos tipo A). Requiere un monitor HDMI.
    * MacBook Air: USB solo vía DWC3/Type-C. Pantalla incorporada. Teclado SPI. Requiere alimentación por Type C para cargar.
    * MacBook Pro: Como el Air, pero con una Touch Bar reemplazando las teclas F, lo que significa que tu teclado estará limitado hasta que se escriban los drivers para eso.

* macOS instalado en la máquina (asumimos que comenzarás desde una configuración de fábrica con una sola partición de macOS)
    * Sin FileVault (cifrado). Esto complicará las cosas y no está probado.

* Una máquina de desarrollo Linux (cualquier arquitectura)
    * Si no es arm64: un compilador/toolchain gcc `aarch64-linux-gnu` (clang también es compatible para compilar m1n1 pero está menos probado).

Altamente recomendado:
  
* Una solución de puerto serie. Sigue leyendo para más información.

### TL;DR sobre el arranque en Mac M1

Almacenamiento: el SSD interno es un disco particionado GPT que contiene (inicialmente) contenedores APFS, cada uno de los cuales contiene múltiples volúmenes APFS.

El proceso de arranque:

1. SecureROM (Boot ROM) en el silicio M1 inicia
    * O entra en modo DFU (recuperación USB) o
    * Arranca iBoot1 desde la flash NOR (SPI)
2. iBoot1 (global) busca políticas de arranque en iSC Preboot e intenta arrancar la activa desde su volumen Preboot APFS de SO (como se define en NVRAM)
    * Si se mantiene presionado el botón de encendido, arranca 1TR en su lugar
    * Esto es lo que inicializa la pantalla y muestra el logo de Apple
3. iBoot2 (copia por SO; ~= cargador de SO) arranca el SO
    * Carga firmwares auxiliares de CPU desde la partición Preboot APFS del SO
    * Luego carga un kernel mach-o envuelto en un contenedor img4 desde la partición Preboot
    * Se encarga de ajustar y pasar el ADT (Apple Device Tree)
4. El kernel del SO (XNU/Darwin) arranca
    * Monta el sistema de archivos raíz, etc.

Lee [Arranque](open-os-interop.md) y [Diferencias con el Proceso de Arranque de PC](pc-boot-differences.md) para más información.

Mini glosario:

* 1TR: One True Recovery: recuperación de sistema de confianza, incluye toda la interacción de usuario de arranque también (selector de arranque). Vive en su propio contenedor APFS (última partición).
* APFS: El sistema de archivos avanzado de Apple
    * Contenedor APFS: ~= pool ZFS (normalmente respaldado por una partición GPT)
    * Volumen APFS: ~= dataset ZFS
    * Snapshot APFS: ~= snapshot ZFS
* AP Ticket: blob firmado de Apple que te permite ejecutar una versión específica de macOS en una máquina específica. "Versión de macOS" ~= iBoot2 y paquetes de firmware. Hay "genéricos" disponibles para usar en modos de seguridad reducida (es decir, sin requerimiento de validación en línea en ese caso).
* Boot Policy: declara un SO arrancable en una máquina dada. Firmado y validado por SEP (localmente). Almacenado en iSC.
* iBoot1: Primer cargador de arranque, encuentra un SO para arrancar
* iBoot2: Segundo cargador de arranque, inicia firmwares auxiliares y arranca el kernel XNU (o m1n1)
* iSC: iBoot System Container, contenedor APFS con configuraciones/archivos de arranque
* kernelcache: kernel + blob de kexts (~=linux + initramfs con módulos)
* kext: módulo de kernel
* NOR: Flash SPI NOR en placa que contiene iBoot1, datos de personalización de producto, nvram
* SecureROM: Boot ROM en el chip M1
* SEP: Secure Enclave Processor ~= TPM o Secure Monitor en otras plataformas (es un núcleo separado aquí).
* SFR: System Firmware and Recovery (iBoot1 + partición iSC + partición 1TR). Protegido contra downgrade.
* Modos de seguridad de arranque
    * Full Security: Arranque seguro completo, no se puede ejecutar software no-Apple excepto binarios firmados y ad-hoc bajo macOS si el usuario lo permite, exige AP tickets (no permite downgrades de macOS).
    * Reduced Security: Permite kexts de terceros, gestión, etc.
    * Permissive Security: Permite kernels sin firmar (esto es lo que queremos).
* XNU: la base de Darwin, el kernel de macOS

Notas:

* Las máquinas M1 no soportan *ninguna* interacción de usuario a nivel de bootloader ni atajos de teclado ni nada.
    * Lo único que iBoot1 puede ver es si mantienes presionado el botón de encendido o no.
    * El "selector de arranque" es una aplicación de macOS corriendo bajo 1TR. Sí, en serio.
* Las máquinas M1 *no pueden* arrancar desde almacenamiento externo.
    * Elegir un disco externo en el selector de arranque *copiará toda su partición Preboot al iSC* y generará una política de arranque. Esto es moralmente equivalente a tener todo /boot en Linux en almacenamiento interno. **Estas máquinas no pueden arrancar kernels de macOS desde almacenamiento externo, nunca**, al menos con el firmware actual.

### Lecturas adicionales

* [Glosario](../project/glossary-es.md)
* [Arranque](open-os-interop.md)
* [Diferencias con el Proceso de Arranque de PC](pc-boot-differences.md)
* [NVRAM](../fw/nvram.md)
* [Disposición de Particiones Original](stock-partition-layout.md)

### Si algo sale mal

Los Macs M1 son prácticamente in-brickeables mientras no escribas en la Flash SPI (desaconsejamos fuertemente declarar la NOR Flash en el devicetree de Linux: no conocemos ninguna razón para tocarla en este momento, así que solo aumenta el riesgo de catástrofe; procederemos con precaución y salvaguardas si alguna vez es necesario acceder directamente). Sin embargo, dependen del software instalado en el SSD interno para arrancar normalmente y en 1TR.

Si terminas con tu Mac en un estado inarrancable, sigue [las instrucciones de recuperación DFU de Apple](https://support.apple.com/en-in/guide/apple-configurator-2/apdd5f3c75ad/mac). Necesitarás otro Mac con macOS para realizar este proceso (los Intel sirven). Esto no debería pasar si sigues normalmente los pasos de esta guía, pero puede ocurrir si accidentalmente escribes en el almacenamiento interno incorrectamente (por ejemplo, borrando todo el dispositivo de bloques o dañando la tabla de particiones GPT).

Eventualmente, debería ser posible usar [idevicerestore](https://github.com/libimobiledevice/idevicerestore) para realizar este mismo proceso desde una máquina Linux, pero aún no está listo.

Aunque el arranque DFU funciona con una NOR flash totalmente corrupta, datos vitales de identificación y calibración de producto se almacenan ahí y no puedes restaurarlos sin la ayuda de Apple; tendrás que enviar la máquina a reparación para que puedan re-provisionar su identidad y ejecutar pruebas y calibración de fábrica. Así que, mantente alejado de la NOR flash.

## Configuración

### Paso 0: Actualizar macOS

Necesitas al menos macOS 11.2. No te molestes con versiones anteriores, no funcionarán.

Debes haber pasado por la configuración inicial de macOS, incluyendo haber creado un usuario administrador con contraseña.

### Paso 1: Particionado

Comienzas aquí:

* disk0s1: iBoot System Container
* disk0s2: Macintosh HD (contenedor APFS del SO #1)
* disk0s3: 1TR (One True Recovery OS)

Queremos llegar aquí:

* disk0s1: iBoot System Container
* disk0s2: Macintosh HD (contenedor APFS macOS SO #1)
* disk0s3: Linux (contenedor APFS "fake macOS" SO #2)
* disk0s4: Linux /boot (FAT32)
* disk0s5: Linux / (ext4)
* disk0s6: 1TR (One True Recovery OS)

Nota que el almacenamiento aún no está soportado en nuestro árbol o bootloader, pero estamos apuntando a este esquema de particiones _a priori_. disk0s3 será nuestro "stub" de macOS, que por ahora contendrá una instalación completa de macOS (eventualmente proveeremos herramientas para que sea una partición mínima solo con archivos de arranque, para evitar espacio desperdiciado, pero eso aún no está listo).

Asumiendo que tienes un modelo de 500GB, sigue estos comandos (nota que tu máquina puede congelarse varios minutos mientras se ejecutan estos comandos):

```shell
# diskutil apfs resizeContainer disk0s2 200GB
# diskutil addPartition disk0s2 APFS Linux 80GB
# diskutil addPartition disk0s5 FAT32 LB 1GB
# diskutil addPartition disk0s4 FAT32 LR 0
```

Necesitas al menos 80GB para la partición stub, porque el proceso de instalación/actualización de macOS es muy ineficiente. Esto no será necesario en el futuro, cuando tengamos nuestro propio proceso de configuración.

Reducir la partición APFS del SO puede hacerse en línea.

Cada invocación de `diskutil addPartition` necesita que le pases el nodo de partición
de la partición *anterior* a la nueva que vas a crear. Esto puede variar, así que
corre `diskutil list` antes de cada instancia y elige el nombre de dispositivo de la última
partición creada. En el ejemplo anterior, `Linux` terminó como disk0s5 y `LB` como disk0s4. Vaya uno a saber. Esto se resetea después de un reinicio.

El nombre del volumen de la partición stub determinará el nombre del SO en el selector de arranque, así que llámalo "Linux".

Podemos cambiar el tipo de FS y GPT de las particiones root y boot de Linux más adelante.

### Paso 2: Instalar macOS en la partición stub

Apaga la máquina. Arranca manteniendo presionado el botón de encendido, hasta que aparezca "Loading startup options...". Esto entra en 1TR, el entorno de recuperación del SO.

Selecciona "Opciones" en el selector de arranque. Puede que se te pida ingresar tus credenciales.
Estas son las credenciales de inicio de sesión de la instalación principal de macOS.

En el menú principal de recuperación, selecciona "Reinstalar macOS Big Sur".

Sigue las instrucciones y selecciona "Linux" como volumen de destino.

Espera un rato. Esto reiniciará la máquina automáticamente en el nuevo SO.

### Paso 3: Realizar la configuración inicial

Completa la configuración inicial del SO. Crea un usuario administrador y contraseña.

Verifica la versión del SO. Si no es 11.2, deberías actualizar al menos a esa versión.

Apaga la máquina de nuevo.

### Paso 4: Bajar la seguridad

Arranca en 1TR de nuevo (entrada "Opciones" en el selector de arranque).

En la barra de menú superior, ve a Utilidades → Terminal. Esto abre un shell root.

Encuentra el ID del grupo de volúmenes de tu partición stub:

```shell
# diskutil apfs listVolumeGroups | grep -B3 Linux | grep Group
```

Luego baja la seguridad:

```shell
# bputil -nkcas
```

Selecciona el ID de instalación de SO correspondiente y sigue las instrucciones. Necesitarás ingresar las credenciales que creaste en el paso 3.

Desactiva SIP para mayor seguridad. Este comando te pedirá elegir el SO por nombre:

```shell
# csrutil disable
```
Nota: Si obtienes errores de permisos como `Failed to create local policy` puede que tengas que resetear la política de seguridad del sistema primero con
```shell
# csrutil clear
```
En este punto ya puedes usar kernels personalizados. ¡Felicidades!

## Obtener una consola serie

Tener una consola serie es indispensable para un ciclo de desarrollo rápido y para depurar problemas de bajo nivel.

Los Macs M1 exponen su puerto serie de depuración en uno de sus puertos Type C (el mismo que se usa para DFU). En los MacBook, es el puerto trasero izquierdo. En el Mac Mini, es el puerto más cercano al enchufe de corriente.

La máquina objetivo también puede ser reiniciada a la fuerza usando comandos USB-PD VDM, lo que permite un ciclo de pruebas rápido (sin mantener presionado el botón de encendido).

Consulta [USB-PD](../hw/soc/usb-pd.md) para detalles sobre los comandos USB-PD VDM y lo que puedes hacer con ellos.

El puerto serie es un UART usando niveles lógicos de 1.2V, y requiere comandos USB-PD VDM específicos del fabricante para habilitarlo. Por tanto, hacer un cable compatible no es trivial. Tienes las siguientes opciones.

### Usando una máquina M1

Si tienes dos equipos M1, esta es la solución más simple. Solo descarga [macvdmtool](https://github.com/AsahiLinux/macvdmtool/), conecta ambas máquinas con un cable Type C SuperSpeed estándar usando el puerto DFU en *ambas* máquinas, ¡y listo!

**NOTA IMPORTANTE:** El cable debe ser del tipo USB 3 / SuperSpeed. Los cables solo USB 2 no funcionarán, **el cable de carga que viene con el MacBook/MacBook Air no funcionará** y tampoco la mayoría de cables baratos o cables vendidos solo para carga. Si no dice "SuperSpeed" o "USB3.0" en el paquete, casi seguro que no funcionará. Si es delgado y flexible, casi seguro que *no* es un cable SuperSpeed. Los cables que funcionan deben tener al menos **15** hilos dentro; si no parece que pueda tener tantos hilos, no es el cable que necesitas. Si estás seguro de que tu cable es SuperSpeed (es decir, los dispositivos se enumeran como SuperSpeed a través de él) y aún así no funciona, entonces es no conforme y el fabricante merece ser avergonzado en su página de Amazon, porque significa que no conectaron los pines SBU1/2.

```shell
$ xcode-select --install
$ git clone https://github.com/AsahiLinux/macvdmtool
$ cd macvdmtool
$ make
$ sudo ./macvdmtool reboot serial
```

Deberías ver algo como esto:

```
Mac type: J313AP
```

### Usando un adaptador UART

Si no tienes otra máquina M1, necesitarás un adaptador UART que soporte niveles lógicos de 1.2V. La mayoría de adaptadores UART estándar usan 3.3V o 5V, lo que podría dañar tu Mac.

Tenemos dos opciones recomendadas:

1. [FTDI FT232H](https://www.ftdichip.com/Products/ICs/FT232H.htm) con un divisor de voltaje
2. [CP2102N](https://www.silabs.com/interface/usb-bridges/classic/device.cp2102n) con un divisor de voltaje

Para el divisor de voltaje, necesitas un divisor de voltaje de 3:1 (3.3V a 1.2V) o 5:1 (5V a 1.2V) dependiendo de tu adaptador. Puedes construirlo con resistencias o usar un regulador de voltaje.

### Configuración del adaptador UART

1. Conecta el adaptador UART a tu computadora
2. Conecta el cable Type C al puerto DFU de tu Mac
3. Conecta los pines TX/RX/GND del adaptador UART a los pines correspondientes del puerto Type C
4. Configura el adaptador para usar 115200 baudios, 8N1, sin control de flujo

### Notas importantes

* El puerto serie solo está disponible cuando el Mac está en modo DFU o cuando se ha habilitado explícitamente mediante comandos USB-PD VDM
* El puerto serie no está disponible durante el arranque normal
* El puerto serie no está disponible durante la recuperación
* El puerto serie no está disponible durante la instalación de macOS

## Siguientes pasos

Ahora que tienes tu entorno de desarrollo configurado, puedes:

1. Clonar el repositorio de m1n1
2. Compilar m1n1
3. Cargar m1n1 en tu Mac
4. Comenzar a desarrollar

Para más información sobre estos pasos, consulta la [documentación de m1n1](https://github.com/AsahiLinux/m1n1).

## Solución de problemas

### El Mac no arranca

Si tu Mac no arranca después de seguir estos pasos:

1. Mantén presionado el botón de encendido durante 10 segundos
2. Suelta el botón
3. Mantén presionado el botón de encendido hasta que aparezca "Loading startup options..."
4. Selecciona tu instalación principal de macOS

### No puedo ver la salida serie

1. Verifica que estás usando un cable SuperSpeed (USB 3.0)
2. Verifica que estás usando el puerto correcto (el puerto DFU)
3. Verifica que el adaptador UART está configurado correctamente
4. Verifica que el divisor de voltaje está funcionando correctamente

### No puedo habilitar el modo serie

1. Verifica que estás usando la versión más reciente de macvdmtool
2. Verifica que tienes permisos de administrador
3. Verifica que el cable es SuperSpeed
4. Verifica que estás usando el puerto correcto

## Recursos adicionales

* [Documentación de m1n1](https://github.com/AsahiLinux/m1n1)
* [Documentación de USB-PD](../hw/soc/usb-pd.md)
* [Documentación de NVRAM](../fw/nvram.md)
* [Documentación de arranque](open-os-interop.md)
* [Documentación de diferencias con PC](pc-boot-differences.md)
* [Glosario](../project/glossary-es.md) 