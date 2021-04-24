## DT binding

The "gpio,t8101" nodes in the ADT represent a GPIO controller with pinmux facilities.
Judging from the Corellium code base the pins can be switched between "gpio" functionality and "periph" functionality.
There may be more options though sine there are unknown bits right next to the bit that controls switching between those two modes.
Given that the controller implements pinmux functionality we need to model this hardware as a pinctrl node in the FDT.  This can be done entirely using generic pinctrl/pinmux/gpio binding properties:

```
#define APPLE_PINMUX(pin, func) ((pin) | ((func) << 16))

                pinctrl: pinctrl@23c100000 {
                        compatible = "apple,t8103-pinctrl";
                        reg = <0x2 0x3c100000 0x0 0x100000>;
                        clocks = <&gpio_clk>;

                        gpio-controller;
                        #gpio-cells = <2>;
                        gpio-ranges = <&pinctrl 0 0 212>;

                        pcie_pins: pcie-pins {
                                pinmux = <APPLE_PINMUX(150, 1)>,
                                         <APPLE_PINMUX(151, 1)>,
                                         <APPLE_PINMUX(32, 1)>;
                        };
                };
```
Using `pinmux` has the benefit that we don't have to invent names for pins and functions and hardcode those in the driver.
The purpose of pins is likely to vary between SoCs and between controllers on a single SoC.  There are four controllers on the M1 SoC!
The example here uses a simple split of the 32-bit pinmux cell.
The lower 16 bits encode the pin number whereas the upper 16 bits encode the pin function.
It is unlikely we need the full 16 bits to encode the pin function so we repurpose some of those bits if we need to in the future.

Some open questions:
* Should the compatible string be "apple,t8101-gpio" given the name of the node in the ADT?  Or should we mention both?
* The controllers seem to provide interrupt functionality as well.  The standard bindings allow for an `interrupt-controller` property so this this can be handled as well.
