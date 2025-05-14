---
title: Controlador de Retroiluminación del Teclado
---

En el MacBook Pro, la retroiluminación del teclado aparece en el ADT como:

```
fpwm {
  [...]
  AAPL.phandle = 59
  clock-gates = 37
  device_type = fpwm
  reg = [889470976, 16384]

  kbd-backlight {
    [...]
  }
}
```

Esto sugiere que hay un PWM en 0x235044000, habilitado por la puerta de reloj en 0x23b7001e0, que controla la retroiluminación del teclado. Y efectivamente parece ser el caso :-)

Registros, según lo que he podido determinar:

```
+0x00: escribir 0x4239 para habilitar o después de cambiar los valores del contador
+0x04: desconocido, sin efecto
+0x08: bits de estado: el bit 0x01 se establece cuando la luz se enciende, 0x02 se establece cuando la luz se apaga. Se borra al escribir.
+0x0c: desconocido, sin efecto
+0x18: período de apagado, en ticks de 24 MHz
+0x1c: período de encendido, en ticks de 24 MHz
```

Así que una secuencia completa de m1n1 para hacer que la retroiluminación del teclado parpadee de una manera molesta y posiblemente inductora de convulsiones es:

```
>>> write32(0x23b7001e0, 0xf)
>>> write32(0x23504401c, 1200000)
>>> write32(0x235044018, 1200000)
>>> write32(0x235044000, 0x4239)
```

cambiando la frecuencia mientras se mantiene un ciclo de trabajo del 50%:

```
>>> write32(0x235044018, 4000)
>>> write32(0x23504401c, 4000)
>>> write32(0x235044000, 0x4239)
```

PR en https://github.com/AsahiLinux/linux/pull/5 