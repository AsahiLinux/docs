The SMC is a piece of hardware handling access to such things as temperature sensors, voltage/power meters, battery status, fan status, and the LCD backlight.

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
* `T???`: temperature values, in centigrade/Celsius, as float. There are many of those. The question marks specify, presumably, the location (and possibly whether or not the value is averaged to provide a more meaningful reading?)
* `V???`: voltages. Probably in volts.
* `gP??`: "GPIO" pins. Actually output only, and there appears to be a bug preventing you from reading the level of a pin non-destructively, except it works for the very first such pin to be read.
* `gP12`: on at least one system, the LCD backlight. Can be turned off, which reduces apparent power consumption, and turned back on.
* `gp??` (note capitalization): presumably also some kind of GPIO pin?
* `D1??`: information about the device connected to the first USB-C port
* `D1in`: name of the connected charger
* `D1is`: serial number of the connected charger
* `D2??`: refer to `D1??`
* `P???`: power meters, presumably in watts
* `PSTR`: possibly the entire system's power consumption
* `SBA?`: system battery information
* `SBAS`: battery charge in percent
* `RPlt`: platform name, such as "J293".
* `a???`: highly volatile power-related measurement, so possibly current going to various device parts.
* `F???`: fan information. Refer to https://github.com/torvalds/linux/blob/master/drivers/hwmon/applesmc.c.
* `CL??`: various times, measured in nanoseconds since (presumably) the SMC was booted.
* `CLKU`: continuously-updated current time
* `CLBT`: boot time
* `CLSP`: possibly the time the system last went to sleep
* `CLWK`: possibly the time the system last woke


### Quirks

Or possibly quirks?

* `#KEY`: contains the number of keys in the SMC, but in reversed byte order.
* `VP3b`: apparently byte-reversed
* `gP??`: latched in a weird way: the first time one of these keys is read, the data indicates the pin's power status. But reading any of the keys afterwards returns `0`, except after a write to one of them, which allows you to read data once more (but just once), for any of the pins. So you can read all pins by repeatedly writing 1 to a pin you know to be at high level, then reading the other pin levels one by one.