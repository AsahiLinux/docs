Partition management from macOS can be confusing. Hopefully this helps explain things.

Note: We'll add uninstall/cleanup options to the installer soon, but by definition it will always be a simplified tool that is only guaranteed to work for the common case of vanilla Asahi Linux installs; if you do your own partition management or install another distro, you'll have to know how to do it manually like this in order to clean up properly.

**Note: If you are deleting Asahi Linux, you will have to set macOS as the default boot OS again if you have not already done so.** You can do this from System Settings in macOS itself, or by holding down the Option key while selecting it in Startup Options. Not doing this ahead of time won't break your computer, but you may not be able to boot automatically until you do so. If you find you cannot go into the Startup Options screen normally, try starting up with a double tap (tap, release, tap and hold the power button).

## Just wipe it all, please

We have a stupidly dangerous script lying around that will indiscriminately wipe anything with "Linux", "EFI" or "Asahi" in its name, as well as all 2.5GB APFS containers (which the installer creates), with no confirmation. It should work for the vast majority of users as long as they don't already have any weird partitions, but please don't use it indiscriminately. ([There's a report of the wipe going wrong when there are multiple macOS installs, requiring a DFU restore to repair.](https://github.com/AsahiLinux/docs/issues/73)) You're much better off deleting partitions manually if you can help it. We wrote it mostly for developers who do lots of reinstalls and needed a quick way to reset.

Due to [some users **wiping** their macOS installs](https://github.com/AsahiLinux/asahi-installer/issues/253), the https://alx.sh/wipe-linux link has been disabled. If you must use it, you can access the script from the [AsahiLinux/asahi-installer](https://github.com/AsahiLinux/asahi-installer) repo in the [tools](https://github.com/AsahiLinux/asahi-installer/tree/main/tools) directory. **DO NOT RUN THE SCRIPT UNLESS YOU ARE AWARE THAT YOU CAN LOSE ACCESS TO ALL OF YOUR DATA.**

Run `curl -L https://github.com/AsahiLinux/asahi-installer/raw/main/tools/wipe-linux.sh | sh` as root. Ignore "operation not permitted" errors at the end (or run it from recovery mode for that optional part to work properly). Don't blame us if it eats your data. Note that this *won't* expand macOS to fill all freed up space; see below for that.



## Do not use the *Disk Utility* application

The graphical Disk Utility application shipped with macOS only barely works for trivial cases where you have one or more APFS containers, no unpartitioned space, all partitions in the right order, and no foreign partitions. Even for ostensibly "supported" things like creating FAT32/HFS partitions, it is buggy. Just don't use it. It will confuse you, it will show you impossible numbers, and it will do the wrong thing. It is not intended as a proper disk management tool; it is a flimsy user interface front-end that can only handle the simplest of tasks and situations and falls apart completely otherwise.

The commandline `diskutil` has a strange interface and is harder to understand, but at least it usually works properly.

## If everything goes wrong

Apple Silicon machines cannot be bricked, but they can be rendered unbootable if you break your System Recovery. To fix this, you will need to connect another machine to it and use a special DFU recovery procedure to restore it via USB. If you have another Mac handy (Intel works), follow Apple's [official documentation](https://support.apple.com/guide/apple-configurator-mac/revive-or-restore-a-mac-with-apple-silicon-apdd5f3c75ad/mac). If you don't, you can use [idevicerestore](https://github.com/libimobiledevice/idevicerestore) instead. Here's a quick [guide](https://tg.st/u/idevicerestore_quickstart.txt) for that.

If you broke your OS recovery, you might find yourself in a boot loop, even as you hold down the power button. If this happens, shut down the machine, then boot with a quick *double-tap-hold* of the power button (tap, release, press and hold). If you're on a laptop, you might find you can't actually force a shutdown from the boot loop. If this happens, count three seconds from the point where the Apple logo disappears during a loop cycle, then do the double tap. This should get you into System Recovery and you can fix things from there without a full DFU flash.

## Physical disk layout on Apple Silicon

* The NVMe drive has namespaces. You only care about the primary one, that's `disk0` on macOS or `nvme0n1` on Linux.
  * The others are used for kernel panic logs and stuff like that. That's pretty low level stuff you don't have to care about. This is an NVMe thing, like "low-level partitions". Just don't think too much about it.
* The primary namespace is formatted as a GPT partition table, same as on most Linux/Windows/Intel Mac systems these days
* The GPT contains partitions, which can be traditional ones (FAT32, HFS+, Linux...) or APFS containers
* An APFS container contains multiple logical volumes sharing disk space
* Each Apple Silicon machine has two special system APFS containers, the first one on the disk (iBoot System Container) and the last one on the disk (System Recovery). These should never be touched. Only create/remove partitions between them.

Warning: Some of Apple's tools do not like unsorted partitions in the GPT partition table. Since you need to keep the first and last partition in place, that means most disk management operations from Linux will append partitions to the GPT, and put it out of order. Make sure you fix this. With the `fdisk` Linux command this can be done with `x` (go into expert mode) → `f` (fix partitions order) → `r` (return to main menu) → `w` (write changes and exit).

## macOS disk management basics

`disk0` is your NVMe drive. `disk0sN` is a GPT partition within it. `N` is *not* stable and is allocated dynamically by the macOS kernel. It does *not* correspond to the physical slot index in the GPT, nor does it correspond to the physical order of the partition data in the drive. Any time you create a partition, N can be allocated to a different number, and they can all be renumbered on reboot.

`diskN` (`N` >= 1) could be a disk image or an external disk, but more likely is an *APFS container*. This is a hack that Apple came up with to represent subvolumes. The "partitions" within such a disk aren't real partitions, they just represent volumes within one APFS container. The container itself exists within a physical partition in `disk0`. That means that for APFS operations, for example, `disk0s2` and `disk1` could mean the same thing, the former referencing the container by its physical partition, and the latter by the virtual (*synthesized*) disk number.

Multiple macOS installs can share one APFS container. Each OS has a *volume group* consisting of two paired subvolumes, a *System* volume and a *Data* volume. There are extra volumes: `Preboot`, `Recovery`, `VM`, `Update`. These are shared between all OSes in that container. Not all of them necessarily exist.

Each macOS install has within it *its own copy of recoveryOS*. Then there is a global System recoveryOS, and (rarely) an additional System Fallback recoveryOS.

## Asahi Linux installs

For Asahi Linux, we do not install alongside macOS in the same container, because that would require using APFS for Linux (which isn't stable yet nor mainlined). We just create normal GPT partitions for Linux. Asahi Linux also needs to install itself the same way macOS would, into an APFS container as a volume group, to be actually bootable. This is what we call the "stub macOS" and is what links the Apple world to the Linux world. Think of it as a bootloader partition. We *could* share a container with macOS for this, but we *choose* not to because it makes it less error-prone and easier to delete, and we're already partitioning the disk anyway.

So the installer will (for a normal Asahi Linux = Arch Linux ARM install) create three partitions:

* A 2.5GB APFS container, containing the bits of iBoot/macOS we need to boot the machine including a copy of recoveryOS
  * m1n1 stage 1 is installed here
* A 500MB EFI System Partition
  * m1n1 stage 2, U-Boot, and the GRUB core image live here
* A Linux ext4 partition filling up the rest of the space
  * GRUB modules and the Linux kernel/initramfs live here

To uninstall, you need to delete all three.

Asahi Linux is unusual in that, unlike on traditional UEFI systems, we create an EFI System Partition *for each instance you install*. We have a bespoke mechanism for OSes to find the right ESP to install into/boot from to handle this. This is because each ESP is logically tied to the 2.5G stub, and it makes OS management easier if we treat it all as one unit, and use the native boot picker to choose among different OSes (and thus ESPs). You should think of the 2.5GB APFS stub container, the EFI System Partition, and whatever root/... partitions are created after that as one logical "container" for an open source OS within an Apple Silicon system. In a way, m1n1+U-Boot turn your machine into a UEFI system, and each time you install you are creating a new "virtual UEFI environment" within your Apple Silicon Mac (note: this isn't a VM).

## Listing partitions with the Asahi Linux installer

`diskutil` can be very baroque and enumerating installed OSes can be painful, so the Asahi Linux installer itself tries to condense the most important disk information into an easily understandable format. You can run it as usual (`curl https://alx.sh | sh`) and simply quit without doing anything if you just want to see this information.

Here's an example from right after installing Asahi Linux, before completing the second step of the installation:

```
Partitions in system disk (disk0):
  1: APFS [Macintosh HD] (380.00 GB, 6 volumes)
    OS: [B ] [Macintosh HD] macOS v12.3 [disk3s1, D44D4ED9-B162-4542-BF50-9470C7AFDA43]
  2: APFS [Asahi Linux] (2.50 GB, 4 volumes)
    OS: [ *] [Asahi Linux] incomplete install (macOS 12.3 stub) [disk4s2, 53F853CF-4851-4E82-933C-2AAEB247B372]
  3: EFI (500.17 MB)
  4: Linux Filesystem (54.19 GB)
  5: (free space: 57.19 GB)
  6: APFS (System Recovery) (5.37 GB, 2 volumes)
    OS: [  ] recoveryOS v12.3 [Primary recoveryOS]

  [B ] = Booted OS, [R ] = Booted recovery, [? ] = Unknown
  [ *] = Default boot volume
```

This shows:

* One APFS container (380GB) containing 6 volumes (not listed) which comprise one macOS 12.3 install ("Macintosh HD"). Note: "Macintosh HD" is actually the name of the System subvolume, and this is how macOS itself displays volumes.
  * If you had another macOS install sharing space in the same container, it would be listed as another `OS:` line under the same partition.
  * disk3s1 is the *volume* for this macOS system, which means `disk3` is the virtual disk that represents this APFS container partition
  * The UUID is the Volume Group ID of this OS, which is the primary identifier for it (e.g. how the machine finds it to boot it, how you select it in `bputil` prompts, the associated subdirectory name within the Preboot and Recovery subvolumes, and more)
* One APFS container (2.5GB) containing 4 volumes which is actually an Asahi Linux bootloader stub, using macOS 12.3 as its base version, named "Asahi Linux"
  * If the install were complete, this would show your m1n1 stage 1 version. However, because it is not, it is listed as `incomplete install` until you reboot into it holding down the power button and complete the second step of installation.
  * disk4s2 is the *volume* for this stub's system, which means `disk4` is the virtual disk that represents this APFS container partition
* One EFI system partition (FAT32)
* One Linux Filesystem partition (ext4 in this case, but the specific FS isn't identified/shown)
* Some free space (unpartitioned) - note that the installer represents this as its own "partition"
  * `diskutil` instead likes to refer to free space by the partition identifier of the partition right before it in physical disk order, which is needless to say quite confusing and error-prone. We figure giving it its own number makes more sense.
* The System Recovery partition (always exists last), which contains 2 APFS volumes and has one instance of recoveryOS installed (version 12.3).
  * You don't want to touch this, but we show it since knowing what version of recoveryOS is present is useful. There could be a fallback version too.

Note how it tells you that you are currently booted into the *Macintosh HD* OS (`[B ]`), but that the default boot OS is set to Asahi Linux (`[ *]`). If you were to run this from recoveryOS, it'd be shown as a `[R*]` (running the recoveryOS that is part of your default boot OS), unless you ended up falling back to System Recovery, in which case the boot mark would be in the last line, starting `[R ] recoveryOS...`.

Note that the Asahi Linux installer will *not* show you the iBoot System Container partition (to not confuse users too much) but *will* show you your System Recovery partition, so you can see what System Recovery versions(s) you have (but won't let you do anything with it). It also doesn't show physical disk partition numbers.

## Listing partitions with `diskutil`

Use `diskutil list`. The same set-up above looks like this:

```
/dev/disk0 (internal):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                         500.3 GB   disk0
   1:             Apple_APFS_ISC ⁨⁩                        524.3 MB   disk0s1
   2:                 Apple_APFS ⁨Container disk3⁩         380.0 GB   disk0s2
   3:                 Apple_APFS ⁨Container disk4⁩         2.5 GB     disk0s5
   4:                        EFI ⁨EFI - ASAHI⁩             500.2 MB   disk0s4
   5:           Linux Filesystem ⁨⁩                        54.2 GB    disk0s7
                    (free space)                         57.2 GB    -
   6:        Apple_APFS_Recovery ⁨⁩                        5.4 GB     disk0s3

/dev/disk3 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +380.0 GB   disk3
                                 Physical Store disk0s2
   1:                APFS Volume ⁨Macintosh HD⁩            15.2 GB    disk3s1
   2:              APFS Snapshot ⁨com.apple.os.update-...⁩ 15.2 GB    disk3s1s1
   3:                APFS Volume ⁨Preboot⁩                 887.6 MB   disk3s2
   4:                APFS Volume ⁨Recovery⁩                798.7 MB   disk3s3
   5:                APFS Volume ⁨Data⁩                    157.1 GB   disk3s5
   6:                APFS Volume ⁨VM⁩                      20.5 KB    disk3s6

/dev/disk4 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +2.5 GB     disk4
                                 Physical Store disk0s5
   1:                APFS Volume ⁨Asahi Linux - Data⁩      884.7 KB   disk4s1
   2:                APFS Volume ⁨Asahi Linux⁩             1.1 MB     disk4s2
   3:                APFS Volume ⁨Preboot⁩                 63.6 MB    disk4s3
   4:                APFS Volume ⁨Recovery⁩                1.8 GB     disk4s4
```

This shows the physical partitions in the order they are present on disk0 first:

* `disk0` (shown as type "GUID_partition_scheme") actually represents the whole disk (500GB)
* `disk0s1` is the iBoot System Container (type `Apple_APFS_ISC`), not shown in the Installer output
  * This is actually an APFS container with more subvolumes, but `diskutil` itself hides those details from you too!
  * This stores a bunch of system-critical information, you don't want to mess with it
* `disk0s2` is the first APFS container, which holds the "Macintosh HD" macOS volume
  * Note how it says "Container disk3" to indicate this is shown as the virtual/synthesized `disk3` disk.
* `disk0s5` is the Asahi Linux bootloader stub
  * The partition index is out of order! This is logically after `disk0s2` and also in that position in the GPT. These partition numbers don't mean anything, it's whatever macOS feels like assigning that day.
  * This is virtual disk `disk4`.
* `disk0s4` is the FAT32 EFI System Partition (displayed as type `EFI`, and with name `EFI - ASAHI` because it gets truncated for these)
* `disk0s7` is the Linux root partition (displayed as type `Linux filesystem`)
* Then there's some free space
* `disk0s3` is the System Recovery partition (type `Apple_APFS_Recovery`)
  * Really, don't mess with this. It is the only way to recover locally if your OS is broken.

After this, you can see the two APFS containers broken out into volumes, each as their own virtual disk: `disk3` and `disk4`. In fact, there are two more: `disk1` is the iBoot System Container (backed by `disk0s1`) and `disk2` is the System Recovery (backed by `disk0s3`), but these are hidden from diskutil output. Remember, the numbering may/will be different for you!

# **Do not blindly copy and paste these commands**

All the following examples *use disk/partition numbers from the above output*. You need to substitute the right numbers for your system. These *will be different for you*. You have been warned.

## Deleting partitions with `diskutil`

Deleting partitions works *differently* for APFS and non-APFS partitions.

### Deleting APFS containers

To delete the *Asahi Linux* APFS container, use one of these forms:

`diskutil apfs deleteContainer disk4`

`diskutil apfs deleteContainer disk0s5`

The first one identifies it by *virtual disk*, the second one by *physical partition*. They are exactly equivalent and have the same result, as long as you are using the right numbers.

### Deleting other partitions

To delete the EFI and Linux partitions, do this:

```
diskutil eraseVolume free free disk0s4
diskutil eraseVolume free free disk0s7
```

This is called "eraseVolume free free" because diskutil's amazingly intuitive interface represents the concept of deleting partitions as "formatting them as free space" (except for APFS). Yes, really.

## Resizing APFS containers

After deleting Asahi Linux, you could re-install it again (no need to use the resize option in the installer). But if you want to grow macOS to use the full size of the disk again, use either of these:

`diskutil apfs resizeContainer disk0s2 0`

`diskutil apfs resizeContainer disk3 0`

Again, you can use the physical partition identifier or the logical disk number. They are equivalent. The `0` means resize to fill all available free space after the partition. If instead you want to expand/shrink to a given size, specify it there, e.g. `100GB`.

## Addendum: Mounting EFI partition
There are two methods to mount the EFI partition. The first one is this:

```
diskutil list
diskutil mount disk0s4
mount
cd /Volumes/...
```

The second one is this:

```
mkdir /Volumes/efi
mount -t msdos /dev/disk0s4 /Volumes/efi
```