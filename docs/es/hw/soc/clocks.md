---
title: Relojes
---

Hay (al menos) dos tipos diferentes de relojes definidos en el ADT:

* `clock-gates` o `power-gates` que indexan en el array `devices` del nodo ADT `pmgr`
* `clock-ids` que representan relojes con una frecuencia e indexan en el array `clock-frequencies` del nodo `arm-io`

## clock-gates / power-gates

Los relojes con compuerta se utilizan para eliminar la señal de reloj a ciertos periféricos cuando no se utilizan. Los ids para un nodo ADT específico generalmente necesitan ser activados antes de que se pueda acceder a la región MMIO de ese dispositivo.

Probablemente también hay alguna topología involucrada en estos relojes ya que, por ejemplo, `SIO`, `UART_P` y `UART0` parecen ser necesarios para acceder a la región MMIO del UART aunque el nodo UART solo solicita `UART0`.

## clock-ids

Estos relojes probablemente están preconfigurados por iBoot y nunca son tocados por XNU mismo. Sus frecuencias se pasan como nodos en el ADT. Los índices bajos (<0x100, pero probablemente solo 6 o así) son relojes dados en el nodo `cpu0` (por ejemplo, `bus-frequency`) y por ahora todos parecen estar configurados a 24 MHz.
Los índices por encima de 0x100 se mapean al array `clock-frequencies` del nodo `arm-io`. Estos generalmente se usan como relojes de referencia para, por ejemplo, el UART o el bus I2C.

También está la propiedad `clock-frequencies-regs` pero se desconoce cómo exactamente los registros allí se mapean a los relojes mencionados anteriormente. Esa propiedad también parece estar completamente sin usar por XNU. 