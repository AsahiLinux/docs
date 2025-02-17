The Asahi Linux project provides pre-configured OS images intended to showcase the bleeding edge of Linux support for Apple Silicon machines. We do this by taking [Arch Linux ARM](https://archlinuxarm.org/) as a base and adding our own package repository on top. This living document lists the differences between our images and vanilla ALARM.

## Builds

Images are built using the scripts in the [asahi-alarm-builder](https://github.com/AsahiLinux/asahi-alarm-builder/) repo. The scripts start with the official Arch Linux ARM generic rootfs package, and then customize it.

### Image format

These images are intended for direct installation by the online Asahi Linux Installer and are packaged in a ZIP archive following a specific format. See [Installer:OS Packages](Installer:OS-Packages.md) for more information.

## Repo

We ship the 'asahi' repo, which contains support packages for Apple Silicon, bleeding edge or patched versions of upstream packages which do not yet have support upstreamed or are in continuous development, and Asahi Linux branding.

Most of these components are optional to some extent, and we do not expect to ever diverge from Arch Linux ARM in a significant way.

### Mirrorlist

Current mirror list:

* [https://cdn.asahilinux.org/$arch/$repo](https://cdn.asahilinux.org/aarch64/asahi) (Worldwide CDN kindly sponsored by [bunny.net](https://bunny.net/))
* [https://de.mirror.asahilinux.org/$arch/$repo](https://de.mirror.asahilinux.org/aarch64/asahi) (Germany)
* [https://jp.mirror.asahilinux.org/$arch/$repo](https://jp.mirror.asahilinux.org/aarch64/asahi) (Japan)

We do not re-mirror the Arch Linux ARM packages here, although we do sponsor [jp.mirror.archlinuxarm.org](https://archlinuxarm.org/about/mirrors) (which is actually the same server as the Japan mirror above).

## Boot chain

The Asahi Linux reference images use the "full fat" boot chain with U-Boot and GRUB:

SecureROM → iBoot1 → iBoot2 → m1n1 (stage 1) → m1n1 (stage 2) → U-Boot → GRUB (UEFI) → Linux → initramfs → Arch

*SecureROM* and *iBoot1* are core system firmware and not managed by us. *iBoot2* and *m1n1 (stage 1)* are provisioned by the Asahi Linux Installer and not normally modified after initial install. The components starting with *m1n1 (stage 2)* and later are shipped and updated as Pacman packages.

## Asahi Linux Core

This is a lightweight remix of Arch Linux ARM.

### [linux-asahi](https://github.com/AsahiLinux/PKGBUILDs/tree/main/linux-asahi)

Our main kernel package. Usually built from the `asahi` branch on [AsahiLinux/linux](https://github.com/AsahiLinux/linux). Frequently updated and often based on bleeding-edge kernels (linux-next). Reference kernel config is [here](Reference-Asahi-kernel-config.md).

This kernel is built with a large assortment of USB device drivers to allow for external devices, but only the PCI/SPI/I²C/SPMI/etc drivers useful for Apple machines (PCI drivers will be enabled once Thunderbolt works). It is not intended to be bootable on non-Apple systems.

[Notes on modifying your kernel configuration to include Asahi](Kernel-config-notes-for-distros.md)

If you need .config options not yet enabled, feel free to request it on IRC or as an issue [here](https://github.com/AsahiLinux/PKGBUILDs).

### [asahilinux-keyring](https://github.com/AsahiLinux/PKGBUILDs/tree/main/asahilinux-keyring)

Keyring package for the packages and repos distributed by the project. Current signers:

* `Hector Martin Cantero <marcan@marcan.st>` (FC18F00317968B7BE86201CBE22A629A4C515DD5)
  * Same key used for Linux kernel pull request tag signing. Signing subkeys are held in redundant YubiKeys set to mandatory touch mode. Master key is backed up to two different sites and protected with a very strong passphrase, and only ever unlocked on offline machines.

The Asahi images also inherit the Arch Linux ARM repos and keyring.

### [m1n1](https://github.com/AsahiLinux/PKGBUILDs/tree/main/m1n1)

Second stage m1n1 bootloader for Apple Silicon machines. See [AsahiLinux/m1n1](https://github.com/AsahiLinux/m1n1).
* [AsahiLinux/u-boot](https://github.com/AsahiLinux/u-boot)
* [AsahiLinux/devicetrees](https://github.com/AsahiLinux/devicetrees)

This package installs m1n1 to `/usr/lib/asahi-boot`. To update the combined image in the ESP, use the `update-m1n1` command. This is done automatically on postupgrade if m1n1 is already installed there.

TODO: provide a way to disable the postupgrade step without uninstalling the package or unmounting the EFI partition.

### [uboot-asahi](https://github.com/AsahiLinux/PKGBUILDs/tree/main/uboot-asahi)

U-Boot port for Apple Silicon machines. Built from [AsahiLinux/u-boot](https://github.com/AsahiLinux/u-boot). Provides UEFI services to GRUB.

This package installs u-boot and its device trees to `/usr/lib/asahi-boot`. To update the combined image in the ESP, use the `update-m1n1` command. This is done automatically on postupgrade if m1n1 is already installed there.

### [mkinitcpio](https://github.com/AsahiLinux/PKGBUILDs/tree/main/mkinitcpio)

Upstream `mkinitcpio` with a minor patch. Will probably go away soon once upstreamed.

### [asahi-scripts](https://github.com/AsahiLinux/PKGBUILDs/tree/main/asahi-scripts)

Maintenance and automation scripts for Apple Silicon machines. Built from [AsahiLinux/asahi-scripts](https://github.com/AsahiLinux/asahi-scripts).

* `/usr/bin/update-grub`: Generates the GRUB config and installs/updates GRUB into the EFI system partition:
  * Probes for the right partition UUIDs
  * Generates and installs a GRUB core image that looks up the root partition via UUID instead of partition index (note: Debian/Ubuntu does something similar).
  * Runs `grub-mkconfig`.
* `/usr/bin/update-m1n1`: Generates the second stage m1n1 image from files contained in the `m1n1`, `uboot-asahi`, and `linux-asahi` packages.
* `/usr/bin/first-boot` and `first-boot.service`: Performs automated tasks on the first boot of the pre-baked image:
  * Randomizes the rootfs UUID
  * Randomizes the EFI system partition FAT volume ID
  * Re-creates `/etc/fstab`
  * Runs `update-grub` (see above)
  * Initializes the Pacman keyring (normally done manually on ALARM).
* `/usr/bin/update-vendor-firmware` and `update-vendor-firmware.service`: Fetches vendor firmware from the EFI system partition and installs it to /lib/firmware, or upgrades it if necessary, on each boot. This is required to make WiFi work out of the box, and more drivers in the future.
* `systemd-udev-trigger-early.service`: Helper service to ensure that the NVMe modules are loaded before `update-vendor-firmware.service` runs so that the EFI partition can be mounted, but does not trigger other subsystems which may request firmware that is not yet available. This actually runs in parallel with the rest of the boot process, but `update-vendor-firmware.service` depends on the EFI partition being mounted (which will wait for it to appear) and will block `systemd-udev-trigger.service` until it is done (which prevents other modules from being autoloaded too early).
* `/lib/initcpio/install/asahi`: `mkinitcpio` hook to add the modules required on Apple Silicon systems. This is needed because the `mkinitcpio` automatic module selection logic cannot follow dynamic device provider dependencies, which are only expressed in the device tree and not as module dependencies (e.g. it would pull in `nvme_apple` and its direct dependencies `apple-rtkit` and `apple-sart`, but fail to pull in `apple-mailbox` which is required for the NVMe device to actually probe). Note that this only concerns module filtering/selection a `mkinitcpio` time; the required modules *are* loaded properly by udev since it knows how to match module aliases to devices at runtime, so we do not force any explicit module loading.

### Preinstalled upstream packages

* `grub`: Linux bootloader, used in UEFI mode. This uses the U-Boot UEFI services, so no Apple Silicon-specific patches are required for GRUB itself.
* `iwd`: To allow users to connect to WiFi out of the box.

### Tweaks / Hacks

* `/etc/grub.d/30_uefi-firmware` is removed (seems to be broken/causes noise sometimes, and is useless on these platform). TODO: figure out exactly what's wrong and upstream a fix; it seems to be trying to parse binary data in a shell script...
* `sshd.service` is disabled by default for security reasons. Enable it manually after changing your `alarm` and `root` user passwords.
* The standard `systemd-firstboot.service` has an override to disable prompting on first boot (`/etc/systemd/system/systemd-firstboot.service.d/no-prompt.conf`), since the UX is terrible and the unit timeout kicks in if you take too long. Users are better off setting the timezone manually later. The tool still runs in order to randomize the machine ID.

## Asahi Linux Plasma

An image with a KDE Plasma environment pre-installed, as well as packages to provide a good out-of-the-box user experience on Apple Silicon.

(TODO)
