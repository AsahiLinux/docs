# Building Linux
* See github linux [Asahi Kernel](https://github.com/AsahiLinux/linux) for the latest Asahi kernel patched for M1 support
* Extract linux via git
```
git clone https://github.com/AsahiLinux/linux.git
```
* Get marcan's config file:
```
wget https://mrcn.st/p/z8MgPiyO -O config-marcan
```
* Build linux for arm64
```
cp config-marcan .config
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- oldconfig
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j8 Image dtbs
```
* m1n1's proxyclient linux.py script wants a gzip'ed image
```
gzip < ../linux/arch/arm64/boot/Image > Image.gz
```
* m1n1's build system creates following dtb: `build/dtb/t8103-j274.dtb`
# Running Linux via USB cable
  * Connecting [USB Type-C to Type A/C cable](https://github.com/AsahiLinux/docs/wiki/Developer-Quickstart#usb-gadget-mode-using-a-standard-usb-cable) to M1 Mac provides two USB serial interfaces on the other computer
  * This can be connected to via the python proxy tool to boot up Linux directly or load up a macho binary like an updated m1n1 version or combined with a Linux image
* Get a 27Mb initrd from debian arm64 installer
```
wget https://deb.debian.org/debian/dists/buster/main/installer-arm64/current/images/netboot/debian-installer/arm64/initrd.gz
```
## Directly
```
python3.9 proxyclient/tools/linux.py -b 'earlycon console=ttySAC0,1500000 console=tty0 debug' \
  Image.gz t8103-j274.dtb initrd.gz
```
## Under Hypervisor
  * Running Linux under m1n1 hypervisor lets you inspect the memory/stop/start and even do a stack trace
    * Create a .macho combined image (run_guest.py only accepts .macho) 
```cat build/m1n1.macho Image.gz build/dtb/apple-j274.dtb initramfs.cpio.gz > m1n1-payload.macho```
    * Load it with run_guest 
```python3.9 proxyclient/tools/run_guest.py -S m1n1-payload.macho```
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
    * It prompts with debug shell and you begin execution from the load point with the start command:
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
  * Once it is running use **^C** to get a debug shell 
```
^CUser interrupt
Entering debug shell
>>> 
```
  * Then was able to get a stack trace (with symbols) after setting some things up
```
>>> load_system_map('../linux/System.map')
>>> hv.pac_mask = 0xfffff00000000000
>>> bt
Stack trace:
 - 0xfffff000102fdc3c (init_pg_end+0x6fffffd0dc3c)
 - 0xfffff000102fdc5c (init_pg_end+0x6fffffd0dc5c)
 - 0xfffff00010305420 (init_pg_end+0x6fffffd15420)
 - 0xfffff0001005fcf0 (init_pg_end+0x6fffffa6fcf0)
 - 0xfffff0001005fec4 (init_pg_end+0x6fffffa6fec4)
 - 0xfffff000102fe278 (init_pg_end+0x6fffffd0e278)
 - 0xfffff000103d0c7c (init_pg_end+0x6fffffde0c7c)
 - 0xfffff000103d11f0 (init_pg_end+0x6fffffde11f0)
```
