---
title: ACE3
---

ACE3 is the new USB-C / USB-PD controller in M3 products. It has a sn201202x compatible value in the ADT.

## SPMI transport

Unlike its predecessors, the ACE3 is accessed via SPMI rather than I2C. However the underlying interface hasn't changed, a thin transport layer allows accessing what were previously I2C registers (which we'll refer to as "logical registers") through the SPMI registers.

- **0x00 (logical register address) [RW]:** writing `0x80 | logical_register_address` to this SPMI register will start a logical register selection process, updating the SPMI registers below. Once the selection has finished, the MSB will be cleared. 

  Note 1: The "register 0 write" SPMI command can also be used, because the 7-bit value is completed with MSB=1 and will therefore trigger a logical register selection.  
  Note 2: Writes with MSB=0 will update the register's value, but won't select a new register.

- **0x1F (logical register size) [RO]:** when a logical register is selected, its size in bytes is written here.

- **0x20..0x5F (logical register data) [RW]:** when a logical register is selected, its data is read, zero-padded and written here. Writes anywhere in this area cause the area's contents to be written (truncated as appropriate) to the last selected logical register.

  Note 1: There doesn't seem to be a way to monitor the completion of a logical register write, but it seems to block further selections.  
  Note 2: There doesn't seem to be a way to hold off the logical register write until later, so only logical registers of size ≤ 16 can be written atomically.

Other observations:

- Only the first 0x60 addresses are mapped, but address bits 7 and higher seem to be ignored, causing the block to be aliased every 0x80 bytes. Many consecutive SPMI registers can be accessed at once using extended (or extended long) commands.

- The device also supports sleep and wakeup commands, and it's sleeping at boot. When sleeping, writes are ACKed but ignored. It takes some time for the device to wake up after receiving the command.

- Interrupts are no longer delivered through a GPIO pin, but through the SPMI controller's interrupt functionality. (I don't know how this works at the bus level, maybe interrupts are triggered via a master write command?)

- For some reason, each device seems to have two SPMI slaves (one listening at the address in the ADT, and one at the next). Each slave holds its own selection, and sending sleep/wakeup commands to either of them reflects in both... except that the second slave seems to ignore sleep commands.

These observations were made on a J516c, SN2012024 HW00A1 FW002.062.00.
