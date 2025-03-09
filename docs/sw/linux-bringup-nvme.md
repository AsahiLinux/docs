---
title: Linux Bringup: NVME
---

# USB drive boot
## The easy way
* As per [Glanzmann's notes](https://tg.st/u/asahi.txt) fetch a debian bullseye rootfs under MacOS and dd it directly into a newly created nvme partition. 
## The harder way
 * This is done on another Linux machine - uses debian bullseye
### Build your rootfs
* [build your own](https://www.debian.org/releases/stretch/arm64/apds03.html.en)
```
mkdir debinst
sudo debootstrap --arch arm64 --foreign bullseye debinst http://ftp.au.debian.org/debian/
sudo cp /usr/bin/qemu-aarch64-static debinst/usr/bin
```
  * Login via a chroot to a bash prompt:`sudo LANG=C.UTF-8 chroot debinst qemu-aarch64-static /bin/bash`
  * Then complete the 2nd stage `/debootstrap/debootstrap --second-stage`
  * While your there install any other packages you want: `apt install file screenfetch procps`
  * For ssh install an ssh server `apt install openssh-server`
  * Allow root login via ssh by setting `PermitRootLogin yes` via `vi /etc/ssh/sshd_config`
  * Most important set the root password `passwd`
### Install rootfs onto USB drive
  * Plug in your USB drive and create a partition with fdisk (assumes drive is /dev/sdb) `sudo fdisk /dev/sdb`
  * Format partition (assumes it's the first one) `sudo mkfs.ext4 /dev/sdb1`
  * Mount the drive some where like /mnt/img `sudo mount /dev/sdb1 /mnt/img`
  * Install the rootfs you created above onto the drive `sudo cp -a debinst/. /mnt/img`
  * Unmount the drive `sudo umount /mnt/img`
### Boot with USB drive as root
  * Back to [booting over USB cable](linux-bringup.md#running-linux-via-usb-cable)
  * Make sure you have the latest m1n1.macho loaded `python3 proxyclient/tools/chainload.py build/m1n1.macho`
  * Build a kernel with builtin features (check for =m and change to =y in .config)
    * In particular need CONFIG_EXT4_FS=y is needed to boot!
  * Try this [Asahi linux snapshot](https://github.com/amworsley/AsahiLinux/tree/asahi-kbd) and this [config](https://raw.githubusercontent.com/amworsley/asahi-wiki/main/images/config-keyboard+nvme)
  * Then boot the gzipp'ed image with the USB drive. I had to plug the drive in the 2nd USB type-C port on the MBA (MacBook Air) through a Type-C to USB-Type A HUB. 
  * Be-aware when I plugged in a lower speed USB device (keyboard) it reset the HUB and corrupted my USB drive. So don't use a keyboard, a Type-A to Type-C dongle worked fine
  * Over the USB cable load the new kernel and boot with the USB drive as the root filesystem:
```
python3 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/sda1 rootdelay=5 rootfstype=ext4'  Image.gz t8103-j313.dtb
```
  * The root filesystem is in first partition of the drive (/dev/sda1) and it's a MBA (t8103-j313.dtb)
  * If your booting something different check the .dts file in **arch/arm64/boot/dts/apple/** by looking at the value of the **model** field
### Install rootfs in the nvme
 * Under MacOS you need to create some free space as per [Glanzmann's notes](https://tg.st/u/asahi.txt) 
 * Be very careful you know exactly what partition you specify this is just an  **example** your numbers may vary
 * make space - the last number is the space that macos will occupy `diskutil apfs resizeContainer disk0s2 200GB`
 * List the partitions and see where the free space now lies `diskutil list`
 * Allocate a FAT32 partition for your linux rootfs on the NVME from the free space
 * **NOTE** you have to specify the partition **before** the free space `diskutil addPartition disk0s3 FAT32 LB 42.6GB`
 * Boot with the USB ext4 USB drive as root (as above)
 * Use fdisk to confirm which partition is the new FAT32 one (it should have the size you created above too) `fdisk -l /dev/nvme0n1`
 * Once you have confirmed it format it to ext4 `mkfs.ext4 /dev/nvme0n1p4`
 * Mount it `mount /dev/nvme0n1p4 /mnt`
 * Copy your USB drive rootfs into it as before `cp -ax /. /mnt`
 * I believe the -x should prevent the recursive descent into the new filesystem on the nvme
 * Unmount it `umount /mnt`
 * Then try booting via the USB cable with your new root filesystem on the nvme
```
python3 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/nvme0n1p6 rootfstype=ext4' Image.gz t8103-j313.dtb
