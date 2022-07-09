## Introduction
Installing Gentoo on Apple Silicon is not that different to doing so on a bog-standard amd64 machine.
We leverage the Asahi installer and the Asahi Linux Minimal environment to bootstrap a secret sauce version
of the Gentoo LiveCD image, which allows us to follow the Handbook pretty closely.

The only major deviation from the Handbook is using [chadmed's `asahi-gentoosupport`](https://github.com/chadmed/asahi-gentoosupport) package to automate the
installation of the kernel, GRUB, overlay, m1n1, and U-Boot. You are of course welcome to attempt installing
these manually, however it will take you longer than bootstrapping the rest of the system combined.

This guide will assume that you are familiar withe the Asahi Linux installer and will not walk you through using
it.

It is important to note that the ESP _must_ be mounted at `/boot/efi` for certain Asahi scripts to function properly.
As such, it is best if you put it in `/etc/fstab` and leave it there.

## Step 1: Set up Asahi Linux Minimal
Install Asahi Linux Minimal and set up networking. The environment comes with iwd and NetworkManager for setting
up WiFi. Ethernet connections should be handled automatically at boot.

Update the system by running `sudo pacman -Syu`. Reboot into Asahi Linux.

Install Git by running `sudo pacman -S git`.

## Step 2: Clone [`asahi-gentoosupport`](https://github.com/chadmed/asahi-gentoosupport)
This repo automates setting up the LiveCD for booting on Apple Silicon. Clone it somewhere and enter the directory.

## Step 3: Acquire the latest LiveCD
Get the latest install-arm64-minimal image from the Gentoo site. It's probably easiest to do this by installing a text
based web browser such as `links`. Save this image to the directory you cloned `asahi-gentoosupport` to as `install.iso`.
It must be called `install.iso`. 

## Step 4: Prepare the system for booting the Gentoo LiveCD
Run `./genstrap.sh` inside the `asahi-gentoosupport` directory. This will automatically prepare the system and LiveCD image for booting by
* Extracting the SquashFS from the LiveCD
* Injecting the `linux-asahi` kernel modules and firmware into it
* Wrapping the SquashFS in an initramfs
* Adding a GRUB menu entry for the installer

## Step 5: Reboot into the Live Image
Reboot the machine. When the GRUB menu appears, select Gentoo Live Install Environment. This will boot you to the standard LiveCD.
From here, install Gentoo as you normally would, stopping when it's time to install the kernel and bootloader.

**Note**: It is absolutely imperative that you **DO NOT** alter **any** other partition
on the system, including the EFI System Partition set up by Asahi Linux. You
are free to do anything you wish to the partition that was previously your
Asahi Linux **root** filesystem, such as shrinking it to add some swap space,
but never, **ever** delete any APFS partition or the Asahi EFI System partition.
You have been warned...

## Step 6: Install Asahi support files
Merge Git by running `emerge -av dev-vcs/git`, then clone `asahi-gentoosupport` again. Run `./install.sh` and follow the prompts. This will
* Install the Asahi Overlay, which provides the kernel, boot tooling and (possibly) patched packages
* Install the boot tooling and firmware required for Apple Silicon machines to function correctly
* Merge the Asahi Linux kernel sources as `asahi-sources`, replacing the standard `gentoo-sources` package
* Copy the running kernel's config to `/usr/src/linux/.config`
* Automate building the kernel

Kbuild may ask you about certain Kconfig options. Just accept its defaults for now.

This allows you to skip setting up GRUB, the kernel, and the boot tooling yourself which can be a bit of a hassle on these
machines and may leave you with an unbootable Linux setup.

## Step 7: Have fun!
Finish off the rest of your usual Gentoo install procedure, reboot, and have fun! It's a good idea to customise the kernel as
you see fit since the running config will be based on Arch/Asahi Linux. Remember to save the running kernel and initramfs as
a fallback so you can easily boot it from GRUB should anything go wrong.