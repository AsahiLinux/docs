# m1n1 - Debug boot loader for M1
* See the [m1n1 github page](https://github.com/AsahiLinux/m1n1)
* Needs the  **aarch64-linux-gnu-gcc** compiler installed and artwork submodule
* Build with:
```
git submodule init
git submodule update
make
```
  * Should give you a .macho MacOS binary **m1n1.macho**
## Running under qemu
* Build qemu with M1 support from github project [modwizcode qemu](https://github.com/modwizcode/qemu.git)
  * Use the relevant M1 branch  **add_M1_test** at the moment
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
  * Connect to the given serial port `picocom /dev/pts/8`