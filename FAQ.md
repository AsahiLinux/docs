## When will Asahi Linux be "done"?

→ [["When will Asahi Linux be done?"]]

## Does $thing work yet?

→ [[Feature Support]]

## How do I install it?

See the website for instructions: https://asahilinux.org/

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

## Do I need to reinstall to get new features / updates?

No! Just upgrade your system using `dnf upgrade`. Kernel updates will require a reboot. Consider a tool like `needrestart` to determine if there are any outdated services or an outdated kernel running.

## Two of the keys on my keyboard are swapped

This is a property inherent to some apple keyboards. Please read https://wiki.archlinux.org/title/Apple_Keyboard to learn how to fix this issue.

## My system keeps booting into macOS, not Asahi!

macOS may be set as your default boot medium. Enter One True Recovery (1TR) by shutting down and powering on while holding the power button for 15 seconds. You can either select Asahi Linux while holding the Option key or enter the Settings page, unlock macOS, then set the bootloader to reboot into Asahi.

## I am having performance/tearing/feature issues on Xorg

Please stop using Xorg and switch to Wayland. Xorg as a primary display server is all but unmaintained, and its architecture is at odds with modern display hardware as is present on Apple Silicon devices. We do not have the development bandwidth to spend time on Xorg and its idiosyncrasies. Distributions and downstream desktop environments are already dropping Xorg support. You are free to keep using it if you wish, but we will not be supporting it beyond "it starts and displays a basic desktop correctly".

The [Fedora Asahi Remix](https://asahilinux.org/fedora/) (the flagship reference distribution) is Wayland-only out of the box for this reason.

## Screen recording is slow

Make sure you have the GPU drivers installed. If screen recording is still slow, you are probably using a screen recording app or compositor that directly reads out or copies GPU display surfaces from the CPU. GPU display surfaces are optimized for GPU access, and direct CPU readout is unlikely to even work at all once we switch to compressed primary display framebuffers. In other words, approaches such as [kmsgrab](http://underpop.online.fr/f/ffmpeg/help/kmsgrab.htm.gz) are fundamentally flawed, will perform poorly, and will stop working entirely in the future. You should use a display compositor and recording app that correctly share GPU textures and then optimize the read-out for CPU encoding. KDE's KWin and OBS are known to work well together, as well as KDE's standalone Spectacle screenshot/recording app.

## Chromium / VS Code / Slack / ARMCord / some other Electron app or Chrome-based browser stopped rendering after an update.
This is an [upstream Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1442633) affecting all Chromium-based frameworks such as [Electron](https://github.com/electron/electron/issues/40366). You have to manually delete your shader cache (e.g. `~/.config/Slack/GPUCache`). We can't do anything about it until the fix is backported/released to users.