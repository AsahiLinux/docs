## Research
* [ ] Document SoC memory map and macOS device tree
* [ ] Document AIC

## Early bring-up

* [x] Enable UART on Type-C ports - see [[HW:USB-PD]] and [vdmtool](https://github.com/AsahiLinux/vdmtool).
* [ ] Test code execution
* [ ] Build a UART-based RPC/loader tool
* [ ] Build a USB device (dwcusb)-based RPC/loader tool

## Kernel bring-up

* [ ] Create an initial devicetree for Linux to use
* [ ] Add support for AIC to the kernel
* [ ] Test initial kernel booting

## Drivers
* [ ] UART
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
* [ ] SEP
* [ ] Battery/PMIC
  * [ ] Battery % readout
  * [ ] Charging monitor (V/A/W)
  * [ ] Power usage monitor
* [ ] TouchID
* [ ] Temperature sensor(s)

## GPU
* [ ] Hardware interface & init reverse engineering
* [ ] Shader ISA reverse engineering
* [ ] Command stream reverse engineering
* [ ] Kernel driver
* [ ] Mesa driver

## Power management
Lots of things here, including processor idling and general DVFS for all in-SoC & external peripherals.
