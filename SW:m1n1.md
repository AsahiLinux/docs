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
