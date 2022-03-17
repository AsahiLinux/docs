This pages explains how to install Debian using three different methods: Debian Installer, livesystem and disk dump.

# Tripwires
All systems are supported. But currently the USB-A Port on the Mac Mini will not work in u-boot and grub. Mark Kettenis is working on it,
but first the other patches need to land in u-boot. The two additional USB-3 ports on the iMac 4 port model also don't work in u-boot,
grub and Linux.

# Artefacts
If you don't want to use the prebuild artefacts, you can build them yourself using the bootstrap.sh script found in [Glanzmanns m1-debian script repository](https://git.zerfleddert.de/cgi-bin/gitweb.cgi/m1-debian)

# Soon to be released Asahi installer

[Video Recording](https://tg.st/u/debian_asahi_installer.mp4)

* Poweroff your Mac. Hold and press the power button until you see a wheel chain and Options written below. Approx 20 seconds.

* In the boot picker, choose Options. Once loaded, open a Terminal under Utilities > Terminal

* Run the asahi installer and select Debian (1):
```
curl -sL tg.st/d | sh
```

* Follow the installer, to install Debian.

* Once Debian is booted log in as root without password and set a root password

```
passwd
pwconv
```

* Configure wifi by editing the wpa_supplicant.conf, enabling the interface and remove the # before allow-hotplug to enable it during boot.

```
vi /etc/wpa/wpa_supplicant.conf
ifup wlp1s0f0
vi /etc/network/interfaces
```

* Reboot to see if grub was correctly installed
```
reboot
```

* Install a desktop environment for example blackbox

```
apt-get install -y xinit blackbox xterm firefox-esr lightdm
```

* Create yourself an unprivileged user

```
useradd -m -c 'Firstname Lastname' -s /bin/bash <username>
passwd <username>
````

* Optional install sshd. You can not log in as root, but only with your unprivileged user

```
apt update
apt install -y openssh-server
```

# Debian Installer
[Video Recording](https://tg.st/u/m1-d-i.mp4)

* Prerequisites

    * USB Stick. this is what this guide assumes, but it is also possible to run the Debian installer from another PC using m1n1 chainloading. But if you know how to do that, you probably don't need this guide.
    * If possible use an Ethernet Dongle, less typing.

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
curl -sL https://tg.st/u/m1-d-i.tar | tar -xf -
umount /mnt
```

* Boot into MacOS, capture the firmware and copy it to the usb stick, if you want to install via wifi, or elsewhere

```
curl -sL tg.st/u/fwx.sh | sh
```

* Follow the [U-Boot Wiki Entry](https://github.com/AsahiLinux/docs/wiki/U-Boot) to make space, setup a 12.1 stub partition using the asahi installer and install u-boot.

* Reboot with the USB stick connected, the Debian installer should automatically start, if it doesn't load the kernel and initrd manually, you can use tab. For x try 0,1,2,...

```
linux (hdX,msdos1)/vmlinuz expert net.ifnames=0
initrd (hd0,msdos1)/initrd.gz
boot
```

* If you need wifi, on the first installer page press **Fn + Option + F2** to change to the second terminal, press **return** to activate the console, and issue the following commands to configure wifi

```
./wifi.sh
```

* Switch back to the primary console by pressing **Fn + Option + F1**.

* Follow the installer along until you end up in the partitioning menu

    * Create one 256M EFI system partition. 512M and 1G partitions fail with an error about wrong clustersize.
    * Create another partition for root

* When you get an error about grub failing, switch to the third console by pressing **Fn + Option + F2**, press **return** to active the console unless already activated, and issue the following commands:

```
./boot.sh
```

* Switch back to the installer console by pressing **Fn + Option + F1** and continue the installer besides errors. The system will reboot into the newly installed system.

# Livesystem
[Video Recording](https://tg.st/u/live.mp4)
* Prerequisites

    * USB Stick. this is what this guide assumes, but it is also possible to run the Debian installer from another PC using m1n1 chainloading. But if you know how to do that, you probably don't need this guide.
    * If possible use an Ethernet Dongle, less typing.

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
curl -sL https://tg.st/u/asahi-debian-live.tar | tar -xf -
umount /mnt
```

In order to format the usb stick under Macos, open the disk utility, right-click on the usb stick (usually the lowest device in the list) and select erase. Choose the following options:

```
Name: LIVE
Format: MS-DOS (FAT)
Scheme: Master Boot Record
```

Than open a terminal, and run the following commands:
```
sudo su -
cd /Volumes/LIVE
curl -sL https://tg.st/u/asahi-debian-live.tar | tar -xf -
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