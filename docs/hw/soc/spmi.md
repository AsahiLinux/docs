---
title: SPMI
---

This block controls a single master in an SPMI bus. It allows sending SPMI commands and also acts as a 256-line interrupt controller for the bus participants. It has had several revisions, according to the ADT compatible:

 - `spmi,gen1`: used in M1
 - `spmi,gen2`: used in M2
 - `spmi,gen3`: used in M3, M4

This document is written based on gen3. The revisions seem to have backwards compatible interfaces, but some functionality may not be present on older ones.

## Registers overview

The first of 3 MMIO areas in the ADT holds the following 32-bit registers:

 - [0x00] **STATUS** [RO]: Status of the TX and RX FIFOs
 - [0x04] **TX_PUSH** [WO]: Writes push a 32-bit word to the TX FIFO
 - [0x08] **RX_PULL** [RO]: Reads consume a 32-bit word from the RX FIFO
<!-- space -->
 - [0x20..0x3F] **BUS_IRQ_MASK** [RW]: IRQ mask area for bus-asserted interrupt lines
 - [0x40] **IRQ_MASK** [RW]: IRQ mask area for controller-asserted interrupt lines
<!-- space -->
 - [0x60..0x7F] **BUS_IRQ_ACK** [RW]: IRQ ACK area for bus-asserted interrupt lines
 - [0x80] **IRQ_ACK** [RW]: IRQ ACK area for controller-asserted interrupt lines
<!-- space -->
 - [0xA0] **CONFIG1** [RW]: Bits 0..2 settable, initialized by iBoot to 6 (`nub-spmi-aN`) or 7 (others). Master address?
 - [0xA4] **ACTION1** [WO]: Writing 1 to some of the bits triggers some actions
<!-- space -->
 - [0xB0] **CURSORS** [RO]: Read/write cursor positions for the TX and RX FIFOs
 - [0xB4] **PEEK_POS** [RW]: FIFO and buffer position to peek
 - [0xB8] **PEEK_VALUE** [RO]: Word at the position described by PEEK_POS
 - [0xBC] **STATUS1** [RO]: Only bit 0 seen, seems to indicate inability to talk on the bus?

## General operation

To send an SPMI command on the bus, a batch of 32-bit words is pushed to the TX FIFO. When all of the following conditions are fulfilled:

- a complete, valid batch is next in the TX FIFO
- there is enough free space in the RX FIFO
- the bus is free
- CONFIG1 holds a nonzero value (?)

the SPMI master side consumes the batch from the TX FIFO, sends the corresponding frames on the bus, and writes a batch of words to the RX FIFO. The general structure of a batch of words in either FIFO is as follows:

 1. a command word (TX FIFO) or reply word (RX FIFO).
 2. 0 to 16 data bytes, which are packed into words in little-endian order, resulting in 0 to 4 words (as many as needed)
    - if the amount of bytes isn't divisible by 4, trailing bytes are added as needed; thus the last word may have its higher 0..3 bytes unused (TX FIFO) or set to 0 (RX FIFO)

For example, a batch with 5 data bytes consists of these 3 words:

~~~
+------------------------+  +--------+--------+--------+--------+  +--------------------+--------+
|   command/reply word   |  | byte 3 | byte 2 | byte 1 | byte 0 |  |     unused/zero    | byte 4 |
+------------------------+  +--------+--------+--------+--------+  +--------------------+--------+
~~~

The amount of data bytes is fully determined by the OPCODE field in the command/reply word. For RX FIFO batches (replies) the amount of data bytes always matches the amount of SPMI input frames, e.g. amount of bytes requested in a register read. For TX FIFO batches (commands) however, the relationship is more complicated, see below.

The general structure of a command word is as follows:

 - [Bits 0..7] **OPCODE**: 8-bit SPMI command opcode. Note that this isn't always the exact opcode that will be sent through the bus, sometimes it just identifies the general command type (e.g. register 0 write, read register), see SPMI commands below
 - [Bits 8..11] **SLAVE_ID**: 4-bit slave address
 - [Bit 15] **NOTIFY**: If set, the NOTIFY interrupt line is asserted when this command completes (see interrupts below)
 - [Bits 16..31] **PARAM**: 16-bit space for extra opcode-dependent parameters that aren't carried in the data bytes

The general structure of a reply word is as follows:

 - [Bits 0..7] **OPCODE**: 8-bit SPMI opcode that was actually transmitted in the command frame (as stated above, this may not always exactly match the OPCODE field in the command word)
 - [Bits 8..11] **SLAVE_ID**: 4-bit slave address (always matches command word)
 - [Bit 15] **ACK**: If the SPMI command includes an acknowledgment frame (basically all commands except reads) this bit carries its value (1 if acknowledged by the slave), otherwise 0
 - [Bits 16..31] **PARITY**: The N lower bits of this field (where N is the amount of input frames included in the SPMI command, and thus the amount of data bytes following this word) hold the result of the parity check for each of those frames (1 if the check succeeded), the rest are zero

