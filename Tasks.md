## Research
* [ ] Document SoC memory map and macOS device tree
* [ ] Document AIC

## Early bring-up

* [x] Enable UART on Type-C ports - see [[HW:USB-PD]] and [vdmtool](https://github.com/AsahiLinux/vdmtool).
* [x] Test code execution
* [x] Build a UART-based RPC/loader tool (m1n1)

## Bootloader (m1n1)
* [x] FB/Logo
* [ ] MMU
* [ ] Text console
* [ ] USB device (dwc3)
* [x] Decompression
* [ ] SMP spin-up
* [ ] Handle CPU chicken bits
* [x] ADT parsing
* [ ] Linux kernel booting
  * [ ] UP
  * [ ] SMP
  * [ ] FDT modification
  * [ ] Initramfs support
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
  * [ ] USB2
  * [ ] USB3
* [ ] PCIe
* [ ] SSD
* [ ] Type-C/PD
  * [ ] Host / sink mode
  * [ ] PD negotiation
  * [ ] Plug detect / extcon
* [ ] Thunderbolt
* [ ] Camera
* [ ] Wi-Fi
* [ ] Bluetooth
* [ ] Sound
  * [ ] 3.5mm jack
  * [ ] Built-in speaker(s)
* [ ] Ethernet
* [ ] Keyboard
  * [ ] Keyboard (duh)
  * [ ] Keyboard backlight
  * [ ] Special keys (brightness etc.)
* [ ] Touchpad
  * [ ] Basic mouse functionality
  * [ ] Multi-finger gestures
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
