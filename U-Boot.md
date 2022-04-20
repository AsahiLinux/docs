U-Boot in combination with m1n1 and device trees can be used to load grub or
any other EFI boot loader from vfat ESP partition located on the internal NVMe drive
or an USB stick. Grub can then load a Linux kernel and initrd to boot Linux. U-Boot will try to load **EFI/BOOT/BOOTAA64.EFI**.
Make sure that grub or any other boot loader is located there.

# Tripwires

The USB-A ports on the Mac mini will not work in U-Boot and Grub. The two additional USB-3 ports on the iMac 4-port model also don't work.

# Prerequisite: Asahi Installer

Run the Asahi Installer and Select UEFI environment only (m1n1 + U-Boot + ESP)
```
curl -L https://alx.sh | sh
```

# Building
See
https://git.zerfleddert.de/cgi-bin/gitweb.cgi/m1-debian/blob_plain/refs/heads/master:/bootstrap.sh
in the functions build_linux, build_m1n1, build_uboot.

# Binary

Are included in the Asahi installer.

# Installing
Copy it to the ESP partition to m1n1/boot.bin.

# Boot from USB

When U-Boot loads it gives you two seconds to interrupt the startup by pressing
any key. The following command can be used to boot via USB:

```
run bootcmd_usb0
```

# Other useful commands

```
boot
reset
poweroff
ls nvme 0:4 /
```
