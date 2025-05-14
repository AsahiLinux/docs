---
title: Controlador PCIe de Apple
---

El puente host PCIe incluye al menos alguna lógica derivada de Synopsys DesignWare. La versión de lanzamiento codificada en el desplazamiento 0x8f8/0x8fc en el espacio de configuración PCIE indica la versión 530*-ea15 (5.30a-ea15).

## Vinculaciones ADT

|      Propiedad     |      Valor       |      Significado      |
|-------------------|------------------|-------------------|
| compatible        | apcie,t8103      | cadena compatible |
| #address-cells    | 3                | DT PCI normal: `<tipo BAR><dir>len>` |
| #size-cells       | 2                | DT PCI normal     |
| interrupt-parent  | -                | phandle de AIC    |
| interrupts        | (0x2b7, 0x2ba, 0x2bd) | Interrupciones administrativas. ¿Quizás AER? |
| msi-parent-controller | -            | phandle de AIC    |
| #msi-vectors      | 32               | número de IRQs en AIC para MSI |
| msi-address       | 0xfffff000       | programar esto en la BAR de dirección MSI-X |
| msi-vector-offset | 0x2c0            | (esto + msi_id) van al campo de valor MSI-X en la BAR de dispositivo MSI-X |
| #ports            | 3                | número de vinculaciones DART |
| apcie-common-tunables | 0x2c, 0x4, 0xff, 0x0, 0x1, 0x0, 0x54, 0x4, 0xffffffff, 0x0, 0x140, 0x0 | ?
| apcie-axi2af-tunables | todo | ? |
| apcie-phy-tunables | todo | ? |
| apcie-phy-ip-pll-tunables | todo | ? |
| apcie-phy-ip-auspma-tunables | todo | ? |

### reg

|   Dirección   | Longitud      | Significado                    |
|-------------|-------------|----------------------------|
| 0x690000000 | 0x10000000  | Espacio ECAM
| 0x680000000 | 0x40000     | Ctrl
| 0x680080000 | 0x90000     | Config Phy
| 0x6800c0000 | 0x20000     | ?
| 0x68c000000 | 0x4000      | ?
| 0x3d2bc000  | 0x1000      | ?
| 0x681000000 | 0x8000      | registros de enlace/control puerto0
| 0x681010000 | 0x1000      | puerto0
| 0x680084000 | 0x4000      | phy puerto0
| 0x6800c8000 | 0x16610     | puerto0
| 0x682000000 | 0x8000      | registros de enlace/control puerto1
| 0x682010000 | 0x1000      | puerto1
| 0x680088000 | 0x4000      | phy puerto1
| 0x6800d0000 | 0x6000      | puerto1
| 0x683000000 | 0x8000      | registros de enlace/control puerto2
| 0x683010000 | 0x1000      | puerto2
| 0x68008c000 | 0x4000      | phy puerto2
| 0x6800d8000 | 0x6000      | puerto2

## Significados conocidos de registros

|    Espacio    |    Desplazamiento    |      nombre      | Significado / Valores       |
|-------------|--------------|----------------|------------------------|
| Ctrl        | 0x28         | Refclk         | 1 << 4 es bueno
| Ctrl        | 0x50         | ?              | Escribir 1 para habilitar PCIe
| Ctrl        | 0x58         | ?              | Lee 1 después de escritura 0x50
| Config Phy  | 0x0          | ?              | Escribir bits 0x1 y 0x2 alternan 0x4 y 0x8 respectivamente
| puertoX link  | 0x100        | pcielint
| puertoX link  | 0x208        | linksts        | Bit 0x1 significa que el enlace está habilitado. Requiere escritura a 0x804
| puertoX link  | 0x210        | linkcdmsts
| puertoX link  | 0x800        | ?              | Leído en initializeRootComplex()
| puertoX link  | 0x804        | ?              | Leído en enablePortHardware()
| puertoX phy   | 0x0          | PhyGlueLaneReg / RefClockBuffer | Escribir bits 0x1 y 0x2 alternan bits 0x4 y 0x2 respectivamente

## Ajustables

El siguiente conjunto de ajustables opera en el espacio de configuración de los dispositivos puente PCIe por puerto.

### pcie-rc-tunables
En el mini M1 2020, este conjunto de escrituras de registro modifica algunos bits en estructuras de capacidad estandarizadas así como algunos otros registros.
| registro | capacidad | efecto |
|----------|------------|--------|
| 0x194    | L1 PM Substates | limpiar Port Common_Mode_Restore_Time |
|          |                 | limpiar Port T_POWER_ON Scale |
|          |                 | limpiar Port T_POWER_ON Value |
| 0x2a4    | Data Link Feature | limpiar Data Link Feature Exchange Enable |
| 0xb80    |             | no es parte de una estructura de capacidad (extendida) |
| 0xb84    |             | no es parte de una estructura de capacidad (extendida) |
| 0x78     | PCI Express | limpiar Max_Read_Request_Size |

### pcie-rc-gen3-shadow-tunables
| registro | capacidad | efecto |
|----------|------------|--------|
| 0x154    | Secondary PCI Express | establecer Downstream Port 8.0 GT/s Transmitter Preset |
|          |                       | establecer Upstream Port 8.0 GT/s Transmitter Preset |
| 0x890    |            | no es parte de una estructura de capacidad (extendida) |
|          |            | parece ser el registro GEN3_RELATED de Synopsys Designware PCIe |
| 0x8a8    |            | no es parte de una estructura de capacidad (extendida) |
|          |            | parece ser el registro GEN3_EQ_CONTROL de Synopsys Designware PCIe |

### pcie-rc-gen4-shadow-tunables
| registro | capacidad | efecto |
|----------|------------|--------|
| 0x178    | Physical Layer 16.0 GT/s | establecer Downstream Port 16.0 GT/s Transmitter Preset |
|          |                          | establecer Upstream Port 16.0 GT/s Transmitter Preset |
| 0x890    |            | no es parte de una estructura de capacidad (extendida) |
|          |            | (ver arriba) |
| 0x8a8    |            | no es parte de una estructura de capacidad (extendida) |
|          |            | (ver arriba) |

Así que los cambios en los registros documentados parecen deshabilitar algunas características (¿con errores?) así como hacer algún ajuste de ecualización de carriles. ¿Quizás Apple espera volver a habilitar esto en una futura revisión del silicio sin tener que especificar revisiones específicas de silicio en su controlador xnu?

## Vinculaciones DT

Las vinculaciones del árbol de dispositivos han sido aceptadas upstream.

Algunas preguntas abiertas permanecen:
* ¿Cómo habilitamos el dispositivo PCIe WiFi/BT? Este dispositivo necesita ser explícitamente habilitado a través del SMC antes de aparecer como un dispositivo PCIe. Se ha sugerido que así es como Apple implementa el "Modo Avión" y hay un nodo "amfm" separado en el ADT para esto. Así que tal vez tenga sentido tener algún tipo de dispositivo/nodo rfkill que se encargue de esto. Con suerte, esto significa que el dispositivo APCIe recibe una interrupción cuando se enciende tal que podemos (re)entrenar el enlace PCIe.

Esta vinculación propuesta ha sido implementada/probada exitosamente en u-boot y OpenBSD. Sin embargo, todavía necesitamos vinculaciones de reloj, pinctrl/gpio y DART para hacer que todo esto funcione. 