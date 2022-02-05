U-Boot in combination with m1n1 and device trees can be used to load grub or
any other efi boot loader from vfat esp partition located on the internal NVMe drive
or an USB stick. Grub can than load a Linux kernel and initird to boot Linux. U-Boot
also enables the wifi pcie device. U-Boot will try to load **EFI/BOOT/BOOTAA64.EFI**.
Make sure that grub or any other boot loader is located there.

# Prerequisit: Supported SOC

At the moment only the T8103 Devices work.

| Marketing name | Device | Product | SoC |
| -------------- | ------ | ------- | --- |
| Mac mini (M1,2020) | Macmini9,1 | J274AP | T8103
| MacBook Pro (13-inch, M1, 2020) | MacBookPro17,1 | J293AP | T8103
| MacBook Air (M1, 2020) | MacBookAir10,1 | J313AP | T8103
| iMac (24-inch (4-ports), M1, 2021) | iMac21,1 | J456AP | T8103
| iMac (24-inch (2-ports), M1, 2021) | iMac21,2  | J457AP | T8103

If you're device is not supported, you can use [[Untethered-m1n1]]. Until someone has enabled PCIe in the kernel, you won't have wifi.

# Prerequisit: Bootchain

In order to use u-boot, you need three extra partitions: The Linux stub from
the asahi installer, an vfat EFI System Partition (esp) and a root partion.
Optionally a boot partition if you have an encrypted root device. Not covered here.

Under MacOS, lets make space - the last number is the space that macos will
occupy. It is recommended to have at least 70 GB. I recommend on leaving at
least 100 GB for macos.
```
diskutil apfs resizeContainer disk0s2 200GB
```

Than run the Asahi Installer. In the MacOS Boot picker, you have to unlock,
select Linux and click on Restart.

```
curl -L https://mrcn.st/alxsh | sh
```

Wait for the system to shutdown and the LEDs turn off. Than wait another 5 seconds. Now press and do _not_ let go of the power button for 15 seconds.  In the boot picker, select 'Options' and select Utilities > Terminal. In this terminal execute. If you screw the power button holding, turn the System off by pressing the power button until it is off and start from the beginning of this paragraph.

```
/Volumes/Linux/step2.sh
```

Create an EFI parition because the final layout will have that
```
diskutil list
diskutil addPartition <identifier before free space> %EFI% LB 512MB
```

Create partition to hold a root filesystem
```
diskutil list
diskutil addPartition <identifier before free space> %Linux% %noformat% <size>
```

# Building
In order to get the boot object, we need to build m1n1 and u-boot and
concatenate the two and the device trees. m1n1 automatically picks the
right device tree for the model you're booting it on.

FIXME: Add instructions to crosscompile
FIXME: Add dependencies

```
git clone https://github.com/kettenis/u-boot
cd u-boot/
git checkout apple-m1-m1n1-nvme
make apple_m1_defconfig
make
cd ..

git clone --recursive https://github.com/AsahiLinux/m1n1.git
cd m1n1
make -j
cd ..

cat m1n1/build/m1n1.macho `find u-boot -name \*.dtb` u-boot/u-boot-nodtb.bin > u-boot.macho
cat m1n1/build/m1n1.bin `find u-boot -name \*.dtb` u-boot/u-boot-nodtb.bin > u-boot.bin
```

# Binary

FIXME; This should be hosted by marcan or better included in the installer

You can download a prebuild version which was built by Thomas Glanzmann from here:
```
curl -LO https://tg.st/u/u-boot.macho
curl -LO https://tg.st/u/u-boot.bin
```

# Installing
In order to install the u-boot.macho object, we need to make sure that Linux
boots by default, power off the m1 system completely, and boot it by holding
the power button until it says 'showing boot options', than select the Options
menu. Open a terminal, download u-boot.macho that you build in the previous
step and run the following command:

```
# <= MaOS 12.0.1
kmutil configure-boot -c u-boot.macho -v /Volumes/Linux
# Macos 12.1 and newer
kmutil configure-boot -c u-boot.bin --raw --entry-point 2048 --lowest-virtual-address 0 -v /Volumes/Linux
```

# Distribution Example: Debian

The esp vfat partition should be mounted to /boot/efi. Replace the X with your partition:

```
lsblk
mkdir -p /boot/efi
echo '/dev/nvme0n1pX /boot/efi vfat defaults 0 0' >> /etc/fstab
mount /boot/efi
```

Install grub and make sure grub-efi-arm64-signed is not installed because it makes u-boot hang.

```
apt-get install grub-efi grub-efi-arm64-signed-
```

Install grub where u-boot expects it by specifying the --removable flag

```
grub-install --target=arm64-efi --efi-directory=/boot/efi --removable
```

Also run the following command and set **Force extra installation to the EFI**
**removable media path** to **yes** and **update nvrma** to **no** in order to make grub updates not break your
bootchain.

```
dpkg-reconfigure grub-efi-arm64
```

Do not forget to update-grub afterwards:

```
update-grub
```

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
```