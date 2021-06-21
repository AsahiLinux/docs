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
# Running Linux via USB
* Get a 27Mb initrd from debian arm64 installer
```
wget https://deb.debian.org/debian/dists/buster/main/installer-arm64/current/images/netboot/debian-installer/arm64/initrd.gz
```
## Directly
```
python3.9 proxyclient/tools/linux.py -b 'earlycon console=ttySAC0,1500000 console=tty0 debug' \
  Image.gz t8103-j274.dtb initrd.gz
```
## Under Hypervistor
  * Create a .macho combined image (run_guest.py only accepts .macho) 
```cat build/m1n1.macho Image.gz build/dtb/apple-j274.dtb initramfs.cpio.gz > m1n1-payload.macho```
  * Load it with run_guest 
```python3.9 proxyclient/tools/run_guest.py -S m1n1-payload.macho```
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
