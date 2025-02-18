This page details currently supported features on all M1 series (M1, M1 Pro, M1 Max, M1 Ultra) Apple Silicon Macs, as well as
their progress towards being upstreamed. The tables herein can be interpreted as follows:

* **Kernel release, *e.g.* 6.0:** the feature was incorporated upstream as of this release
* **linux-asahi (kernel release):** the feature is stable, available for use in Fedora Asahi Remix, and should be upstream by the release indicated
* **linux-asahi**: the feature is (mostly) stable and available for use in Fedora Asahi Remix 
* **WIP**: Development work on the feature is actively progressing, however is not yet ready for wider testing, use or distribution
* **TBA**: Active work on this feature is not being undertaken at this time

If a feature is not ready, then there is no estimation on when it will be ready. [Please do not ask for estimations in support channels (e.g. IRC)](When-will-Asahi-Linux-be-done.md).

## Table of Contents
- [SoC blocks](#soc-blocks)
- [M1 devices](#m1-devices)
- [M1 Pro/Max/Ultra devices](#m1-promaxultra-devices)
- [Notes](#notes)

## SoC Blocks
These are features/hardware blocks that are present on all devices with the given SoC.

|                  | M1<br>(T8103)        | M1 Pro/Max/Ultra<br>(T600x) |
|------------------|:--------------------:|:---------------------------:|
| DCP              | linux-asahi          | linux-asahi                 |
| USB2 (TB ports)  | linux-asahi          | linux-asahi                 |
| USB3 (TB ports)  | linux-asahi          | linux-asahi                 |
| Thunderbolt      | WIP                  | WIP                         |
| DP Alt Mode      | WIP                  | WIP                         |
| GPU              | linux-asahi          | linux-asahi                 |
| Video Decoder    | WIP                  | WIP                         |
| NVMe             | 5.19                 | 5.19                        |
| PCIe             | 5.16                 | 5.16                        |
| PCIe (GE)        | -                    | -                           |
| cpufreq          | 6.2                  | 6.2                         |
| cpuidle          | linux-asahi ([notes](#cpuidle-situation)) | ([notes](#cpuidle-situation)) |
| Suspend/sleep    | linux-asahi          | linux-asahi                 |
| Video Encoder    | WIP                  | WIP                         |
| ProRes Codec     | -                    | TBA                         |
| AICv2            | -                    | 5.18                        |
| DART             | 5.15                 | 6.1                         |
| PMU              | 5.18                 | 5.18                        |
| UART             | 5.13                 | 5.13                        |
| Watchdog         | 5.17                 | 5.17                        |
| I<sup>2</sup>C   | 5.16                 | 5.16                        |
| GPIO             | 5.16                 | 5.16                        |
| USB-PD           | 5.16                 | 5.16                        |
| MCA              | 6.1                  | 6.1                         |
| SPI              | linux-asahi          | linux-asahi                 |
| SPI NOR          | linux-asahi          | linux-asahi                 |
| SMC              | linux-asahi          | linux-asahi                 |
| SPMI             | linux-asahi          | linux-asahi                 |
| RTC              | linux-asahi          | linux-asahi                 |
| SEP              | WIP                  | WIP                         |
| Neural Engine    | out of tree ([notes](#ane-driver)) | ([notes](#ane-driver)) |


## M1 devices
|                    | Mac Mini<br>(2020)   | MacBook Pro<br>(13-inch, 2020) | MacBook Air<br>(2020) | iMac<br>(2021)       |
|--------------------|:--------------------:|:------------------------------:|:---------------------:|:--------------------:|
| Installer          | yes                  | yes                            | yes                   | yes                  |
| Devicetree         | 5.13                 | 5.17                           | 5.17                  | 5.17                 |
| Main display       | 5.17                 | 5.17                           | 5.17                  | 5.17                 |
| Brightness         | -                    | linux-asahi                    | linux-asahi           | linux-asahi          |
| HDMI Out           | 5.13                 | -                              | -                     | -                    |
| HDMI Audio         | linux-asahi ([notes](#hdmi-audio)) | -                | -                     | -                    |
| Keyboard           | -                    | linux-asahi                    | linux-asahi           | -                    |
| KB backlight       | -                    | 6.4                            | 6.4                   | -                    |
| Touchpad           | -                    | linux-asahi                    | linux-asahi           | -                    |
| Battery info       | -                    | linux-asahi                    | linux-asahi           | -                    |
| USB-A ports        | 5.16                 | -                              | -                     | -                    |
| WiFi               | 6.1                  | 6.1                            | 6.1                   | 6.1                  |
| Bluetooth          | 6.2                  | 6.2                            | 6.2                   | 6.2                  |
| 3.5mm jack         | linux-asahi          | linux-asahi                    | linux-asahi           | linux-asahi          |
| Speakers           | linux-asahi ([notes](#speakers)) | linux-asahi ([notes](#speakers)) | linux-asahi ([notes](#speakers)) | TBA                  | 
| SD card slot       | -                    | -                              | -                     | -                    |
| 1Gbps Ethernet     | 5.16                 | -                              | -                     | 5.17                 |
| 10Gbps Ethernet    | 5.17                 | -                              | -                     | -                    |
| Microphones        | -                    | WIP                            | WIP                   | WIP                  |
| Webcam             | -                    | linux-asahi                    | linux-asahi           | linux-asahi          |
| Touch Bar          | -                    | linux-asahi                    | -                     | -                    |
| TouchID            | TBA                  | TBA                            | TBA                   | TBA                  |

## M1 Pro/Max/Ultra devices
|                    | MacBook Pro<br>(14/16-inch, 2021) | Mac Studio<br>(2022) |
|--------------------|:---------------------------------:|:--------------------:|
| Installer          | yes                               | yes                  |
| Devicetree         | 6.2                               | 6.2                  |
| Main display       | 5.17                              | 5.17                 |
| Brightness         | linux-asahi                       | -                    |
| HDMI Out           | linux-asahi (13.5 FW only)        | 6.2                  |
| HDMI Audio         | linux-asahi ([notes](#hdmi-audio)) | linux-asahi ([notes](#hdmi-audio)) |
| Keyboard           | linux-asahi                       | -                    |
| KB backlight       | 6.4                               | -                    |
| Touchpad           | linux-asahi                       | -                    |
| Battery info       | linux-asahi                       | -                    |
| USB-A ports        | -                                 | linux-asahi          |
| WiFi               | 6.1                               | 6.1                  |
| Bluetooth          | 6.2                               | 6.2                  |
| 3.5mm jack         | linux-asahi                       | linux-asahi          |
| Speakers           | linux-asahi ([notes](#speakers))  | linux-asahi ([notes](#speakers)) |
| SD card slot       | 5.17                              | 5.17                 |
| 1Gbps Ethernet     | -                                 | -                    |
| 10Gbps Ethernet    | -                                 | linux-asahi          |
| Microphones        | WIP                               | -                    |
| Webcam             | linux-asahi                       | -                    |
| Touch Bar          | -                                 | -                    |
| TouchID            | TBA                               | TBA                  |


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

### Speakers
The speakers are enabled with separate patches due to a [lsp-plugins bug](https://github.com/lsp-plugins/lsp-dsp-lib/pull/20). The bug causes full-scale artifacts which could potentially damage the speakers. This fix was included in lsp-plugins release [1.0.20](https://github.com/lsp-plugins/lsp-dsp-lib/releases/tag/1.0.20).

### HDMI Audio
A preview of HDMI audio support is available since `asahi-6.8.6-3` for all devices with HDMI port except devices with M1/M2 Ultra. Due to missing user space integration it is displayed as `Analog Output (Built-in Audio Stereo)` or similar. There are still some glitches. The start of audio is sometimes cut off and noise might be heard. It might not not be available although the HDMI display part is working.
