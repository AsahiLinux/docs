When Apple firmware boots a kernel, it passes a device tree in a binary format. This format is very similar to, but different from, the Open Firmware standard expected by Linux.

Like Linux devicetrees, the Apple device tree (ADT) encodes a number of untyped byte arrays (properties) in a hierarchy of nodes. These describe the available hardware, or provide other information that Apple thinks the firmware might need to tell the kernel about.

The main difference between ADTs and Linux DTs is byte order; since properties are untyped, we can't automatically correct for that. Also, MMIO addresses in Linux generally include a 0x200000000 offset, while Apple's MMIO addresses start at 0 instead.

## Obtaining your ADT

Given hardware, you can access your ADT in a number of ways.

## Decoding an ADT

`m1n1/proxyclient/adt.py`. Other ways?