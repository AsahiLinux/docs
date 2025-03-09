---
title: Apple Interrupt Controller (AIC)
---

AIC is the Apple Interrupt Controller. These are some scattered RE notes.

Apple likes to use a particular SET/CLR register pair style:

* SET: reads current state, writes set bits set to 1
* CLR: reads current state, writes clear bits set to 1

## Registers

```
0000~ global stuff
  0004: NR_IRQ?
  0010: GLOBAL_CFG? (impl bits: f8fffff1)
2000~ interrupt acks, IPIs, etc

3000~ IRQ_TGT (1 per reg, CPU bitfield each reg)
4000~ SW_GEN_SET (bitfields)
4080~ SW_GEN_CLR (bitfields)
4100~ IRQ_MASK_SET (bitfields)
4180~ IRQ_MASK_CLR
4200~ HW_IRQ_MON (current interrupt line state?)

8020 Low 32 bits of MSR CNTPCT_EL0 (system timer)
8028 High 32 bits of MSR CNTPCT_EL0 (system timer)

Mirror accessing per-core state for the current CPU core:
2004 IRQ_REASON
2008 IPI_SEND - Send an IPI, bits 0..<31 send an other IPI to a CPU, bit 31 sends a "self" IPI to this CPU
200c IPI_ACK  - Acks an IPI, bit 0 acks an "other" IPI, and bit 31 acks a "self" IPI
2024 IPI_MASK_SET - Mask bits for IPIs correspond to the same type and position of the bits for IPI_ACK
2028 IPI_MASK_CLR

TODO Document direct access to per-core state offsets
```

## Usage

IPI flow:

* Write bit to IPI_SEND
* ARM IRQ asserted
* Read IRQ_REASON
    * IPI is masked in IPI_MASK
    * ARM irq is desasserted
* Write bit to IPI_ACK
* Write bit to IPI_MASK_CLR
    * IPI is unmasked
    * if IPI_ACK was not cleared, ARM irq would reassert here

HW irq flow:

* Set target bitfield in IRQ_TGT
* Write bit to IRQ_MASK_CLR
* (later) HW IRQ asserted
* Read IRQ_REASON
    * IRQ_MASK is automatically set
    * ARM irq is desasserted
* (clear the IRQ in the specific hardware)
* Write bit to IRQ_MASK_CLR
    * IRQ is unmasked
    * if hardware line was not cleared, ARM irq would reassert here

There are 11 targets? CPUs 0-7 and some auxiliary ones?
        
Bits set in SW_GEN are ORed with the hardware IRQ lines

## Timer

The system timer is the standard ARM64 MSR stuff, and bypasses AIC. It is wired straight to FIQ.
