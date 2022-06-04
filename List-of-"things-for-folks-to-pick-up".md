Here the official-ish list of "things for folks to pick-up". Reach out to the #asahi-dev IRC channel to check latest status if you want to contribute.

* hwmon support

  status: just started

  contact: marcan/jeffmiw

* irq support for the i2c driver

  The Linux driver for the I2C controller on M1 chips (see [source here](https://github.com/AsahiLinux/linux/blob/asahi/drivers/i2c/busses/i2c-pasemi-core.c)) lacks IRQ support. This means it needs to do polling where it could just wait for an interrupt instead. Adding the IRQ support could be a nice and small task for someone who wants to start kernel development. Contact sven over IRC, he might be able to give pointers or provide general help if needed.

  status: to be started

  contact: sven
