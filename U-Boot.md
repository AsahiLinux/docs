U-Boot in combination with m1n1 and device trees can be used to load grub or
any other efi boot loader from vfat esp partition located on the internal NVMe drive
or an USB stick. Grub can then load a Linux kernel and initird to boot Linux. U-Boot will try to load **EFI/BOOT/BOOTAA64.EFI**.
Make sure that grub or any other boot loader is located there.

# Tripwires

The USB-a ports on the mac mini will not work in u-boot and grub. The two additional USB-3 ports on the iMac 4 port model also don't work.

# Prerequisit: Asahi Installer

Run the Asahi Installer and Select UEFI environment only (m1n1 + U-Boot + ESP)
```
curl -L https://alx.sh | sh
```

# Building
See
https://git.zerfleddert.de/cgi-bin/gitweb.cgi/m1-debian/blob_plain/refs/heads/master:/bootstrap.sh
in the fuctions build_linux, build_m1n1, build_uboot.

# Binary

Are included in the asahi installer.

# Installing
Copy it to the esp partition to m1n1/boot.bin.

# Boot from USB

When U-Boot loads it gives you two seconds to interrupt the startup by pressing
any key. The following command can be used to boot via usb:

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
