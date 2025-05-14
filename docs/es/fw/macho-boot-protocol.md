---
title: Protocolo de Arranque MachO
summary:
  Protocolo de arranque utilizado por dispositivos Apple Silicon al arrancar m1n1 como un binario MachO
---

## Protocolo de arranque

### Memoria

La memoria comienza en 0x8_0000_0000.

Cuando iBoot nos llama, la memoria se ve así:

```
+==========================+ <-- fondo de la RAM (0x8_0000_0000)
| Reservas de coprocesador,|
| cosas de iBoot, etc.     |
+==========================+ <-- boot_args->phys_base, VM = boot_args->virt_base
| Espacio para kASLR (<32MiB) |
+==========================+
| Árbol de Dispositivos (ADT) | /chosen/memory-map.DeviceTree
+--------------------------+
| Trust Cache              | /chosen/memory-map.TrustCache
+==========================+ <-- Dirección base más baja de Mach-O mapeada aquí (+ desplazamiento!)
| Base Mach-O (cabecera)   | /chosen/memory-map.Kernel-mach_header
+--                      --+
| Segmentos Mach-O...      | /chosen/memory-map.Kernel-(segment ID)...
+--                      --+
| m1n1: Región de payload  | /chosen/memory-map.Kernel-PYLD (actualmente 64MB)
+==========================+
| Firmware SEP             | /chosen/memory-map.SEPFW
+--------------------------+ <-- boot_args
| BootArgs                 | /chosen/memory-map.BootArgs
+==========================+ <-- boot_args->top_of_kdata
|                          |
|      (Memoria libre)     |
| (incl. trampolín iBoot)  |
|                          |
+==========================+ <-- boot_args->top_of_kdata + boot_args->mem_size
| Memoria de video, SEP    |
| reservas y más           |
+==========================+ <-- 0x8_0000_0000 + boot_args.mem_size_actual
```

### Sobre los punteros

Hay cuatro tipos de direcciones que puedes encontrar:

* Direcciones físicas
* Desplazamientos no reubicados de m1n1 (relativos a 0)
* Direcciones virtuales Mach-O
* Direcciones virtuales desplazadas por kASLR

Las direcciones físicas son lo único que debería importarte.

Los desplazamientos no reubicados de m1n1 solo se usan en el código de inicio de m1n1 antes de ejecutar las reubicaciones y la información relacionada del script del enlazador. El entorno C está correctamente ajustado después de eso, así que nunca deberías verlos ahí. Sin embargo, si estás depurando m1n1 e imprimiendo punteros, y quieres mapearlos al archivo ELF crudo, tendrás que restar el desplazamiento de carga de m1n1 para obtener el desplazamiento no reubicado.

Las direcciones virtuales no tienen significado; esto se usa solo porque Mach-O no tiene concepto de direcciones físicas, y toda la configuración asume que Darwin se mapeará de cierta manera. Para nuestros propósitos, una vaddr es simplemente `paddr + ba.virt_base - ba.phys_base`. m1n1 no usa direcciones virtuales de la mitad superior, y Linux hace lo suyo, que no tiene nada que ver con Darwin.

Además, hay dos mapas de direcciones virtuales: lo que está en el Mach-O y los punteros que iBoot realmente nos pasa. Estos últimos están desplazados por el kASLR, lo que también afecta a las vaddrs. Esto lo hace todo más confuso.

Así, para cualquier puntero virtual desplazado por kASLR de Darwin recibido de iBoot, calculamos
`vaddr - ba.virt_base + ba.phys_base` y eso es todo lo que nos importa; por el contrario, solo el script del enlazador (y la generación de cabecera Mach-O dentro de él) se preocupa por las direcciones virtuales no desplazadas de Mach-O. Si escribes código para m1n1 nunca verás esas. Realmente, no lo pienses demasiado, solo te confundirás.

### Entrada

iBoot entra en nosotros en el punto de entrada definido en la (ridícula) estructura de datos Mach-O como una vaddr no desplazada. La entrada es con la MMU apagada. `x0` apunta a la [estructura boot_args](https://github.com/AsahiLinux/m1n1/blob/main/src/xnuboot.h).

Además, iBoot establece y bloquea el RVBAR de la CPU de arranque para que sea la parte superior de la página donde vive el punto de entrada. Esto no puede cambiarse después del arranque, y por lo tanto esta dirección siempre tendrá un significado especial y debe tratarse como código residente del gestor de arranque. Por ahora, el significado práctico no está claro, pero presumiblemente después de reanudar desde un sueño profundo, la CPU de arranque comenzará a ejecutar código aquí. Ten en cuenta que esto no bloquea los vectores reales de la CPU (que pueden cambiarse libremente en `VBAR_EL2`) ni afecta al RVBAR de las CPUs secundarias (que pueden establecerse libremente antes de emitir el comando de inicio).

## Distribución de memoria de m1n1

Al ejecutar m1n1 inicialmente, la memoria relevante se ve así:

```
+==========================+
| Árbol de Dispositivos (ADT) | /chosen/memory-map.DeviceTree
+--------------------------+
| Trust Cache              | /chosen/memory-map.TrustCache
+==========================+ <-- _base
| Cabecera Mach-O          | /chosen/memory-map.Kernel-_HDR
+--                      --+ <-- _text_start, _vectors_start
| m1n1 .text               | /chosen/memory-map.Kernel-TEXT
+--                      --+
| m1n1 .rodata             | /chosen/memory-map.Kernel-RODA
+--                      --+ <-- _data_start
| m1n1 .data & .bss        | /chosen/memory-map.Kernel-DATA
+--                      --+ <-- _payload_start
| Región de payload m1n1   | /chosen/memory-map.Kernel-PYLD (actualmente 64MB)
+==========================+ <-- _payload_end
| Firmware SEP             | /chosen/memory-map.SEPFW
+--------------------------+ <-- boot_args
| BootArgs                 | /chosen/memory-map.BootArgs
+==========================+ <-- boot_args->top_of_kdata, heap_base
| Bloque de heap de m1n1   | (>=128MB)
+--                      --+ <-- ProxyUtils.heap_base (fin de uso del heap de m1n1 + 128MB)
| Heap de Python           | (1 GiB)
+--                      --+
|      (Memoria sin usar)  |
+==========================+ <-- boot_args->top_of_kdata + boot_args->mem_size
```

El área de heapblock de m1n1 (usada como backend para malloc y para cargar payloads) comienza en `boot_args.top_of_kdata` y actualmente no tiene límite. Al usar proxyclient, ProxyUtils configurará una base de heap de Python 128MiB por encima de donde termina el heapblock actual, lo que significa que m1n1 puede usar hasta 128MiB de memoria adicional antes de encontrarse con las estructuras del lado de Python. Ten en cuenta que nuevas ejecuciones del lado de Python reinicializarán su heap comenzando donde termine m1n1, así que, por ejemplo, fugas de memoria del lado de m1n1 en cada ejecución de Python no son un problema inmediato hasta que se agote la RAM total.

Al encadenar otro payload Mach-O, la siguiente etapa sobrescribe m1n1 en su lugar. El código de carga Mach-O de chainload.py omite el final de relleno de la sección de payload de m1n1 (excepto 4 bytes cero como marcador), por lo que el firmware SEP y BootArgs siguen directamente en lo que de otro modo habría sido el área de payload de m1n1, ahorrando RAM. Reubicar el firmware SEP es opcional; si no está habilitado, permanece donde está y top_of_kdata se mantiene sin cambios. A menos que m1n1 crezca más que el tamaño de su región de payload, esto debería ser seguro. 