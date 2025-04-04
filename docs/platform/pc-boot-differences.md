---
title: Boot flow deviations from the AMD64 PC platform
---

The M1 machines use a boot process that on the surface looks very different from how a regular PC or older Intel Mac boots. However, there is logic to the madness. This document gives you a way of thinking that you can use to better visualize how things work on Apple Silicon machines.

# SSD

The SSD on M1 machines contains both boot components and the OS that is installed on the machine. This is different from UEFI machines. Think of the SSD on Apple Silicon as being *both* parts of UEFI firmware flash memory (in particular, configuration is stored on the SSD), *and* the main OS NVMe device you boot from, including the OS loader, combined. If you're familiar with Android devices, those use a similar model.

The SSD uses GPT, just like disks under most UEFI systems. The first partition is used for boot-related stuff, configuration, and sometimes firmware, kind of like the UEFI variable firmware volume and other bits. The OS is installed in a container that includes a volume that contains the OS bootloader, some firmware, and the OS kernel. Think of this as similar to the EFI System Partition (ESP).

iBoot can only understand APFS, and all three partitions on the GPT disk are APFS containers themselves containing multiple APFS volumes.

# NOR Flash

There is also a separate flash chip, called a NOR flash. This is the same kind of chip that contains the UEFI firmware on PCs. It only contains product information and the first stage of iBoot. You can think of it as the early portion of the UEFI firmware, enough to boot the OS bootloader from internal storage but *not* including a huge amount of drivers like UEFI does.

# SecureROM

This is a ROM embedded in the M1 and is truly the first code that runs. Its job is to load the first stage of iBoot from NOR and run it.

Intel/AMD PCs also have various ROMs and a complicated boot process, but we never hear about those parts because they are proprietary. The idea that modern Intel PCs directly start executing code from the firmware in Flash without any initialization is an illusion, but we like to pretend that that's still how it works.

# iBoot

iBoot is the main bootloader on M1 machines. It is small. It cannot understand external storage. It does not support USB. It does not have a UI. All it can do is boot from internal storage, and show an Apple logo and a few error messages.

iBoot is like the lower level components of UEFI firmware on a PC. Enough to boot from internal NVMe, but without any USB drivers.

There are two stages to iBoot. One of them lives in NOR Flash, and its job is to understand APFS and load the second stage from the SSD. This is like system firmware, and it is persistent. The second stage is effectively a macOS bootloader, and boots the macOS kernel. This is like boot.efi on Intel Macs.

# Recovery Mode

Recovery Mode is a macOS instance that is built in to a separate partition. It is a secure environment where you can select which OS to boot, or go into a recovery shell/environment. When you hold down the power button on an Apple Silicon machine, you actually boot macOS. The boot options screen is already a full-screen macOS application. Once you go into recovery mode, you can pull up a terminal and you get a root shell. You can use the network, curl, sh, perl, and other tools that come with the installation. You can run arbitrary scripts and the environment has commands useful for configuring boot. You can run your own ad-hoc signed binaries (as of 11.2). However, SIP and AMFI (entitlement) restrictions apply, so you cannot grant your own binaries e.g. permission to interact with the boot policy/SEP.

Recovery mode is like a supercharged UEFI shell and UEFI setup menu combined into one. It should be powerful enough for us to build a Linux installer off of. Think of it as the rest of the UEFI firmware, and more.

# macOS

macOS boots from the second GPT partition. It is the real OS. It starts with the Darwin kernel and goes from there.

Asahi Linux replaces or complements macOS. This point is where we are allowed to replace things and boot our own code.

The concept of an "OS" for Apple Silicon macs includes both the OS loader (the second stage of iBoot) and the Darwin kernel and filesystem. We can replace the kernel, but not the second stage of iBoot - the kernel is the point in the boot process where Apple has developed the ability to downgrade security and run our own code. We also need to keep the overall structure looking like macOS. This means that, effectively, Linux will bootstrap off of a "shell" of macOS, a volume with just iBoot and a few files to convince Apple's boot infrastructure that it is a legitimate OS that can be booted. Think of this whole thing as a somewhat complicated EFI System Partition.

Since there are special requirements on how the first boot stage that replaces macOS is installed, it is inconvenient to update from Linux. Therefore, what we will do is insert our own bootloader chain at this point. You can think of this as the UEFI secureboot "shim" used to install Linux on UEFI environments that use the Microsoft secureboot keys. The signing is different; we won't be needing nor using any Apple developer certificates for this; instead what will happen is that the install process will "sign" the first stage for use on a single machine only - but the concept is similar. After this stage, we can chainload to anything we want from filesystems more standard in Linux land, such as ext4 or FAT32.

# DFU

DFU is a recovery mode built in to the SecureROM of the M1 that allows flashing the device from scratch, if iBoot and/or recovery mode are gone. DFU works even if the data in the NOR Flash is gone.

DFU does not exist on most PCs. If the UEFI flash is corrupted, the PC is bricked. DFU mode is a unique feature of Apple Silicon devices.

Some PC motherboards implement a similar feature as part of a separate chip, which can flash the UEFI firmware from a USB stick without actually turning on the motherboard normally, but this is only common in higher-end stand alone motherboards.

Thanks to DFU mode, it is just about impossible to brick an Apple Silicon machine in such a way that it cannot be recovered externally. The worst case scenario is that the product information (serial number, calibration, etc) in NOR is erased. If that happens, in theory, the DFU process should pull that information from Apple during the phone-home steps of the recovery process. Even then, this happening by accident is vanishingly unlikely.
