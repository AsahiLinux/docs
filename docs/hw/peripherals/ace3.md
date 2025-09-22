---
title: ACE3
---

ACE3 is the new USB-C / USB-PD controller in M3 products. It has a sn201202x compatible value in the ADT.

## SPMI registers

Unlike its predecessors, the ACE3 is accessed via SPMI rather than I2C. However the underlying interface hasn't changed, a thin transport layer allows accessing what were previously I2C registers (which we'll refer to as "logical registers") through the SPMI registers.

- **0x00 (logical register address) [RW]:** writing `0x80 | logical_register_address` to this SPMI register triggers a logical register selection process. Once finished, the SPMI registers below are updated, the MSB in this register is cleared and an interrupt is asserted (see "Interrupts").

  Note 1: The "register 0 write" SPMI command can also be used (the 7-bit value is completed with MSB=1 and will therefore trigger a logical register selection). In fact selections triggered using this command appear to have stricter semantics and seem to be needed in some cases, see "Dual-slave operation" below.  
  Note 2: Writes with MSB=0 will update the register's value, but won't trigger a selection.

- **0x1F (logical register size) [RO]:** when a logical register is selected, its size in bytes is written here by the hardware.

- **0x20..0x5F (logical register data) [RW]:** when a logical register is selected, its data is read, zero-padded and written here by the hardware. Writes anywhere in this area cause the area's contents to be written (truncated as appropriate) to the last selected logical register.

  Note 1: There doesn't seem to be a way to monitor the completion of a logical register write, but it seems to block further selections.  
  Note 2: There doesn't seem to be a way to hold off the logical register write until later, so only logical registers of size ≤ 16 can be written atomically.

Other observations:

- Only the first 0x60 addresses are mapped, but address bits 7 and higher seem to be ignored, causing the block to be aliased every 0x80 bytes. Many consecutive SPMI registers can be accessed at once using extended (or extended long) commands.

- The device also supports the sleep and wakeup SPMI commands, and it's sleeping at boot. When sleeping, writes to SPMI registers are ACKed but ignored. It takes some time for the device to wake up after receiving the command (see also "Interrupts"). Even while in sleeping state, the ACE3 can respond to events (such as plugging a cable) and send the appropriate interrupts.

## Interrupts

Interrupts are no longer delivered through a GPIO pin; instead they are delivered through the SPMI controller, which thus also acts as an interrupt controller. I don't know how this works at the bus level, maybe delivery happens via a master write command? See the SPMI controller documentation for more info on how to receive these "SPMI interrupts".

The ADT lists 3 odd interrupts for each ACE3; we call the smaller of those `BASE`.

 - [`BASE + 0`] **Logical interrupts** (marked as type 0 in the ADT): Asserted when an unacked (logical register 0x14) and unmasked (logical register 0x16) interrupt becomes pending. This serves the same purpose as the previous GPIO pin, however SPMI interrupts have edge/MSI semantics: each (unmasked) interrupt causes `BASE + 0` to be asserted once (even if there were other unacked+unmasked interrupts already) and not asserted again until ACKed.

 - [`BASE + 2`] **Selection complete?** (doesn't appear in the ADT): Asserted each time a logical register selection completes.

 - [`BASE + 4`] (doesn't appear in the ADT): Never observed in the wild.

 - [`BASE + 6`] **Sleep complete?** (marked as type 2 in the ADT): Asserted when an SPMI sleep command is sent to the slave, even if the slave was already in that state. Possibly to indicate when the operation completes?

 - [`BASE + 8`] **Wakeup complete?** (marked as type 3 in the ADT): Asserted when an SPMI wakeup command is sent to the slave, even if the slave was already in that state. Possibly to indicate when the operation completes? But the registers become writable much much earlier than receipt of the interrupt, so it may be something else.

The reason for this spacing of 2 in between (possible) interrupts is to support the dual-slave operation outlined below.

## Dual-slave operation

Each ACE3 seems to have two SPMI slaves at the bus: one listening at the address listed in the ADT (even), presumably for use by the AP, and another listening at the address immediately after (odd), presumably for use by *something else* (the SMC, perhaps). This seems to allow the ACE3 to be accessed by two masters without fighting over the state of the interface (SPMI registers, interrupts, etc). In particular:

- Each slave holds its own selection, even though they operate over the same logical registers. Each slave also seems to have some sort of cache for selections, which appears to be invalidated when the "register 0 write" command is used. By contrary, using a normal write to trigger a selection uses the cache and may return stale data: for example, logical registers may appear out of sync among the two slaves, and command execution (which involves writing a command to logical register 8) may appear to not finish, since subsequent reads of register 8 return the cached command rather than the result of the execution. Logical register writes are always committed immediately on writes to the 0x20..0x5F area, regardless how the selection was made.

- Each slave holds its own interrupt state: the "AP slave" uses register 0x14 for pending interrupts, register 0x16 for unmasked interrupts and register 0x18 to ACK interrupts. The other slave uses the same registers but shifted by +1 (0x15 for pending, 0x17 for unmasked, 0x19 for ACK). Drivers should be careful not to touch these (along with any other state owned by the secondary slave).

- Each slave holds its own sleeping state, but the ACE3 is only put to sleep if both slaves are in sleeping state. In this state, both slaves ignore writes to SPMI registers (but still ACK the commands). If at least one of the slaves is woken up, this doesn't happen (neither slave ignores writes). Whatever is using the secondary slave makes sure to only wake up the slave temporarily, perform the commands it needs to, and put it to sleep again. The "AP slave" is sleeping at boot.

- While the "AP slave" uses the SPMI interrupts documented above, the other slave uses the same interrupts but shifted by -1 (*not* +1). So for example selecting a register in the secondary slave causes a `BASE + 1` interrupt, the triggering of one of the interrupts in register 0x17 causes a `BASE - 1` interrupt, sending a sleep command to the secondary slave causes a `BASE + 5` interrupt and so on.

The secondary slave triggers abundant interrupts when e.g. plugging in a cable, making it clear something else is actually operating it. The fact that these interrupts make it to our SPMI controller hints at the interrupt delivery mechanism not being a "master write" command, since that's addressed to a single master and presumably the other user isn't using our SPMI controller but a separate SPMI master.
