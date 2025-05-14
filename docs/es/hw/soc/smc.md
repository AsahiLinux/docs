---
title: Controlador de Gestión del Sistema (SMC)
---

El SMC es una pieza de hardware que maneja el acceso a elementos como sensores de temperatura, medidores de voltaje/potencia, estado de la batería, estado del ventilador, y la retroiluminación LCD y el interruptor de tapa.

Está "documentado", en la medida en que lo está, en https://github.com/corellium/linux-m1/blob/master/drivers/hwmon/apple-m1-smc.c, pero eso es solo el protocolo, que esencialmente te permite hacer tres cosas:

1. leer datos para cada una de las muchas, muchas "claves" de cuatro caracteres ASCII. Hay alrededor de 1,400 de estas claves en el MacBook Pro.

2. leer datos para una clave, proporcionando un payload.

3. escribir datos para una clave.

Además de recibir los bytes de datos, el SMC proporciona un tipo para esos datos, codificado como cuatro caracteres ASCII, y un byte de flags.

Hasta ahora, no he sido lo suficientemente valiente como para intentar (2) o (3).

## Tipos de claves SMC

Codificados como cuatro caracteres ASCII, el último de los cuales omito si es un espacio.

* `flt`: un float IEEE de precisión simple de 32 bits. En al menos un caso, el orden de bytes está realmente invertido.
* `si8`, `ui8`, `si16`, `ui16`, `si32`, `ui32`, `si64`, `ui64`: valores con/sin signo de 8/16/32/64 bits
* `hex_`: datos binarios aleatorios
* `flag`: 1 o 0
* `ioft`: esto parece ser un valor de punto fijo sin signo de 64 bits (48.16, muy probablemente).
* `ch8*`: cadena ASCII
* `{jst`: desconocido. ¿Posiblemente algún tipo de documento estructurado codificado en binario?

### Flags SMC

Casi totalmente desconocidos. Las claves con flags `0xf0` no parecen devolver valores no cero de manera confiable (ver Quirks).

### Claves SMC

Muchas. https://github.com/torvalds/linux/blob/master/drivers/hwmon/applesmc.c documenta algunas, pero en su mayoría tienes que adivinar basándote en el nombre de cuatro caracteres. Hay más de 1,400 de estas claves en el MacBook Pro, con muchas aparentemente sin usar.

