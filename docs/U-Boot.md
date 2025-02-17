U-Boot is the default payload for m1n1 stage 2, and is used to provide a standard preboot environment familiar to
AArch64 developers. External boot is not supported with the native Apple Silicon boot tooling, making U-Boot a hard
necessity for providing a PC-like boot environment. This page explains how we use U-Boot and how to manually build and
install it. It is assumed that you are working on an Apple Silicon machine using a well-supported distro, meaning either
Asahi itself or one listed at [SW-Alternative Distros](SW-Alternative-Distros.md).

Do note that the process for building and installing U-Boot listed here is for documentation and development purposes
only. If you are an Asahi user and not interested in hacking on U-Boot or m1n1, they are managed automatically
via `pacman`. The same should be true for all (most) distros listed at [SW-Alternative Distros](SW-Alternative-Distros.md).

## Standard boot flow
We make use of U-Boot's UEFI implementation to load and execute a UEFI binary located at `/EFI/BOOT/BOOTAA64.EFI` 
on the paired EFI System Partition. The default payload for Asahi installs is GRUB. U-Boot passes GRUB a pointer 
to the FDT automatically.

## Alternative arrangements
The default U-Boot script can be interrupted at runtime to manually alter the boot flow. This allows the user to
do things like boot off external media, execute arbitrary UEFI code, load and jump to a kernel directly, et cetera. 

## Known issues
* USB-A ports on machines with them will not work due to their controller requiring firmware which we cannot redistribute
* Ditto the two USB Type-C ports furthest from the power cable on the iMacs, and the two front facing ports on the M1 **Max** Mac Studio.
* Certain USB devices which expose multiple functions (hubs with NICs, fancy gaming keyboards, etc.) do not work.
* USB hubs with integrated SD card readers will cause your machine to hard reset if the slot is empty. The fix for this is queued.

## Prerequisites
* An Apple Silicon machine running Asahi or a distro listed at [SW-Alternative Distros](SW-Alternative-Distros.md)
* A clean build of m1n1, see the [m1n1 User Guide](m1n1-User-Guide.md)
* The Apple DTBs from `AsahiLinux/linux`. Compiling these is out of scope for this document.
* The Asahi EFI System Partition mounted at `/boot/efi/`.

## Building
1. Clone the `AsahiLinux/u-boot` repository.
2. `make apple_m1_defconfig`
3. `make -j$(nproc)`

Do not be fooled by the name of the defconfig, it will build support for **all** Apple Silicon machines, not just the M1. You may tinker
with the config, however try not to play around with Apple-specific stuff as most (all) of it is absolutely necessary just to cleanly boot. 

You may also build using Clang/LLVM.

## Installing
Installing your build of U-Boot involves creating a new stage 2 of m1n1, which is why we require a clean build of m1n1 and the DTBs.
Make a backup of `/boot/efi/m1n1/boot.bin`, then concatenate m1n1, the DTBs and U-Boot. This must be run as root.

```sh
cat build/m1n1.bin /path/to/dtbs/*.dtb <(gzip -c /path/to/uboot/u-boot-nodtb.bin) > /boot/efi/m1n1/boot.bin
```

### Important note for package maintainers
We recommend that you install the bare m1n1/U-Boot images and DTBs to a specific location on the
root filesystem, and ship a script that backs up the existing image and creates a new one. This prevents regressions from making bricking
the OS install. Users can simply mount the ESP in macOS, delete the new `boot.bin` and rename the backup to recover their machine to a
known good state. For an example of how we do this in Asahi, see `uboot-asahi` and `asahi-scripts/update-m1n1` in the 
`AsahiLinux/PKGBUILDs` repo.

## Helpful U-Boot tricks

### Booting from a USB
1. Make sure the only USB storage device connected is the one you want to boot from
2. Interrupt the default U-Boot script when prompted.
```
run bootcmd_usb0
```

If the USB fails to load, you might need to restart the USB, which can be done via:
```
usb start
usb reset
```

If you are using a USB to load a recovery / "Live CD", ensure you also have `usbhid xhci_hcd` under MODULES in `/etc/mkinitcpio.conf`. Also have a read of [Install_Arch_Linux_on_a_removable_medium](https://wiki.archlinux.org/title/Install_Arch_Linux_on_a_removable_medium) for tips and tricks.

### Other useful U-Boot commands
```sh
bootd # Continue the default U-Boot script
reset # Reboot the machine
poweroff # Shutdown the machine completely
nvme scan # Discover NVMe disks (required for next command to succeed)
ls nvme 0:4 / # List the contents of the paired EFI System Partition
```
