U-Boot in combination with m1n1 and device trees can be used to load grub or
any other efi boot loader from vfat esp partition located on the internal NVMe drive
or an USB stick. Grub can than load a Linux kernel and initird to boot Linux. U-Boot
also enables the wifi pcie device. U-Boot will try to load **EFI/BOOT/BOOTAA64.EFI**.
Make sure that grub or any other boot loder is located there.

# Prerequisit: Supported SOC

At the moment only the T8103 Devices work.

| Marketing name | Device | Product | SoC |
| -------------- | ------ | ------- | --- |
| Mac mini (M1,2020) | Macmini9,1 | J274AP | T8103
| MacBook Pro (13-inch, M1, 2020) | MacBookPro17,1 | J293AP | T8103
| MacBook Air (M1, 2020) | MacBookAir10,1 | J313AP | T8103
| iMac (24-inch (4-ports), M1, 2021) | iMac21,1 | J456AP | T8103
| iMac (24-inch (2-ports), M1, 2021) | iMac21,2  | J457AP | T8103

# Prerequisit: Bootchain

In order to use u-boot, you need three extra partitions: The Linux stub from
the asahi installer, you get it my making space for Linux, running the asahi
installer, create an esp vfat partition and a Linux partion used for the root
partition.

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

Once the system has shutdown, follow these instructions:
```
1. Press and hold down the power button to power on the system.
   * It is important that the system be fully powered off before this step,
     and that you press and hold down the button once, not multiple times.
     This is required to put the machine into the right mode.
2. Release it once 'Entering startup options' is displayed.
3. Choose Options.
4. You will briefly see a 'macOS Recovery' dialog.
   * If you are asked to 'Select a volume to recover',
     then choose your normal macOS volume and click Next.
5. Click on the Utilities menu and select Terminal.
6. Type the following command and follow the prompts:
```

To create the additional partitions (esp vfat and Linux root), the easiest way
is to boot Linux from a live stick, but I'll also add instructions howto do it
under macos.

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

You can download a prebuild versio which was built by Thomas Glanzmann from here:
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

Install the right grub version:

```
apt-get install grub-efi
```

In order to make Debian install grub in the location that U-Boot expects, the
following needs to be done. Adopt the X with your esp partition:

```
grub-install --removable /dev/nvme0nX
```

Also run the following command and set **Force extra installation to the EFI**
**removable media path** to **yes**.

```
dpkg-reconfigure grub-efi-arm64
```

Do not forget to update-grub afterwards:

```
update-grub
```

The current version that is shipped with Debian testing refuses to be booted from U-Boot
because one efi binary. In order to make U-boot boot the grub that is shipped
with Debian Testing, remove this binary:

```
find /boot/efi -name fbaa64.efi | xargs rm
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