Algunas conjeturas sobre lo que podrían significar:
* `T???`: valores de temperatura, en Celsius, como float. Hay muchos de estos. Los signos de interrogación especifican, presumiblemente, la ubicación (y posiblemente si el valor está promediado para proporcionar una lectura más significativa?)
* `TB0T`: temperatura de la batería
* `TCHP`: temperatura del cargador (aumenta ligeramente cuando está cargando)
* `TW0P`: temperatura inalámbrica (aumenta ligeramente cuando el inalámbrico está activado)
* `Ts0P`: temperatura del reposamanos
* `Ts1P`: temperatura del reposamanos
* `V???`: voltajes. Probablemente en voltios.
* `gP??`: pines "GPIO". En realidad solo salida, y parece haber un error que te impide leer el nivel de un pin de manera no destructiva, excepto que funciona para el primer pin de este tipo que se lea.
* `gP0d`: controla los chips WiFi/BT. Sin habilitar esto, los dispositivos PCI para WiFi y BT no aparecen. ¿Usado para implementar funcionalidad "rfkill"?
* `gP12`: en al menos un sistema, la retroiluminación LCD. Se puede apagar, lo que reduce el consumo de energía aparente, y volver a encender.
* `gp??` (nota la capitalización): ¿presumiblemente también algún tipo de pin GPIO?
* `D1??`: información sobre el dispositivo conectado al primer puerto USB-C
* `D1in`: nombre del cargador conectado
* `D1is`: número de serie del cargador conectado
* `D2??`: referirse a `D1??`
* `P???`: medidores de potencia, presumiblemente en vatios
* `PSTR`: consumo de potencia de todo el sistema en W
* `SBA?`: información de la batería del sistema
* `SBA1`: voltaje de la celda 1 de la batería en mV
* `SBA2`: voltaje de la celda 2 de la batería en mV
* `SBA3`: voltaje de la celda 3 de la batería en mV
* `SBAV`: voltaje de la batería en mV (suma de `SBA1`, `SBA2` y `SBA3`, igual que `B0AV` pero como `flt`)
* `SBAR`: capacidad restante de la batería en mAh (igual que `B0RM` pero como `flt`)
* `SBAS`: carga de la batería en porcentaje (igual que `BRSC` pero como `flt`)
* `RPlt`: nombre de la plataforma, como "J293".
* `a???`: medición altamente volátil relacionada con la potencia, así que posiblemente corriente yendo a varias partes del dispositivo.
* `F???`: información del ventilador. Referirse a https://github.com/torvalds/linux/blob/master/drivers/hwmon/applesmc.c.
* `CL??`: varios tiempos, medidos en microsegundos desde (posiblemente) el tiempo de fabricación/reinicio RTC
* `CLKU`: tiempo actual actualizado continuamente
* `CLBT`: tiempo de arranque del SMC (ej. energía AC aplicada)
* `CLSP`: posiblemente el tiempo en que el SMC durmió por última vez
* `CLWK`: posiblemente el tiempo en que el SMC despertó por última vez
* `MSLD`: el interruptor de tapa, 1 para cerrado, 0 para abierto
* `bHLD`: botón de energía actualmente presionado
* `MBSe`: botón de energía presionado desde la última lectura, lectura-para-limpiar
* `B0CT`: conteo de ciclos de carga de la batería
* `B0AV`: voltaje de la batería en mV (igual que `SBAV` pero como `si16`)
* `BRSC`: carga de la batería en porcentaje (igual que `SBAS` pero como `ui16`)
* `B0DC`: capacidad de diseño de la batería en mAh
* `B0FC`: capacidad completa de la batería en mAh
* `B0RM`: capacidad restante de la batería en mAh (igual que `SBAR` pero como `ui16` en orden de bytes invertido)
* `B0TE`: tiempo hasta vacío de la batería en minutos
* `B0TF`: tiempo hasta lleno de la batería en minutos
* `ID0R`: corriente de entrada en A
* `VD0R`: voltaje de entrada en V
* `PDTR`: potencia de entrada en W

### Quirks

¿O posiblemente peculiaridades?

* `#KEY`: contiene el número de claves en el SMC, pero en orden de bytes invertido.
* `VP3b`: aparentemente con bytes invertidos
* `gP??`: bloqueado de una manera extraña: la primera vez que se lee una de estas claves, los datos indican el estado de potencia del pin. Pero leer cualquiera de las claves después devuelve `0`, excepto después de una escritura en una de ellas, lo que te permite leer datos una vez más (pero solo una vez), para cualquiera de los pines. Así que puedes leer todos los pines escribiendo repetidamente 1 en un pin que sabes que está en nivel alto, luego leyendo los otros niveles de pin uno por uno. Leer con un payload de 0xffffffff o 0x00000001 devuelve el valor correcto.
* `rLD0` etc. no se pueden leer normalmente, pero se pueden leer con un payload de 0x00000001 o 0x00ffffff. Quizás eso está relacionado con el byte de "flags" siendo 0xf0.

### Notificaciones

Establecer el flag "NTAP" (notificar procesador de aplicación, ¿quizás?) a 1 hace que el SMC envíe notificaciones cuando ocurren ciertos eventos del sistema, como la conexión y desconexión de energía, el botón de energía siendo presionado, o la tapa siendo abierta o cerrada. Las notificaciones son mensajes de buzón aparentemente limitados al payload de 64 bits.

### ADC

Además de las claves accesibles "directamente" a través del SMC, hay lo que parece ser un ADC de un solo canal multiplexado que proporciona acceso a 111 valores adicionales. Se accede a través de "aDC#" (dando el número de claves), "aDC?" (consultar nombre de clave usando un payload numérico), y "aDCR", el valor de resultado real. 