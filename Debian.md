This pages explains how to install Debian using three different methods: Debian Installer, livesystem and disk dump.

# Supported systems
The approach below uses the bootchain m1n1+dtbs+u-boot and than grub. This is only available on the models in the following table. If you
have a more recent model, you can use a tethered boot described here [succinct developerquickstart](https://tg.st/u/asahi.txt). You can also
concat the kernel directly to m1n1 and have  a system that boots by itself, but then you won't have internal wifi until marcan has pushed the SMC branch and kernel updates are painful because you have to boot in 1tr and 'kmutil' a new boot object.

| Marketing name | Device | Product | SoC |
| -------------- | ------ | ------- | --- |
| Mac mini (M1,2020) | Macmini9,1 | J274AP | T8103
| MacBook Pro (13-inch, M1, 2020) | MacBookPro17,1 | J293AP | T8103
| MacBook Air (M1, 2020) | MacBookAir10,1 | J313AP | T8103
| iMac (24-inch (4-ports), M1, 2021) | iMac21,1 | J456AP | T8103
| iMac (24-inch (2-ports), M1, 2021) | iMac21,2  | J457AP | T8103

# Artefacts
If you don't want to use the prebuild artefacts, you can build them yourself using the bootstrap.sh script found in [Glanzmanns m1-debian script repository](https://git.zerfleddert.de/cgi-bin/gitweb.cgi/m1-debian)

# Debian Installer
[Video Recording](https://tg.st/u/m1-d-i.mp4)

* Prerequisits

    * USB Stick. this is what this guide assumes, but it is also possible to run the Debian installer from another PC using m1n1 chainloading. But if you know how to do that, you probably don't need this guide.
    * If possible us an Ethernet Dongle, less typing.

* Create USB Stick with a single vfat partition on it and untar the modified Debian installer on it. On Linux you would use the following:

```
# Identify the usb stick device
lsblk
DEVICE=/dev/sdX
parted -a optimal $DEVICE mklabel msdos
parted -a optimal $DEVICE mkpart primary fat32 2048s 100%
mkfs.vfat ${DEVICE}1

mount /dev/sdX1 /mnt
cd /mnt
curl -sL https://tg.st/u/m1-d-i.tar | tar -C /mnt -xf -
umount /mnt
```

* Boot into MacOS, capture the firmware and copy it to the usb stick, if you want to install via wifi, or elsewhere

```
curl -sL tg.st/u/fwx.sh | sh
```

* Follow the [U-Boot Wiki Entry](https://github.com/AsahiLinux/docs/wiki/U-Boot) to make space, setup a 12.1 stub partition using the asahi installer and install u-boot.

* Reboot with the USB stick connected, the Debian installer should automatically start, if it doesn't load the kernel and initrd manually, you can use tab. For x try 0,1,2,...

```
linux (hdX,msdos1)/vmlinuz expert
initrd (hd0,msdos1)/initrd.gz
boot
```

* If you need wifi, on the first installer page press **Fn + Option + F2** to change to the second terminal, press **return** to activate the console, and issue the following commands to configure wifi

```
# change the ssid and psk
nano /etc/wpa.conf
rmmod brcmfmac
rmmod brcmutil
mount /dev/sda1 /mnt
tar -C /lib/firmware/ -xf /mnt/linux-firmware.tar
umount /mnt
modprobe brcmfmac
vim /etc/wpa.conf
wpa_supplicant -i <interface> -c /etc/wpa.conf
# If WPA supplicant does not associate, than run rerun the
# rmmod, modprobe, and wpa_supplicant commands until it does.
# I always had to. No idea why.
```

* Once wifi is associated switch back to the primary console by pressing **Fn + Option + F1**.

* Follow the installer along until you end up in the partitioning menu

    * Create one 256M EFI system partition. 512M and 1G partitions fail with an error about wrong clustersize.
    * Create another partition for root

* When you get an error about grub failing, switch to the third console by pressing **Fn + Option + F3**, press **return** to active the console, and issue the following commands:

```
# Switch into the system that is being installed
cd /target
chroot . bin/bash
# Install the kernel
wget https://tg.st/u/k.deb
dpkg -i k.deb
# Fix grub
# We deinstall grub-efi-arm64-signed- because it creates a file fbaa64.efi
# which makes u-boot hang.
apt-get install grub-efi grub-efi-arm64-signed-
grub-install --target=arm64-efi --efi-directory=/boot/efi --removable
update-grub
# Set removable media to yes and nvram to no to make later grub updates work
dpkg-reconfigure grub-efi-arm64

# Install the wifi firmware if you have it on the USB stick
mount /dev/sda1 /mnt
tar -C /lib/firmware/ -xf /mnt/linux-firmware.tar
umount /mnt
# Leave the system that is being installed
exit
cd /
```

* Switch back to the installer console by pressing **Fn + Option + F1** and continue the installer besides errors. The system will reboot into the newly installed system.

# Livesystem
[Video Recording](https://tg.st/u/live.mp4)
* Prerequisits

    * USB Stick. this is what this guide assumes, but it is also possible to run the Debian installer from another PC using m1n1 chainloading. But if you know how to do that, you probably don't need this guide.
    * If possible us an Ethernet Dongle, less typing.

* Create USB Stick with a single vfat partition on it and untar the modified Debian installer on it. Instructions for Linux:

```
# Identify the usb stick device
lsblk
DEVICE=/dev/sdX
parted -a optimal $DEVICE mklabel msdos
parted -a optimal $DEVICE mkpart primary fat32 2048s 100%
mkfs.vfat ${DEVICE}1

mount /dev/sdX1 /mnt
cd /mnt
curl -sL https://tg.st/u/asahi-debian-live.tar | tar -C /mnt -xf -
umount /mnt
```

* Boot into MacOS, capture the firmware and copy it to the usb stick, if you don't have done that already.

      curl -sL tg.st/u/fwx.sh | sh

* Follow the [U-Boot Wiki Entry](https://github.com/AsahiLinux/docs/wiki/U-Boot) to make space, setup a 12.1 stub partition using the asahi installer and install u-boot.

* If you have a EFI binary on the NVMe and want to boot from the usb stick, you need to interrupt u-boot on the countdoun by pressing any key and run the following comamnd to boot from usb:

      run bootcmd_usb0

* Reboot with the USB stick connected, the Debian livesystem should automatically start, if it doesn't load the kernel and initrd manually, you can use tab. For x try 0,1,2,...

```
linux (hdX,msdos1)/vmlinuz
initrd (hd0,msdos1)/initrd.gz
boot
```

* Log in as **root** without password.

* Consult the **quickstart.txt** file to find out how to get the networking up, set the time etc.

# Diskdump
[Video Recording](https://tg.st/u/m1debian.mp4)