This page details currently supported features on all M3 series (M3, M3 Pro, M3 Max) Apple Silicon Macs, as well as
their progress towards being upstreamed. The tables herein can be interpreted as follows:

* **Kernel release, *e.g.* 6.0:** the feature was incorporated upstream as of this release
* **linux-asahi (kernel release):** the feature is stable, available for use in `linux-asahi`, and should be upstream by the release indicated
* **linux-asahi**: the feature is (mostly) stable and available for use in Fedora Asahi Remix and in `linux-asahi`
* **asahi-edge**: the feature is (mostly) stable and available for use in Fedora Asahi Remix. For historical reason it is available in the `linux-asahi-edge` package in the linux-asahi Linux distribution
* **WIP**: Development work on the feature is actively progressing, however is not yet ready for wider testing, use or distribution
* **TBA**: Active work on this feature is not being undertaken at this time

If a feature is not ready, then there is no estimation on when it will be ready. [Please do not ask for estimations in support channels (e.g. IRC)|"When-will-Asahi-Linux-be-done?"](When-will-Asahi-Linux-be-done.md). 

## Table of Contents
- [SoC blocks](#soc-blocks)
- [M3 devices](#m3-devices)
- [M3 Pro/Max devices](#m3-promax-devices)
- [Notes](#notes)

Note that as these machines have not been released for general availability yet, supported and missing features are predictions based on what Apple has changed
on a per-SoC and per-machine basis in the past. This page will change rapidly once work begins on support for these machines.

## SoC blocks
These are features/hardware blocks that are present on all devices with the given SoC.

|                  | M3<br>(T8122)        | M3 Pro/Max<br>(T603x)       |
|------------------|:--------------------:|:---------------------------:|
| DCP              | TBA                  | TBA                         |
| USB2 (TB ports)  | linux-asahi          | linux-asahi                 |
| USB3 (TB ports)  | linux-asahi          | linux-asahi                 |
| Thunderbolt      | TBA                  | TBA                         |
| DP Alt Mode      | WIP                  | WIP                         |
| GPU              | TBA                  | TBA                         |
| Video Decoder    | TBA                  | TBA                         |
| NVMe             | 5.19                 | 5.19                        |
| PCIe             | TBA                  | TBA                         |
| PCIe (GE)        | -                    | -                           |
| cpufreq          | 6.2                  | 6.2                         |
| cpuidle          | linux-asahi ([notes](#cpuidle-situation)) | linux-asahi ([notes](#cpuidle-situation)) |
| Suspend/sleep    | asahi-edge           | asahi-edge                  |
| Video Encoder    | TBA                  | TBA                         |
| ProRes Codec     | TBA                  | TBA                         |
| AICv3            | TBA                  | TBA                         |
| DART             | TBA                  | TBA                         |
| PMU              | TBA                  | TBA                         |
| UART             | 5.13                 | 5.13                        |
| Watchdog         | 5.17                 | 5.17                        |
| I<sup>2</sup>C   | 5.16                 | 5.16                        |
| GPIO             | 5.16                 | 5.16                        |
| USB-PD           | 5.16                 | 5.16                        |
| MCA              | 6.1 / 6.4 (dts)      | linux-asahi                 |
| SPI              | linux-asahi          | linux-asahi                 |
| SPI NOR          | linux-asahi          | linux-asahi                 |
| SMC              | linux-asahi          | linux-asahi                 |
| SPMI             | linux-asahi          | linux-asahi                 |
| RTC              | linux-asahi          | linux-asahi                 |
| SEP              | WIP                  | WIP                         |
| Neural Engine    | out of tree ([notes](#ane-driver)) | out of tree ([notes](#ane-driver)) |


## M3 devices
|                    | iMac<br>(2023)     | MacBook Pro<br>(14-inch, late 2023) | MacBook Air<br>(13” and 15” 2024) |
|--------------------|:------------------:|:-----------------------------------:|:------------------------------:|
| Installer          | no                 | no                                  |                                |
| Devicetree         | TBA                | TBA                                 |                                |
| Main display       | TBA                | TBA                                 |                                |
| Keyboard           | -                  | TBA                                 |                                |
| KB backlight       | -                  | TBA                                 |                                |
| Touchpad           | -                  | TBA                                 |                                |
| Brightness         | TBA                | TBA                                 |                                |
| Battery info       | -                  | TBA                                 |                                |
| WiFi               | TBA                | TBA                                 |                                |
| Bluetooth          | TBA                | TBA                                 |                                |
| HDMI Out           | -                  | TBA                                 | -                              |
| 3.5mm jack         | TBA                | TBA                                 |                                |
| Speakers           | TBA                | TBA                                 |                                |
| Microphones        | TBA                | TBA                                 |                                |
| Webcam             | TBA                | TBA                                 |                                |
| SD card slot       | -                  | TBA                                 | -                              |
| 1Gbps Ethernet     | TBA                | -                                   | -                              |
| 10Gbps Ethernet    | -                  | -                                   | -                              |
| TouchID            | -                  | TBA                                 |                                |

## M3 Pro/Max devices
|                    | MacBook Pro<br>(14/16-inch, late 2023) |
|--------------------|:---------------------------------:|
| Installer          | no                                |
| Devicetree         | TBA                               |
| Main display       | TBA                               |
| Keyboard           | linux-asahi                       |
| KB backlight       | linux-asahi                       |
| Touchpad           | linux-asahi                       |
| Brightness         | TBA                               |
| Battery info       | linux-asahi                       |
| WiFi               | TBA                               |
| Bluetooth          | TBA                               |
| HDMI Out           | TBA                               |
| 3.5mm jack         | linux-asahi                       |
| Speakers           | WIP                               |
| Microphones        | TBA                               |
| Webcam             | TBA                               |
| SD card slot       | 5.17                              |
| 1Gbps Ethernet     | -                                 |
| 10Gbps Ethernet    | -                                 |
| TouchID            | TBA                               |

Note: Many peripherals depend on DART and PCIe support.


## Notes

### cpuidle situation
Some power management functionality on ARM machines is controlled via the PSCI interface. The
kernel has a specific way of talking to PSCI that is not compatible with Apple Silicon, and a
discussion is required with upstream maintainers in order to figure out the best way forward. Given
that this discussion has failed to materialise for two years, the decision has been
made to hack together a driver that directly calls WFI/WFE instructions in order to bring
this functionality to Asahi Linux. This greatly improves the UX on laptops when coupled with
energy-aware scheduling, as it resolves the issue of the machines running warm to the touch
and significantly improves battery life. This can never be upstreamed, however the hope is
that this hacked together driver becomes unnecessary at some point in the near future.

### ANE driver
An out of tree [kernel module](https://github.com/eiln/ane/tree/main) is available. It will be merged into linux-asahi.
