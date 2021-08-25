When Apple firmware boots a kernel, it passes a device tree in a binary format. This format is very similar to, but different from, the Open Firmware standard expected by Linux.

Like Linux devicetrees, the Apple device tree (ADT) encodes a number of untyped byte arrays (properties) in a hierarchy of nodes. These describe the available hardware, or provide other information that Apple thinks the firmware might need to tell the kernel about. This includes identifying and secret information like serial numbers and WiFi keys.

The main difference between ADTs and Linux DTs is byte order; since properties are untyped, we can't automatically correct for that.

## Obtaining your ADT

Given hardware, you can access your ADT in a number of ways.

The easiest way is probably using m1n1 via adt.py

```
cd m1n1/proxyclient ; python3.9 -m m1n1.adt --retrieve dt.bin
```

This will write a file called "dt.bin" containing the raw (binary) ADT and print the decoded ADT.

## Decoding an ADT

`cd m1n1/proxyclient ; python3.9 -m m1n1.adt dt.bin`. Other ways?

You can also get a memory map with the -a option:

`cd m1n1/proxyclient ; python3.9 -m m1n1.adt -a dt.bin` 