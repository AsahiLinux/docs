This page details currently supported features on all extant Apple Silicon Macs, as well as their upstream status. Kernel versions indicate when each feature was upstreamed. Versions in parentheses indicate when features currently in review are scheduled/likely to be scheduled for merging upstream.

## Table of Contents
- [M1 (T8103)](#m1-t8103)
  * [Mac Mini (M1, 2020)](#mac-mini-m1-2020)
  * [MacBook Pro (13-inch, M1, 2020)](#macbook-pro-13-inch-m1-2020)
  * [MacBook Air (13-inch, M1, 2020)](#macbook-air-13-inch-m1-2020)
  * [iMac (M1, 2021)](#imac-m1-2021)
- [M1 Pro/Max (T6000/T6001)](#m1-promax-t6000t6001)
  * [MacBook Pro (14/16-inch, M1 Pro/Max, 2021)](#macbook-pro-1416-inch-m1-promax-2021)
- [M1 Ultra (T6002)](#m1-ultra-t6002)
  * [Mac Studio (M1 Max/Ultra, 2022)](#mac-studio-m1-maxultra-2022)
- [M2 (T8112)](#m2-t8112)
  * [MacBook Air (13-inch, M2, 2022)](#macbook-air-13-inch-m2-2022)
  * [MacBook Pro (13-inch, M2, 2022)](#macbook-pro-13-inch-m2-2022)


## M1 (T8103)
Devices based on the Apple M1 SoC, released in 2020.

### T8103 platform support
Devices and features common to the platform.

| Feature | Support |
|---------|---------|
| Boot | 5.13 |
| ARM PMU | 5.18 |
| cpufreq | linux-asahi |
| cpuidle | see note on power |
| System suspend | see note on power |
| UART | 5.13 |
| Watchdog | 5.17 |
| PCIe | 5.16 |
| I<sup>2</sup>C | 5.16 |
| GPIO | 5.16 |
| USB-PD | 5.16 |
| Power management | 5.17 |
| NVMe | linux-asahi (5.19) |
| SPI | linux-asahi |
| SPI NOR | linux-asahi |
| Primary display (SimpleDRM) | 5.17 |
| DCP | WIP |
| DP Alt Mode | unsupported |
| Thunderbolt | WIP |
| USB2 (via TB ports) | linux-asahi |
| USB3 (via TB ports) | WIP |
| SMC | linux-asahi |
| SPMI | linux-asahi |
| RTC | linux-asahi |
| SEP | unsupported |
| AVD | WIP |
| AVE | WIP |
| GPU | WIP |
| ANE | unsupported |

### Mac Mini (M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Devicetree | 5.13 |
| USB-A ports | 5.16 |
| HDMI Out | see M1 primary display |
| External TouchID | unsupported |
| 1Gbps Ethernet | 5.16 |
| 10Gbps Ethernet | 5.17 |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| 3.5mm jack | linux-asahi |
| Microphones | unsupported |
| Internal Speaker | linux-asahi [see note on speakers] |

### MacBook Pro (13-inch, M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Devicetree | 5.17 |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| Touch Bar | unsupported |
| TouchID | unsupported |
| Keyboard Backlight | unsupported |
| Webcam | WIP |
| Internal speakers | linux-asahi [see note on speakers] |
| 3.5mm jack | linux-asahi |
| Microphones | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | see note on brightness |

### MacBook Air (13-inch, M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Devicetree | 5.17 |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| TouchID | unsupported |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| Keyboard Backlight | unsupported |
| Webcam | WIP |
| Internal speakers | linux-asahi [see note on speakers] |
| 3.5mm jack | linux-asahi |
| Microphones | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | see note on brightness |

### iMac (M1, 2021)
| Feature | Support Level |
|---------|---------------|
| Devicetree | 5.17 |
| USB Type-C Ports | unsupported |
| 1Gbps Ethernet | 5.16 |
| External TouchID | unsupported |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| Webcam | WIP |
| Internal speakers | linux-asahi [see note on speakers] |
| 3.5mm jack | linux-asahi |
| Microphones | unsupported |
| Display brightness | see note on brightness |


## M1 Pro/Max (T6000/T6001)
Devices based on the Apple M1 Pro and Max SoCs, released late 2021.

### T600X platform support
Devices and features common to the platform.

| Feature | Support |
|---------|---------|
| AICv2 | 5.18 |
| DART | linux-asahi |
| ARM PMU | 5.18 |
| cpufreq | linux-asahi |
| cpuidle | see note on power |
| System sleep | see note on power |
| UART | 5.13 |
| Watchdog | 5.17 |
| PCIe | 5.16, requires DART |
| I<sup>2</sup>C | 5.16 |
| GPIO | 5.16 |
| USB-PD | 5.16 |
| Power management | 5.17 |
| NVMe | linux-asahi (5.19) |
| SPI | linux-asahi |
| SPI NOR | linux-asahi |
| Primary display (SimpleDRM) | 5.17 |
| DCP | WIP |
| DP Alt Mode | unsupported |
| Thunderbolt | WIP |
| USB2 (via TB ports) | linux-asahi |
| USB3 (via TB ports) | WIP |
| SMC | linux-asahi |
| SPMI | linux-asahi |
| RTC | linux-asahi |
| SEP | unsupported |
| AVD | WIP |
| AVE | WIP |
| GPU | WIP |
| ANE | unsupported |
| Apple ProRes | WIP |

### MacBook Pro (14/16-inch, M1 Pro/Max, 2021)
| Feature | Support Level |
|---------|---------------|
| Devicetree | linux-asahi |
| MagSafe connector | 5.16 |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| TouchID | unsupported |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| Keyboard Backlight | unsupported |
| Webcam | WIP |
| Internal speakers | linux-asahi [see note on speakers] |
| 3.5mm jack | unsupported |
| Microphones | unsupported |
| HDMI Out | unsupported |
| SD Card Reader | linux-asahi (5.17, requires DART) |
| Battery/charge monitoring | linux-asahi |
| Display brightness | see note on brightness |


## M1 Ultra (T6002)
The M1 Ultra consists of two M1 Max SoCs connected together
in an interleaved UMA configuration. Responsibility for whole-chip functions
is split between the two dice. Since none of the hardware is actually
new, hardware support is identical to the M1 Max. Only a device tree
is required to support this SoC. Machine-specific hardware will still
need to be evaluated on a per-machine basis.

### Mac Studio (M1 Max/Ultra, 2022)
| Feature | Support Level |
| ------- | ------------- |
| Devicetree | linux-asahi |
| Internal speaker | unsupported |
| HDMI Out | linux-asahi |
| Ethernet | linux-asahi |
| 3.5mm jack | unsupported |

## M2 (T8112)
Devices based on the Apple M2 SoC, released in 2022.

**Note: These levels of support are extrapolated from the MacBook Air devicetree,
and as such should be taken with a grain of salt until we have real hardware to test.**

### T8112 platform support
Devices and features common to the platform.

| Feature | Support |
|---------|---------|
| AICv2 | 5.18 |
| DART | linux-asahi |
| PMU | unsupported |
| cpufreq | linux-asahi |
| cpuidle | see note on power |
| System sleep | see note on power |
| UART | 5.13 |
| Watchdog | 5.17 |
| PCIe | linux-asahi |
| I<sup>2</sup>C | 5.16 |
| GPIO | 5.16 |
| USB-PD | 5.16 |
| Power management | unsupported |
| NVMe | linux-asahi (5.19) |
| SPI | linux-asahi |
| SPI NOR | linux-asahi |
| MTP | linux-asahi |
| Primary display (SimpleDRM) | linux-asahi |
| DCP | WIP |
| DP Alt Mode | unsupported |
| Thunderbolt | unsupported |
| USB2 (via TB ports) | linux-asahi |
| USB3 (via TB ports) | unsupported |
| SMC | linux-asahi |
| SPMI | linux-asahi |
| RTC | linux-asahi |
| SEP | unsupported |
| AVD | WIP |
| AVE | WIP |
| GPU | WIP |
| ANE | unsupported |
| Apple ProRes | WIP |


### MacBook Air (13-inch, M2, 2022)
| Feature | Support Level |
|---------|---------------|
| Devicetree | unsupported |
| Keyboard | unsupported |
| Touchpad | unsupported |
| TouchID | unsupported |
| WiFi | linux-asahi |
| Bluetooth | WIP |
| Keyboard Backlight | unsupported |
| Webcam | unsupported |
| Internal speakers | unsupported [see note on speakers] |
| 3.5mm jack | unsupported |
| Microphones | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | see note on brightness |

### MacBook Pro (13-inch, M2, 2022)
| Feature | Support Level |
|---------|---------------|
| Devicetree | linux-asahi |
| WiFi | linux-asahi |
| Bluetooth | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| Touch Bar | unsupported |
| TouchID | unsupported |
| Keyboard Backlight | unsupported |
| Webcam | unsupported |
| Internal speakers | unsupported |
| 3.5mm jack | unsupported |
| Microphones | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | see note on brightness |

## Notes

### Speakers
Speakers are functioning, however remain unsafe. There is a serious risk of _blowing up_ the speakers
should you misconfigure any part of the userspace stack. As such, on machines where we have (preliminary)
support for speakers, the speakers are disabled in the devicetree. In order to get functioning speakers,
you must manually edit the devicetree to enable it and build a new m1n1 payload containing the modifications.
As this is potentially dangerous and suitable only for well seasoned power users, no specific instructions
are provided.


### Power
Some power management functionality on these machines is tied to PSCI. These machines do not support the
normal way the kernel handles PSCI calls. We could implement this functionality as a one-off ugly driver,
but this would duplicate a lot of functionality that already exists in the kernel, and likely would not
fly upstream. Instead, changes to the kernel's PSCI interface have been proposed which would provide a generic
method for any future machines with similar designs. Until this discussion has resolved, these features
cannot be implemented.


### Brightness
Setting the display brightness remains unsupported until DCP support lands, however you _can_ switch the backlight
on and off. Display brightness settings seem to persist across boots on these machines, so setting the brightness
in macOS and then rebooting into Linux suffices as a workaround until the patches for the DCP are distributed.