## Foreword

This document presents our vision for how open OSes should interoperate on Apple Silicon (i.e. M1 and later) Macs. We recommend first reading [Introduction to Apple Silicon](Introduction-to-Apple-Silicon.md) to first learn how the platform is designed from Apple's perspective.

The ideas in this document are not intended to set hard requirements or rules; anyone is of course free (and encouraged) to go their own way if they so choose. Rather, we would like to agree on a set of standards that make it easier for different OSes to co-exist and be installed by end users, aiming to make the process as simple, seamless, and future-proof as possible.

This document is a draft, and we welcome all commentary and discussion in order to help shape the future of how to build an open OS ecosystem on these platforms. Please drop by #asahi on OFTC if you have general questions or feedback, or ping us on #asahi-dev if you are a developer and would like to discuss technical aspects ([further info](https://asahilinux.org/community/)).

## OS layout & boot

An OS on an Apple Silicon machine, as seen by Apple's tooling, means a portion of an APFS container partition. As the machines natively support multi-boot, and in order to fit within the security design of the platform (e.g. the SEP should know what OS was booted), we recommend a 1:1 mapping between an installed OS and an OS as seen by the platform.

For third-party OSes, we propose the following GPT partition structure per OS:

1. APFS container partition ("stub macOS") (~2.5GB) with:
  * iBoot2, firmware, XNU kernel, RecoveryOS (all required by the platform)
  * m1n1 as fuOS kernel, with chainloading config pointing to the EFI partition
  * ~empty root/data filesystem subvolumes
2. EFI system partition (FAT32) (~512MB) with:
  * m1n1 stage 2 + device trees + U-Boot
  * GRUB or another UEFI OS loader boot the target kernel
3. root/boot/etc. partitions (OS-specific)

Rationale: this arrangement pairs together a third-party OS with an APFS-resident OS as seen by Apple's tooling, and allows users to use the native boot picker (with a11y support). It avoids potential trouble down the road which could come from having multiple OSes attempt to manage the SEP under a shared OS context. It also lets us have independent secure-boot chains for OSes (once that is implemented), with the fuOS image containing the root of trust for subsequent boot stages, bridged to the machine chain of trust by the user with their machine owner credentials during installation.

While it would be possible to share one APFS container between multiple OSes (and even macOS), there isn't much point to this other than saving a small amount of disk space per OS. Using a separate container partition for each installed OS makes it easier to wipe and start over, which would otherwise require a more complicated cleanup process where certain APFS subvolumes are deleted and certain directory trees in others are wiped.

This design, unconventionally, provides an EFI system partition for each installed OS. There are two reasons for this: first, each OS is logically a "container" and includes the EFI implementation itself, so it makes sense to isolate the ESP from that of other OSes. Second, due to the absence of EFI variable runtime services (see below), it would be difficult for multiple co-existing OSes to share an ESP and configure their respective EFI boot entries. Having separate ESPs allows us to just use the default boot path (`\EFI\BOOT\BOOTAA64.EFI`) and avoid having to persist boot configurations. It also allows the ESP to be directly used as the `/boot` partition for an OS, without having multiple OSes colliding with each other (if desired).

In the future, once open APFS drivers are deemed stable enough to use as a root filesystem, we would like to support full space-sharing coexistence with macOS; at that point only the EFI system partition would be required on top of an existing APFS macOS container.

Due to the presence of multiple ESPs, OSes will need a way to figure out which is theirs. For typical mounts and boot purposes, that can be done with partition/FS IDs; this should mostly be a concern for OS installers which need to determine what ESP to install their bootloader into at installation time. For this purpose, m1n1 stage 1 is normally configured at installation time to provide (and forward) a Device Tree `/chosen` property named `asahi,efi-system-partition`, which contains the EFI system partition PARTUUID value.

### Boot overview

A typical boot of a reference Linux system will go as follows, continuing on from the Boot Flow section above:

* iBoot2 loads the custom kernel, which is a build of m1n1
* m1n1 stage 1 runs and
  * Parses the Apple Device Tree (ADT) to obtain machine-specific information
  * Performs additional hardware initialization (machine-specific)
    * E.g. memory controller details, USB-C charging, HDMI display (on Mac Mini)
  * Displays its logo on the screen (replacing the Apple logo)
  * Loads its embedded configuration, which directs it to chainload from a FAT32 partition
  * Initializes the NVMe controller
  * Searches the GPT for the partition configured for chainloading, by PARTUUID.
  * Mounts the partition as FAT32
  * Searches for the filename configured for chainloading and loads it
  * Shuts down the NVMe controller
  * Chainloads to the loaded instance of m1n1 (as a raw binary blob), including forwarding any /chosen property configurations found in its embedded config.
