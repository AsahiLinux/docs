The M1 machines use a boot process that on the surface looks very different from how a regular PC or older Intel Mac boots. However, there is logic to the madness. This document gives you a way of thinking that you can use to better visualize how things work on Apple Silicon machines.

# SSD

The SSD on M1 machines contains both boot components and the OS that is installed on the machine. This is different from UEFI machines. Think of the SSD on Apple Silicon as being *both* the UEFI firmware flash memory, *and* the main OS NVMe device you boot from, combined. If you're familiar with Android devices, those use a similar model.

The SSD uses GPT, just like disks under most UEFI systems. The first partition is used for boot-related stuff, kind of like the EFI system partition, but also contains iBoot itself and other components.

iBoot can only understand APFS, and all three partitions on the GPT disk are APFS containers themselves containing multiple APFS volumes.

# iBoot

iBoot is the main bootloader on M1 machines. It is small. It cannot understand external storage. It does not support USB. It does not have a UI. All it can do is boot from internal flash, and show an Apple logo, a progress bar, and error messages.

iBoot is like the lower level components of UEFI firmware on a PC. Enough to boot from internal NVMe, but without any USB drivers.

# Recovery Mode

Recovery Mode is a macOS instance that is built in to a separate partition. It is a secure environment where you can select which OS to boot, or go into a recovery shell/environment. When you hold down the power button on an Apple Silicon machine, you actually boot macOS. The boot options screen is already a full-screen macOS application. Once you go into recovery mode, you can pull up a terminal and you get a root shell. You can use the network, curl, sh, perl, and other tools that come with the installation. You can run arbitrary scripts and the environment has commands useful for configuring boot. You cannot download and run your own binary code, as all binaries are signed by Apple.

Recovery mode is like a supercharged UEFI shell and UEFI setup menu combined into one. It should be powerful enough for us to build a Linux installer off of. Think of it as the rest of the UEFI firmware, and more.

# macOS

macOS boots from the second GPT partition. It is the real OS. It starts with the Darwin kernel and goes from there.

Asahi Linux replaces or complements macOS. This point is where we are allowed to replace things and boot our own code.

Since there are special requirements on how the first boot stage that replaces macOS is installed, it is inconvenient to update from Linux. Therefore, what we will do is insert our own bootloader chain at this point. You can think of this as the UEFI secureboot "shim" used to install Linux on UEFI environments that use the Microsoft secureboot keys. The signing is different; we won't be needing nor using any Apple developer certificates for this; instead what will happen is that the install process will "sign" the first stage for use on a single machine only - but the concept is similar. After this stage, we can chainload to anything we want from filesystems more standard in Linux land, such as ext4 or FAT32.

# DFU

DFU is a recovery mode built in to the BootROM of the M1 that allows flashing the device from scratch, if iBoot and/or recovery mode are gone.

DFU does not exist on most PCs. If the UEFI flash is corrupted, the PC is bricked. DFU mode is a unique feature of Apple Silicon devices.

Some PC motherboards implement a similar feature as part of a separate chip, which can flash the UEFI firmware from a USB stick without actually turning on the motherboard normally, but this is only common in higher-end stand alone motherboards.