This page is basically a TL;DR of [Open OS Ecosystem on Apple Silicon Macs](Open-OS-Ecosystem-on-Apple-Silicon-Macs.md). It is written for general Linux power users who are used to the boot process on other platforms. Read that page for the full details.

## This is not a typical UEFI platform

On typical UEFI systems, UEFI is the native boot firmware and expected to manage any and all installed OSes. **This is not the case on Apple Silicon**. We only use the U-Boot UEFI layer as a bridge layer to allow you to use existing/familiar bootloaders and remain compatible with typical systems. This has a few implications:

* There is no UEFI variable storage, because the platform has no native UEFI support that could accommodate it. This means you cannot configure UEFI boot. U-Boot will *always* boot from the default UEFI executable (`\EFI\BOOT\BOOTAA64.EFI`).
* You can have *multiple* UEFI instances and each instance is intended to boot *only one* OS. Multi-boot is achieved at the native OS install layer and the native boot picker, *not* via UEFI. Installing multiple OSes under one UEFI subsystem is *not supported* and liable to breaking in the future for multiple reasons.
* That means there can be *multiple EFI System Partitions*, which means that finding the ESP by type UUID *is not reliable*. Any tools that attempt to do so will be broken for some subset of users.

When you boot an OS on an Apple Silicon platform, there are two concepts of an ESP:

* The ESP that the OS was booted from, which could be on a USB drive if you told U-Boot to boot from USB.
* The System ESP which is where U-Boot itself and m1n1 stage 2 are installed, along with vendor firmware. This is always on the internal NVMe.

The System ESP can be identified by looking up the `asahi,efi-system-partition` chosen variable in the device tree, which you can find at `/proc/device-tree/chosen/asahi,efi-system-partition`. This variable always contains the PARTUUID of the System ESP, regardless of where you told U-Boot to boot from.

The OS ESP is usually configured in `/etc/fstab` by UUID or PARTUUID and mounted at `/boot/efi` or `/boot`.

On standard internal NVMe installs, there is a single ESP which fulfills both roles.

## Firmware is loaded and provided on boot

We do not ship native platform firmware in `linux-firmware` or any other separate firmware package. Instead, there are three kinds of firmware:

* *System-global* firmware that is updated by macOS together with macOS updates. This only ever goes forward in version, never backwards (unless you do a full DFU erase), and is intended to be backwards-compatible. It is loaded on boot by iBoot.
* *OS-paired* firmware that is installed by the Asahi Linux installer into the stub APFS partition and directly loaded by iBoot. This is *not* backwards-compatible and whatever OS you install *must* support the specific firmware version used. This is why going into expert mode in the installer and picking a non-default version (despite all the warnings) will break your system. There is currently no way to upgrade this, but there will be in the future once there's a good reason to upgrade it.
* *Extracted* vendor firmware that is collected by the Asahi Linux installer and placed in `\vendorfw\vendorfw.cpio` in your System ESP. This is loaded into memory by either your bootloader (as an initramfs) or by your initramfs, and extracted into a tmpfs mounted on `/lib/firmware/vendor` on every boot so the kernel can load it. This *should* match your OS-paired firmware version. The `asahi-fwextract` package contains the same extraction script as the Asahi Linux installer and is used to upgrade `vendorfw.cpio` when new kinds of firmware are added, to avoid having to go back to macOS and run the Asahi Linux installer.

## OSes should be considered paired to their UEFI environment and ESP

The Linux kernel ships with device trees, and on typical setups with our Asahi enablement scripts, these device trees are installed alongside m1n1 and u-boot into the *System ESP* and updated when you update your kernel. U-Boot and m1n1 themselves are also installed as packages and updated that way. That means that **there can only be one OS installed that owns the System ESP and manages the bootloader there**.

Nothing stops you from booting other OSes from such a UEFI environment, such as temporarily booting into a USB drive for recovery purposes, but *there is no absolute guarantee that mismatched kernels will work with foreign device trees*. In the past, changes have broken booting entirely. This is less likely these days, but could still happen. More likely, you may experience missing features or broken drivers. In general, all device tree bindings which are already upstream should remain backwards-compatible, but all bets are off with any drivers not yet upstream.

If you nonetheless want to boot more than one OS from the same UEFI partition (which should really only be done for experimental or recovery purposes or if you intend to manage this all yourself manually, not as a long-term setup, and is not supported by us), you should make sure that *only one OS* owns your System ESP and will update the `/m1n1/boot.bin` file there. That means you need to edit/create `/etc/default/update-m1n1` file on *all but one* of the OS installs you intend to run, and add the `M1N1_UPDATE_DISABLED=1` variable there. This will stop the standard m1n1 update script from running, and therefore disable m1n1, u-boot, and device tree updates.

Future features, like SEP support for encryption and secret storage, may further depend on this pairing and are not expected to work with multiple OSes sharing one ESP/UEFI container.

On the other hand, it is perfectly acceptable to have one single external USB install that you always boot (e.g. from a "UEFI only" install with the Asahi Linux installer, which only sets up the APFS stub and System ESP), and to allow that install to manage your System ESP on the internal disk. In that case, OS tooling needs to use `/boot/efi` or `/boot` (depending on the setup) when it wants to update its own EFI bootloader (e.g. GRUB), and locate the System ESP by using the UUID in `/proc/device-tree/chosen/asahi,efi-system-partition` when it needs to update m1n1/u-boot/device trees or locate `vendorfw.cpio`. This is already the case in our reference implementation in asahi-scripts.