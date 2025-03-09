---
title: Linux Bringup: USB Keyboard
---

# Linux USB keyboard
* Got a USB keyboard working with an ramdisk root filesystem.
* By booting the [Asahi dart/dev kernel](https://github.com/AsahiLinux/linux/tree/dart/dev) with USB3 XHCD, DWC3 and DART et cetera 
 * Can use this [Linux config file for M1 MacBook Air with USB](https://github.com/amworsley/asahi-wiki/blob/main/images/config-jannau-iso9660-noR.gz) as a base (doesn't enable gadget mode)
* Modifying the initrd to just run /bin/sh (edit /init) 
* Booted it directly via ```python3.9 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug' Image-dwc3.gz t8103-j274.dtb initrd-be2.gz```
  * Where the Image-dwc3.gz is the Asahi dart/dev kernel, the t8103.j274.dtb built with that kernel, at **linux/arch/arm64/boot/dts/apple/t8103-j274.dtb**, and initrd-be2.gz is the modified debian Bullseye initrd to just run **/bin/sh** after the set up.
* Then I used a Type-C to Type-A adapter to plug in a normal old USB Dell keyboard and enter commands into the /bin/sh running.
![Linux running on M1 macbook with input via external USB keyboard](../assets/linuxOnM1.png)

 * You can go one step further and try [booting a USB drive](linux-bringup-usb.md)
