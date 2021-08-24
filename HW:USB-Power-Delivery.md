On the MacBooks, USB Power Delivery happens using two I2C devices that implement interfaces very similar to the standard tps6598x chips. There are two twists:

1. When booting, the chip is in a special power mode and an "SSPS" command needs to be issued to put it into normal S0 mode.

2. Some interrupts have to be unmasked for battery charging to start when a power supply is connected. One possibility is that the interrupt line the two PD chips share is snooped by some coprocessor in the system which kicks the charging circuitry after every interrupt.