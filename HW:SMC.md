The SMC is a piece of hardware handling access to such things as temperature sensors, voltage/power meters, battery status, fan status, and the LCD backlight and lid switch.

It is "documented", to the extent that it is, in https://github.com/corellium/linux-m1/blob/master/drivers/hwmon/apple-m1-smc.c, but that's just the protocol, which essentially allows you to do three things:

1. read data for each of many, many four-ASCII-character "keys". There are about 1,400 such keys on the MacBook Pro.

2. read data for a key, supplying a payload.

3. write data for a key.

In addition to receiving the bytes of data, the SMC provides a type for that data, encoded as four ASCII characters, and a flags byte.

So far, I haven't been brave enough to try (2) or (3).

## SMC key types

Encoded as four ASCII characters, the last of which I omit if it's a space.

* `flt`: a 32-bit single-precision IEEE float. In at least one case, the byte order is actually reversed.
* `si8`, `ui8`, `si16`, `ui16`, `si32`, `ui32`, `si64`, `ui64`: signed/unsigned 8-/16-/32-/64-bit values
* `hex_`: random binary data
* `flag`: 1 or 0
* `ioft`: this appears to be a 64-bit unsigned fixed-point value (48.16, most likely).
* `ch8*`: ASCII string
* `{jst`: unknown. Possibly some sort of binary-encoded structured document?

### SMC flags

Almost totally unknown. Keys with `0xf0` flags don't appear to return non-zero values reliably (see Quirks).

### SMC keys

Many. https://github.com/torvalds/linux/blob/master/drivers/hwmon/applesmc.c documents some, but mostly you have to guess based on the four-character name. There are more than 1,400 such keys on the MacBook Pro, with many apparently unused.

Some guesses as to what they might mean:
* `T???`: temperature values, in Celsius, as float. There are many of those. The question marks specify, presumably, the location (and possibly whether or not the value is averaged to provide a more meaningful reading?)
* `TB0T`: battery temperature
* `TCHP`: charger temperature (increases sligtly when charging)
* `TW0P`: wireless temperature (increases slightly when wireless is turned on)
* `Ts0P`: palm rest temperature
* `Ts1P`: palm rest temperature
* `V???`: voltages. Probably in volts.
* `gP??`: "GPIO" pins. Actually output only, and there appears to be a bug preventing you from reading the level of a pin non-destructively, except it works for the very first such pin to be read.
* `gP0d`: controls the WiFi/BT chips.  Without enabling this, the PCI devices for WiFi and BT don't show up.  Used to implement "rfkill" functionality?
* `gP12`: on at least one system, the LCD backlight. Can be turned off, which reduces apparent power consumption, and turned back on.
* `gp??` (note capitalization): presumably also some kind of GPIO pin?
* `D1??`: information about the device connected to the first USB-C port
* `D1in`: name of the connected charger
* `D1is`: serial number of the connected charger
* `D2??`: refer to `D1??`
* `P???`: power meters, presumably in watts
* `PSTR`: entire system's power consumption in W
* `SBA?`: system battery information
* `SBA1`: battery cell 1 voltage in mV
* `SBA2`: battery cell 3 voltage in mV
* `SBA3`: battery cell 3 voltage in mV
* `SBAV`: battery voltage in mV (sum of `SBA1`, `SBA2` and `SBA3`, same as `B0AV` but as a `flt`)
* `SBAR`: battery remaining capacity in mAh (same as `B0RM` but as a `flt`)
* `SBAS`: battery charge in percent (same as `BRSC` but as a `flt`)
* `RPlt`: platform name, such as "J293".
* `a???`: highly volatile power-related measurement, so possibly current going to various device parts.
* `F???`: fan information. Refer to https://github.com/torvalds/linux/blob/master/drivers/hwmon/applesmc.c.
* `CL??`: various times, measured in nanoseconds since (presumably) the SMC was booted.
* `CLKU`: continuously-updated current time
* `CLBT`: boot time
* `CLSP`: possibly the time the system last went to sleep
* `CLWK`: possibly the time the system last woke
* `MSLD`: the lid switch, 1 for closed, 0 for open
* `bHLD`: power button currently pressed
* `MBSe`: power button pressed since last read, read-to-clear
* `B0CT`: battery charge cycle count
* `B0AV`: battery voltage in mV (same as `SBAV` but as an `si16`)
* `BRSC`: battery charge in percent (same as `SBAS` but as a `ui16`)
* `B0DC`: battery design capacity in mAh
* `B0FC`: battery full capacity in mAh
* `B0RM`: battery remaining capacity in mAh (same as `SBAR` but as a `ui16` in reverse byte order)
* `B0TE`: battery time-to-empty in minutes
* `B0TF`: battery time-to-full in minutes
* `ID0R`: input current in A
* `VD0R`: input voltage in V
* `PDTR`: input power in W


### Quirks

Or possibly quirks?

* `#KEY`: contains the number of keys in the SMC, but in reversed byte order.
* `VP3b`: apparently byte-reversed
* `gP??`: latched in a weird way: the first time one of these keys is read, the data indicates the pin's power status. But reading any of the keys afterwards returns `0`, except after a write to one of them, which allows you to read data once more (but just once), for any of the pins. So you can read all pins by repeatedly writing 1 to a pin you know to be at high level, then reading the other pin levels one by one. Reading with a payload of 0xffffffff or 0x00000001 returns the right value.
* `rLD0` etc. cannot be read normally, but can be read with a 0x00000001 or 0x00ffffff payload. Maybe that's related to the "flags" byte being 0xf0.

### Notifications

Setting the "NTAP" (notify application processor, maybe?) flag to 1 makes the SMC send notifications when certain system events happen, such as power being connected and disconnected, the power button being pressed, or the lid being opened or
closed. Notifications are mailbox messages apparently limited to the 64-bit payload.
### ADC

In addition to the keys accessible "directly" through the SMC, there is what appears to be a muxed single-channel ADC providing access to 111 further values.  It is accessed through "aDC#" (giving the nmuber of keys), "aDC?" (query key name using a numeric payload), and "aDCR", the actual result value.