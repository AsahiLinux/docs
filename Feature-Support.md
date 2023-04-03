This page details currently supported features on all extant Apple Silicon Macs, as well as their upstream status. The tables can
be interpreted as follows:

* **Kernel release, *e.g.* 6.0:** the feature was incorporated upstream as of this release
* **linux-asahi (kernel release):** the feature is stable, available for use in `linux-asahi`, and should be upstream by the release indicated
* **linux-asahi**: the feature is (mostly) stable and available for use in `linux-asahi`
* **asahi-edge**: the feature is available for wider testing in the `linux-asahi-edge` package in the linux-asahi Linux distribution
* **WIP**: Development work on the feature is actively progressing, however is not yet ready for wider testing, use or distribution
* **TBA**: Active work on this feature is not being undertaken at this time

## Table of Contents
- [Common SoC Features](#common-soc-features)
- **M1 Series (M1, M1 Pro, M1 Max, M1 Ultra)**
  * [M1 device-specific support](#m1-series-device-specific-support)
- **M2 Series (M2, M2 Pro, M2 Max)**
  * [M2 device-specific support](#m2-series-device-specific-support)

## Common SoC Features
These are features/hardware blocks that are present on all devices with the given SoC.

|                  | M1<br>(T8103)        | M1 Pro/Max/Ultra<br>(T600x) | M2<br>(T8112)        | M2 Pro/Max<br>(T602x) |
|------------------|:--------------------:|:---------------------------:|:--------------------:|:--------------------:|
| DCP              | asahi-edge           | asahi-edge                  | asahi-edge           | WIP                  |
| USB2 (TB ports)  | linux-asahi          | linux-asahi                 | linux-asahi          | TBA                  |
| USB3 (TB ports)  | linux-asahi          | linux-asahi                 | linux-asahi          | TBA                  |
| Thunderbolt      | WIP                  | WIP                         | TBA                  | TBA                  |
| DP Alt Mode      | WIP                  | WIP                         | WIP                  | TBA                  |
| GPU              | asahi-edge           | asahi-edge                  | asahi-edge           | TBA                  |
| Video Decoder    | TBA                  | TBA                         | TBA                  | TBA                  |
| NVMe             | 5.19                 | 5.19                        | 5.19                 | 5.19                 |
| PCIe             | 5.16                 | 5.16                        | linux-asahi          | linux-asahi          |
| cpufreq          | 6.2                  | 6.2                         | linux-asahi          | linux-asahi          |
| cpuidle          | see notes            | see notes                   | see notes            | see notes            |
| Suspend/sleep    | asahi-edge           | asahi-edge                  | asahi-edge           | TBA                  |
| Video Encoder    | TBA                  | TBA                         | TBA                  | TBA                  |
| ProRes Codec     | -                    | TBA                         | TBA                  | TBA                  |
| AICv2            | -                    | 5.18                        | 5.18                 | 5.18                 |
| DART             | 5.15                 | 6.1                         | linux-asahi          | linux-asahi          |
| PMU              | 5.18                 | 5.18                        | TBA                  | TBA                  |
| UART             | 5.13                 | 5.13                        | 5.13                 | 5.13                 |
| Watchdog         | 5.17                 | 5.17                        | 5.17                 | 5.17                 |
| I<sup>2</sup>C   | 5.16                 | 5.16                        | 5.16                 | 5.16                 |
| GPIO             | 5.16                 | 5.16                        | 5.16                 | 5.16                 |
| USB-PD           | 5.16                 | 5.16                        | 5.16                 | 5.16                 |
| MCA              | 6.1                  | 6.1                         | linux-asahi          | linux-asahi          |
| SPI              | linux-asahi          | linux-asahi                 | linux-asahi          | linux-asahi          |
| SPI NOR          | linux-asahi          | linux-asahi                 | linux-asahi          | linux-asahi          |
| SMC              | linux-asahi          | linux-asahi                 | linux-asahi          | linux-asahi          |
| SPMI             | linux-asahi          | linux-asahi                 | linux-asahi          | linux-asahi          |
| RTC              | linux-asahi          | linux-asahi                 | linux-asahi          | linux-asahi          |
| SEP              | WIP                  | WIP                         | WIP                  | WIP                  |
| Neural Engine    | WIP                  | WIP                         | WIP                  | WIP                  |
  
  
## M1 series (M1, M1 Pro, M1 Max, M1 Ultra)

### M1 series device-specific support
|                    | Mac Mini<br>(2020)   | MacBook Pro<br>(13-inch, 2020) | MacBook Air<br>(2020) | iMac<br>(2021)       | MacBook Pro<br>(14/16-inch, 2021) | Mac Studio<br>(2022) |
|--------------------|:--------------------:|:------------------------------:|:---------------------:|:--------------------:|:---------------------------------:|:--------------------:|
| Installer          | yes                  | yes                            | yes                   | yes                  | yes                               | yes                  |
| Devicetree         | 5.13                 | 5.17                           | 5.17                  | 5.17                 | 6.2                               | 6.2                  |
| Main display       | 5.17                 | 5.17                           | 5.17                  | 5.17                 | 5.17                              | 5.17                 |
| Brightness         | -                    | asahi-edge                     | asahi-edge            | asahi-edge           | asahi-edge                        | -                    |
| HDMI Out           | 5.13                 | -                              | -                     | -                    | WIP                               | 6.2                  |
| Keyboard           | -                    | linux-asahi                    | linux-asahi           | -                    | linux-asahi                       | -                    |
| KB backlight       | -                    | asahi-edge                     | asahi-edge            | -                    | asahi-edge                        | -                    |
| Touchpad           | -                    | linux-asahi                    | linux-asahi           | -                    | linux-asahi                       | -                    |
| Battery info       | -                    | linux-asahi                    | linux-asahi           | -                    | linux-asahi                       | -                    |
| USB-A ports        | 5.16                 | -                              | -                     | -                    | -                                 | linux-asahi          |
| WiFi               | 6.1                  | 6.1                            | 6.1                   | 6.1                  | 6.1                               | 6.1                  |
| Bluetooth          | 6.2                  | 6.2                            | 6.2                   | 6.2                  | 6.2                               | 6.2                  |
| 3.5mm jack         | linux-asahi          | linux-asahi                    | linux-asahi           | linux-asahi          | linux-asahi                       | linux-asahi          |
| Speakers           | linux-asahi          | WIP                            | WIP                   | WIP                  | WIP                               | WIP                  | 
| SD card slot       | -                    | -                              | -                     | -                    | 5.17                              | 5.17                 |
| 1Gbps Ethernet     | 5.16                 | -                              | -                     | -                    | -                                 | -                    |
| 10Gbps Ethernet    | 5.17                 | -                              | -                     | -                    | -                                 | linux-asahi          |
| Microphones        | WIP                  | WIP                            | WIP                   | WIP                  | WIP                               | -                    |
| Webcam             | -                    | TBA                            | TBA                   | TBA                  | TBA                               | -                    |
| Touch Bar          | -                    | TBA                            | -                     | -                    | -                                 | -                    |
| TouchID            | TBA                  | TBA                            | TBA                   | TBA                  | TBA                               | TBA                  |


## M2 Series (M2, M2 Pro, M2 Max)
### M2 series device-specific support
|                    | MacBook Air<br>(2022) | MacBook Pro<br>(13-inch, 2022) | Mac Mini<br>(2023) | MacBook Pro<br>(14/16-inch, 2023) |
|--------------------|:---------------------:|:------------------------------:|:------------------:|:---------------------------------:|
| Installer          | yes                   | yes                            | no                 | no                                |
| Devicetree         | linux-asahi           | linux-asahi                    | WIP                | TBA                               |
| Main display       | linux-asahi           | linux-asahi                    | WIP                | TBA                               |
| Keyboard           | linux-asahi           | linux-asahi                    | -                  | linux-asahi                       |
| KB backlight       | asahi-edge            | asahi-edge                     | -                  | TBA                               |
| Touchpad           | linux-asahi           | linux-asahi                    | -                  | linux-asahi                       |
| Brightness         | asahi-edge            | asahi-edge                     | -                  | TBA                               |
| Battery info       | linux-asahi           | linux-asahi                    | -                  | linux-asahi                       |
| WiFi               | 6.1                   | 6.1                            | TBA                | TBA                               |
| Bluetooth          | 6.2                   | 6.2                            | TBA                | TBA                               |
| HDMI Out           | -                     | -                              | WIP                | TBA                               |
| 3.5mm jack         | linux-asahi           | linux-asahi                    | TBA                | TBA                               |
| Speakers           | WIP                   | WIP                            | TBA                | TBA                               |
| Microphones        | WIP                   | WIP                            | TBA                | TBA                               |
| Webcam             | TBA                   | TBA                            | TBA                | TBA                               |
| SD card slot       | -                     | -                              | -                  | 5.17                              |
| 1Gbps Ethernet     | -                     | -                              | TBA                | -                                 |
| 10Gbps Ethernet    | -                     | -                              | TBA                | -                                 |
| Touch Bar          | -                     | TBA                            | -                  | -                                 |
| TouchID            | TBA                   | TBA                            | TBA                | TBA                               |

Note: Many peripherals depend on T600x DART, T8112 DART, and PCIe support.

## Notes

### Power
Some power management functionality on these machines is tied to PSCI. These machines do not support the
normal way the kernel handles PSCI calls. We could implement this functionality as a one-off ugly driver,
but this would duplicate a lot of functionality that already exists in the kernel, and likely would not
fly upstream. Instead, changes to the kernel's PSCI interface have been proposed which would provide a generic
method for any future machines with similar designs. Until this discussion has resolved, these features
cannot be implemented.
