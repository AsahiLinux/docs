This page is a list of miscellaneous tasks that need to be done, but may have been de-prioritised in order to focus on frying bigger fish.
Most of these tasks will be low stakes and low effort, making them good places to start for newcomers to kernel development or Free Software
in general.

If you decide to take up any of these tasks, please update the task's status to avoid duplicate work. Reach out on `#asahi-dev` if you have
any questions or are in need of assistance.

| Task | Status | Description | Contact |
| ---- | ------ | ----------- | ------- |
| hwmon driver | **Started** |The SMC reports data from many thermal and power sensors in these machines. We need a driver for the hwmon subsystem to retrieve these values in userspace. There are already multiple drivers that talk to the SMC to draw inspiration from, so this shouldn't be too difficult. | marcan<br>jeffmiw |
| I<sup>2</sup>C IRQ support | **Started** |The [PASemi I<sup>2</sup>C kernel driver](https://github.com/AsahiLinux/linux/blob/asahi/drivers/i2c/busses/i2c-pasemi-core.c) lacks support for IRQs. Rather than simply wait for an interrupt to do something, it must constantly poll the I<sup>2</sup>C bus, which is terrible and wastes CPU cycles. Adding IRQ support to this already-existing driver should be trivial. | sven<br>amarioguy|