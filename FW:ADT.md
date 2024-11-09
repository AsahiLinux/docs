When Apple firmware boots a kernel, it passes a device tree in a binary format. This format is very similar to, but different from, the Open Firmware standard expected by Linux.

Like Linux devicetrees, the Apple device tree (ADT) encodes a number of untyped byte arrays (properties) in a hierarchy of nodes. These describe the available hardware, or provide other information that Apple thinks the firmware might need to tell the kernel about. This includes identifying and secret information like serial numbers and WiFi keys.

The main difference between ADTs and Linux DTs is byte order; since properties are untyped, we can't automatically correct for that.

## Obtaining your ADT

Given hardware, you can access your ADT in a number of ways.

### Option 1: via m1n1 debug console. 
The easiest way is probably using m1n1 via adt.py

```
cd m1n1/proxyclient ; python -m m1n1.adt --retrieve dt.bin
```

This will write a file called "dt.bin" containing the raw (binary) ADT and print the decoded ADT.

### Option 2: via macOS im4p files (Note: these are missing details filled in by iBoot during boot)
### img4lib
Get a copy of xerub's img4lib

```
git clone https://github.com/xerub/img4lib
cd img4lib
make -C lzfse
make
make install
```

### img4tool
Get a copy of tihmstar's img4tool (you will also need his libgeneral as well as autoconf, automate, libtool, pkg-config, openssl and libelist-2.0).

```
git clone https://github.com/tihmstar/libgeneral.git
git clone https://github.com/tihmstar/img4tool.git
```
then for each 
```
./autogen.sh
make
make install
```
### Obtaining device tree files
copy the im4p file from the below directory. See [[Devices]] for Machine 'j' model details.

`/System/Volumes/Preboot/[UUID]/restore/Firmware/all_flash/DeviceTree.{model}.im4p`

If the dir doesn't exist try disabling csrutil in recovery mode, going to settings and enabling terminal to acces all files, or start from `Volumes/Macintosh HD/` because it may be symlinked. If it's still not accessible, try good ol `sudo find . -type f -name '*.im4p'`.

then use img4tool to extract the im4p file into a .bin file e.g.
```
img4tool -e DeviceTree.j274ap.im4p -o j274.bin
```
To do the same with img4lib, do
```
img4 -i DeviceTree.j274ap.im4p -o j274.bin
```

### Option 3: From macOS

You can get a textual representation of the ADT directly from macOS by running:
```
ioreg -p IODeviceTree -l | cat
```
While this does not require decoding, it outputs much less information than using m1n1 (see below).

## Decoding an ADT

after m1n1 installation (see [repo page](https://github.com/AsahiLinux/m1n1))

`cd m1n1/proxyclient`

get construct python library (not a construct.py file, it's a library)

`pip install construct`

copy obtained j{*}.bin file into proxyclient dir && extract by:

`python -m m1n1.adt j{*}.bin`

You can also get a memory map with the -a option:

`python -m m1n1.adt -a j{*}.bin` 

Other ways?

