---
title: Application Processor Debug Registers
summary:
  Debug registers found in Apple-designed ARM cores
---

The various CPU cores export entries in the [ADT](../../fw/adt.md) that hint at the existence of debug registers. The string "coresight" appears, and coresight register files are unlocked by writing `0xc5acce55` to offset `0xfb0`, which is also what the Corellium CPU start code does. The lock status register is at `0x210030fb4` for CPU0.

CPU0's PC can be read at `0x210040090` (the usual offsets apply to the other cores), but the other registers don't appear to be making any obvious appearances.
