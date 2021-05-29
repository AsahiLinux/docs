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
## Test it via qemu
* Note: **Need to match qemu version to linux version**
```
Current rev e06aa5ca66 Feb 1 qemu <=> rev c837226506a6 Jan 21  linux *Not* later multi-CPU kernels
```
* See modwizcode's M1 supporting qemu [SW:m1n1 page](https://github.com/AsahiLinux/docs/wiki/SW%3Am1n1) for building extracting that
* Run modwizcode's M1 supporting qemu on the m1n1.macho loader binary
```
../qemu/build/qemu-system-aarch64 -M apple-m1 -bios build/m1n1.macho -serial pty
```
* Start up a view VNC viewer on the given port
```
vncviewer :5900
```
* python proxyclient script setup
```
export M1N1DEVICE
M1N1DEVICE=/dev/pts/8
```

* Load kernel via python proxy script
```
python3 proxyclient/linux.py Image.gz build/dtb/t8103-j274.dtb
```
* Get a 27Mb initrd from debian arm64 installer
```
wget https://deb.debian.org/debian/dists/buster/main/installer-arm64/current/images/netboot/debian-installer/arm64/initrd.gz
```
* This takes *forever* to load so strip out some stuff - still very big!
```
sudo unmkinitramfs initrd.gz initrd
sudo rm -rf initrd/lib/modules/4.19.0-13-arm64
sudo rm initrd/lib/libslang.so.2*
sudo rm -r initrd/var/lib/dpkg/info
sudo  rm -rf initrd/etc/ssl
```
* Make it run /bin/sh
```
sudo cp initrd//init initrd//init-orig
sudo vi initrd//init
```
* Wrap it back up
```
(cd initrd ; find . | cpio -o -H newc --quiet | gzip -9) > init-new.gz
```
* Try loading with ramdisk
```
python3 proxyclient/linux.py Image.gz build/dtb/t8103-j274.dtb init-new.gz
```
* **NOTE**: I haven't been able to get the shell to run yet... stay tuned for updates (or please add them)
![Image of console showing panic running /init](https://raw.githubusercontent.com/amworsley/asahi-wiki/main/images/qemu-boot.png)