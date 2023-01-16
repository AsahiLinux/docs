## Table of Contents
- [Introduction](#Introduction)
- [Prerequisites](#Important-prerequisite-information)
- [Installation](#Step-1-Set-up-Asahi-Linux-Minimal)
  * [Step 1: Set up Asahi Linux Minimal](#Step-1-Set-up-Asahi-Linux-Minimal)
  * [Step 2: Clone asahi-gentoosupport](#Step-2-Clone-asahi-gentoosupport)
  * [Step 3: Acquire the latest LiveCD](#Step-3-Acquire-the-latest-LiveCD)
  * [Step 4: Prepare the system for booting the Gentoo LiveCD](#Step-4-Prepare-the-system-for-booting-the-Gentoo-LiveCD)
  * [Step 5: Reboot into the Live Image](#Step-5-Reboot-into-the-Live-Image)
  * [Step 6: Install Asahi support files](#Step-6-Install-Asahi-support-files)
  * [Step 7: Have fun!](#Step-7-Have-fun)
- [Maintenance](#Maintenance)
  * [Updating U-Boot and m1n1](#Updating-U-Boot-and-m1n1)
  * [Upgrading the kernel](#Upgrading-the-kernel)
  * [Syncing the Asahi overlay](#Syncing-the-Asahi-overlay)

## Introduction
Installing Gentoo on Apple Silicon is not that different to doing so on a bog-standard amd64 machine.
We leverage the Asahi installer and the Asahi Linux Minimal environment to bootstrap a secret sauce version
of the Gentoo LiveCD image, which allows us to follow the Handbook pretty closely.

The only major deviation from the Handbook is using [chadmed's `asahi-gentoosupport`](https://github.com/chadmed/asahi-gentoosupport) package to automate the
installation of the kernel, GRUB, overlay, m1n1, and U-Boot. You are of course welcome to attempt installing
these manually, however it will take you longer than bootstrapping the rest of the system combined.

This guide will assume that you are familiar withe the Asahi Linux installer and will not walk you through using
it.

If you've never used a Portage overlay before, take a few minutes to read the final section on maintaining the system.
Failure to do so properly may result in you missing critical system updates or leaving your machine in an unbootable state.

## Important prerequisite information
* When upgrading the kernel, you **must** pass `--all-ramdisk-modules` to `genkernel` for building the initramfs. Since we have
  some required softdeps for booting, failing to put all modules in the initramfs will leave your system in an unbootable state.
  Of course, this only applies if you actually use an initramfs.

* If you are using the [`asahi-audio`](https://github.com/chadmed/asahi-audio) package, PipeWire _must_ be compiled with `extra` 
  and `gstreamer` USE flags. Failing to do so will stop PipeWire from being linked against `libsndfile`, which will stop the
  FIRs from loading.

* If you are switching your toolchain to clang/LLVM, be sure to force `kmod` to be built with gcc. Your system will be
  unbootable if you try building with clang!

## Step 1: Set up Asahi Linux Minimal
Install Asahi Linux Minimal (with more than the minimal disk space, 12GB worked) and set up networking.
The environment comes with iwd and NetworkManager for setting up WiFi. Ethernet connections
should be handled automatically at boot.

Switch to the `asahi-dev` repo by changing `[asahi]` to `[asahi-dev]` in `/etc/pacman.conf`.

Update the system by running `pacman -Syu` as root (or `sudo pacman -Syu` when you installed AsahiLinux Desktop).
Reboot into Asahi Linux.

Install Git by running `pacman -S git`/`sudo pacman -S git`..

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

## Maintenance
Getting and applying system updates is a little more involved than a totally vanilla Gentoo installation. You need to keep
the Asahi overlay synced and make sure that system firmware is updated correctly.

### Updating U-Boot and m1n1
When you update the U-Boot or m1n1 packages, Portage will only install the resultant binaries to `/usr/lib/asahi-boot/`.
This is both a security and a reliability measure. m1n1 ships with a script, `update-m1n1`, which must be run as root
every time you update the kernel, U-Boot, or m1n1 itself. This script is responsible for collecting the m1n1, U-Boot
and Devicetree blobs, packaging them up into a single binary object, and installing it on the EFI System Partition.
For more information on how this works and why it must work this way, consult [[Open OS ecosystem on Apple Silicon Macs]]

### Upgrading the kernel
When you are running through a kernel upgrade, it is extremely important that you update the Stage 2 m1n1 payload at the
same time. m1n1 Stage 2 contains the Devicetree blobs required for the kernel to find the hardware, probe it properly, and
boot the system. Devicetrees are not stable, and a kernel upgrade with new DTs may result in an unbootable system, loss of
function, or missing out on a newly enabled feature. To make sure this does not occur, it is imperative that you run
```bash
root# update-m1n1
```
after *every* kernel upgrade. 

### Syncing the Asahi overlay
In order to receive Asahi-specific updates, you must ensure that the Asahi overlay remains synchronised. By default,
Portage will not do this for you. In addition to `emerge --sync` or `emerge-webrsync`, you must also run
```bash
root# emaint -r asahi sync
```
before trying to update. No other steps are necessary to make sure that packages are updated, just update 
your system like you normally would at this point.
