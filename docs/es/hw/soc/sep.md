---
title: Procesador de Enclave Seguro (SEP)
---

Algunas notas sobre el SEP basadas en investigaciones pasadas de la comunidad y exploración del SEP, junto con algunos TODOs para cualquiera que quiera rastrear el SEP en Asahi Linux

advertencia justa: esta página está desordenada y probablemente permanecerá así hasta que se construya suficiente comprensión para construir una página limpia.

Notas para cualquiera que rastree para Asahi:

Como no controlas el firmware SEP que se carga, las partes que importan para Linux en sí son realmente solo el protocolo de comunicación entre AP y SEP, similar a otros ASCs. Para entender el flujo de creación y aprovisionamiento de xART/Gigalocker, crear un nuevo usuario debería aprovisionar nuevas claves de cifrado para ellos, lo que muy probablemente implicaría agregar entradas a los Gigalockers. También es obvio pero el rastreo debe hacerse en la misma versión de macOS que será el firmware para las instalaciones de Asahi Linux. (13.5 al 11/13/2024) - No es del todo cierto, el firmware SEP está determinado por la versión más alta de macOS que se haya instalado en el dispositivo, pero el protocolo es compatible hacia atrás.

TODOs para rastreo:
- Reducir masivamente el spam de mensajes del rastreador sobre la consola Python, *ralentiza enormemente* el sistema y ha llevado a pánicos ocasionalmente ya que el spam de mensajes lleva a que las cosas se agoten.
- actualmente el rastreador parece asumir firmware SEP de Monterey o Big Sur, actualizarlo para Ventura y más nuevo.
- ¿Quizás solo rastrear mensajes SEP de applets SEP individuales basados en índices de endpoint, y usar scripts Python separados para rastrear el flujo SKS o el flujo SSE?
- construir una tabla de tipos de mensajes y datos enviados para todos los endpoints (en los logs de XNU, muchos de los mensajes parecen tener partes del verdadero mensaje SEP enmascaradas)

Preguntas misceláneas:

- cuando el endpoint de depuración notifica al AP que un endpoint ha cobrado vida, el campo "DATA" tiene un valor de 0x2020202, 0x1010101, 0x0, o 0x2020404 - estos son tamaños de buffer ool en páginas, entrada y salida. No estoy seguro de por qué están duplicados.
- una parte del buffer de memoria compartida SEP al principio durante la configuración del endpoint cambia el byte inferior de la primera palabra de 32 bits de 02 a 1f. ¿por qué sería eso? ¿es un bit de configuración? ¿eso lo hace macOS o el SEP OS?

Información del coprocesador:

Como con otros coprocesadores ASC como DCP, este es un coprocesador ASC y por lo tanto se comunica con el AP principal a través de una interfaz de buzón similar y buffers compartidos ocasionales (en AppleSEPManager, los llaman buffers "OOL", supuestamente buffers fuera de línea). A diferencia de los otros procesadores que ejecutan RTKit o un derivado, SEP parece ejecutar un OS personalizado que Apple llama internamente SEPOS. Además, el propio SEPOS parece estar dividido en muchas aplicaciones diferentes que se ejecutan en el propio SEP.

SEP parece autenticar su propio firmware (evidenciado por cadenas del kernel que dicen que SEP ha "aceptado" el IMG4), y aparentemente entrará en pánico si falla la autenticación del firmware. El firmware SEP está cifrado por un GID separado del GID normal de AP, por lo que una vulnerabilidad en la cadena de arranque en iBoot no te dará ninguna capacidad para descifrar el firmware SEP o cargar firmware SEP arbitrario a menos que también logres comprometer el propio SEP.

En comparación con los otros coprocesadores ASC, SEP es el único que parece tener almacenamiento dedicado (al menos para cualquier información sensible como claves envueltas y similares) con el que ningún otro procesador en el dispositivo puede comunicarse.

