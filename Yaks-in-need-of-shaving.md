This page is a list of miscellaneous tasks that need to be done, but may have been de-prioritised in order to focus on frying bigger fish.
Most of these tasks will be low stakes and low effort, making them good places to start for newcomers to kernel development or Free Software
in general.

If you decide to take up any of these tasks, please update the task's status to avoid duplicate work. Reach out on `#asahi-dev` if you have
any questions or are in need of assistance.

| Task | Status | Description | Contact |
| ---- | ------ | ----------- | ------- |
| hwmon driver | **Started** |The SMC reports data from many thermal and power sensors in these machines. We need a driver for the hwmon subsystem to retrieve these values in userspace. There are already multiple drivers that talk to the SMC to draw inspiration from, so this shouldn't be too difficult. | marcan<br>jeffmiw |
| I<sup>2</sup>C IRQ support | **Started** |The [PASemi I<sup>2</sup>C kernel driver](https://github.com/AsahiLinux/linux/blob/asahi/drivers/i2c/busses/i2c-pasemi-core.c) lacks support for IRQs. Rather than simply wait for an interrupt to signify completement of a transaction, it must periodically poll the hardware, which is suboptimal. Adding IRQ support to this already-existing driver should be trivial. | sven<br>amarioguy|
| SSM3515 driver | **Unclaimed** | For speaker support on the iMac, we need a driver for the [SSM3515](https://www.analog.com/en/products/ssm3515.html) speaker amp part. Pretty much the driver only needs to set the volume, request a power-up of all the relevant circuitry inside the chip and set the sample format on the I2S bus while having the right interface of a codec driver in the [ALSA System on Chip](https://www.kernel.org/doc/html/latest/sound/soc/index.html) framework. The work will mostly consist of cannibalizing the boilerplate from an existing codec driver and filling in the specifics of the register map of the part in question. All in all I would call it dull/bureaucratic work, so choose it only if you have some special interest in it, and also have access to an iMac to test on. I (povik) will be happy to consult it. | povik |