Entire batches of words are consumed and pushed from/to the FIFOs atomically; once the first word of a batch is available, there's no need to wait for the other words.

## SPMI commands

Additional requirements for the command / reply word batches depend on the particular kind of command being issued:

### Simple commands

For power state management commands (reset, sleep, shutdown, wakeup) since they carry no additional parameters, the PARAM field is unused. No data bytes follow the command or reply.

### Basic register access

For commands that read or write a single register (read register, write register, register 0 write) the PARAM field is structured as follows:

 - [Bits 0..7] **ADDRESS**: Register address, 0..0x1F (unused for the register 0 write command)
 - [Bits 8..15] **VALUE**: Written register value (unused for the read register command)

In the command's OPCODE field, any bits specifying this info are ignored and replaced with the relevant bits from PARAM. No data bytes follow the command, and 0 (writes) or 1 (reads) data bytes follow the reply.

### Extended register access

For commands that can operate on multiple registers at once, and also allow accessing an extended register address space (extended read, extended write, extended read long, extended write long) the PARAM field holds the register address (0..0xFF for extended read/write, 0..0xFFFF for extended read/write long).

The amount of data bytes following the command (writes) or reply (reads) is the amount of registers/bytes being read/written, as encoded in OPCODE.

<!-- TODO: other commands -->

## FIFOs

Each of the FIFOs has a capacity of 64 words. Because all known batches can be at most 5 words, the controller can in the worst case hold up to 12 outstanding SPMI commands.

STATUS and CURSORS return information about the TX FIFO in the low half-word, and the RX FIFO in the high half-word. A half-word in STATUS is structured as follows:

 - [Bits 0..7] **COUNT**: Amount of words in the FIFO, 0..0x40
 - [Bit 8] **EMPTY**: Set if the FIFO is empty, e.g. COUNT == 0
 - [Bit 9] **FULL**: Set if the FIFO is full, e.g. COUNT == 0x40

A half-word in CURSORS is structured as follows:

 - [Bits 0..7] **WRITE_CURSOR**: Buffer position of the next word to push, 0..0x3F
 - [Bits 8..15] **READ_CURSOR**: Buffer position of the next word to consume, 0..0x3F

When both cursors are equal, the FIFO may be either empty or full; STATUS may be used to disambiguate.

Writing a 1 to bit 0 of the ACTION1 register clears both FIFOs.

There is a debug mechanism to read arbitrary words from the buffer of a FIFO. PEEK_POS selects which word:

 - [Bit 8] **FIFO_IDX**: FIFO to select (0 = TX, 1 = RX)
 - [Bits 16..24] **CURSOR**: Buffer position to read, 0..0x3F

And PEEK_VALUE returns the current value at the selection.

## Interrupts

The ADT lists several AIC interrupt lines, but only the second one seems to be of interest, since the other ones appear to be shared across all other SPMI controllers.

The mask area is at 0x20..0x5F; each bit is set to 1 if the corresponding line is unmasked, 0 if masked.

The ACK area is shifted by +0x40, at 0x60..0x9F; each bit is set to 1 when the corresponding line triggers; writing a 1 to the bit clears it.

The AIC line is asserted if at least one bit is set in both areas. The first 256 lines (first half of each area) appear to be triggered by participants in the bus (the SPMI spec doesn't specify a command for this, could be a master write command?). The rest are triggered by the controller itself when certain events occur. Note that masking a line doesn't prevent it from being triggered (and the corresponding bit set to 1 in the ACK area).

At M3, only the following controller-triggered lines are unmaskable:

 - [Bit 0] **NOTIFY**: Triggered when a command with the NOTIFY flag completes and its reply has been pushed to the RX FIFO
<!-- space -->
 - [Bit 4]
 - [Bit 5]
 - [Bit 6] **READ_FAIL_1**: Triggered when a read command completes with parity check failures
 - [Bit 7] **ACK_FAIL**: Triggered when a (non-read) command completes and wasn't acknowledged by the slave
 - [Bit 8]
 - [Bit 9]
 - [Bit 10]
 - [Bit 11] **READ_FAIL_2**: Triggered when a read command completes with parity check failures
 - [Bit 12]
 - [Bit 13]
<!-- space -->
 - [Bit 16]
 - [Bit 17]
<!-- space -->
 - [Bit 23] (only on `nub-spmiN`)
 - [Bit 24] (only on `nub-spmiN`)
 - [Bit 25] (only on `nub-spmiN`)
 - [Bit 26] (only on `nub-spmiN`)
 - [Bit 27] **FAIL**: Triggered when attempting to consume a word from the RX FIFO while empty. Unlike the rest this one seems to be level-triggered and I can't find the way to clear it (short of a PMGR reset)
 - [Bit 28] (only on `nub-spmiN`)
 - [Bit 29] (only on `nub-spmiN`)
