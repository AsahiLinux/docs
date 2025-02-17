## ASC registers

```
0x40 - some flags/ctrl

0x44 - CPU_CTRL
    4 - CPU_START

0x48 - CPU_STATUS
    5 - MBOXES_TO_AP_EMPTY
    4 - ?
    3 - FIQ_NOT_PENDING
    2 - IRQ_NOT_PENDING
    1 - CPU_STOPPED
    0 - CPU_IDLE
    
0x400
    10 - set when the CPU is started (probaby by firmware)
    
0x80c - IRQ_CONFIG
    0 - IRQ_CONTROLLER_ENABLE

0x818 - IRQ_EVENT_IRQ?
0x820 - IRQ_EVENT_FIQ?

0xa00.. - IRQ_MASK_SET
0xa80.. - IRQ_MASK_CLEAR
0xb00.. - IRQ_MASK2_SET?
0xb80.. - IRQ_MASK2_CLEAR?

0x1000 - CFG?
    1 - IPIs to IRQ, not FIQ?
0x1010 - A_SET
0x1014 - B_SET
0x1018 - A_CLR
    2 - triggers FIQ IPI?
    1 - triggers IRQ IPI?
0x101c - B_CLR

0x1030 - C_SET
0x1034 - D_SET
0x1038 - C_CLR
0x103c - D_CLR

0x8000 - mirror of CPU_STATUS?

0x4000~ and 0x8000~ are mailbox stuff
```

## Mailboxes

Communication between the M1's main CPU cores and the ASCs/IOPs (I/O processors) uses hardware mailboxes to send 128-bit notifications back and forth between the processors, in addition to larger messages sent using shared memory. The usual protocol is that one of the processors writes to shared memory, then sends a mailbox notification to the other processor which triggers an interrupt which causes the other processor to look at the modified memory and interpret a larger message.

While protocols differ between processors, a common element appears to be that the low-order 8 bits of the second 64-bit half of the message encode the endpoint at the IOP side of the message. The first 64 bits appear to be passed through by the mailbox without further changes and very different encodings are used for them.

The hardware side of the mailbox is located at offset +0x8000 in MMIO space, and uses four interrupts numbered consecutively at the [AIC|HW-AIC](AIC|HW-AIC.md), two of which are useful to us.

Data is sent from the main CPU to the IOP when two 64-bit writes target offsets +0x8800 and +0x8808. Once the IOP reads the data and removes it from the queue, the interrupt with the lowest number at the AIC will trigger until it is disabled or further data is written.

Data from the IOP is read by the main CPU, and removed from the queue, by performing 64-bit MMIO reads at offsets +0x8830 and +0x8838. While data is available, the interrupt with the highest number at the AIC will trigger.

A 32-bit status register at +0x8110 indicates whether the CPU-to-IOP queue is empty (bit 17) or not empty (bit 16). Symmetrically, the status register at +0x8114 indicates whether the IOP-to-CPU queue is empty (bit 17) or not empty (bit 16).

It is possible for several messages to be queued in the same direction at the same time, and this is used by IOPs which send more than one notification to the CPU without waiting for an ack.
