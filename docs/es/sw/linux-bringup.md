---
title: Inicio de Linux
---

# Compilación de Linux
* Consulta el repositorio de Linux [Asahi Kernel](https://github.com/AsahiLinux/linux) para obtener el último kernel de Asahi con soporte para M1
 * En particular, según el [informe de progreso de diciembre 2021](https://asahilinux.org/2021/12/progress-report-oct-nov-2021/), puedes probar la [rama asahi](https://github.com/AsahiLinux/linux/tree/asahi) que "...es un kernel de vanguardia ... en un estado lo suficientemente utilizable como para que queramos que la gente lo pruebe..."
* Aunque el desarrollo ocurre en el repositorio AsahiLinux, algunos cambios para soportar M1 fueron incorporados al kernel de Linux (ver tabla en el [informe de progreso](https://asahilinux.org/2021/12/progress-report-oct-nov-2021/) para más detalles), así que puedes clonar el espejo oficial del kernel de Linux
```
git clone https://github.com/torvalds/linux.git
cd ./linux
```
* Genera la configuración predeterminada para arm64 y añade soporte para el framebuffer simple.
```
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- defconfig
./scripts/config --set-val CONFIG_FB_SIMPLE y
```
* Compila Linux para arm64
```
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j8 Image dtbs
```
* El script linux.py de proxyclient de m1n1 quiere una imagen comprimida con gzip
```
gzip < ./arch/arm64/boot/Image > Image.gz
```
* **Ten cuidado** de NO usar el dtb de m1n1: `build/dtb/t8103-j274.dtb` con un kernel de Linux diferente como el [kernel dart/dev de Asahi](https://github.com/AsahiLinux/linux/tree/dart/dev) que tiene mejor soporte para USB. En este caso, usa el que es generado por *ese* kernel en **linux/arch/arm64/boot/dts/apple**, de lo contrario tus puertos USB podrían no funcionar.
```
cp ../linux/arch/arm64/boot/dts/apple/t8103-j274.dtb t8103-j274.dtb
```
### Teclado + nvme funcionando
* Instantánea de [rev a2281d64fdbc](https://github.com/amworsley/AsahiLinux/tree/asahi-kbd) con configuración como [esta](https://raw.githubusercontent.com/amworsley/asahi-wiki/main/images/config-keyboard+nvme)
## Arranca con tus cables USB conectados
  * Conecta tus cables/hubs/adaptadores USB **antes** de arrancar tu Mac ya que m1n1/linux aún no hace la configuración de bajo nivel del PHY USB. Deja que iBoot lo haga cuando arranque a m1n1 que instalaste mediante tu [configuración de arranque a m1n1](../platform/dev-quickstart.md#setup)
  * Si el código C de m1n1 ha sido actualizado desde la configuración, deberías cargar en cadena la nueva imagen .macho
```
python3.9 proxyclient/tools/chainload.py build/m1n1.macho
```
# Ejecutar Linux vía cable USB
  * Conectar un [cable USB Type-C a Type A/C](../platform/dev-quickstart.md#usb-gadget-mode-using-a-standard-usb-cable) al Mac M1 proporciona dos interfaces seriales USB en la otra computadora![Cable USB Type-C a Type A conectando MacBookAir M1 y MacBookAir Pro 2012](../assets/usb-setup.png)
  * Esto se puede conectar mediante la herramienta proxy de Python para arrancar Linux directamente o cargar un binario macho como una versión actualizada de m1n1 o combinado con una imagen de Linux
* Obtén un initrd de 27Mb del instalador de debian arm64
```
wget https://deb.debian.org/debian/dists/buster/main/installer-arm64/current/images/netboot/debian-installer/arm64/initrd.gz
```
## Directamente
* Configura tu M1N1DEVICE
```
M1N1DEVICE=/dev/ttyACM0
export M1N1DEVICE
```
* Arranca Linux mediante la herramienta linux.py:
```
python3.9 proxyclient/tools/linux.py -b 'earlycon console=ttySAC0,1500000 console=tty0 debug' \
  Image.gz t8103-j274.dtb initrd.gz
```
El instalador de debian arm64 (initrd.gz) arrancará el instalador. Si quieres tener una shell que puedas usar con un teclado USB, puedes modificar el script init de este initrd.gz (ramdisk) para lanzar una shell.
Extrae el ramdisk:
```
gzip -cd < /ruta/a/initrd.gz | cpio --extract
```
=> obtendrás el contenido del ramdisk en el directorio actual
Modifica el script init reemplazando la última línea "exec $init" por "exec /bin/busybox sh" por ejemplo.
Recrea el nuevo ramdisk: (desde el directorio del ramdisk)
```
find . | cpio -o -H newc | gzip -c -9 >| /ruta/a/initrd-new.gz
```

## Bajo el Hipervisor
  * Ejecutar Linux bajo el hipervisor m1n1 te permite inspeccionar la memoria/detener/iniciar e incluso hacer un seguimiento de la pila
  * Crea una imagen .macho combinada (run_guest.py solo acepta .macho)
```
cat build/m1n1.macho Image.gz build/dtb/apple-j274.dtb initramfs.cpio.gz > m1n1-payload.macho
```

 * Cárgala con run_guest
```
python3.9 proxyclient/tools/run_guest.py -S m1n1-payload.macho
```

<details>
<summary>Ver registro completo</summary>

```
% python3.9 proxyclient/tools/run_guest.py -S m1n1-payload.macho
Fetching ADT (0x00058000 bytes)...
Disable iodev IODEV.USB1
Initializing hypervisor over iodev IODEV.USB0
TTY> Starting secondary CPUs...
TTY> Starting CPU 1 (0:1)...   Started.
TTY> Starting CPU 2 (0:2)...   Started.
TTY> Starting CPU 3 (0:3)...   Started.
TTY> Starting CPU 4 (1:0)...   Started.
TTY> Starting CPU 5 (1:1)...   Started.
TTY> Starting CPU 6 (1:2)...   Started.
TTY> Starting CPU 7 (1:3)...   Started.
Removing ADT node /arm-io/dart-usb0
Removing ADT node /arm-io/atc-phy0
Removing ADT node /arm-io/usb-drd0
Removing ADT node /arm-io/acio0
Removing ADT node /arm-io/acio-cpu0
Removing ADT node /arm-io/dart-acio0
Removing ADT node /arm-io/apciec0
Removing ADT node /arm-io/dart-apciec0
Removing ADT node /arm-io/apciec0-piodma
Removing ADT node /arm-io/i2c0/hpmBusManager/hpm0
Removing ADT node /arm-io/atc0-dpxbar
Removing ADT node /arm-io/atc0-dpphy
Removing ADT node /arm-io/atc0-dpin0
Removing ADT node /arm-io/atc0-dpin1
Removing ADT node /arm-io/atc-phy0
Removing ADT node /cpus/cpu1
Removing ADT node /cpus/cpu2
Removing ADT node /cpus/cpu3
Removing ADT node /cpus/cpu4
Removing ADT node /cpus/cpu5
Removing ADT node /cpus/cpu6
Removing ADT node /cpus/cpu7
LOAD: _HDR 16384 bytes from 0 to 0
LOAD: TEXT 131072 bytes from 4000 to 4000
LOAD: RODA 32768 bytes from 24000 to 24000
LOAD: DATA 393216 bytes from 2c000 to 2c000
ZERO: 442368 bytes from 0x8c000 to 0xf8000
LOAD: PYLD 9851973 bytes from 8c000 to f8000
SKIP: 57256891 bytes from 0xa5d445 to 0x40f8000
Total region size: 0x11b4000 bytes
Physical memory: 0x819d30000 .. 0xbccbe8000
Guest region start: 0x81ade8000
Mapping guest physical memory...
Loading kernel image (0xa5d449 bytes)...
.........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
Copying SEPFW (0x750000 bytes)...
Copying TrustCache (0x60000 bytes)...
Adjusting addresses in ADT...
Uploading ADT (0x4f088 bytes)...
Setting up bootargs at 0x81bf98000...
Entering hypervisor shell. Type `start` to start the guest.
>>>
```

</details>

 * Te muestra un shell de depuración y comienzas la ejecución desde el punto de carga con el comando start:
<details>
<summary>Ver registro de arranque</summary>

```
Entering hypervisor shell. Type `start` to start the guest.
>>> start
Disabling other iodevs...
 - IODEV.UART
 - IODEV.FB
 - IODEV.USB1
 - IODEV.USB0_SEC
 - IODEV.USB1_SEC
Doing essential MMIO remaps...
Updating page tables...
PT[200000000:235200000] -> HW
PT[235200000:235204000] -> RESERVED VUART
PT[235204000:23b700420] -> HW
PT[23b700420:23b700424] -> RESERVED PMU HACK
PT[23b700424:23d280088] -> HW
PT[23d280088:23d28008c] -> RESERVED PMU HACK
PT[23d28008c:23d280098] -> HW
PT[23d280098:23d28009c] -> RESERVED PMU HACK
PT[23d28009c:700000000] -> HW
Improving logo...
Shutting down framebuffer...
Enabling SPRR...
Enabling GXF...
Jumping to entrypoint at 0x81b118800
Pass: mrs x0, HID5_EL1 = 2082df50e700df14 (HID5_EL1)
Pass: msr HID5_EL1, x0 = 2082df50e700df14 (OK) (HID5_EL1)
Pass: mrs x0, EHID9_EL1 = 600000811 (EHID9_EL1)
Pass: msr EHID9_EL1, x0 = 600000811 (OK) (EHID9_EL1)
Pass: mrs x0, EHID10_EL1 = 3000528002788 (EHID10_EL1)
Pass: msr EHID10_EL1, x0 = 3000528002788 (OK) (EHID10_EL1)
Pass: mrs x0, EHID20_EL1 = 618100 (EHID20_EL1)
Pass: msr EHID20_EL1, x0 = 618100 (OK) (EHID20_EL1)
Pass: mrs x0, EHID20_EL1 = 618100 (EHID20_EL1)
Pass: msr EHID20_EL1, x0 = 618100 (OK) (EHID20_EL1)
Pass: mrs x0, EHID20_EL1 = 618100 (EHID20_EL1)
Pass: msr EHID20_EL1, x0 = 618100 (OK) (EHID20_EL1)
Pass: mrs x1, CYC_OVRD_EL1 = 2000000 (CYC_OVRD_EL1)
Skip: msr CYC_OVRD_EL1, x1 = 2000000
Pass: mrs x1, ACC_CFG_EL1 = d (ACC_CFG_EL1)
Skip: msr ACC_CFG_EL1, x1 = d
```
</details>

  * Una vez que está en ejecución, usa **^C** para obtener un shell de depuración
```
...
Skip: msr CYC_OVRD_EL1, x1 = 2000000
Pass: mrs x1, ACC_CFG_EL1 = d (ACC_CFG_EL1)
Skip: msr ACC_CFG_EL1, x1 = d
^CUser interrupt
Entering debug shell
>>> 
```
  * Luego obtén un seguimiento de la pila (con símbolos) después de cargar el archivo System.map del kernel y establecer el PAC_MASK (máscara de protección de punteros)
```
>>> load_system_map('../linux/System.map')
>>> hv.pac_mask = 0xfffff00000000000
>>> bt
Stack trace:
 - 0xffff8000102fdc3c (cpu_do_idle+0xc)
 - 0xffff8000102fdc5c (arch_cpu_idle+0xc)
 - 0xffff800010305420 (default_idle_call+0x20)
 - 0xffff80001005fcf0 (do_idle+0x210)
 - 0xffff80001005fec4 (cpu_startup_entry+0x24)
 - 0xffff8000102fe278 (rest_init+0xd0)
 - 0xffff8000103d0c7c (arch_call_rest_init+0xc)
 - 0xffff8000103d11f0 (start_kernel+0x528)
```
  * Desensambla direcciones antes del contador de programa
```
>>> disassemble_at(p.hv_translate(hv.ctx.elr, True) - 32, 64)
    81f6fdc04:  d53cd042        mrs     x2, tpidr_el2
    81f6fdc08:  d53cd041        mrs     x1, tpidr_el2
    81f6fdc0c:  d53cd041        mrs     x1, tpidr_el2
    81f6fdc10:  d53cd040        mrs     x0, tpidr_el2
    81f6fdc14:  d53cd040        mrs     x0, tpidr_el2
    81f6fdc18:  d503233f        paciasp
    81f6fdc1c:  d5033f9f        dsb     sy
    81f6fdc20:  d503207f        wfi
    81f6fdc24:  d50323bf        autiasp
    81f6fdc28:  d65f03c0        ret
    81f6fdc2c:  d503201f        nop
    81f6fdc30:  d503233f        paciasp
    81f6fdc34:  a9bf7bfd        stp     x29, x30, [sp, #-16]!
    81f6fdc38:  910003fd        mov     x29, sp
    81f6fdc3c:  97fffff7        bl      81f6fdc18 <_start+0x14>
    81f6fdc40:  a8c17bfd        ldp     x29, x30, [sp], #16
```
  * Vuelca el registro %0 de la última excepción al hipervisor
```
>>> hv.ctx.regs[0]
0xffff0003ccaf21e0
```
### Salida de consola de Linux
* Bajo el hipervisor puedes obtener la salida de consola de Linux a través del segundo dispositivo ttyACM1 generado por el HV de m1n1
* **NOTA** La salida estaba rellenada con muchos espacios en blanco al principio que tuve que eliminar con ```sed '/^ */s///' ``` para obtener esta bonita visualización a continuación:
<details>
<summary>Ver salida de consola</summary>

```
% picocom /dev/ttyACM1

picocom v3.1

port is        : /dev/ttyACM1
flowcontrol    : none
baudrate is    : 9600
parity is      : none
databits are   : 8
stopbits are   : 1
escape is      : C-a
local echo is  : no
noinit is      : no
noreset is     : no
hangup is      : no
nolock is      : no
send_cmd is    : sz -vv
receive_cmd is : rz -vv -E
imap is        : 
omap is        : 
emap is        : crcrlf,delbs,
logfile is     : none
initstring     : none
exit_after is  : not set
exit is        : no

Type [C-a] [C-h] to see available commands
Terminal ready
m1n1
sc: Initializing
CPU init... CPU: M1 Icestorm

boot_args at 0x81bd9c000
revision:     2
version:      2
virt_base:    0xfffffe0011b34000
phys_base:    0x819b34000
mem_size:     0x3b30b0000
top_of_kdata: 0x81bda0000
video:
base:       0xbd2ce4000
display:    0x0
stride:     0x2800
width:      2560
height:     1600
depth:      0x1001e
machine_type: 0
devtree:      0xfffffe0012b34000
devtree_size: 0x58000
cmdline:      -v
boot_flags:   0x0
mem_size_act: 0x400000000



m1n1 vda44067
Copyright (C) 2021 The Asahi Linux Contributors
Licensed under the MIT license

Running in EL1

Heap base: 0x81ece4000
MMU: Initializing...
MMU: SCTLR_EL1: 100030d50980 -> 30901085
MMU: running with MMU and caches enabled!
fb init: 2560x1600 (30) [s=2560] @0xbd2ce4000
fb console: max rows 46, max cols 64
fb: display logo
Device info:
Model: MacBookAir10,1
Target: J313
Board-ID: 0x26
Chip-ID: 0x8103

WDT registers @ 0x23d2b0000
WDT disabled
pmgr: initialized, 272 devices found.
Initialization complete.
Checking for payloads...
Found a gzip compressed payload at 0x81ace4000
Uncompressing... 2029114 bytes uncompressed to 5693448 bytes
Found a kernel at 0x81ee00000
Found a devicetree at 0x81aed363a
Found a gzip compressed payload at 0x81aed446f
Uncompressing... 7819222 bytes uncompressed to 16741888 bytes
Found a cpio initramfs at 0x81f400000
No more payloads at 0x81b649445
Starting secondary CPUs...
FDT: initrd at 0x81f400000 size 0xff7600
FDT: framebuffer@bd2ce4000 base 0xbd2ce4000 size 0xfa0000
ADT: 64 bytes of random seed available
FDT: KASLR seed initialized
FDT: Passing 64 bytes of random seed
FDT: DRAM at 0x800000000 size 0x400000000
FDT: Usable memory is 0x819b34000..0xbccbe4000 (0x3b30b0000)
FDT: CPU 1 is not alive, disabling...
FDT: CPU 2 is not alive, disabling...
FDT: CPU 3 is not alive, disabling...
FDT: CPU 4 is not alive, disabling...
FDT: CPU 5 is not alive, disabling...
FDT: CPU 6 is not alive, disabling...
FDT: CPU 7 is not alive, disabling...
FDT prepared at 0x8203f8000
tps6598x: Error getting /arm-io/i2c0/hpmBusManager/hpm0 node
usb: tps6598x_init failed for /arm-io/i2c0/hpmBusManager/hpm0.
usb: failed to init hpm0
pmgr: Error getting node /arm-io/atc-phy0
usb: unable to bringup the phy with index 0
tunable: unable to find ADT node /arm-io/apcie/pci-bridge1.
pcie: Error applying apcie-config-tunables for /arm-io/apcie/pci-bridge1
Preparing to boot kernel at 0x81ee00000 with fdt at 0x8203f8000
Valid payload found
Preparing to run next stage at 0x81ee00000...
MMU: shutting down...
MMU: shutdown successful, clearing caches
Vectoring to next stage...
M1 Linux
Starting Shell
Still running 1
Still running 2
Still running 3
Still running 4
Still running 5
Still running 6
Still running 7
Still running 8
Still running 9
Still running 10
Still running 11
Still running 12
Still running 13
Still running 14
Still running 15
Still running 16
Still running 17
Still running 18
Still running 19
Still running 20
Still running 21
....
```

</details>

# Opciones de sistema de archivos raíz
 * [initrd + teclado USB](linux-bringup-usb-keyboard.md#linux-usb-keyboard)
 * [Arranque desde unidad USB](linux-bringup-usb.md)
 * [Unidad USB a partición NVME](linux-bringup-nvme.md)
# Otras características
 * [Soporte WiFi](linux-bringup-wifi.md)
 * [Soporte X11](linux-bringup-x11.md)
# Faltante
 * Sonido
 * Gestión de energía - **NO** cierres la tapa 