---
title: Kernelcache de macOS
---

# LEE ESTO ANTES DE PROCEDER MÁS ADELANTE

**Asahi Linux tiene una [política de ingeniería inversa](https://asahilinux.org/copyright/) muy estricta. No comiences a desensamblar código de macOS, incluyendo el kernel de Darwin, a menos que hayas leído y entendido completamente la política.**

Esperamos que cualquier contribuidor que desee usar ingeniería inversa binaria como parte de su contribución al proyecto discuta los detalles específicos con nosotros de antemano. Esto generalmente significará organizar un entorno de sala limpia, donde su único trabajo será escribir especificaciones, no código fuente, sobre cualquier subsistema relacionado.

Puedes ser baneado de contribuir código directamente a nuestro proyecto si no haces esto. Has sido advertido.

**Distribuir binarios de macOS, en su totalidad o en parte, es una violación de derechos de autor.** No subas ni compartas ningún archivo de este tipo. Tienes que extraer los archivos de tu propia instalación de macOS, en una computadora Apple.

De nuevo, **solo procede si has hablado con nosotros primero sobre esto**.

## Extrayendo el kernelcache de Darwin

* Encuentra tu kernelcache en la partición Preboot de tu instalación del OS
* Obtén [img4tool](https://github.com/tihmstar/img4tool)
* `img4tool -a kernelcache -e -p kernelcache.im4p -m kernelcache.im4m`
* `img4tool kernelcache.im4p -e -o kernelcache.macho`
* El resultado es un archivo Mach-O estándar. Puedes ver los encabezados con [machodump.py](https://gist.github.com/marcan/e1808a2f4a5e1fc562357550a770afb1) si no tienes un toolchain de Mach-O a mano.

## Alternativa usando el archivo kernel.release.*

* Por sugerencia de **davidrysk** hay algunas imágenes de kernel de MacOS ya disponibles en **/System/Library/Kernels/kernel.release.t8020**
* A continuación se muestra el volcado del encabezado macho con el script de Marcan [machodump.py](https://gist.github.com/marcan/e1808a2f4a5e1fc562357550a770afb1) para obtener los offsets para desensamblar el código:
  * Nota: Esto requiere el paquete python **construct** pero los paquetes de debian buster no funcionaron (python 3 o 2) ni siquiera una versión de github
  * Tuve que usar la instalación pypi vía pip3:
```
 apt install python3-pip
 pip3 install construct
```

 * Luego vuelca los encabezados para extraer los offsets al código:
```
python3 machodump.py kernel.release.t8020
...
            cmd = (enum) SEGMENT_64 25
            args = Container: 
                segname = u'__TEXT' (total 6)
                vmaddr = 0xFFFFFE0007004000
                vmsize = 0x00000000000C4000
                fileoff = 0x0000000000000000
                filesize = 0x00000000000C4000
...
        Container: 
            cmd = (enum) UNIXTHREAD 5
            args = ListContainer: 
                Container: 
                    flavor = (enum) THREAD64 6
                    data = Container: 
                        x = ListContainer: 
                            0x0000000000000000
...
                            0x0000000000000000
                        fp = 0x0000000000000000
                        lr = 0x0000000000000000
                        sp = 0x0000000000000000
                        pc = 0xFFFFFE00071F4580
                        cpsr = 0x00000000
                        flags = 0x00000000
....
```
* Calcula el offset desde la instrucción inicial pc=0xFFFFFE00071F4580 hasta el inicio de la VM (vmaddr=0xFFFFFE0007004000)
```
calc "base(16); 0xFFFFFE00071F4580 - 0xFFFFFE0007004000"
        0x1f0580
```
* Salta sobre los primeros 0x1f0000 = 0x1f0 x 0x1000 (4k) bloques y separa 64K desde aquí:
```
dd if=/home/amw/doc/share/kernel.release.t8020 of=init.bin bs=4k skip=$((0x1f0)) count=16
```
* Desensambla el blob binario raw
```
aarch64-linux-gnu-objdump -D -b binary -m aarch64 init.bin

init.bin:     file format binary

Disassembly of section .data:

0000000000000000 <.data>:
       0:       14000100        b       0x400
       4:       d503201f        nop
       8:       d503201f        nop
       c:       d503201f        nop
      10:       d503201f        nop
      14:       d503201f        nop
      18:       d503201f        nop
      1c:       d503201f        nop
      20:       d503201f        nop
...
     3f4:       d503201f        nop
     3f8:       d503201f        nop
     3fc:       d503201f        nop
     400:       d510109f        msr     oslar_el1, xzr
     404:       d5034fdf        msr     daifset, #0xf
     408:       f2e88aa0        movk    x0, #0x4455, lsl #48
     40c:       f2c80a80        movk    x0, #0x4054, lsl #32
     410:       f2ac8cc0        movk    x0, #0x6466, lsl #16
     414:       f28c8ee0        movk    x0, #0x6477
     418:       90003fe4        adrp    x4, 0x7fc000
     41c:       3944c085        ldrb    w5, [x4, #304]
     420:       710000bf        cmp     w5, #0x0
...
```
* En el Mac real con XCode instalado como señaló **davidrysk** puedes hacer lo mucho más simple:
```
otool -xv /System/Library/Kernels/kernel.release.t8020

...
/System/Library/Kernels/kernel.release.t8020:
(__TEXT_EXEC,__text) section
fffffe00071ec000        sub     x13, sp, #0x60
fffffe00071ec004        sub     sp, sp, #0x60
fffffe00071ec008        st1.4s  { v0, v1, v2 }, [x13], #48 ; Latency: 4
...
fffffe00071f43f8        nop
fffffe00071f43fc        nop
fffffe00071f4400        msr     OSLAR_EL1, xzr
fffffe00071f4404        msr     DAIFSet, #0xf
fffffe00071f4408        movk    x0, #0x4455, lsl #48
fffffe00071f440c        movk    x0, #0x4054, lsl #32
fffffe00071f4410        movk    x0, #0x6466, lsl #16
fffffe00071f4414        movk    x0, #0x6477
fffffe00071f4418        adrp    x4, 2044 ; 0xfffffe00079f0000
fffffe00071f441c        ldrb    w5, [x4, #0x130]        ; Latency: 4
fffffe00071f4420        cmp     w5, #0x0
fffffe00071f4424        b.ne    0xfffffe00071f4438
....
``` 