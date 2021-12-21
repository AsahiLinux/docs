# Linux USB keyboard
* Got a USB keyboard working with an ramdisk root filesystem.
* By booting the [Asahi dart/dev kernel](https://github.com/AsahiLinux/linux/tree/dart/dev) with USB3 XHCD, DWC3 and DART et cetera 
 * Can use this [Linux config file for M1 MacBook Air with USB](https://github.com/amworsley/asahi-wiki/blob/main/images/config-jannau-iso9660-noR.gz) as a base (doesn't enable gadget mode)
* Modifying the initrd to just run /bin/sh (edit /init) 
* Booted it directly via ```python3.9 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug' Image-dwc3.gz t8103-j274.dtb initrd-be2.gz```
  * Where the Image-dwc3.gz is the Asahi dart/dev kernel, the t8103.j274.dtb built with that kernel, at **linux/arch/arm64/boot/dts/apple/t8103-j274.dtb**, and initrd-be2.gz is the modified debian Bullseye initrd to just run **/bin/sh** after the set up.
* Then I used a Type-C to Type-A adapter to plug in a normal old USB Dell keyboard and enter commands into the /bin/sh running.
![Linux running on M1 macbook with input via external USB keyboard](https://github.com/amworsley/asahi-wiki/blob/main/images/linuxOnM1.png)
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
