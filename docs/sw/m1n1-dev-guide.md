---
title: m1n1 Developer Guide
---

(Not written yet, just throwing some stuff in)

## Boot protocol

The boot protocol used for m1n1 images is a trivial subset of the XNU boot protocol. Raw binaries can be loaded anywhere (at 16K aligned offsets). The RVBAR is at offset 0 (only relevant for resuming from sleep mode, due to iBoot locking down that register). Payloads are simply concatenated to the main binary and are loaded together with it. The entry point is at 0x800 with translation disabled and the physical address to the XNU [`boot_args`](https://github.com/AsahiLinux/m1n1/blob/main/src/xnuboot.h) structure in r0.

There are also legacy Mach-O images; these are currently only still necessary for older iBoot2 versions and for run_guest.py (TODO: fix that). Those are basically the same thing with a Mach-O header and the .bss section trimmed, as the file is not loaded flat any more. There is a hacky large payload section at the end that is trimmed to 0 bytes and "hangs off of the end of the file", to provide space for payloads to be appended by concatenation.
