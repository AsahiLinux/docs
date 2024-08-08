## Table of Contents
- [Introduction](#Introduction)
- [Prerequisites](#Important-prerequisite-information)
- [Installation](#Step-1-Set-up-Asahi-Linux-Minimal)
  * [Step 1: Set up the Asahi U-Boot Environment](#Step-1-Set-up-the-Asahi-U-Boot-environment)
  * [Step 2: Acquire the Gentoo Asahi LiveCD image](#Step-2-Acquire-the-Gentoo-Asahi-LiveCD-image)
  * [Step 3: Boot into the LiveCD](#Step-3-Boot-into-the-LiveCD)
  * [Step 4: Install Asahi support files](#Step-4-Install-Asahi-support-files)
  * [Step 5: Have fun!](#Step-5-Have-fun)
- [Maintenance](#Maintenance)
  * [Updating U-Boot and m1n1](#Updating-U-Boot-and-m1n1)
  * [Upgrading the kernel](#Upgrading-the-kernel)
  * [Syncing the Asahi overlay](#Syncing-the-Asahi-overlay)

## Introduction
Installing Gentoo on Apple Silicon is not that different to doing so on a bog-standard amd64 machine.
We have a LiveCD image that is almost identical to the standard Gentoo arm64 one, customised only to
enable it to boot on Apple Silicon devices.

The only major deviation from the Handbook is using [chadmed's `asahi-gentoosupport`](https://github.com/chadmed/asahi-gentoosupport) package to automate the
installation of the kernel, GRUB, overlay, m1n1, and U-Boot. You are of course welcome to attempt installing
these manually, however it will take you longer than bootstrapping the rest of the system combined.

This guide will assume that you are familiar withe the Asahi Linux installer and will not walk you through using
it.

If you've never used a Portage overlay before, take a few minutes to read the final section on maintaining the system.
Failure to do so properly may result in you missing critical system updates or leaving your machine in an unbootable state.

## Important prerequisite information
* Please do not use `genkernel` to build your initramfs. The only supported initramfs generator is `dracut`. The `asahi-configs`
  package installed later will supply the necessary configuration files to make `dracut` work seamlessly.
  
* U-Boot's USB stack is not fantastic, to say the least. You may find that various USB sticks or keyboards do not work reliably
  with it. Unfortunately, there is nothing we can do about this at the moment and you will just have to try different USB
  devices until you find one that works.

## Step 1: Set up the Asahi U-Boot Environment
Use the Asahi Installer to set up the minimal m1n1 + U-boot UEFI environment. Ensure that you tell the installer to
leave the amount of free space you want for your Gentoo system. It may be easier to simply use the Fedora Asahi Remix
Minimal installation option. We won't be using it, but it will guarantee that space is reserved for your root filesystem.

It is assumed going forward that you have fully "completed" the Asahi installation.

## Step 2: Acquire the Gentoo Asahi LiveCD image
We build lightly customised Gentoo LiveCDs which allow booting on Apple Silicon machines. Grab the latest one from
https://chadmed.au/pub/gentoo/install-arm64-asahi-latest.iso.

The LiveCDs are built using the standard Gentoo release engineering tooling. The Catalyst specfiles can be found at
https://github.com/chadmed/gentoo-asahi-releng.

Flash this on to a USB stick using your favourite method. As always, plain old `dd` works best.

## Step 3: Boot into the LiveCD
Boot the machine with the USB stick you flashed plugged in. U-Boot will enumerate your USB devices, then give you 2 seconds
to interrupt its automatic boot sequence. If you opted for the m1n1 + U-Boot installation option, you should be safe
to just let it continue booting. It will automatically boot from your USB stick.

If you installed one of the complete operating system images, you will need to interrupt the boot process and force
U-Boot to boot from the USB. Once you have interrupted U-Boot's automatic boot sequence, run this series of commands:

```
setenv boot_targets "usb"
setenv bootmeths "efi"
boot
```

If your U-Boot plays nicely with your USB stick, this will boot you into the LiveCD's GRUB. From here, you can simply
follow the Gentoo Handbook for amd64, stopping only when it is time to install a kernel.

**NOTE**: When partitioning your machine, it is absolutely vital that you do _not_ alter _any_ partitions other than
the space reserved for your rootfs. This includes the EFI System Partition set up by the Asahi Installer. You are free
to partition the rootfs space in any manner you wish, but do not modify any other structure on the disk. You will most
likely require a DFU restore of your Mac if you do.

## Step 4: Install Asahi support files
Merge Git by running `emerge -av dev-vcs/git`, then clone `chadmed/asahi-gentoosupport` from GitHub. Run `./install.sh` and follow the prompts. This will
* Install the Asahi Overlay, which provides the kernel, boot tooling and (possibly) patched packages
* Install the `sys-apps/asahi-meta` package, which will pull in all the Asahi-specific goodies necessary for booting,
  including a dist-kernel.
* Install and update GRUB.

This allows you to skip setting up GRUB, the kernel, and the boot tooling yourself which can be a bit of a hassle on these
machines and may leave you with an unbootable Linux setup.

## Step 5: Have fun!
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

**Note for developers and advanced users:** You may also wish to install multiple kernels, and make use of `eselect kernel`
to swap the symlink to `/usr/src/linux`. This is supported, however you *must* run `eselect kernel set` and `update-m1n1`
before *every* reboot into different kernel. This is to ensure that you are always booting with the correct DTBs.

### Syncing the Asahi overlay
In order to receive Asahi-specific updates, you must ensure that the Asahi overlay remains synchronised. Portage will
do this for you if you use `emerge --sync`, but *not* if you use `emerge-webrsync`. To synchronise the overlay manually, run
```bash
root# emaint -r asahi sync
```
before trying to update. No other steps are necessary to make sure that packages are updated, just update 
your system like you normally would at this point.
