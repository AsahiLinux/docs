---
title: Asahi Linux Distribution Guidelines
---

Asahi Linux exists to reverse engineer, document, and ultimately
implement Linux support for the Apple Silicon platform. While
[Fedora Asahi Remix](https://fedora-asahi-remix.org) is our flagship distribution, representing the
state of the art of Linux support on Apple Silicon, we have always
encouraged interested parties representing other distributions
(and even other FLOSS operating systems like [OpenBSD](https://www.openbsd.org/)) to implement
support for the platform.

Traditionally, it has been unclear whether or not these efforts
are officially endorsed by the Asahi Linux project. This has led
to frustration and confusion on the part of users, distro maintainers,
and Asahi developers alike. Some distros have been semi-integrated
into the project on account of being the distro of choice of
our developers, while others are listed as "supported" in our
documentation despite being drive-by attempts at support led
by a single person who has long since given up.

To remedy this situation, we have compiled a set of guidelines
for distros looking to implement support for Apple Silicon. We
heavily encourage all distributions to strive toward them in the
interests of a consistently good experience for all Apple Silicon
users regardless of their distribution of choice.

These criteria are entirely optional. Everyone is of course
welcome to experiment with and enjoy their favourite distribution
on the Apple Silicon platform, and we will always enable and
encourage this. These guidelines are aimed at mature/mainstream
distributions interested in supporting Apple Silicon in an
official or semi-official capacity. Distros which demonstrate
adherence to these guidelines will be eligible for listing in
our documentation as viable alternatives to Fedora Asahi Remix.

## Required reading
Please familiarise yourself with the [Introduction to Apple Silicon](../platform/introduction.md),
[Open OS Platform Integration](../platform/open-os-interop.md),
and [Boot Process Guide](boot-process-guide.md) documents before continuing.

## Official buy-in
Your project to implement Apple Silicon support in your distro of
choice must be directly supported - or otherwise acknowledged - by
your distro's official maintainers. This may vary depending on your
distro's policy and organisational structure, however typically this
will take the form of an official taskforce/group endorsed by the
distro, e.g. the [Fedora Asahi SIG](https://fedoraproject.org/wiki/SIGs/Asahi),
[Gentoo Asahi Project](https://wiki.gentoo.org/wiki/Project:Asahi), or Debian's
[Team Bananas](https://wiki.debian.org/Teams/Bananas).

## Complete and up to date packages
You must have the following list of packages present in your distro.
Preferably, these will be in official package repositories. However,
it is acceptable for them to be in a third-party repository (e.g.
Fedora COPR, Portage Overlay) provided that your repository has been
endorsed by your distro's official maintainers.

* [The Asahi Linux fork of the Linux kernel](https://github.com/AsahiLinux/linux)
* [m1n1](https://github.com/AsahiLinux/m1n1)
* [The Asahi Linux fork of Das U-Boot](https://github.com/AsahiLinux/u-boot)
* [asahi-scripts](https://github.com/AsahiLinux/asahi-scripts) or equivalent configuration presets/scripts
* [tiny-dfr](https://github.com/AsahiLinux/tiny-dfr)
* [asahi-firmware](https://github.com/AsahiLinux/asahi-installer) (including its dependency lzfse)
* [speakersafetyd](https://github.com/AsahiLinux/speakersafetyd)
* [asahi-audio](https://github.com/AsahiLinux/asahi-audio) (and its LV2 plugin dependencies)

New versions of the above software must be packaged in your
distro's bleeding edge (e.g. Fedora Rawhide or Gentoo's
unstable package stream) within 2 weeks of becoming available upstream.

## Installation procedure
Asahi Linux uses Das U-Boot's UEFI environment to chainload standard UEFI
bootloaders, such as GRUB and systemd-boot. The Asahi Installer is capable
of setting up a minial UEFI-only environment capable of booting UEFI
executables on removable media. This provides users an installation
experience that is almost identical to a standard amd64-based workstation.
Building Apple Silicon support into your distro's existing AArch64 bootable
media (e.g. via a secondary Asahi kernel selectable at the UEFI bootloader)
allows the reuse of all your distro's existing upstream AArch64 resources,
and negates the need to fork the Asahi Installer.

When selecting the minimal UEFI environment installation option, the Asahi
Installer can be directed to create free space for a future root filesystem.
Your guide must instruct users to use this facility to prepare their disk
for your distribution rather than attempting to manually shrink or alter
APFS containers via your installer.

Your installation process should be as close to your distro's standard
installation procedure as possible. If your distro has an officially endorsed
automatic installer (e.g. Anaconda), then it must be used. If your
distro follows a manual guided installation (e.g. Gentoo Handbook), then
you must have a clear and easy to follow guide specific to Apple Silicon.
You must not instruct your users to materially deviate from your distro's
prescribed official installation procedure. 

If your installer attempts to partition the user's disk automatically, then
you _should_ explicitly warn your users against making use of it if it cannot
be made to ignore APFS containers. Altering or destroying any of the
on-disk APFS containers will require your users to DFU restore their Mac.

Instead, your installation procedure _must_ encourage manual partitioning,
with a section in your guide explaining the dangers of carelessly altering
the partition table. Users must be made aware that it is _never_ safe to
alter or rearrange _any_ disk structure other than the free space left by
the Asahi Installer.

_Note: We are actively working on improving the safety of common disk partitioning
and installation tooling. We may tighten these requirements in the future as
tools such as cfdisk, blivet, Anaconda, etc. become capable of automatically
handling Apple Silicon devices safely._

Your installation must install the Asahi-specific packages listed above as
part of the installation procedure, or a subset suitable for the installation
type. For example, server operating systems may choose to forego automatically
installing the audio enablement packages.

## Infrastructure and hosting
You or your distro will assume all responsibility for any required hosting
or infrastructure other than the Asahi Installer. This includes any
documentation, packages, CI runners to build packages, CDNs etc. The Asahi
Linux project cannot do this for you.

## Support
Your distro must have first-class, mature support for AArch64/ARM64 upstream.

You or your distro will provide official support for distro-specific issues
relating to the Apple Silicon platform. This includes acting as the first
point of contact for users when they encounter bugs or other issues with any
packaged software. Apple Silicon should be a first-class platform within your
distro's broader AArch64/ARM64 support.

## Using a forked installer and disk image
There are two supported mechanisms for installing Linux on Apple Silicon Macs.
As an alternative to the standard UEFI media method described above, the Asahi
Installer can free space on the NVMe drive and then flash a prebuilt OS image
into that space. This mimics other AArch64 embedded platforms, such as the
Raspberry Pi, and provides a way for users not familiar or confident with
installing Linux an easy way to get started at the expense of customisability.
For more details on how this works, please see [AsahiLinux/asahi-installer](https://github.com/AsahiLinux/asahi-installer).

We expect distros to fork, modify, and host the reference Asahi Installer themselves
if choosing to go down this route. We cannot host your images or make distro-specific
changes to our reference installer.

Your disk image based installation should follow these guidelines:

* The installer and disk images are built and hosted by the distro officially
* The disk images are ZIPped and streamable from the Web
* The OS scrambles the root partition's UUID on first boot
* The OS grows its root partition into trailing free space on first boot
* The disk image includes all Asahi-specific packages
* All supported hardware is enabled and working from the first boot
* Disk images are reasonably up to date
* The install flow for all images is tested before release
* All disk images are thoroughly tested on multiple devices before release

It should be noted that the disk image installation flow is a curiosity of early
bringup work that ended up sticking. While this installation method has its advantages,
it is not the way forward for workstation-class hardware and contributes to the stigma
of AArch64 devices being janky developers' toys. We heavily encourage distros
to invest time in building AArch64 bootable media with Apple Silicon support,
and leverage the reference installer's minimal UEFI environment. As mentioned above,
this aligns closer with user expectations and 40 years of precedence when dealing with
workstation-grade hardware.

We are actively working on improving the tooling required to make bootable media installs
safer for users. Once we consider mainstream disk partitioning software and live media
installation tooling sufficiently foolproof on Apple Silicon devices, we _may_ reconsider
the need to support the image-based installation flow going forward.

## Disendorsement
Through dilligent QA and attention to detail, Asahi Linux has
become well-regarded as one of the best desktop Linux experiences available.
This is a great source of pride for us, and we are determined to meet the high
user expectations that come with such a reputation. We expect officially
endorsed distros to strive to meet those same expectations.

We hope that it will never be necessary to do so, but we may be required to
disendorse distros that are not meeting user or Asahi Linux expectations.
Disendorsed distros will be delisted from our documentation. Depending on the
circumstances, we may also discourage use of the disendorsed distro.

Reasons for disendorsement may include:

* A lack of official distro support for the Apple Silicon platform
* Frequent or recurring distro-specific issues that cannot be reproduced
  on Fedora Asahi Remix, especially if such issues are not addressed in
  a timely fashion
* Repeated failure to keep Asahi packages current
* Failure to keep installer disk images current (if image-based installation is offered)

