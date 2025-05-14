---
title: Subsistemas de la Plataforma Apple Silicon
---

Estas páginas detallan los aspectos específicos de un subsistema particular de la plataforma. Están categorizadas
por función.

### Descripciones generales
* [Introducción a Apple Silicon](introduction.md)
* [Motores Aceleradores](../hw/soc/accelerators.md)

### Coprocesadores y aceleradores
* [AGX](../hw/soc/agx.md) - El renderizador basado en tiles con aplazamiento derivado de PowerVR de Apple
* [SEP](../hw/soc/sep.md) - El Secure Enclave, el motor de criptografía/biometría/seguridad de Apple

### Lógica de control de la plataforma
* [AIC](../hw/soc/aic.md) - Controlador de Interrupciones de Apple
* [WDT](../hw/soc/wdt.md) - Temporizador Watchdog
* [SMC](../hw/soc/smc.md) - Controlador de Gestión del Sistema
* [ASC](../hw/soc/asc.md) - Interfaz de firmware tipo Mailbox de Apple

### Inicialización y arranque de la plataforma
* [Arranque](../fw/boot.md)
* [Protocolo de Arranque MachO](../fw/macho-boot-protocol.md)
* [Mapa de Memoria](../hw/soc/memmap.md)
* [Inicio SMP](../hw/cpu/smp.md)
* [ADT](../fw/adt.md) (Apple Device Tree)
* [NVRAM](../fw/nvram.md) 

### Procesadores de aplicación
* [Registros del Sistema ARM](../hw/cpu/system-registers.md)
* [SPRR y GXF](../hw/cpu/sprr-gxf.md)
* [Registros de Depuración de CPU](../hw/cpu/debug-registers.md)
* [Instrucciones de Apple](../hw/cpu/apple-instructions.md)

### E/S
* [APCIe](../hw/soc/apcie.md) (controlador PCIe de Apple)
* [GPIO](../hw/soc/gpio.md)
* [Depuración USB](../hw/soc/usb-debug.md)
* [USB PD](../hw/soc/usb-pd.md)
* [Disposición de Particiones Original](stock-partition-layout.md)

### Periféricos
* [Cámara](../hw/peripherals/camera.md) - Cámara e ISP de Broadcom 