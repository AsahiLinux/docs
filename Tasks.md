> NOTE: This list is old / unused, see See [[Feature Support]] instead. 

This page lists currently supported features, as well as features still needed to support a "nice" desktop experience on Apple Silicon Macs.

An item being ticked off means that it is, at the very least, supported and available for testing in m1n1 or linux-asahi. Some drivers may still require stabilisation or cleaning up before being submitted upstream. See [[Feature Support]] for details on what has been upstreamed and what has not.

## Research
* [ ] Document SoC memory map and macOS device tree
* [ ] Document AIC

## Early bring-up

* [x] Enable UART on Type-C ports - see [[HW:USB-PD]] and [vdmtool](https://github.com/AsahiLinux/vdmtool) or [macvdmtool](https://github.com/AsahiLinux/macvdmtool).
* [x] Test code execution
* [x] Build a UART-based RPC/loader tool (m1n1)

## Bootloader (m1n1)
* [x] FB/Logo
* [x] MMU
* [x] Text console
* [x] USB device (dwc3)
* [x] Decompression
* [x] SMP spin-up
* [x] Handle CPU chicken bits
* [x] ADT parsing
* [x] Linux kernel booting
  * [x] UP
  * [x] SMP
  * [x] FDT modification
  * [x] Initramfs support
* [ ] Storage driver
* [ ] Filesystems
* [ ] Config file
* [ ] Boot / kernel selection menu


## Kernel bring-up

* [x] Create an initial devicetree for Linux to use
* [x] Add support for AIC to the kernel
* [x] Test initial kernel booting

## Drivers
* [x] UART
* [ ] USB
  * [x] USB2
  * [ ] USB3
* [x] PCIe
* [x] SSD
* [ ] Type-C/PD
  * [ ] Host / sink mode
  * [ ] PD negotiation
  * [ ] Plug detect / extcon
* [ ] Thunderbolt
* [ ] Camera
* [x] Wi-Fi
* [ ] Bluetooth
* [ ] Sound
  * [ ] 3.5mm jack
  * [ ] Built-in speaker(s)
* [x] Ethernet
* [x] Keyboard
  * [x] Keyboard (duh)
  * [ ] Keyboard backlight
  * [x] Special keys (brightness etc.)
* [ ] Touchpad
  * [x] Basic mouse functionality
  * [x] Multi-finger gestures
  * [ ] Force Touch
* [ ] Touch Bar
  * [ ] Display
  * [ ] Touchscreen
* [ ] Battery/PMIC
  * [ ] Battery % readout
  * [ ] Charging monitor (V/A/W)
  * [ ] Power usage monitor
* [ ] TouchID
* [ ] Temperature sensor(s)

## SOC
### GPU
* [ ] Hardware interface & init reverse engineering
* [ ] Shader ISA reverse engineering
* [ ] Command stream reverse engineering
* [ ] Kernel driver
* [ ] Mesa driver
### SEP
* [ ] Secure Enclave Processor
### ISP
* [ ] Image Signal Processor
### DSP
* [ ] Digital Signal Processor
### NPU (ANE)
* [ ] Neural Processing Unit (Apple Neural Engine)
### Video codec
* [ ] Video encoder/decoder unit
### Unified Memory Controller
* [ ] Unified Memory Controller

## Power management
Lots of things here, including processor idling and general DVFS for all in-SoC & external peripherals.

