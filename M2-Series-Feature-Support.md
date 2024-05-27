This page details currently supported features on all M2 series (M2, M2 Pro, M2 Max, M2 Ultra) Apple Silicon Macs, as well as
their progress towards being upstreamed. The tables herein can be interpreted as follows:

* **Kernel release, *e.g.* 6.0:** the feature was incorporated upstream as of this release
* **linux-asahi (kernel release):** the feature is stable, available for use in Fedora Asahi Remix, and should be upstream by the release indicated
* **linux-asahi**: the feature is (mostly) stable and available for use in Fedora Asahi Remix
* **WIP**: Development work on the feature is actively progressing, however is not yet ready for wider testing, use or distribution
* **TBA**: Active work on this feature is not being undertaken at this time
* **dts**: Feature is included as part of the Linux Device Tree system
* **-**: Feature not supported by hardware on this platform

If a feature is not ready, then there is no estimation on when it will be ready. [[Please do not ask for estimations in support channels (e.g. IRC)|"When-will-Asahi-Linux-be-done?"]]. 

## Table of Contents
- [SoC blocks](#soc-blocks)
- [M2 devices](#m2-devices)
- [M2 Pro/Max/Ultra devices](#m2-promaxultra-devices)
- [Notes](#notes)

## SoC blocks
These are features/hardware blocks that are present on all devices with the given SoC.

|                  | M2<br>(T8112)        | M2 Pro/Max/Ultra<br>(T602x) |
|------------------|:--------------------:|:---------------------------:|
| DCP              | linux-asahi          | linux-asahi                 |
| USB2 (TB ports)  | linux-asahi          | linux-asahi                 |
| USB3 (TB ports)  | linux-asahi          | linux-asahi                 |
| Thunderbolt      | TBA                  | TBA                         |
| DP Alt Mode      | WIP                  | WIP                         |
| GPU              | linux-asahi          | linux-asahi                 |
| Video Decoder    | WIP                  | WIP                         |
| NVMe             | 5.19                 | 5.19                        |
| PCIe             | 5.16 / 6.4 (dts)     | linux-asahi                 |
| PCIe (GE)        | -                    | TBA                         |
| cpufreq          | 6.2                  | 6.2                         |
| cpuidle          | linux-asahi ([notes](#cpuidle-situation)) | linux-asahi ([notes](#cpuidle-situation)) |
| Suspend/sleep    | linux-asahi          | linux-asahi                 |
| Video Encoder    | WIP                  | WIP                         |
| ProRes Codec     | TBA                  | TBA                         |
| AICv2            | 5.18                 | 5.18                        |
| DART             | 6.3                  | linux-asahi                 |
| PMU              | 6.4                  | 6.4                         |
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


## M2 devices
|                    | MacBook Air<br>(13-inch, 2022) | MacBook Air<br>(15-inch, 2023) | MacBook Pro<br>(13-inch, 2022) | Mac Mini<br>(2023) |
|--------------------|:------------------------------:|:------------------------------:|:------------------------------:|:------------------:|
| Installer          | yes                            | yes                            | yes                            | yes                |
| Devicetree         | 6.4                            | linux-asahi                    | 6.4                            | 6.4                |
| Main display       | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| Keyboard           | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| KB backlight       | 6.4                            | 6.4                            | 6.4                            | -                  |
| Touchpad           | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| Brightness         | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| Battery info       | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| WiFi               | 6.1                            | 6.1                            | 6.1                            | linux-asahi        |
| Bluetooth          | 6.2                            | 6.2                            | 6.2                            | linux-asahi        |
| HDMI Out           | -                              | -                              | -                              | linux-asahi        |
| HDMI audio         | -                              | -                              | -                              | linux-asahi ([notes](#hdmi-audio)) |
| 3.5mm jack output  | linux-asahi                    | linux-asahi                    | linux-asahi                    | linux-asahi        |
| Speakers           | linux-asahi                    | linux-asahi                    | linux-asahi                    | linux-asahi        |
| Microphones        | WIP                            | WIP                            | WIP                            | -                  |
| Webcam             | linux-asahi                    | linux-asahi                    | linux-asahi                    | -                  |
| SD card slot       | -                              | -                              | -                              | -                  |
| 1Gbps Ethernet     | -                              | -                              | -                              | 6.4 (dts)          |
| 10Gbps Ethernet    | -                              | -                              | -                              | 6.4 (dts)          |
| Touch Bar          | -                              | -                              | linux-asahi                    | -                  |
| TouchID            | TBA                            | TBA                            | TBA                            | -                  |

## M2 Pro/Max/Ultra devices
|                    | Mac Mini<br>(2023) | MacBook Pro<br>(14/16-inch, 2023) | Mac Studio<br>(2023) | Mac Pro<br>(2023)    |
|--------------------|:------------------:|:---------------------------------:|:--------------------:|:--------------------:|
| Installer          | yes                | yes                               | yes                  | WIP                  |
| Devicetree         | linux-asahi        | linux-asahi                       | linux-asahi          | linux-asahi          |
| Main display       | -                  | linux-asahi                       | -                    | -                    |
| Keyboard           | -                  | linux-asahi                       | -                    | -                    |
| KB backlight       | -                  | linux-asahi                       | -                    | -                    |
| Touchpad           | -                  | linux-asahi                       | -                    | -                    |
| Brightness         | -                  | linux-asahi                       | -                    | -                    |
| Battery info       | -                  | linux-asahi                       | -                    | -                    |
| WiFi               | linux-asahi        | linux-asahi                       | linux-asahi          | linux-asahi          |
| Bluetooth          | linux-asahi        | linux-asahi                       | linux-asahi          | linux-asahi          |
| HDMI Out           | linux-asahi        | linux-asahi                       | linux-asahi          | linux-asahi          |
| HDMI Audio         | linux-asahi ([notes](#hdmi-audio))| linux-asahi ([notes](#hdmi-audio)) | linux-asahi ([notes](#hdmi-audio)) | WIP |
| 3.5mm jack output  | linux-asahi        | linux-asahi                       | linux-asahi          | linux-asahi          |
| Speakers           | linux-asahi        | linux-asahi                       | linux-asahi          | TBA                  |
| Microphones        | -                  | TBA                               | -                    | -                    |
| Webcam             | -                  | linux-asahi                       | -                    | -                    |
| SD card slot       | -                  | 5.17                              | 5.17                 | 5.17                 |
| 1Gbps Ethernet     | linux-asahi        | -                                 | -                    | -                    |
| 10Gbps Ethernet    | linux-asahi        | -                                 | linux-asahi          | linux-asahi          |
| Touch Bar          | -                  | -                                 | -                    | -                    |
| TouchID            | -                  | TBA                               | TBA                  | TBA                  |

Note: Many peripherals depend on T600x DART, T8112 DART, and PCIe support.


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

### HDMI Audio
A preview of HDMI audio support is available since `asahi-6.8.6-3` for all devices with HDMI port except devices with M1/M2 Ultra. Due to missing user space integration it is displayed as `Analog Output (Built-in Audio Stereo)` or similar. There are still some glitches. The start of audio is sometimes cut off and noise might be heard. It might not not be available although the HDMI display part is working.