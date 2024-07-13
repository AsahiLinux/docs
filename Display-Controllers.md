M series of chips have two kinds of display controllers, `dcp` and `dcpext`. Both kinds support
- DP 1.4 (4 lanes) with DSC. No MST!
- HDMI via dp2hdmi converter. See below for routing restrictions.
- USB-C ports: DP altmode, or USB4 tunneling with 2 controllers max per port. See below for routing restrictions.

Controller-specific information:
| Type | Mode limits |
| - | - |
| `dcp` | 5K, 60Hz, 10bpp (Apple-provided information, not tested) |
| `dcpext` | 6K, 60Hz, 10bpp (Apple-provided information, not tested) |

Family-specific information:
| Family | Notes |
| - | - |
| M1 | `dcp` can only be routed to internal display and HDMI, `dcpext` can only be routed to USB-C |
| M2 and later | `dcp` can be routed everywhere (internal display, HDMI and USB-C), `dcpext` can be routed to HDMI and USB-C |

SoC-specific information:
| SoC | Number of `dcp` | Number of `dcpext` | Notes |
| - | - | - | - |
| M1 | 1 | 1 | |
| M1 Pro | 1 | 2 | |
| M1 Max | 1 | 4 |
| M1 Ultra | 1 | 8 | There are no Ultra devices with internal display. `dcp` is disabled on one of the dies, another `dcp` is routed to HDMI |
| M2 | 1 | 1
| M2 Pro | 1 | 2
| M2 Max | 1 | 4
| M2 Ultra | 0 | 8 | There are no Ultra devices with internal display. `dcp` on both dies are disabled |
| M3 | 1 | 1 |
| M3 Pro | 1 | 2 |
| M3 Max | 1 | 4 |
| M4 (tentative) | 1 | 2 |

