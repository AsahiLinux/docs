---
title: USB-PD
---

## Introducción

Apple usa mensajes USB-PD personalizados para controlar el multiplexado de pines en sus puertos Type-C para depuración y otros propósitos. La comunicación USB-PD tiene lugar a través de la línea CCx del puerto (CC1 o CC2 dependiendo de la orientación del puerto).

Gracias a los chicos de t8012dev por proporcionar la información. Ver https://web.archive.org/web/20211023034503/https://blog.t8012.dev/ace-part-1/ como referencia. El controlador en los Macs M1 de Apple (2020) es el CD3217 "Ace2".

Deberías consultar la [especificación USB-PD](https://www.usb.org/document-library/usb-power-delivery) para información de fondo.

Apple usa mensajes VDM (Vendor Define Message) estructurados específicos del fabricante con su ID USB (0x5AC), pero requieren que los mensajes usen los tokens de inicio de paquete SOP'DEBUG (si se originan desde el UFP) o SOP''DEBUG (si se originan desde el DFP) (que no se usan en el estándar, y algunos controladores pueden no ser capaces de enviarlos). El encabezado VDM tiene la forma 0x5ac8000 | (comando).

Se recomienda ejecutar este protocolo actuando como DFP (es decir, una fuente de alimentación), porque los Macs solo actuarán como DFP ellos mismos después de que el sistema operativo haya sido iniciado.

Los siguientes comandos están en formato separado por comas codificado en hexadecimal para facilitar el pegado en la consola serial de [vdmtool](https://github.com/AsahiLinux/vdmtool). El protocolo hace un uso intensivo de unidades de datos de 16 bits, empaquetadas de mayor a menor en las palabras VDM de 32 bits, y terminadas en cero.

Las respuestas de comandos usan el ID de comando de solicitud | 0x40. La respuesta al comando 0x10 es el comando 0x50, etc.

## Chips

* CD3215C00 "ACE1" - esto parece ser un TPS65983 con código ROM/OTP diferente.
* CD3217B12 "ACE2" - esto probablemente sea silicio nuevo real con algunas diferencias, aunque esto es incierto. Podría ser equivalente a otra parte de TI. Los dispositivos M1 iniciales usan esta parte. La organización del firmware es algo diferente.

## Puertos

Cada puerto en un Mac puede tener diferente soporte VDM. Las cosas de depuración generalmente solo se soportan en un puerto.

### MacBook Air 2020 (M1)

El puerto más cercano al borde tiene todas las cosas de depuración.

### Mac Mini 2020 (M1)

El puerto más a la izquierda (más cercano a la entrada de alimentación) tiene todas las cosas de depuración.

### MacBook Pro 16" 2019 (MacBookPro16,1 - Titan Ridge)

Los puertos izquierdos frontal y trasero reportan cada uno 7 acciones. El puerto derecho trasero reporta 4 acciones. El puerto derecho frontal reporta 3 acciones.

### MacBook Pro 13" 2019 (MacBookPro15,2 - Titan Ridge)

El puerto izquierdo frontal reporta 8 acciones. El puerto izquierdo trasero reporta 5 acciones. El puerto derecho trasero reporta 4 acciones. El puerto derecho frontal reporta 3 acciones.

### MacBook Pro 13" 2017 (MacBookPro14,2 - Alpine Ridge)

El puerto izquierdo trasero reporta 4 acciones. Los puertos izquierdo frontal y derecho frontal reportan cada uno 3 acciones. El puerto derecho trasero reporta 2 acciones.

## Comandos

### 0x10 Obtener Lista de Acciones

```5ac8010```

Cada "acción" es algo que hacer o una señal para multiplexar.

Respuesta de ejemplo del puerto izquierdo del Mac Mini M1 (2020):

```
5ac8010
>VDM 5AC8010
<VDM RX SOP'DEBUG (7) [704F] 5AC8050 46060606 2060301 3060106 1050303 8030809 1030000
                             ^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                             vdm hdr action list
```

Esto indica soporte para las acciones 0x4606, 0x606, 0x206, 0x301, 0x306, 0x106, 0x105, 0x303, 0x803, 0x809, 0x103.

El MacBookPro16,1 soporta las acciones 0x602, 0x606, 0x601, 0x403, 0x302, 0x501 y 0x301 en el puerto izquierdo frontal, acciones 0x205, 0x206, 0x103, 0x602, 0x302, 0x501 y 0x301 en el puerto izquierdo trasero, acciones 0xE04, 0x501, 0x301 y 0x302 en el puerto derecho trasero y acciones 0x302, 0x501 y 0x301 en el puerto derecho frontal.

El MacBookPro15,2 soporta las acciones 0x207, 0x205, 0x602, 0x606, 0x501, 0x601, 0x301 y 0x302 en el puerto izquierdo frontal, acciones 0x403, 0x602, 0x302, 0x501 y 0x301 en el puerto izquierdo trasero, acciones 0x501, 0x103, 0x301 y 0x302 en el puerto derecho trasero y acciones 0x302, 0x501 y 0x301 en el puerto derecho frontal.

El MacBookPro14,2 soporta las acciones 0x403, 0x602, 0x301 y 0x302 en el puerto izquierdo trasero, acciones 0x302, 0x205 y 0x301 en el puerto izquierdo frontal, acciones 0x302, 0x802 y 0x301 en el puerto derecho frontal y acciones 0x301 y 0x302 en el puerto derecho trasero.

### 0x11 Obtener Información de Acción

```5ac8011,<actionid>```

Esto devuelve información sobre una acción específica, en unidades cortas de 16 bits (terminadas en cero).

Para el Mac Mini M1 se devuelve la siguiente información para cada acción:

```
Action  Info reply
4606    0183
0606    0183
0206    0187 020C 0318 8001
0301    0187 020C 0303
0306    0187 020C 800C
0106    8001
0105    8000
0303    0187 0221 0303 809E 0030 6030 000C
0803    0187 0221 8001
0809    0187 0221 8001
0103    8000
```

### 0x12: Ejecutar Acción

```5ac8012,<actionid>[,args]```

Ejecuta o mapea una acción dada a un conjunto de pines.

`actionid` contiene el ID de acción en los 16 bits inferiores, y campos como sigue:

```
Bits  Descripción
25    Si es 1 sale del modo, en lugar de entrar en él
24    Persiste a través de reinicio suave. Parece hacer algo en modo DFP.
23    Si es 1 intenta salir de modos conflictivos antes de entrar en este
22-16 Máscara de bits de líneas para mapear a esta acción
15-0  ID de Acción
```

Respuesta de ejemplo:

```
5ac8012,40306
>VDM 5AC8012 40306
<VDM RX SOP'DEBUG (5) [504F] 5AC8052 44740000 306 0 0
                             ^^^^^^^ ^^^^\------------ estados de pin
                             vdm hdr estado de conexión/línea 
```

* Estado de conexión/línea: Un encabezado corto de 16 bits (`(ConnectionState << 14) | (LineState[i] << (2 * i))` para i entre 0 y 7, exclusivo) seguido por 7 cortos indicando qué acción está multiplexada fuera de cada conjunto de pines. ConnectionState puede ser 0 para desconectado, 1 o 2 para un dispositivo conectado estándar dependiendo de la orientación y 3 para conexiones de audio y depuración. LineState es un valor de 2 bits, cuya significancia no es bien conocida en este momento.
* Estados de pin: un ID de acción por par de pines, en cortos de 16 bits.

En este caso la acción 306 está mapeada al conjunto de pines 2 (el tercer conjunto de pines).

## Conjuntos de pines

Del Mac Mini 2020 (M1):

* 0: D+,D- Secundario (par de datos USB2 en el lado VCONN del conector)
* 1: D+,D- Primario (par de datos USB2 en el lado CC del conector). Estos no están puenteados en el lado del host y pueden sacar diferentes señales, lo cual es una característica única de los puertos de depuración. ¡Los cables solo tienen un par en el lado CC!
* 2: SBU1,SBU2
* 3-6: desconocido (¿pares SSTX/SSRX?)

Los pines se ajustan automáticamente para la orientación del conector en el lado del Mac, por lo que los pines siempre serán los mismos desde el lado del cable. El dispositivo en el otro extremo es responsable de ajustar para la orientación en ese extremo.

## Acciones

### 103: Reinicio PD

Esto necesita un argumento 0x8000 (tomado de la respuesta de información de acción).

```
5AC8012,0103,80000000
>VDM(D) 5AC8012 103 80000000
Disconnect: cc1=0 cc2=0
VBUS OFF
Disconnected
(ocurre renegociación PD)
```

### 105: Reinicio

Esto necesita un argumento 0x8000 (tomado de la respuesta de información de acción).

```
5AC8012,0105,80000000
>VDM(D) 5AC8012 105 80000000
<VDM RX SOP"DEBUG (5) [524F] 5AC8052 44740000 306 0 0
Disconnect: cc1=0 cc2=0
VBUS OFF
Disconnected
S: DISCONNECTED
IRQ: VBUSOK (VBUS=OFF)
(el dispositivo se reinicia y PD renegocia)
```

#### sobre el comando de reinicio
el comando "5AC8012,0105,80000000" se envía a través del Monitor Serial del IDE de Arduino. si quieres reiniciar el Mac de manera más conveniente,
puedes probar los siguientes comandos:
```
Opción 1:
echo "5AC8012,0105,80000000" | picocom -c -b 500000 --imap lfcrlf -qrx 1000 /dev/<tu dispositivo Serial Arduino>

Opción 2:
stty 500000 </dev/<tu dispositivo Serial Arduino> 
echo > /dev/<tu dispositivo Serial Arduino> 
echo 5AC8012,0105,80000000 > /dev/<tu dispositivo Serial Arduino> 
```
Sin embargo, debido a las [operaciones predeterminadas de Arduino en el puerto Serial](https://forum.arduino.cc/t/solved-problem-with-serial-communication-on-leonardo/139614), los comandos anteriores probablemente fallarán y tendrán éxito aleatoriamente.
Resulta que el siguiente código python funciona bien al reiniciar manualmente Arduino antes de enviar los datos del comando:
```
import serial
import time
ser = serial.Serial("/dev/<tu dispositivo Serial Arduino>", 500000, dsrdtr=True)
ser.dtr = True
ser.dtr = False
time.sleep(0.5)
ser.dtr = True
time.sleep(2)
ser.write(b'5AC8012,0105,80000000\n')
ser.close() 
```

### 106: DFU / modo de retención

Esto necesita un argumento 0x8001 (tomado de la respuesta de información de acción). Solo funciona correctamente en modo DFP (Mac actuando como UFP).

```
5AC8012,0106,80010000
>VDM(D) 5AC8012 106 80010000
<VDM RX SOP"DEBUG (5) [544F] 5AC8052 44740000 306 0 0
(el dispositivo se reinicia en modo DFU, no ocurre renegociación PD)
```

Este modo es especial. En el Mac Mini, un apagado forzado normalmente deshabilita las comunicaciones PD y el modo UFP (Rd abierto). Sin embargo, un apagado forzado desde este modo (por ejemplo, manteniendo presionado el botón de encendido) apagará la máquina mientras las comunicaciones PD permanecen activas. La máquina también puede ser reiniciada vía 105 al modo normal, y nuevamente PD no se reinicia y los modos existentes permanecen activos. Esto puede usarse para mantener la conectividad de depuración a través de un reinicio de la máquina.

FIXME: o tal vez es solo el bit de persistencia en el encabezado. Necesita más pruebas.

### 306: UART de Depuración

Orden de pines: TX, RX

Esto puede mapearse a conjuntos de pines 0-2 (D+/D- B, D+/D- A, o SBU1/2). El UART usa niveles de voltaje de 1.2V.

```
5AC8012,840306
>VDM 5AC8012 840306
<VDM RX SOP'DEBUG (5) [584F] 5AC8052 44740000 306 0 0
(UART ahora está mapeado a SBU1/2)
```

el pin 1 es TX y el pin 2 es RX, consciente de la orientación (para CC=CC2 están invertidos). En otras palabras, el pin SBU en el mismo lado del conector (A o B) que tu pin CC es TX.

### 606: USB DFU

Orden de pines: D+, D- (por supuesto)

Esto se mapea automáticamente al conjunto de pines 1 (D+/D- primario) en modo DFU, pero puede moverse.

Para mover DFU al otro conjunto D+/D-:
```
5AC8012,2020606
>VDM(D) 5AC8012 2020606
<VDM RX SOP"DEBUG (5) [5E4F] 5AC8052 44400000 0 0 0
5AC8012,810606
>VDM(D) 5AC8012 810606
<VDM RX SOP"DEBUG (5) [504F] 5AC8052 44430606 0 0 0
(DFU ahora está en el par D+/D- secundario (conjunto de pines 0))
```

### 4606: USB de Depuración

Interesante. Esto no es impulsado por la CPU principal, se enumera incluso cuando el sistema está apagado (en modo persistente). Se reenumera en transiciones de energía.