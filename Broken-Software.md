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
want us to keep Emacs all to ourselves, now would you?

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

## Broken packages
| Package | Upstream report | Notes |
| ------- | --------------- | ----- |
| cuttlefish |  | downstream patches: [bionic](https://r.android.com/2083840), build/soong ([1](https://r.android.com/2084588), [2](https://r.android.com/2240865)), [external/scudo](https://github.com/pcc/llvm-project/tree/scudo-bionic-page-size) |
| f2fs | https://github.com/torvalds/linux/commit/5c9b469295fb | |
| FEX | https://github.com/FEX-Emu/FEX/issues/1221 | Not likely to be fixed in the near future.<br>Box64 works as an alternative. |
| hardened_malloc | https://github.com/GrapheneOS/hardened_malloc/issues/183 | There are more changes necessary to hardened_malloc before 16k page support is done. It is also not a high priority at the moment as we need MTE |
| jemalloc | https://github.com/jemalloc/jemalloc/issues/467 | Upstream unwilling to fix, Needs build options if compiled on a 4k page size system. Addressed in [ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1914). |
| [fd](https://github.com/sharkdp/fd/issues/1085) or any project using `jemallocator` crate    | https://github.com/sharkdp/fd/issues/1085 | Same reason as jemalloc (also almost always statically linked) |
| lvm2 | https://bugzilla.redhat.com/show_bug.cgi?id=2059734 | Seems to work, but will throw warnings. |
| notion-app(-enhancer) | https://github.com/notion-enhancer/notion-repackaged/issues/107 | electron + broken build flags |
| Wine | https://bugs.winehq.org/show_bug.cgi?id=52715 |
| qemu-user | https://lists.gnu.org/archive/html/qemu-devel/2019-09/msg03664.html | qemu-user can't emulate architectures with a 4K page size (that is, most of them) <br /> <br />Some qemu-user and qemu-system works at [[SW:Ubuntu Asahi Qemu]] of [[SW:Alternative Distros]] |
| Zig | https://github.com/ziglang/zig/issues/11308 | 

## Fixed packages
| Package | Fixing commit | Notes |
| ------- | ------------- | ----- |
| 1Password | _proprietary_ | Fixed as of 8.8.0-119 beta. |
| btrfs | https://lore.kernel.org/lkml/cover.1653327652.git.dsterba@suse.com/ | Fixed since Linux 5.19 |
| Chromium | https://bugs.chromium.org/p/chromium/issues/detail?id=1301788| Includes Electron apps.<br>Fixed since 102. |
| Emacs | https://lists.gnu.org/archive/html/bug-gnu-emacs/2021-03/msg01260.html | Fixed since 28.0 |
| libunwind | https://github.com/libunwind/libunwind/pull/330 | Fix merged to master. Not yet released |
| libglvnd | https://gitlab.freedesktop.org/glvnd/libglvnd/-/merge_requests/262 | Fixed since 1.5.0 |
| pdfium | https://bugs.chromium.org/p/pdfium/issues/detail?id=1853 | Fixed and shipped with Chromium 108 |
| qt5-webengine | https://bugreports.qt.io/browse/QTBUG-105145 | chromium 87, likely won’t be fixed upstream. [Fixed in downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| qt6-webengine | https://bugreports.qt.io/browse/QTBUG-105145 | chromium 94 for 6.3, partially fixed upstream in 6.4 for webview but not for QtPdf. [Fixed in downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| Rust | https://github.com/archlinuxarm/PKGBUILDs/commit/19a1393 | Fixed for `rust-1.62.1-1.1` in ALARM/extra |  
| rr | https://github.com/rr-debugger/rr/pull/3146 | Fixed since 5.6.0. |
| WebKitGTK | https://github.com/WebKit/WebKit/commit/0a4a03da45f774 | Fixed since 2.34.6 |
| Telegram Desktop | https://github.com/telegramdesktop/tdesktop/issues/24564 | Fixed since 4.1.1 |
| Visual Studio Code | https://aur.archlinux.org/packages/visual-studio-code-bin | Fixed since 1.71.0 (uses Electron 19) |