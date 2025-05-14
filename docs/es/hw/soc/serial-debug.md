---
title: Depuración mediante Consola Serial
---

Tomado de la guía original de Inicio Rápido para Desarrolladores

## Obteniendo una consola serial

Tener una consola serial es indispensable para un ciclo de desarrollo rápido y para depurar problemas de bajo nivel.

Los Macs M1 exponen su puerto serial de depuración a través de uno de sus puertos Type C (el mismo usado para DFU). En los MacBooks, este es el puerto trasero izquierdo. En el Mac Mini, este es el puerto más cercano al enchufe de alimentación.

La máquina objetivo también puede ser reiniciada forzosamente usando comandos USB-PD VDM, permitiendo un ciclo de prueba rápido (sin mantener presionados botones de encendido).

Ver [USB-PD](usb-pd.md) para detalles sobre los comandos USB-PD VDM y lo que puedes hacer con ellos.

El puerto serial es un UART que usa niveles lógicos de 1.2V, y requiere comandos USB-PD VDM específicos del fabricante para habilitarse. Por lo tanto, hacer un cable compatible no es trivial. Tienes las siguientes opciones.

### Usando una máquina M1

Si tienes dos cajas M1, esta es la solución más simple. Solo toma [macvdmtool](https://github.com/AsahiLinux/macvdmtool/), conecta ambas máquinas con un cable Type C SuperSpeed estándar usando el puerto DFU en *ambas* máquinas, ¡y eso es todo!

**NOTA IMPORTANTE:** El cable necesita ser del tipo USB 3 / SuperSpeed. Los cables solo USB 2 no funcionarán, **el cable de carga que viene con el MacBook/MacBook Air no funcionará** y tampoco lo harán la mayoría de otros cables baratos o cables comercializados por su capacidad de carga. Si no dice "SuperSpeed" o "USB3.0" en el paquete casi seguro no funcionará. Si es delgado y flexible casi seguro *no* es un cable SuperSpeed. Los cables que funcionan necesitan tener más de **15** cables dentro; si no parece que podría tener tantos cables dentro, no es el cable que necesitas. Si estás seguro de que tu cable es capaz de SuperSpeed (es decir, los dispositivos se enumeran como SuperSpeed a través de él) y aún así no funciona, entonces no es compatible y el fabricante merece ser avergonzado en su página de reseñas de Amazon, porque significa que no conectaron los pines SBU1/2.

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
Looking for HPM devices...
Found: IOService:/AppleARMPE/arm-io@10F00000/AppleT810xIO/i2c0@35010000/AppleS5L8940XI2CController/hpmBusManager@6B/AppleHPMBusController/hpm0/AppleHPMARM
Connection: Sink
Status: APP 
Unlocking... OK
Entering DBMa mode... Status: DBMa
Rebooting target into normal mode... OK
Waiting for connection........ Connected
Putting target into serial mode... OK
Putting local end into serial mode... OK
Exiting DBMa mode... OK
```

Ve la página de macvdmtool o simplemente ejecútalo sin argumentos para una lista de comandos soportados. Tu dispositivo de puerto serial es `/dev/cu.debug-console`. Puedes probar picocom con: `sudo picocom -q --omap crlf --imap lfcrlf -b 115200 /dev/tty.debug-console`.

NOTA: si has habilitado la salida de depuración serial en tu máquina host (a través de configuraciones nvram), el dispositivo de puerto serial estará en uso por el kernel. Necesitas desactivar eso para usarlo como un puerto serial genérico.

### Interfaz USB-PD DIY basada en Arduino

Puedes construir una interfaz USB-PD DIY con las siguientes partes:

* Un Arduino o clon
* Un chip FUSB302, ya sea independiente o en una placa breakout
* Una placa breakout USB Type C (consigue una macho, conectándola directamente al objetivo, para la máxima flexibilidad)
* Una interfaz UART compatible con 1.2V

Ten en cuenta que la mayoría de las placas breakout FUSB302 no expondrán útilmente los pines Type C que necesitas, así que es mejor usar una placa breakout completa separada.

Ve al repositorio [vdmtool](https://github.com/AsahiLinux/vdmtool) para más información y una lista de cableado. La documentación es un poco escasa en este momento. Puedes preguntarnos en IRC (OFTC/#asahi) si necesitas ayuda.

Las interfaces UART compatibles con 1.2V son relativamente raras. Las de 1.8V generalmente funcionarán para entrada (RX); puedes usar un divisor de resistencia para bajar el voltaje TX (`TX -- 220Ω -+- 470Ω -- GND` bajará TX de 1.8V a 1.22V en el punto `+`).

El código `vdmtool` por defecto pondrá serial en los pines SBU1/SBU2. En el lado del conector del dispositivo (sin cable), TX (salida del Mac) estará en el pin SBU1 en el lado del conector que tiene la línea CC activa (deberías conectar solo uno), y RX (entrada al Mac) estará directamente opuesto a la línea CC.

Todo esto es bastante rudimentario porque es una solución temporal para la solución adecuada, que es...

### Interfaz de Depuración USB-PD Inflexible (también conocida como Central Scrutinizer)

Una alternativa al enfoque DIY anterior es el proyecto Central Scrutinizer, que comenzó exactamente como lo anterior, solo usando un PCB personalizado en lugar de una placa de pruebas. Desde entonces ha evolucionado para soportar características adicionales, pero la funcionalidad principal es exactamente la misma:

![Central Scrutinizer](../../assets/central-scrutinizer.jpg)
![Central Scrutinizer (lado)](../../assets/central-scrutinizer-2.jpg)

Las características principales son:
- RaspberryPi Pico como micro-controlador (¡sí, totalmente excesivo, pero más barato que un Arduino!)
- cambiadores de nivel para las líneas seriales
- passthrough USB2.0 para alimentar m1n1
- apilable (un solo Pico es capaz de manejar **dos** placas Central Scrutinizer)
- detección de orientación USB-C (v2+)
- capaz de usar cables USB2.0 simples para serial, a costa de no poder usar la característica de passthrough (v3+)

El proyecto KiCad está disponible [aquí](https://git.kernel.org/pub/scm/linux/kernel/git/maz/cs-hw.git), y el firmware correspondiente para el Pico está [allí](https://git.kernel.org/pub/scm/linux/kernel/git/maz/cs-sw.git). El lado de hardware del proyecto está pre-configurado para producción en JLCPCB, por lo que producirlo está a solo unos clics de distancia. Alternativamente, puedes encontrar algunas placas pre-construidas en Tindie, pero construir la tuya debería ser la primera opción.

Si quieres más información sobre este proyecto, no dudes en contactar a [maz](mailto:maz@kernel.org).

### Interfaz de Depuración USB-PD Flexible (nombre del proyecto por determinar)

~~En las próximas semanas diseñaremos una interfaz de hardware abierto para conectar con puertos seriales M1, y más (soportando otros conjuntos de pines de depuración en dispositivos Apple, así como UARTs en otros dispositivos como ciertos teléfonos Android, etc). Mantente atento para más información. Los desarrolladores de kernel establecidos que quieran obtener un prototipo temprano cuando estén disponibles deberían contactar a [marcan](mailto:marcan@marcan.st).~~

Nota: Esto está indefinidamente en espera y mayormente obsoleto por el soporte USB en m1n1/hypervisor. 