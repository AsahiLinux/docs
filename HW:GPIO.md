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
* The controllers seem to provide interrupt functionality as well.  The standard bindings allow for an `interrupt-controller` property so this this can be handled as well. There are (up to) 7 AIC interrupts per controllers each handling a group of GPIO pins.  It seems GPIO pins can be freely assigned to a group although the ADT contains properties that suggest that not all groups are functional on some of the controllers.

The gpio controller provides interrupt functionality to devices which uses it as `interrupt-parent`. Those devices have 2 `#interrupt-cells`. The first cell specifies the GPIO pin. The meaning of the second pin is unknown. `audio-tas5770L-speaker`, `audio-codec-output`, `hpmBusManager` use 0x1, `wlan` 0x2 and `bluetooth` 0x2000002. The second cells' value does not seem to correspond to the pin's configuration register.

device                 | pin | 2nd cell  | config by iboot (mac mini)
---------------------- | --- | --------- | --------------------------
hpmBusManager          | 106 | 0x1       | 0x76b80
bluetooth              | 136 | 0x2000002 | 0x76a80
audio-tas5770L-speaker | 182 | 0x1       | 0x76b81
audio-codec-output     | 183 | 0x1       | 0x76b81
wlan                   | 196 | 0x2       | 0x76ac0

Observed Mac OS behavior for device `/arm-io/gpio` at address `0x23c100000`:
1. read pin config (4 bytes) from offset `0x0000` to `0x34c` (212 pins)
2. clear interrupts for all 7 groups? writing ones 7 x 4 bytes in seven groups to the offsets `0x800`, `0x840`, `0x880`, `0x8C0`, `0x900`, `0x940`, `0x980`