* m1n1 stage 2 runs and
  * Parses the Apple Device Tree (ADT) to obtain machine-specific information
  * Re-initializes hardware, including anything stage 1 did not do (e.g. due to it being older)
  * Searches its embedded payloads to find Device Trees and an embedded U-Boot image
  * Selects an embedded Device Tree (FDT) appropriate for the current platform
  * Personalizes the FDT with dynamic information transplanted from the ADT
  * Performs any other hardware initialization to prepare the machine environment for Linux
  * Loads the embedded U-Boot image and jumps to it
* U-Boot runs and
  * Parses the FDT
  * Initializes the keyboard for input
  * Initializes NVMe
  * Prompts the user to break into a shell if requested
  * Mounts the appropriate EFI System Partition
  * Brings up basic EFI services
  * Locates the default EFI bootloader in the ESP, e.g. GRUB, and boots it
* GRUB runs and
  * Uses EFI disk access services to mount the /boot filesystem (could be the ESP itself, could be something else)
  * Locates its configuration file and additional components
  * Presents the user with a boot menu, using EFI console/input services
  * Loads the kernel and initramfs from /boot
  * Jumps to the kernel
* The Linux kernel boots as it would on any other UEFI+FDT platform

This boot chain is designed to progressively bring the system closer to a "typical" ARM64 machine, so that subsequent layers have to worry less about the particulars of Apple Silicon machines.

### m1n1

m1n1 is our first-stage bootstrap for Apple Silicon systems. Its purpose is to bridge between the XNU boot protocol and the Device Tree / ARM64 Linux boot protocol, and do low-level bring-up so that subsequent boot stages do not have to be concerned with it. See the [m1n1 User Guide](m1n1-User-Guide.md) for more details on how it works.

m1n1 can also be puppeteered via USB for development and reverse engineering purposes, including loading kernels to allow for a very fast build-test cycle. It also features a bare-metal hypervisor that can boot Linux or macOS and provide a virtualized UART over USB, and includes advanced Python-based event tracing framework. These features are not intended for end users, but we hope they make OS development and testing on these platforms as enjoyable as possible.

m1n1 can be installed as a single stage, but on production systems it should be split into two versions, with the stage 1 build chainloading a second stage from the EFI system partition. This is important because stage 1 can only be modified by the user via booting in 1TR, which precludes it from being updated by another OS directly. By loading a second stage from NVMe, we can have it be updatable, along with its payloads.

In the future, we intend to allow for the stage 2 chainload to maintain a secureboot chain, via signed m1n1 images. For this reason, the current chainloading code to load stage 2 from FAT32 is written in Rust, as it is part of the secureboot attack surface. This essentially eliminates the possibility of exploitable memory-safety bugs in that part of the code. The signature verification will also be implemented in Rust for this reason. The public key for verification will be configured at stage 1 installation time, and will be that of the entity expected to provide stage 2 builds for that particular OS container.

### U-Boot

U-Boot provides the first point of local (keyboard) user interaction, and support for booting from USB or other external devices. It also implements EFI services that hide the specifics of the platform, making it look like a typical UEFI machine.

Notably, U-Boot cannot provide particularly useful EFI runtime services. As the platform does not have an EFI variable store, and it is not practical to e.g. share NVMe access with a running OS, it won't be possible to make modifications to EFI boot configs from a running OS. Instead, those modifications would have to be made by changing configuration files directly. This shouldn't be an issue if different OSes use different ESPs.

### GRUB

GRUB does the final Linux loading and provides users with the familiar kernel selection and option editing menu. GRUB does not need any patches to work on Apple Silicon machines, as it relies entirely on EFI services to do its job. It is up to the OS distribution to decide what to use here; GRUB is merely an example.

### Boot schemes

Installed OSes are in control of the boot chain starting from m1n1 stage 2, and thus are free to manage it however they wish. For example, a Linux distro could append Linux kernels directly to m1n1 stage 2, or use U-Boot directly to boot kernels, or use the Linux EFI stub, or GRUB.

OS installers booted via USB must use the standard UEFI boot protocol from a FAT32 EFI System Partition if they want to work with the UEFI-only setup mode of the Asahi Linux Installer (which installs m1n1 stage 2 + U-Boot set up like that). The installer may overwrite this with another mechanism as part of the installation, if desired, although this is not recommended without a good reason: keeping the second stage blob installed by the Asahi Linux Installer may allow for booting on machines not yet supported by a given OS release, by providing new device trees, if those platforms are sufficiently backwards compatible.

For OSes that use the typical m1n1+U-Boot approach, it is recommended that they check the existing version in the ESP and refuse to downgrade automatically it if the package provided by the OS is older. This, again, allows for future hardware to be partially supported with only an installer update. TODO: specify how this version check should work (we need to start tagging m1n1 builds properly).

## Initial installation

