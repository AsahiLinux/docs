This page details currently supported features on all extant Apple Silicon Macs, as well as their upstream status. Kernel versions indicate when each feature was upstreamed. Versions in parentheses indicate when features currently in review are scheduled/likely to be scheduled for merging upstream.

# M1 (T8103)
Devices based on the Apple M1 SoC, released in 2020.

## Common features
These features are common to all Apple Silicon devices with the M1 (T8103) SoC.
| Feature | Support |
|---------|---------|
| Bringup | 5.13 |
| ARM PMU | linux-asahi (5.18) |
| cpufreq | linux-asahi |
| CPU power gating | in review |
| System sleep | in review |
| UART | 5.13 |
| Watchdog | linux-asahi (5.17) |
| PCIe | 5.16 |
| I<sup>2</sup>C | 5.16 |
| GPIO | 5.16 |
| USB-PD | 5.16 |
| Power management | linux-asahi (5.17) |
| NVMe | linux-asahi |
| SPI | linux-asahi |
| SPI NOR | linux-asahi |
| Primary display (SimpleFB) | 5.13 |
| Primary display (SimpleDRM) | linux-asahi (5.17) |
| DCP | needs cleanup |
| DP Alt Mode | unsupported |
| Thunderbolt | unsupported |
| USB2 (via TB ports) | linux-asahi (5.17) |
| USB3 (via TB ports) | unsupported |
| WiFi | linux-asahi |
| Bluetooth | unsupported |
| SMC | linux-asahi |
| 3.5mm jack | linux-asahi [line out only] |
| Sound capture | unsupported |
| ARM SPMI | linux-asahi |
| RTC | linux-asahi |
| SEP | unsupported |
| TouchID | unsupported |
| AVD | unsupported |
| AVE | unsupported |
| GPU | unsupported |
| ANE | unsupported |

## Mac Mini (M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Device tree | 5.13 |
| USB-A ports | 5.16 |
| HDMI Out | see M1 primary display |
| 1Gbps Ethernet | 5.16 |
| 10Gbps Ethernet | linux-asahi (5.17) |
| Internal Speaker | linux-asahi |

## MacBook Pro (13-inch, M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Device tree | linux-asahi (5.17) |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| Touch Bar | unsupported |
| Keyboard Backlight | unsupported |
| Webcam | unsupported |
| Internal speakers | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | unsupported |

## MacBook Air (13-inch, M1, 2020)
| Feature | Support Level |
|---------|---------------|
| Device tree | linux-asahi (5.17) |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| Keyboard Backlight | unsupported |
| Webcam | unsupported |
| Internal speakers | unsupported |
| Battery/charge monitoring | linux-asahi |
| Display brightness | unsupported |

## iMac (M1, 2020)
| Feature | Support Level |
|---------|---------------|
| USB Type-C Ports | unsupported |
| 1Gbps Ethernet | 5.16 |
| Webcam | unsupported |
| Internal speakers | unsupported |
| Display brightness | unsupported |


# M1 Pro/Max (T6000/T6001)
Devices based on the Apple M1 Pro and Max SoCs, released late 2021.

## Common Features
These features are common to all M1 Pro/Max devices
| Feature | Support |
|---------|---------|
| Bringup | 5.17 |
| ARM PMU | linux-asahi (5.18) |
| cpufreq | linux-asahi |
| CPU power gating | in review |
| System sleep | in review |
| UART | 5.13 |
| Watchdog | linux-asahi (5.17) |
| PCIe | 5.16 |
| I<sup>2</sup>C | 5.16 |
| GPIO | 5.16 |
| USB-PD | 5.16 |
| Power management | linux-asahi (5.17) |
| NVMe | linux-asahi |
| SPI | linux-asahi |
| SPI NOR | linux-asahi |
| Primary display (SimpleFB) | 5.13 |
| Primary display (SimpleDRM) | linux-asahi (5.17) |
| DCP | needs cleanup |
| DP Alt Mode | unsupported |
| Thunderbolt | unsupported |
| USB2 (via TB ports) | linux-asahi (5.17) |
| USB3 (via TB ports) | unsupported |
| WiFi | linux-asahi |
| Bluetooth | unsupported |
| SMC | linux-asahi |
| 3.5mm jack | unsupported |
| Sound capture | unsupported |
| ARM SPMI | linux-asahi |
| RTC | linux-asahi |
| SEP | unsupported |
| TouchID | unsupported |
| AVD | unsupported |
| AVE | unsupported |
| GPU | unsupported |
| ANE | unsupported |
| Apple ProRes | unsupported |

## MacBook Pro (14/16-inch, M1 Pro/Max, 2021)
| Feature | Support Level |
|---------|---------------|
| Device tree | linux-asahi (5.17) |
| MagSafe connector | 5.16 |
| SPI HID | linux-asahi |
| Keyboard | linux-asahi |
| Touchpad | linux-asahi |
| Keyboard Backlight | unsupported |
| Webcam | unsupported |
| Internal speakers | unsupported |
| HDMI Out | unsupported |
| SD Card Reader | linux-asahi (5.17) |
| Battery/charge monitoring | linux-asahi |
| Display brightness | unsupported |
