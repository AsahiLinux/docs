---
title: Watchdog Timer (WDT)
---

The M1 includes a watchdog timer which can reboot the system automatically in case the kernel fails to boot or run properly. It can also be (ab)used to trigger an immediate or delayed reboot in other circumstances.

The initial macho (usually m1n1) is booted with the watchdog timer enabled, so if it does nothing to it, the system will automatically reboot after a while.

There's a 24MHz 32-bit timer at 0x23d2b0000+0x10, a compare value at 0x23d2b0000+0x14 (initially set to 120 seconds), and a control register at 0x23d2b0000+0x1c. When the timer exceeds or equals the compare value, and bit 0x04 in the control register is set, a reboot is triggered.

The WDT is disabled by writing 0 to +0x1c, and enabled by writing 4 to +0x1c.

Since the counters are 32-bit values and wrap, that means the maximum timeout is just short of three minutes.

Registers 0x23d2b0000+0x0/0x4/0xc and 0x23d2b0000+0x20/0x24/0x2c seem to work like +0x10,+0x14,0x1c, but trigger a reboot into recovery mode instead.