Base del buzón ASC SEP T8112: 0x25E400000 (buzón real en +0x8000, como otros IOPs ASC)

Información de endpoints:

| Índice de endpoint | Nombre de endpoint | Propósito |
| -------------- | ------------- | ------- |
| 0x00 | Control/CNTL | parece controlar algunas propiedades de endpoint |
| 0x08 | Biometría Segura (SBIO) | autenticación biométrica |
| 0x0a | SCRD | probablemente "gestor de credenciales seguro/SEP" usado para autenticación de credenciales de usuario |
| 0x0c | sse  | De alguna manera relacionado con NFC, puede estar relacionado con Apple Pay. |
| 0x0e | HDCP | probablemente protección de contenido HDCP |
| 0x10 | xars (según el rastreador) | configuración xART? involucrado en inicio/apagado |
| 0x12 | Almacén de Claves Seguro/SEP | operaciones de cifrado/descifrado SEP y gestión de claves |
| 0x13 | gestor xART | gestiona xARTs, gigalockers y keybags (necesario para que SKS inicie) |
| 0x14 | hibe (según el rastreador) | relacionado con hibernación | 
| 0x15 | pnon (nombre del rastreador) | Relacionado con la política de arranque. Eventualmente lo necesitaremos para la transferencia de credenciales de propietario de máquina, pero puede ignorarse por ahora |
| 0x17 | skdl | CoreKDL. KDL significa lista de denegación de kext, relevante para FairPlay, quizás relevante para HDCP y Apple Pay. |
| 0x18 | stac | vinculado a la extensión AppleTrustedAccessory, probablemente "Conexión de Accesorios Confiables Seguro/SEP" | 
| 0xFD | Depuración(?) | Más un endpoint de descubrimiento, devuelve la lista de endpoints y tamaños de buffer OOL |
| 0xFE | Boot254 | Señala a SEP para arrancar en SEPOS con un IMG4 que se configurará en su región de memoria protegida. |
| 0xFF | Boot255 | Señala a SEP que la región protegida de memoria configurada para él está lista para su propio uso |

Formato Gigalocker/xART (¡gracias sven por esta información!):
| Inicio de sección-fin de sección | Descripción |
| ------------------------- | ----------- |
| 0x00-0x01 | Siempre 0 (¿quizás algún tipo de identificador de versión?) |
| 0x01-0x12 | UUID/clave (¿un identificador de clave para SKS?) |
| 0x12-0x16 | longitud de la clave |
| 0x16-0x1a | CRC de la clave envuelta |
| 0x1a-0x22 | propósito desconocido |
| 0x22-fin de payload | datos de payload/keybag envuelto |

Formato de mensaje SEP:

bits 0-7 - Número de endpoint

bits 8-15 - un valor de "tag" (para el endpoint de control, un mensaje entrante y saliente a veces pueden compartir tags, no se usa mucho en el bootrom SEP)

bits 16-24 - "tipo" de mensaje (lo que quieres que el extremo receptor actúe, este campo es cómo comunicas tu acción deseada al SEP)

bits 25-31 - parámetros del mensaje (endpoint de depuración, este es siempre el endpoint sobre el que el endpoint de depuración está respondiendo/recibiendo información, el bootrom SEP no usa esto mucho)

bits 32-63 - algún tipo de datos (puede ser un puntero o un valor de configuración, pero esto casi siempre debe establecerse para acciones que cambian el estado del sistema)

el buzón es capaz de enviar cosas en los bits 127-63 pero actualmente esos bits no se usan, el bootrom SEP los ignora totalmente, y AppleSEPManager tampoco lo hace.

