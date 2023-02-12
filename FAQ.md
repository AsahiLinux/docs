## When will Asahi Linux be "done"?

→ [["When will Asahi Linux be done?"]]

## Does $thing work yet?

→ [[Feature Support]]

## How do I install it?

See the alpha release blog post: https://asahilinux.org/2022/03/asahi-linux-alpha-release/

## How do I uninstall / clean up a failed installation?

There is no automated uninstaller, but see [[Partitioning cheatsheet]] to learn how to delete the partitions manually.

## I have ~40GB of free disk space but the installer says that's not enough!

The installer always leaves 38GB of disk space *free* for macOS upgrades to work. That means you need enough disk space for the new OS *on top of* those 38GB.

If you want to skip this check, enable expert mode at the beginning. Keep in mind that you might be unable to update macOS if you do not have enough free disk space left over!

## Common problems

### I get an error during the macOS resize step of the installer

Read the error message carefully. It'll be one of these:

#### "Storage system verify or repair failed"

You have existing APFS filesystem corruption (not caused by the installer) that is preventing a successful resize of your macOS partition. See [this issue](https://github.com/AsahiLinux/asahi-installer/issues/81) for more information and fix steps.

#### "Your APFS Container resize request is below the APFS-system-imposed minimal container size (perhaps caused by APFS Snapshot usage by Time Machine)"

As the message implies, this is caused by Time Machine snapshots taking up "free" space on your disk. See [this issue](https://github.com/AsahiLinux/asahi-installer/issues/86) for more information and fix steps.

### Disk Utility doesn't work for me after installing / for uninstalling / any other time!

Don't use Disk Utility, it's broken and only works for really simple partition setups. See [[Partitioning cheatsheet]] to learn how to manage partitions with the command line instead.

## How come HDMI works on Mac Mini but not MacBook?

HDMI on the MacBook is internally connected to a Thunderbolt port.
HDMI on the Mac Mini is internally connected to a DisplayPort port.

## Do I need to reinstall to get new features / updates?

No! Just upgrade your system using `pacman -Syu`. Kernel updates will require a reboot. Consider a tool like `needrestart` to determine if there are any outdated services or an outdated kernel running.

## Two of the keys on my keyboard are swapped

This is a property inherent to some apple keyboards. Please read https://wiki.archlinux.org/title/Apple_Keyboard to learn how to fix this issue.

## My system keeps booting into macOS, not Asahi!

macOS may be set as your default boot medium. Enter One True Recovery (1TR) by shutting down and powering on while holding the power button for 15 seconds. You can either select Asahi Linux while holding the Option key or enter the Settings page, unlock macOS, then set the bootloader to reboot into Asahi.