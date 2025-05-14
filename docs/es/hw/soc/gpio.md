---
title: Controlador GPIO
---

## Vinculación DT

Los nodos "gpio,t8101" en el ADT representan un controlador GPIO con capacidades de pinmux.
A juzgar por la base de código de Corellium, los pines pueden cambiarse entre la funcionalidad "gpio" y la funcionalidad "periph".
Puede haber más opciones aunque hay bits desconocidos justo al lado del bit que controla el cambio entre esos dos modos.
Dado que el controlador implementa funcionalidad de pinmux, necesitamos modelar este hardware como un nodo pinctrl en el FDT. Esto se puede hacer completamente usando propiedades genéricas de vinculación pinctrl/pinmux/gpio:

```
#define APPLE_PINMUX(pin, func) ((pin) | ((func) << 16))

                pinctrl: pinctrl@23c100000 {
                        compatible = "apple,t8103-pinctrl";
                        reg = <0x2 0x3c100000 0x0 0x100000>;
                        clocks = <&gpio_clk>;

                        gpio-controller;
                        #gpio-cells = <2>;
                        gpio-ranges = <&pinctrl 0 0 212>;

                        pcie_pins: pcie-pins {
                                pinmux = <APPLE_PINMUX(150, 1)>,
                                         <APPLE_PINMUX(151, 1)>,
                                         <APPLE_PINMUX(32, 1)>;
                        };
                };
```
Usar `pinmux` tiene la ventaja de que no tenemos que inventar nombres para los pines y funciones y codificarlos en el controlador.
El propósito de los pines probablemente variará entre SoCs y entre controladores en un solo SoC. ¡Hay cuatro controladores en el SoC M1!
El ejemplo aquí usa una división simple de la celda pinmux de 32 bits.
Los 16 bits inferiores codifican el número de pin mientras que los 16 bits superiores codifican la función del pin.
Es poco probable que necesitemos los 16 bits completos para codificar la función del pin, así que reutilizaremos algunos de esos bits si lo necesitamos en el futuro.

Algunas preguntas abiertas:
* ¿Debería la cadena compatible ser "apple,t8101-gpio" dado el nombre del nodo en el ADT? ¿O deberíamos mencionar ambos?
* Los controladores parecen proporcionar funcionalidad de interrupción también. Las vinculaciones estándar permiten una propiedad `interrupt-controller` así que esto también se puede manejar. Hay (hasta) 7 interrupciones AIC por controlador, cada una manejando un grupo de pines GPIO. Parece que los pines GPIO pueden asignarse libremente a un grupo aunque el ADT contiene propiedades que sugieren que no todos los grupos son funcionales en algunos de los controladores.

El controlador gpio proporciona funcionalidad de interrupción a dispositivos que lo usan como `interrupt-parent`. Esos dispositivos tienen 2 `#interrupt-cells`. La primera celda especifica el pin GPIO. El significado del segundo pin es desconocido. `audio-tas5770L-speaker`, `audio-codec-output`, `hpmBusManager` usan 0x1, `wlan` 0x2 y `bluetooth` 0x2000002. El valor de las segundas celdas no parece corresponder al registro de configuración del pin.

dispositivo              | pin | 2da celda | config por iboot (mac mini)
---------------------- | --- | --------- | --------------------------
hpmBusManager          | 106 | 0x1       | 0x76b80
bluetooth              | 136 | 0x2000002 | 0x76a80
audio-tas5770L-speaker | 182 | 0x1       | 0x76b81
audio-codec-output     | 183 | 0x1       | 0x76b81
wlan                   | 196 | 0x2       | 0x76ac0

Comportamiento observado de Mac OS para el dispositivo `/arm-io/gpio` en la dirección `0x23c100000`:
1. leer configuración de pin (4 bytes) desde el desplazamiento `0x0000` hasta `0x34c` (212 pines)
2. limpiar interrupciones para los 7 grupos? escribiendo unos 7 x 4 bytes en siete grupos en los desplazamientos `0x800`, `0x840`, `0x880`, `0x8C0`, `0x900`, `0x940`, `0x980` 