On these machines, there is a mismatch between the point where a third-party kernel boots (after iBoot2), and the required per-OS boot components (including iBoot2 itself, firmware, and other files, as well as the recoveryOS image and XNU kernel for it). In addition, Apple's tooling requires these files to be laid out in a certain way in the Preboot partition in order to work properly in the OS selection menus, beyond the requirements imposed by iBoot1/2 themselves. In effect, creating a new OS container requires, essentially, installing macOS minus the root filesystem.

Thankfully, all the required components can be fetched from the restore images (IPSW files) which are publicly available at [well-known](https://ipsw.me/), stable URLs. We have implemented this process in [asahi-installer](https://github.com/AsahiLinux/asahi-installer), a Python-based installation framework that is intended to run from 1TR. It streams the required bits of the IPSW file, avoiding a complete download, and sets up the partitions and contents as required to boot recoveryOS and subsequently a custom kernel.

We don't expect OSes to want to reinvent this particular wheel (trust us, you don't want to), so we'd like to make the installer flexible enough to support bootstrapping different installation flows.

### Launching the installer

At this time, the Asahi Linux installer is supported as a purely online installer (`curl | sh` style), which can be launched from macOS or from recoveryOS. OSes to be installed are downloaded on demand (streamed directly to the target disk without any intermediate storage). Alternatively, users may choose to install only a UEFI boot environment, which can then boot any OS from USB using the standard mechanisms, leaving unpartitioned space for e.g. an OS installer to use.

Future installation options could include:

* USB netinstall images/bundles, setting up the installer as "bootable install media". This can be set up by just unpacking some files to a FAT32 partition on a USB drive, so it is easy for users to use, and will allow them to select the installer from the boot picker ([more info](Introduction-to-Apple-Silicon.md#boot-picker) on how this magic works). It would still fetch the OS to be installed from the internet.
* USB local install images/bundles, which can also serve as UEFI install media for later or for other platforms. This will install the target OS from USB, but will still hit Apple's CDN for the Apple components, making the install not truly offline.
  * An option for end users to add the Apple components, e.g. by running a script from the USB drive, making it fully offline
  * An option for end users to add the Apple components when creating the USB installer, e.g. by running a script that downloads them and provisions the installer in one go, instead of a pre-baked image.
    * We want to add this as a feature to the online installer, e.g. "create a bootable USB installer" instead of actually doing the install.
* Packaging as a macOS app (this would already be part of USB install modes anyway)
  * Though this runs into GateKeeper issues with unsigned downloads if downloaded "normally" by users from a browser...
  
## Firmware provisioning

Apple Silicon machines rely on a large number of firmware blobs to work. While the majority of these are already loaded by the time a third-party OS boots, there is a small subset that isn't. Since these blobs do not have a redistributable license, this presents an issue for those OSes that need to have access to the blobs. Thankfully, the blobs are available in the IPSW files created by the initial installer. We propose a "vendor-firmware" mechanism to pass those blobs onto the booted/installed OS.

Note: There is currently a hack in the installer to dump out all firmware raw to another place in the ESP, so we can provide a script for users to extract the rest of it into a form compliant with this specification. This will go away once all the extractors are done, and is intended as a temporary ad-hoc thing.

### Packaged blobs

Currently, Broadcom FullMAC WiFi firmware is packaged. These blobs have also been identified as necessary, but are not yet packaged:

* Broadcom Bluetooth firmware
* AVD (Apple Video Decoder) Cortex-M3 firmware
* USB xHCI firmware (only needed for iMac models with 4 USB-C ports).

Details on Broadcom FullMAC WiFi firmware naming: <https://lore.kernel.org/all/20220104072658.69756-10-marcan@marcan.st/>

### VendorFW package

The stub OS installer collects available platform firmware from the IPSW, and packages it as two files:

* firmware.tar: Tarball containing the firmware, in a structure compatible with the `/lib/firmware` hierarchy (e.g. `brcm/foo.bin`).
* manifest.txt: A text file containing lines of the following two forms:
  * `LINK <src> <tgt>` : hard link
  * `FILE <name> SHA256 <hash>`: file

These files are then placed in the EFI system partition under the `vendorfw` directory.

### OS handling

A booted OS shall mount the ESP and inspect the `manifest.txt` file. If it is found to be different from the existing vendor firmware installed in the OS partition (if any), it shall update it by extracting `firmware.tar` into `/lib/firmware`, and then comparing both manifest files and removing any files that are no longer present in the ESP manifest. This should be done before any drivers requiring firmware are loaded.

Alternatively, an OS that supports a more complex dynamic firmware loading mechanism could read the `firmware.tar` file directly as firmware is requested.

An example implementation of this process is available in the asahi-scripts repo [here](https://github.com/AsahiLinux/asahi-scripts/blob/main/update-vendor-firmware).

The firmware package should be checked on every boot, to pick up changes from users who upgrade their stub OS by re-running the installer. This will be rare, but it's worth supporting properly.