Flujo de arranque SEP:
- iBoot precarga el firmware SEP en una región de memoria que está registrada en ADT.
- XNU envía un mensaje boottz0, llevando a SEP a la segunda etapa de arranque (una porción de RAM está reservada para esto)
- XNU envía img4, SEP verifica integridad, si es aceptado, arranca en SEP/OS (enviar un IMG4 malformado o inválido es un pánico en el lado SEP, haciéndolo inutilizable por el resto de ese arranque hasta que el dispositivo se reinicie)
- Configuración de endpoint (incluyendo configuración xART/Gigalocker, configuración SKS incluyendo claves FileVault, etc.)

Flujo de inicialización xART (incompleto por ahora, puede estar mal):

(el tipo de mensaje 0 es algún tipo de solicitud de obtención, el tipo de mensaje 0x5 parece ser una respuesta de obtención para lockers individuales)
(los tags parecen aumentar en el orden de los lockers dentro del gigalocker)

```c:
//Inicialización de Gigalocker (TODO: verificar si las versiones posteriores de OS usan el mismo formato)


[cpu1] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000010000000213 (EP=0x13, TAG=0x2, TYPE=0x0, PARAM=0x0, DATA=0x100)


[cpu14] [SEPTracer@/arm-io/sep] [xarm] <0x13(None) 0000000000130113 (EP=0x13, TAG=0x1, TYPE=0x13, PARAM=0x0, DATA=0x0)


//Obtención xART SEP desde gigalocker (este xART en sí parece tener muchos sublocks?)


[cpu0] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000000000000113 (EP=0x13, TAG=0x1, TYPE=0x0, PARAM=0x0, DATA=0x0)


[cpu10] [SEPTracer@/arm-io/sep] [xarm] <0x0(None) 0000010000000313 (EP=0x13, TAG=0x3, TYPE=0x0, PARAM=0x0, DATA=0x100)
```

Notas de Accesorio Confiable SEP:

```c:

//ping
[cpu0] [SEPTracer@/arm-io/sep] [stac] >0xf(None) 00000000000ffc18 (EP=0x18, TAG=0xfc, TYPE=0xf, PARAM=0x0, DATA=0x0)

//pong
[cpu0] [SEPTracer@/arm-io/sep] [stac] <0xf(None) 00000000000ffc18 (EP=0x18, TAG=0xfc, TYPE=0xf, PARAM=0x0, DATA=0x0)
```

AppleTrustedAccessory habla con este endpoint, probablemente para el sensor Touch ID en teclados externos.

Notas de compatibilidad hacia atrás SEP:

IPC SKS se negocia tanto en el lado del kernel como en el lado SEP, la versión IPC compatible más baja entre ambos será la IPC usada para comunicación entre el procesador principal y SEP.

Esto debería asegurar que SEP y OS puedan seguir siendo compatibles entre sí incluso si SEP se actualiza (ya que simplemente usará la versión IPC más antigua). (pregunta potencial: en el controlador Linux ¿cómo debería tenerse esto en cuenta?)

Notas misceláneas:

El endpoint de control parece responder a solicitudes entrantes con un tipo de mensaje de 0x1 y parámetros de entrada si algo fue exitoso (probablemente un ack/okay del lado SEP si todo está bien) (al menos para mensajes que establecen longitud o punteros de entrada/salida)

SKS es *muy* spammy en modo normal ya que los mensajes de buzón hacia/desde sep con él como endpoint se envían constantemente (esto es probablemente debido a cómo funciona la Protección de Datos según la guía de seguridad de Apple, muchos de estos probablemente están recuperando/actualizando claves desde/hacia gigalocker)

El modo de usuario único es útil al hacer rastreo, ya que SKS no será tan spammy y podemos capturar la secuencia de inicialización.

Notas de obtención xART:

durante la secuencia de obtención de locker, un gran número de los mensajes tienen 0x100 como la parte "data". las respuestas del SEP con respecto a una solicitud de obtención/desenvoltura de locker siempre tendrán parámetro 0x10. Una respuesta con tipo 0x5 es éxito, 0x7 es un error (al mínimo es la señalización de error de que no se pudo encontrar un locker xART de usuario) 