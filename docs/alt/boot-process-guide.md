This page explains the packages/components involved in a bootable Asahi Linux system, and how they interact with each other. It is aimed at distro packagers and people who want to roll/maintain their own builds instead of using packages. It is based on the setup used in the Arch Linux ARM-based reference distro, but should apply to most systems.

This is a practical guide. For a more formal description/spec, including how we handle vendor firmware, see [Open OS Ecosystem on Apple Silicon Macs](../platform/open-os-interop.md). For information about specifically how everything is plumbed in Fedora Asahi Remix, see its [How it's made](https://docs.fedoraproject.org/en-US/fedora-asahi-remix/how-its-made/) page.

## Boot chain overview

[Apple stuff] → m1n1 stage 1 → m1n1 stage 2 → DT + U-Boot → GRUB → Linux

m1n1 stage 1 is installed by the Asahi Linux installer from recovery mode (in step2.sh), is signed by an internal machine-specific key in the process (as part of Apple's secure boot policy), and can be considered immutable. Upgrading it should seldom be needed, we'll make tooling for this when it becomes necessary. It has the PARTUUID of the EFI system partition assigned to this OS hardcoded into it (set at install time), and chainloads m1n1 stage 2 from `<ESP>/m1n1/boot.bin` (the ESP must be in internal NVMe storage, no external storage is supported). It also passes through this PARTUUID to the next stage (as a to-be-set /chosen property, see below), so the next stage knows what partition it's booting from.

An OS/distribution is in charge of maintaining and upgrading the rest of the boot components.

m1n1 stage 2 is in charge of initializing (more) hardware, choosing the appropriate DT for this platform, filling in dynamic properties, and loading U-Boot.

U-Boot initializes more things (e.g. keyboard, USB), provides UEFI services, and (by default, in our release configuration) loads a UEFI binary from `<ESP>/EFI/BOOT/BOOTAA64.EFI`, honoring the magic. Note that U-Boot both consumes, slightly modifies*, and forwards on the DT.

GRUB is vanilla, nothing special there. You could use any other arm64 EFI binary.

\* Largely just setting the stdout-path based on whether it thinks you should be using a physical/keyboard console or a UART console.

### The magic ESP stuff

For Asahi we have a non-standard setup where each OS install has its own EFI system partition. This makes it easier to fit in with Apple's boot picker model, since it knows nothing about EFI; from its point of view, each Asahi instance installed is its own separate OS, and therefore downstream we use a separate ESP for each. Nothing stops you from installing multiple bootloaders or OSes within one such container/ESP, but:

* We suspect this will cause pain in the future once we start integrating with security-related platform features (e.g. SEP), since it might have a concept of "currently booted OS identity".
* Since there can only be one set of DTs, U-Boot, and m1n1 stage 2 version per container/ESP, there is no sane way for multiple distros to cooperate to manage updates if they share one container.
* We don't have persistent EFI variable storage (and no good idea for how to do it in runtime services), which means there's no way to manage the EFI boot order. So you end up with the default only.

Thus, if you're adding distro support for end-users, please stick to this model. An exception is USB-bootable rescue/installer images, which should be bootable by the vanilla m1n1.bin bundle that the Asahi Linux installer installs in plain UEFI container mode, from their own ESP on the USB drive containing `/EFI/BOOT/BOOTAA64.EFI` (no `m1n1/boot.bin`). Those should never try to manage the `boot.bin` in the internal ESP themselves (until/unless installed proper, thus becoming the owners of that container), and hopefully the DT situation will work out for the USB boot.

The PARTUUID of the EFI system partition assigned to the currently booted OS is set by m1n1 as the `asahi,efi-system-partition` property of the `/chosen` device tree node, which can be read from Linux at `/proc/device-tree/chosen/asahi,efi-system-partition`. Our U-Boot branch also uses this to find the right ESP.

## Version interactions

Here's where it gets a bit hairy. m1n1, u-boot, Linux, and the device trees have somewhat complex and subtle version interdependencies.

* m1n1 stage 2 is in charge of some hardware init, and patching in dynamic values into the device trees. This means that newer kernel hardware support often depends on a m1n1 update, either to initialize things or to add more device tree data, or both.
  * In general, we prefer to keep Linux drivers simple and put "magic" init (e.g. random magic sets of register writes, which Apple loves to describe in their variant of a DT) in m1n1. Same with things related to the memory controller, clock configurations that we can reasonably leave static, etc. The exception is when Linux has no choice but to do this dynamically at runtime. Apple likes to leave way too much to the XNU kernel (which m1n1 replaces), including ridiculous things like turning on the system-level L3 cache, and we don't want Linux to have to deal with that. This also highly increases our chances of existing kernels working (at least partially) on newer SoCs/platforms with only DT changes, which is good for e.g. forward-compatibility of distro install images. For example, PCIe on M2 required no driver-level changes, only changes to the m1n1 initialization.
* U-Boot generally doesn't change much once properly brought up on any given SoC, and only cares about a subset of DT info.
* Linux needs DT data to bring up hardware, so new hardware needs DT updates. Our canonical DT repository is part of our Linux tree itself, but remember changes here often need m1n1 (stage 2) updates to make things actually work.

In an ideal world where everything is upstream and we understand ~all the hardware, DTs should be forwards- and backwards- compatible with software versions. That is, new features require everything to be up to date, but otherwise those new features simply won't be available.

In the real world,
* DT bindings that have not been upstreamed yet are subject to incompatible changes as they go through review. We try to avoid this, but it has happened (e.g. the AIC2 IRQ controller binding changed, which notably broke booting completely for older kernels on t600x). Sometimes we can have interim DTs that have both styles of data, to maintain compat.
* m1n1 *should* degrade gracefully when it runs into missing DT structure for the changes it wants to patch in (i.e. m1n1 version > DT version), but those code paths don't get much testing. Please file a bug if you see it abort or crash when it shouldn't.
* The early days of U-Boot on any given SoC might see some changes in DT dependencies (e.g. MTP keyboard support for M2 platforms goes along with DT changes, though this will degrade gracefully if missing)
* In principle, it's possible for a Linux driver to crash badly if m1n1 was not updated to initialize the hardware properly (and if it's not injecting any DT props, the driver won't bail due to missing them). We obviously try to handle errors gracefully, but it's conceivable that e.g. missing power- or memory controller-related init could cause something like a hard SoC wedge when Linux tried to bring up dependent hardware. Maybe we should start stuffing the m1n1 version in the DT, so drivers can bail if something is known unsafe with older versions?
* There are some DT changes that hit corner cases in the "full compat" ideal and aren't very easy to fix. For example, if a DT node introduces a dependency on another node (e.g. a producer-consumer relationship), even if it were optional in principle, that driver may fail to probe (or not even attempt to probe) if the producer's driver is not available, can't probe, or does not implement the proper producer function. We also have issues with power domains: some are currently marked "always-on" because they break something badly if turned off, but in the future we might learn how to handle this properly. If that flag is removed in newer DTs, older kernels would be in trouble.

Since you *can* have multiple kernels installed, you have to pick where you source your DTs somehow. The logical choice would be the most recent kernel. For Arch, since there is only ever one installed kernel with the standard package, we get to ignore this issue (for typical users) and just always update the DTs on package updates to that version.

TL;DR: Update your DTs when you update your kernel (unless you know they weren't touched), and also update your m1n1 to make big new stuff work.

## Build instructions

Assuming everything is done natively (no cross-compiling):

### m1n1

```shell
git clone --recursive https://github.com/AsahiLinux/m1n1
cd m1n1
make ARCH= RELEASE=1
```
Note: RELEASE=1 currently just turns off verbose log output by default. You can enable it in release builds using `nvram boot-args=-v` from recoveryOS.

Output is at `build/m1n1.bin`.

### U-Boot

```shell
git clone https://github.com/AsahiLinux/u-boot
cd u-boot
git checkout asahi-releng # this branch is what we ship to users, it has the EFI partition auto-detection stuff
make apple_m1_defconfig
make
```

Output is at `u-boot-nodtb.bin`.

### Device Trees

The canonical DTs are the ones in our [Linux kernel tree](https://github.com/AsahiLinux/linux). Building kernels is out of scope for this doc.

Output is at `arch/arm64/boot/dts/apple/*.dtb`.

## Installation

m1n1, the set of device trees, and U-Boot are all packaged together into a single file which becomes m1n1 stage 2, loaded from `<ESP>/m1n1/boot.bin`. This is done by simple concatenation, using the [update-m1n1](https://github.com/AsahiLinux/asahi-scripts/blob/main/update-m1n1) script.

Simplified,
```shell
m1n1_dir="/boot/efi/m1n1"
src=/usr/lib/asahi-boot/
target="$m1n1_dir/boot.bin"
dtbs=/lib/modules/*-ARCH/dtbs/*

cat "$src/m1n1.bin" \
    $dtbs \
    <(gzip -c "$src/u-boot-nodtb.bin") \
    >"${target}"
```

Notes:
* U-boot must be gzipped for m1n1 to load it reliably (this has to do with the image format not being self-delimiting)
* All device trees are included; m1n1 will select the appropriate one for the given platform
* The Asahi Linux kernel packages install the DTBs to `/lib/modules/$ver/dtbs/`. This is nonstandard.
* You can append textual `var=value\n` lines to the .bin to configure some things in m1n1. We'll have better tooling for this in the future, but for now it's really only for very specific cases.

You might want to rename the old `m1n1.bin` after an update. If booting fails, you can just go into macOS or recovery mode and put the old one back, since macOS can access the FAT32 ESP just fine (`diskutil list` then mount it with `diskutil mount`).

## Misc stuff

m1n1 stuffs the Apple keyboard code into `/proc/device-tree/chosen/asahi,kblang-code` (as a big-endian u32 cell, standard for DT). The mapping is [here](https://github.com/AsahiLinux/asahi-calamares-configs/blob/main/bin/first-time-setup.sh#L109). Feel free to start a discussion on how to standardize a proper binding for this.

We have a whole story for how vendor firmware (i.e. firmware that is not redistributable as a distro package, but is prepared at install time) is handled. How that works is covered in detail [here](../platform/open-os-interop.md#firmware-provisioning).
