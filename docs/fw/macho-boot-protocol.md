---
title: MachO Boot Protocol
summary:
  Boot protocol used by Apple Silicon devices when booting m1n1 as a
  MachO binary
---

## Boot protocol

### Memory

Memory starts at 0x8_0000_0000.

The memory when iBoot calls us looks like this:

```
+==========================+ <-- bottom of RAM (0x8_0000_0000)
| Coprocessor carveouts,   |
| iBoot stuff, etc.        |
+==========================+ <-- boot_args->phys_base, VM = boot_args->virt_base
| kASLR slide gap (<32MiB) |
+==========================+
| Device Tree (ADT)        | /chosen/memory-map.DeviceTree
+--------------------------+
| Trust Cache              | /chosen/memory-map.TrustCache
+==========================+ <-- Mach-O lowest vmaddr mapped to here (+ slide!)
| Mach-O base (header)     | /chosen/memory-map.Kernel-mach_header
+--                      --+
| Mach-O segments...       | /chosen/memory-map.Kernel-(segment ID)...
+--                      --+
| m1n1: Payload region     | /chosen/memory-map.Kernel-PYLD (64MB currently)
+==========================+
| SEP Firmware             | /chosen/memory-map.SEPFW
+--------------------------+ <-- boot_args
| BootArgs                 | /chosen/memory-map.BootArgs
+==========================+ <-- boot_args->top_of_kdata
|                          |
|      (Free memory)       |
| (incl. iBoot trampoline) |
|                          |
+==========================+ <-- boot_args->top_of_kdata + boot_args->mem_size
| Video memory, SEP        |
| carveout, and more       |
+==========================+ <-- 0x8_0000_0000 + boot_args.mem_size_actual
```

### About pointers

There are four kinds of addresses you might come across:

* Physical addresses
* m1n1 unrelocated offsets (relative to 0)
* Mach-O virtual addresses
* kASLR-slid virtual addresses

Physical addresses are the only thing you should care about.

m1n1 unrelocated offsets are only used by the m1n1 startup code prior to running relocations, and
the related linker script info. The C environment is properly position-adjusted after those, so you
should never see them there. However, if you're debugging m1n1 and printing pointers, and want to
map those back to the raw ELF file, you will have to subtract the m1n1 load offset to get the
unrelocated offset.

Virtual addresses have no significance; this is just used because Mach-O has no concept of physical
addresses, and the whole set-up assumes Darwin will map itself in a certain way. For our purposes,
a vaddr is just `paddr + ba.virt_base - ba.phys_base`. m1n1 does not use top-half virtual addresses,
and Linux does its own thing that has nothing to do with Darwin.

In addition, there are two virtual address maps: whatever's in the Mach-O, and the pointers iBoot
actually passes us. The latter is offset by the kASLR slide, which also affects vaddrs. This makes
everything more confusing.

Thus, for any Darwin kASLR-slid virtual pointer received from iBoot, we compute
`vaddr - ba.virt_base + ba.phys_base` and that's all we care about; conversely, only the linker
script (and the Mach-O header generation within) cares about Mach-O unslid virtual addresses.
If you're writing m1n1 code you will never see those. Really, don't try to think about it too much,
you'll just confuse yourself.

### Entry

iBoot enters us at the entrypoint defined in the (ridiculous) Mach-O data structure as an unslid
vaddr. Entry is with the MMU off. `x0` points to the [boot_args structure](https://github.com/AsahiLinux/m1n1/blob/main/src/xnuboot.h).

In addition, iBoot sets and locks the RVBAR of the boot CPU to be the top of the page that the
entrypoint lives in. This cannot be changed after boot, and thus this address will always have
a special significance and have to be treated as resident bootloader code. Right now the practical
significance is unclear, but presumably after a resume from deep sleep, the boot CPU will start
executing code here. Note that this does not lock the actual CPU vectors (that can be changed
freely in `VBAR_EL2`) nor does it affect the RVBAR of secondary CPUs (which can be freely set prior
to issuing the start command).

## m1n1 memory layout

When running m1n1 initially, the relevant memory looks like this:

```
+==========================+
| Device Tree (ADT)        | /chosen/memory-map.DeviceTree
+--------------------------+
| Trust Cache              | /chosen/memory-map.TrustCache
+==========================+ <-- _base
| Mach-O header            | /chosen/memory-map.Kernel-_HDR
+--                      --+ <-- _text_start, _vectors_start
| m1n1 .text               | /chosen/memory-map.Kernel-TEXT
+--                      --+
| m1n1 .rodata             | /chosen/memory-map.Kernel-RODA
+--                      --+ <-- _data_start
| m1n1 .data & .bss        | /chosen/memory-map.Kernel-DATA
+--                      --+ <-- _payload_start
| m1n1 Payload region      | /chosen/memory-map.Kernel-PYLD (64MB currently)
+==========================+ <-- _payload_end
| SEP Firmware             | /chosen/memory-map.SEPFW
+--------------------------+ <-- boot_args
| BootArgs                 | /chosen/memory-map.BootArgs
+==========================+ <-- boot_args->top_of_kdata, heap_base
| m1n1 heapblock           | (>=128MB)
+--                      --+ <-- ProxyUtils.heap_base (m1n1 heapblock in use end + 128MB)
| Python heap              | (1 GiB)
+--                      --+
|      (Unused memory)     |
+==========================+ <-- boot_args->top_of_kdata + boot_args->mem_size
```

m1n1's heapblock area (used as a backend for malloc, and for loading payloads) starts at `boot_args.top_of_kdata` and has no bound at this time. When using proxyclient, ProxyUtils will set up a Python heap base 128MiB above whatever the current heapblock top is, which means m1n1 can use up to 128MiB of additional memory before it runs into Python-side structures. Note that fresh executions of the Python side will re-initialize their heap starting at whatever the current m1n1 end is, so e.g. m1n1-side memory leaks on each Python excecution are not an immediate problem until you run out of total RAM.

When chainloading another Mach-O payload, the next stage overwrites m1n1 in-place. The chainload.py Mach-O loading code skips the padding end of the m1n1 payload section (except 4 zero bytes as a marker), so SEP firmware and BootArgs follow directly in what would've otherwise been the m1n1 payload area, saving RAM. Relocating the SEP firmware is optional; if it is not enabled, it remains where it is, and top_of_kdata is kept untouched. Unless m1n1 grows by more than the size of its payload region, this should be safe.
