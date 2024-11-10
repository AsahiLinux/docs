ACE3 is the new USB-C / USB-PD controller in M3 products. It has a sn201202x compatible value in the ADT.

## SPMI transport

Unlike its predecessors, the ACE3 is accessed via SPMI rather than I2C. However the underlying interface hasn't changed, a thin transport layer allows accessing what were previously I2C registers (which we'll refer to as "logical registers") through the SPMI registers.

- **0x00 (logical register address) [RW]:** writing to this SPMI register using the "register 0 write" command selects a logical register, updating the SPMI registers below. The MSB seems to be set while the selection is taking place, and cleared when done.

  Note: it has to be a register 0 write command specifically. Any other command will write the SPMI register but won't select a logical register.

- **0x1F (logical register size) [RO]:** when a logical register is selected, its size in bytes is written here.

- **0x20..0x5F (logical register data) [RW]:** when a logical register is selected, its data is read, zero-padded and written here. Writes anywhere in this area cause the area's contents to be written to the last selected logical register.

Other observations:

- Only the first 0x60 addresses are mapped, but address bits 8 and higher seem to be ignored, causing the block to be aliased every 0x80 bytes. Many consecutive SPMI registers can be accessed at once using extended (or extended long) commands.

- The device also supports sleep and wakeup commands, and it's sleeping at boot. When sleeping, writes are ACKed but ignored. It takes some time for the device to wake up after receiving the command.

- Interrupts are no longer delivered through a GPIO pin, but through the SPMI controller's interrupt functionality. (I don't know how this works at the bus level, maybe interrupts are triggered via a master write command?)

- For some reason, each device seems to have two SPMI slaves (one listening at the address in the ADT, and one at the next). Each slave holds its own selection, and sending sleep/wakeup commands to either of them reflects in both... except that the second slave seems to ignore sleep commands.
