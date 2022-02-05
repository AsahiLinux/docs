# m1n1 - Debug boot loader for M1
* See the [m1n1 github page](https://github.com/AsahiLinux/m1n1)
* Needs the  **aarch64-linux-gnu-gcc** compiler installed and artwork submodule
* Build with:
```
git clone --recursive https://github.com/AsahiLinux/m1n1.git
cd m1n1
make
```
  * Should give you a .macho MacOS binary **m1n1.macho**
## Running under qemu
* **Note:** version of qemu will affect version dtb/linux m1n1 can load/run
* Build qemu with M1 support from github project [modwizcode qemu](https://github.com/modwizcode/qemu.git)
  * Use the relevant M1 branch  **add_M1_test** at the moment
    * Wants ninja-build package (under debian buster) to build
```
mkdir build
cd build
../configure
make
```
* Run loading the **m1n1.macho** build and it will display details of how to connect to the VM
```
./qemu-system-aarch64 -M apple-m1 -bios ../../m1n1/build/m1n1.macho -serial pty
```
  * Then connect to the given VNC port `vncviewer :5900`
  * **NOTE:** Connecting directly to the given serial port `picocom /dev/pts/8` doesn't seem too work well
* But via the python proxyclient scripts in m1n1/proxyclient it does work.
* First set the environment variable M1N1DEVICE for the scripts to know the serial port:
```
export M1N1DEVICE
M1N1DEVICE=/dev/pts/8
```
* Then can load the m1n1 binary via itself
```
python3 proxyclient/chainload.py build/m1n1.macho
```
* Entry a simple python shell (see proxyclient/utils.py for commands available like `mrs(MIDR_EL1, r1)`
```
python3 proxyclient/chainload.py build/m1n1.macho
```
## Load linux via m1n1 under qemu (old)
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
