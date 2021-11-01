When Apple firmware boots a kernel, it passes a device tree in a binary format. This format is very similar to, but different from, the Open Firmware standard expected by Linux.

Like Linux devicetrees, the Apple device tree (ADT) encodes a number of untyped byte arrays (properties) in a hierarchy of nodes. These describe the available hardware, or provide other information that Apple thinks the firmware might need to tell the kernel about. This includes identifying and secret information like serial numbers and WiFi keys.

The main difference between ADTs and Linux DTs is byte order; since properties are untyped, we can't automatically correct for that.

## Obtaining your ADT

Given hardware, you can access your ADT in a number of ways.

### Option 1: via m1n1 debug console. 
The easiest way is probably using m1n1 via adt.py

```
cd m1n1/proxyclient ; python3.9 -m m1n1.adt --retrieve dt.bin
```

This will write a file called "dt.bin" containing the raw (binary) ADT and print the decoded ADT.

### Option 2: via macOS im4p files (Note: these are missing details filled in by iBoot during boot)
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
copy the im4p file from the below directory. See [[Devices]] for Machine 'j' model details.

`/System/Volumes/Preboot/Firmware/all_flash/DeviceTree.{model}.im4p`

then use imp4tool to extract the dt.bin e.g.
```
img4tool -e DeviceTree.j274ap.im4p -o j274.bin
```

### Option 3: From macOS

You can get a textual representation of the ADT directly from macOS by running:
```
ioreg -p IODeviceTree -l
```

## Decoding an ADT

`cd m1n1/proxyclient ; python3.9 -m m1n1.adt dt.bin`. Other ways?

You can also get a memory map with the -a option:

`cd m1n1/proxyclient ; python3.9 -m m1n1.adt -a dt.bin` 