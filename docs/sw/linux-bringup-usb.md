---
title: Linux Bringup: USB
---

## root as USB drive
* Inspired by [Alyssa's tomshardware article](https://www.tomshardware.com/news/apple-m1-debian-linux) 
* Make an **arm64** root filesystem as per [debian rootfs](https://www.debian.org/releases/stretch/arm64/apds03.html.en)
* Note: The following is done as root on a debian system:
```
mkdir debinst-buster
debootstrap --arch arm64 --foreign buster debinst-buster http://ftp.au.debian.org/debian/
cp /usr/bin/qemu-aarch64-static debinst-buster/usr/bin
LANG=C.UTF-8 chroot debinst-buster qemu-aarch64-static /bin/bash
```
* In the chroot complete the set up:
```
/debootstrap/debootstrap --second-stage
```
* Install any other packages you want with apt
```
apt install file screenfetch procps openssh-server
```
* Configure the sshd to allow root access and set the password to what you want
```
# Add PermitRootLogin yes
vi /etc/ssh/sshd_config
# Set root's password
passwd
```
* Create an ext4 partition on a USB device (e.g. /dev/sdb in example below)
```
fdisk /dev/sdb
# n => new partition
# w => write it out
```
* Format ext4 filesystem ```mkfs.ext4 /dev/sdb1```
* Install your new rootfs on it (you could have just created the rootfs on the partition.... :-)
```
mount /dev/sdb1 /mnt/img
cp -a debinst-buster/. /mnt/img
umount /mnt/img
```
* Boot up linux with the USB drive plugged in (now should be /dev/sda1). I used a simple USB hub on the 2nd port with a USB keyboard the USB drive plugged in before powering on the Mac.
```
python3.9 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/sda1 rootdelay=5 rootfstype=ext4'  Image-dart-dev.gz t8103-j274-dart-dev.dtb
```
* **Image-dart-dev.gz** - dart/dev branch of the Asahi linux as above
* **t8103-j274-dart-dev.dtb** - the dtb from the above linux
* NO initrd is passed
