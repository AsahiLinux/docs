---
title: Broken Software
---

This page lists software that is known not to work correctly on Apple Silicon machines.
We publish it in the hope that it incentivizes inclined members of the community to contribute
fixes for the affected packages upstream, bettering the AArch64 software ecosystem for everyone.

### If ${PACKAGE} supports AArch64, why doesn't it work?
This is almost always due to incorrect/incomplete support for 16K pages.
Packages are sometimes built assuming a 4K page size, or are otherwise incompatible
with large pages. This has not been a serious issue for desktop Linux software, as
x86/amd64 supports only 4K pages and PowerPC supports only 4K _or_ 64K pages.
AArch64 is unique in that an AArch64 machine can use 4K, 16K _or_ 64K pages.

### Why not just use 4K pages then?
While these machines can boot 4K kernels, doing so requires some very hacky patches,
as the IOMMUs only support 16K-aligned pages. Not only does this cause severe performance
penalties, but it does not address the actual problem which is userspace software with
incomplete support for AArch64. XNU (macOS) gets around this by supporting independent
page sizes in userspace, however we have no such mechanism in Linux and likely never will.

### Why not just host a fixed version of ${PACKAGE} yourself?
Desktop-class AArch64 machines are only going to become more common in the next few years.
By having an upstream-first policy we can make sure these fixes are propagated to everyone
via distro repositories, improving the AArch64 ecosystem for everyone! See [Fixed packages](#fixed-packages)
for a list of software that has been fixed for everyone as a result of this. You wouldn't
want us to keep Emacs all to ourselves now, would you?

### Why does "not work" sometimes mean "instantly segfault"?
If an ELF executable or library has sections which are not aligned to 16K pages, the loader
will be unable to map the binary into memory and will signal this failure by causing
a segmentation fault before the program even technically starts execution.

You can confirm that this is the case using `readelf -l /path/to/binary`. All program
header sections of type `LOAD` must have an `ALIGN` value of at least `0x4000` to
successfully load on a 16K machine like Apple Silicon. The library illustrated here
is only aligned for 4K pages (`0x1000`) so it cannot load.

```
$ readelf -l lib64/ld-android.so

Elf file type is DYN (Shared object file)
Entry point 0x0
There are 9 program headers, starting at offset 64

Program Headers:
  Type           Offset             VirtAddr           PhysAddr
                 FileSiz            MemSiz              Flags  Align
  PHDR           0x0000000000000040 0x0000000000000040 0x0000000000000040
                 0x00000000000001f8 0x00000000000001f8  R      0x8
  LOAD           0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000874 0x0000000000000874  R      0x1000
  LOAD           0x0000000000001000 0x0000000000001000 0x0000000000001000
                 0x0000000000000004 0x0000000000000004  R E    0x1000
  LOAD           0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x00000000000000a0  RW     0x1000
  DYNAMIC        0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x00000000000000a0  RW     0x8
  GNU_RELRO      0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x0000000000001000  R      0x1
  GNU_EH_FRAME   0x000000000000082c 0x000000000000082c 0x000000000000082c
                 0x0000000000000014 0x0000000000000014  R      0x4
  GNU_STACK      0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000000 0x0000000000000000  RW     0x0
  NOTE           0x0000000000000238 0x0000000000000238 0x0000000000000238
                 0x0000000000000020 0x0000000000000020  R      0x4

 Section to Segment mapping:
  Segment Sections...
   00     
   01     .note.gnu.build-id .dynsym .gnu.hash .dynstr .eh_frame_hdr .eh_frame 
   02     .text 
   03     .dynamic 
   04     .dynamic 
   05     .dynamic 
   06     .eh_frame_hdr 
   07     
   08     .note.gnu.build-id 
```

Though the default for AArch64 compilers is to produce ELF files with sections aligned
to 64K for compatibility with all AArch64 machines, tooling bugs (such as binaries
manipulated by old versions of `patchelf`) or customized compiler flags (such as
many Google programs, including older versions of Chrome (and Electron) and most current
Android programs) may result in a binary whose sections are only aligned to 4K.

## Are there any available workarounds?

Fedora Linux Asahi Remix's `muvm` package is, by default, configured to virtualize a 4K
kernel (along with setting FEX as the x86_64 binfmt handler so x86_64 programs may be
run). You may have varying levels of success by attempting to run your software in `muvm`.

## Broken packages
| Package | Upstream report | Notes |
| ------- | --------------- | ----- |
| hardened_malloc | <https://github.com/GrapheneOS/hardened_malloc/issues/183> | There are more changes necessary to hardened_malloc before 16k page support is done. It is also not a high priority at the moment as we need MTE |
| jemalloc | <https://github.com/jemalloc/jemalloc/issues/467> | Upstream unwilling to fix, Needs build options if compiled on a 4k page size system. Addressed in [ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1914). |
| notion-app(-enhancer) | <https://github.com/notion-enhancer/notion-repackaged/issues/107> | electron + broken build flags |
| Waydroid | <https://github.com/waydroid/waydroid/issues/373> | Upstream AOSP is working on 16k page support: <https://developer.android.com/guide/practices/page-sizes> |

\* Running x86-64 software is supported via a 4k page size microVM running FEX.

## Fixed packages
| Package | Fixing commit | Notes |
| ------- | ------------- | ----- |
| 1Password | _proprietary_ | Fixed as of 8.8.0-119 beta. |
| Android Cuttlefish | <https://android-review.googlesource.com/c/device/google/cuttlefish/+/2545951> | Fixed in AOSP main branch by switching to musl. |
| box64 | <https://github.com/ptitSeb/box64/issues/384> | Fixed since 0.2.8 |
| btrfs | <https://lore.kernel.org/lkml/cover.1653327652.git.dsterba@suse.com/> | Fixed since Linux 5.19 ([caveats](https://web.archive.org/web/20241204022740/https://social.treehouse.systems/@marcan/111493984306764821)) |
| Chromium | <https://bugs.chromium.org/p/chromium/issues/detail?id=1301788> | Includes Electron apps.<br>Fixed since 102. |
| Emacs | <https://lists.gnu.org/archive/html/bug-gnu-emacs/2021-03/msg01260.html> | Fixed since 28.0 |
| f2fs | <https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=d7e9a9037de27b642d5a3edef7c69e2a2b460287> | Fixed since Linux 6.7 |
| fd | <https://github.com/sharkdp/fd/issues/1085> | Fixed since 10.1 |
| k3s-io | <https://github.com/k3s-io/k3s/issues/7335> | Fixed since 1.27.2 |
| KiCad | <https://gitlab.com/kicad/code/kicad/-/issues/16008> | Fixed since 7.0.10 |
| libglvnd | <https://gitlab.freedesktop.org/glvnd/libglvnd/-/merge_requests/262> | Fixed since 1.5.0 |
| libunwind | <https://github.com/libunwind/libunwind/pull/330> | Fixed since 1.7.0 |
| libunwind | <https://github.com/libunwind/libunwind/issues/260> | Fixed since 1.8.0 |
| libvirt/QEMU/KVM | <https://patchew.org/QEMU/20230727073134.134102-1-akihiko.odaki@daynix.com/> | Fixed since QEMU 7.2.6 / 8.0.5 / 8.1.1 |
| lvm2 | <https://bugzilla.redhat.com/show_bug.cgi?id=2059734> | Fixed since 2.03.21 |
| MEGAsync | <https://github.com/meganz/MEGAsync/issues/303> <https://github.com/meganz/MEGAsync/issues/310> | Fixed since 5.12.0 |
| pdfium | <https://bugs.chromium.org/p/pdfium/issues/detail?id=1853> | Fixed and shipped with Chromium 108 |
| qt5-webengine | <https://bugreports.qt.io/browse/QTBUG-105145> | chromium 87, likely won’t be fixed upstream. [Fixed in downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| qt6-webengine | <https://bugreports.qt.io/browse/QTBUG-105145> | chromium 94 for 6.3, partially fixed upstream in 6.4 for webview but not for QtPdf. [Fixed in downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| Redis | <https://bugzilla.redhat.com/show_bug.cgi?id=2240293> <https://bodhi.fedoraproject.org/updates/FEDORA-2023-bdb1515542> | Fixed in fedora since redis-7.0.13-2.fc38 and redis-7.2.1-2.fc39) |
| rr | <https://github.com/rr-debugger/rr/pull/3146> | Fixed since 5.6.0 |
| Rust | <https://github.com/archlinuxarm/PKGBUILDs/commit/19a1393> | Fixed for `rust-1.62.1-1.1` in ALARM/extra |  
| Telegram Desktop | <https://github.com/telegramdesktop/tdesktop/issues/26103> | Fixed since 4.1.1 |
| Visual Studio Code | <https://aur.archlinux.org/packages/visual-studio-code-bin> | Fixed since 1.71.0 (uses Electron 19) |
| WebKitGTK | <https://github.com/WebKit/WebKit/commit/0a4a03da45f774> | Fixed since 2.34.6 |
| Wine | <https://bugs.winehq.org/show_bug.cgi?id=52715> | Fixed since 10.5 |
| Zig | <https://github.com/ziglang/zig/issues/11308> | Fixed since [0.14.0](https://ziglang.org/download/0.14.0/release-notes.html#Runtime-Page-Size) |

## Bugs

Issues (other than page size and architectural support issues) in third-party software, reported and/or tracked by Asahi core team members:

### Open Bugs

| Package          | Issue | Notes |
| ---------------- | ----- | ----- |
| firefox          | [wayland: The first frame on startup is sometimes uninitialized for a moment (also maybe on x11)](https://bugzilla.mozilla.org/show_bug.cgi?id=1831051) |
| gnome-bluetooth/bluez | Frequent audio stutters and deconnections of audio A2DP output (no issues using blueman) | No bugs filled yet |
| hyprland         | [Explicit sync doesn't work on split-node gpu drivers](https://github.com/hyprwm/Hyprland/issues/10401) |
| kwin             | [Root background damage regions are calculated incorrectly with multiscreen](https://bugs.kde.org/show_bug.cgi?id=477454) |
| plasmashell      | [startplasma breaks variable merging between profile.d and environment.d](https://bugs.kde.org/show_bug.cgi?id=491579) |
| systemsettings   | [default system keyboard model is not correctly set on Wayland](https://bugs.kde.org/show_bug.cgi?id=475435) |
| wireplumber      | [Cannot pass args to PW modules from lua](https://gitlab.freedesktop.org/pipewire/wireplumber/-/issues/538) |
| wlroots          | [Add support for DRM Color Transformation Matrix (Useful for e.g. redshift)](https://gitlab.freedesktop.org/wlroots/wlroots/-/issues/1078) | [Related PR](https://gitlab.freedesktop.org/wlroots/wlroots/-/merge_requests/4815) |
| wlroots          | [cannot open render as master when using seatd](https://gitlab.freedesktop.org/wlroots/wlroots/-/issues/3911) |
| xkeyboard-config | [Handling Mac Fn keys in xkeyboard](https://gitlab.freedesktop.org/xkeyboard-config/xkeyboard-config/-/issues/379) |



### Closed Bugs

| Package          | Issue | Notes |
| ---------------- | ----- | ----- |
| abrt             | [ABRT can't submit crash report: processing failed](https://bugzilla.redhat.com/show_bug.cgi?id=2238248) | Issue Closed |
| blender          | [blender core dumps at execution instead of giving sane feedback about unsupported hardware](https://bugzilla.redhat.com/show_bug.cgi?id=2237821) | Issue Closed |
| chromium         | [Skia shader compilation error](https://bugs.chromium.org/p/chromium/issues/detail?id=1442633) | Fixed in Chromium 121.0.6167.85 |
| chromium         | [cppgc crashes on Linux w/ 16KiB pages because of hardcoded kGuardPageSize](https://issues.chromium.org/issues/378017037) | Fixed in Chromium 133.0.6943.141 |
| dracut           | [Memoize find_kmod_module_from_sysfs_node](https://github.com/dracut-ng/dracut-ng/pull/408) | Fixed in dracut 103 |
| firefox          | [YouTube is capping resolutions to 1080 on Linux aarch64 user agents](https://bugzilla.mozilla.org/show_bug.cgi?id=1869521) | Fixed in Firefox 123 |
| gcc              | [LTO miscompilation of ceph on aarch64 and x86_64](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=113359) | Fixed in gcc 13.3 / 14.1 |
| glibc            | [TLS modid reuse breaks TLS accesses](https://bugzilla.redhat.com/show_bug.cgi?id=2251557) | Fixed in glibc 2.39 |
| gtk              | [GSK issues illegal render ops with load=dont-care and blend=over with Wayland fractional scaling, causing graphical corruption](https://gitlab.gnome.org/GNOME/gtk/-/issues/7146) | Fixed in gtk 4.17.6 |
| gtk              | [GSK/vulkan uses mipmaps without checking the formats/tiling `VkImageFormatProperties.maxMipLevels`](https://gitlab.gnome.org/GNOME/gtk/-/issues/7229) | Fixed in gtk 4.17.5 |
| hyprland         | [issue with OpenGL applications crashing when using Hyprland 0.42.0](https://github.com/hyprwm/Hyprland/issues/7364) | Fixed in hyprland 0.43.0 |
| kpipewire        | [Spectacle fails to record a window with h264 in specific dimensions](https://bugs.kde.org/show_bug.cgi?id=475472) | Issue Closed |
| kpipewire        | [OpenH264 codec support](https://bugs.kde.org/show_bug.cgi?id=476187) | Fixed in Plasma 6.1.4 |
| kwin             | [Outputs freeze on multi-screen when hardware cursors are not supported](https://bugs.kde.org/show_bug.cgi?id=477451) | Fixed in Plasma 6.0 |
| kwin             | [Software cursor repaints are glitchy with fractional scaling sometimes](https://bugs.kde.org/show_bug.cgi?id=477455) | Fixed in Plasma 6.0 |
| lsp-common-lib   | [Fix atomic operations for AArch64](https://github.com/lsp-plugins/lsp-plugins/issues/463) | Fixed in lsp-common-lib 1.0.40 |
| lib-dsp-lib      | [Fix aarch64 msmatrix code](https://github.com/lsp-plugins/lsp-dsp-lib/pull/20) | Fixed in lsp-dsp-lib 1.0.20 |
| plasmashell      | [startplasma breaks variable merging between profile.d and environment.d](https://bugs.kde.org/show_bug.cgi?id=491579) |
| qqc2-desktop-style | [Some text glyphs in QML software are vertically mis-aligned or squished when using a fractional scale factor](https://bugs.kde.org/show_bug.cgi?id=479891) | Fixed in KDE Frameworks 6.9.0 |
| wireplumber      | [Wireplumber ignores default playback volume](https://gitlab.freedesktop.org/pipewire/wireplumber/-/issues/655#) | Fixed in wireplumber 0.5.3 |
