This page details currently supported features on all extant Apple Silicon Macs, as well as their upstream status. The tables can
be interpreted as follows:

* **Kernel release, *e.g.* 6.0:** the feature was incorporated upstream as of this release
* **linux-asahi (kernel release):** the feature is stable, available for use, and scheduled for merging upstream by the release indicated
* **linux-asahi**: the feature is (mostly) stable and available for use in Asahi Linux, or other distros which package our kernel
* **linux-asahi-edge**: the feature is available for wider testing in the linux-asahi-edge package in the Asahi Linux distribution
* **linux-asahi-dev**: the feature is working to some extent, but is not suitable for general use

## Table of Contents
- [M1 Series (M1, M1 Pro, M1 Max, M1 Ultra)](#m1-series-soc-features)
  * [M1 device-specific support](#m1-device-specific-support)
  * [M1 Pro/Max/Ultra device-specific support](#m1-pro-max-ultra-device-specific-support)
- [M2 Series (M2)](#m2-series-soc-features)
  * [M2 device-specific support](#m2-device-specific-support)

## M1 series (M1, M1 Pro, M1 Max, M1 Ultra)

### M1 series SoC features
Features found on all devices featuring a given SoC

|                  | M1 (T8103)        | M1 Pro/Max/Ultra (T600x) |
|------------------|:-----------------:|:------------------------:|
| AICv2            | N/A               | 5.18                     |
| DART             | 5.15              | 6.1                      |
| ARM PMU          | 5.18              | 5.18                     |
| cpufreq          | linux-asahi       | linux-asahi              |
| cpuidle          | see notes         | see notes                |
| Suspend          | linux-asahi-edge  | linux-asahi-edge         |
| UART             | 5.13              | 5.13                     |
| Watchdog         | 5.17              | 5.17                     |
| PCIe             | 5.16              | 5.16                     |
| I<sup>2</sup>C   | 5.16              | 5.16                     |
| GPIO             | 5.16              | 5.16                     |
| USB-PD           | 5.16              | 5.16                     |
| Power management | 5.17              | 5.17                     |
| NVMe             | 5.19              | 5.19                     |
| SPI              | linux-asahi       | linux-asahi              |
| SPI NOR          | linux-asahi       | linux-asahi              |
| Primary display  | 5.17              | 5.17                     |
| DCP              | linux-asahi-edge  | linux-asahi-edge         |
| DP Alt Mode      | WIP               | WIP                      |
| Thunderbolt      | WIP               | WIP                      |
| USB2 (TB ports)  | linux-asahi       | linux-asahi              |
| USB3 (TB ports)  | linux-asahi       | linux-asahi              |
| SMC              | linux-asahi       | linux-asahi              |
| SPMI             | linux-asahi       | linux-asahi              |
| RTC              | linux-asahi       | linux-asahi              |
| SEP              | WIP               | WIP                      |
| Video Decoder    | WIP               | WIP                      |
| Video Encoder    | WIP               | WIP                      |
| ProRes Codec     | N/A               | WIP                      |
| GPU              | WIP               | WIP                      |
| Neural Engine    | not yet supported | not yet supported        |

### M1 device-specific support
|                    | Mac Mini (2020)   | MacBook Pro (13-inch, 2020) | MacBook Air (2020) | iMac (2021)       |
|--------------------|:-----------------:|:---------------------------:|:------------------:|:-----------------:|
| Devicetree         | 5.13              | 5.17                        | 5.17               | 5.17              |
| Keyboard           | N/A               | linux-asahi                 | linux-asahi        | N/A               |
| Keyboard backlight | N/A               | linux-asahi-edge            | linux-asahi-edge   | N/A               |
| Touchpad           | N/A               | linux-asahi                 | linux-asahi        | N/A               |
| Touch Bar          | N/A               | not yet supported           | N/A                | N/A               |
| USB-A ports        | 5.16              | N/A                         | N/A                | N/A               |
| HDMI Out           | 5.13              | N/A                         | N/A                | N/A               |
| TouchID            | not yet supported | not yet supported           | not yet supported  | not yet supported |
| 1Gbps Ethernet     | 5.16              | N/A                         | N/A                | N/A               |
| 10Gbps Ethernet    | 5.17              | N/A                         | N/A                | N/A               |
| WiFi               | 6.1               | 6.1                         | 6.1                | 6.1               |
| Bluetooth          | linux-asahi (6.2) | linux-asahi (6.2)           | linux-asahi (6.2)  | linux-asahi (6.2) |
| 3.5mm jack         | linux-asahi       | linux-asahi                 | linux-asahi        | linux-asahi       |
| Microphones        | not yet supported | not yet supported           | not yet supported  | not yet supported |
| Internal speakers  | see notes         | see notes                   | see notes          | see notes         |
| Webcam             | N/A               | WIP                         | WIP                | WIP               |
| Battery monitoring | N/A               | linux-asahi                 | linux-asahi        | N/A               |
| Screen brightness  | N/A               | linux-asahi-edge            | linux-asahi-edge   | linux-asahi-edge  |

### M1 Pro/Max/Ultra device-specific support
|                    | Mac Studio (2022) | MacBook Pro (14/16-inch, 2021) |
|--------------------|:-----------------:|:------------------------------:|
| Devicetree         | linux-asahi (6.2) | linux-asahi (6.2)              |
| MagSafe            | N/A               | 5.16                           |
| Keyboard           | N/A               | linux-asahi                    |
| Keyboard backlight | N/A               | linux-asahi-edge               |
| Touchpad           | N/A               | linux-asahi                    |
| HDMI Out           | linux-asahi       | not yet supported              |
| TouchID            | not yet supported | not yet supported              |
| Ethernet           | linux-asahi       | N/A                            |
| WiFi               | 6.1               | 6.1                            |
| Bluetooth          | linux-asahi (6.2) | linux-asahi (6.2)              |
| 3.5mm jack         | linux-asahi       | linux-asahi                    |
| Microphones        | N/A               | not yet supported              |
| Internal speakers  | see notes         | see notes                      |
| Webcam             | N/A               | WIP                            |
| Battery monitoring | N/A               | linux-asahi                    |
| Screen brightness  | N/A               | linux-asahi-edge               |
| SD card reader     | 5.17              | 5.17                           |

## M2 Series (M2)

### M2 series SoC features
Features found on all devices with a given SoC.

|                  | M2 (T8112)        |
|------------------|:-----------------:|
| AICv2            | 5.18              |
| DART             | linux-asahi       |
| PMU              | not yet supported |
| cpufreq          | linux-asahi       |
| cpuidle          | see notes         |
| Suspend          | linux-asahi-edge  |
| UART             | 5.13              |
| Watchdog         | 5.17              |
| PCIe             | linux-asahi       |
| I<sup>2</sup>C   | 5.16              |
| GPIO             | 5.16              |
| USB-PD           | 5.16              |
| Power management | linux-asahi       |
| NVMe             | 5.19              |
| SPI              | linux-asahi       |
| SPI NOR          | linux-asahi       |
| Primary display  | linux-asahi       |
| DCP              | WIP               |
| DP Alt Mode      | WIP               |
| Thunderbolt      | not yet supported |
| USB2 (TB ports)  | linux-asahi       |
| USB3 (TB ports)  | linux-asahi       |
| SMC              | linux-asahi       |
| SPMI             | linux-asahi       |
| RTC              | linux-asahi       |
| SEP              | WIP               |
| Video Decoder    | WIP               |
| Video Encoder    | WIP               |
| ProRes Codec     | WIP               |
| GPU              | WIP               |
| Neural Engine    | not yet supported |

### M2 device-specific support
|                    | MacBook Air (2022) | MacBook Pro (13-inch, 2022) |
|--------------------|:------------------:|:---------------------------:|
| Devicetree         | linux-asahi        | linux-asahi                 |
| MagSafe            | 5.16               | N/A                         |
| Keyboard           | linux-asahi        | linux-asahi                 |
| Keyboard backlight | linux-asahi-edge   | linux-asahi-edge            |
| Touchpad           | linux-asahi        | linux-asahi                 |
| Touch Bar          | N/A                | not yet supported           |
| HDMI Out           | N/A                | N/A                         |
| TouchID            | not yet supported  | not yet supported           |
| WiFi               | 6.1                | 6.1                         |
| Bluetooth          | linux-asahi (6.2)  | linux-asahi (6.2)           |
| 3.5mm jack         | linux-asahi        | linux-asahi                 |
| Microphones        | not yet supported  | not yet supported           |
| Internal speakers  | not yet supported  | not yet supported           |
| Webcam             | WIP                | WIP                         |
| Battery monitoring | linux-asahi        | linux-asahi                 |
| Screen brightness  | WIP                | WIP                         |
| SD card reader     | N/A                | N/A                         |

Note: Many peripherals depend on T600x DART, T8112 DART, and PCIe support.

## Upstream Statistics
Here we track the absolute number of patches carried in `linux-asahi` compared to the
upstream base. This number should decrease with each new kernel version, major hardware
changes notwithstanding.
 
| Kernel base tag | Carried patches |
| :-------------: | :-------------: |
| v5.19           | 175             |
| v6.0-rc6        | 440             |
| v6.1-rc1        | 198             |

The number of carried patches can be computed with the command `git rev-list [base tag]..[asahi tag] | wc -l`

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
