---
title: Puesta en Marcha de Linux: Teclado USB
---

# Teclado USB en Linux
* Logré hacer funcionar un teclado USB con un sistema de archivos raíz en ramdisk.
* Arrancando el [kernel Asahi dart/dev](https://github.com/AsahiLinux/linux/tree/dart/dev) con USB3 XHCD, DWC3 y DART, etcétera
 * Puede usar este [archivo de configuración de Linux para M1 MacBook Air con USB](https://github.com/amworsley/asahi-wiki/blob/main/images/config-jannau-iso9660-noR.gz) como base (no habilita el modo gadget)
* Modificando el initrd para que solo ejecute /bin/sh (edite /init)
* Lo arranqué directamente con ```python3.9 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug' Image-dwc3.gz t8103-j274.dtb initrd-be2.gz```
  * Donde Image-dwc3.gz es el kernel Asahi dart/dev, t8103.j274.dtb se construyó con ese kernel, en **linux/arch/arm64/boot/dts/apple/t8103-j274.dtb**, e initrd-be2.gz es el initrd de Debian Bullseye modificado para ejecutar **/bin/sh** después de la configuración.
* Luego utilicé un adaptador de Type-C a Type-A para conectar un teclado USB Dell antiguo y escribir comandos en el /bin/sh en ejecución.
![Linux ejecutándose en un MacBook M1 con entrada mediante teclado USB externo](../assets/linuxOnM1.png)

 * Puede ir un paso más allá e intentar [arrancar desde una unidad USB](linux-bringup-usb.md) 