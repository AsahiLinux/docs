This page lists software that is known not to work correctly on Apple Silicon machines.
We publish it in the hope that it incentivises inclined members of the community to contribute
fixes for the affected packages upstream, bettering the AArch64 software ecosystem for everyone.

### If ${PACKAGE} supports AArch64, why doesn't it work?
This is almost always due to incorrect/incomplete support for 16K pages.
Packages are sometimes built assuming a 4K page size, or are otherwise incompatible
with large pages. This has not been a serious issue for desktop Linux software, as
x86/amd64 supports only 4K pages and PowerPC supports only 4K _or_ 64K pages.
AArch64 is unique in that an AArch64 machine can use 4K, 16K _or_ 64K pages.

### Why not just use 4K pages then?
While these machines can boot 4K kernels, doing so requires some very hacky patches,
as the IOMMUs only support 16K-aligned pages. Not does this cause severe performance
penalties, it does not address the actual problem which is userspace software with
incomplete support for AArch64. XNU gets around this by supporting independent
page sizes in userspace, however we have no such mechanism in Linux and likely never will.

### Why not just host a fixed version of ${PACKAGE} yourself?
Desktop-class AArch64 machines are only going to become more common in the next few years.
By having an upstream-first policy we can make sure these fixes are propagated to everyone
via distro repositories, improving the AArch64 ecosystem for everyone! See [Fixed packages](#fixed-packages)
for a list of software that has been fixed for everyone as a result of this. You wouldn't
want us to keep Emacs all to ourselves, now would you?

## Broken packages
| Package | Upstream report | Notes |
| ------- | --------------- | ----- |
| f2fs | https://github.com/torvalds/linux/commit/5c9b469295fb | |
| FEX | https://github.com/FEX-Emu/FEX/issues/1221 | Not likely to be fixed in the near future.<br>Box64 works as an alternative. |
| hardened_malloc | https://github.com/GrapheneOS/hardened_malloc/issues/183 | There are more changes necessary to hardened_malloc before 16k page support is done. It is also not a high priority at the moment as we need MTE |
| jemalloc | https://github.com/archlinuxarm/PKGBUILDs/pull/1914 | Only works when compiled for page sizes >= system. |
| lvm2 | https://bugzilla.redhat.com/show_bug.cgi?id=2059734 | Seems to work, but will throw warnings. |
| Rust | build issue | might use embedded jemalloc using the build system's page size by default, AsahiLinux/Arch Linux Arm [fix](https://github.com/AsahiLinux/alarm-PKGBUILDs/commit/c2459a0ae6fc04b7fe98bb04f10795248eca949b)<br>Does not affect Rust installed via rustup. |
| Zig | https://github.com/ziglang/zig/issues/11308 | 

## Fixed packages
| Package | Fixing commit | Notes |
| ------- | ------------- | ----- |
| btrfs | https://lore.kernel.org/lkml/cover.1653327652.git.dsterba@suse.com/ | 16k subpage handling queued for Linux 5.19 |
| Chromium | https://bugs.chromium.org/p/chromium/issues/detail?id=1301788| Includes Electron apps.<br>Fixed since 102. |
| Emacs | https://lists.gnu.org/archive/html/bug-gnu-emacs/2021-03/msg01260.html | Fixed since 28.0 |
| libunwind | https://github.com/libunwind/libunwind/pull/330 | Fix merged to master. Not yet released |
| rr | https://github.com/rr-debugger/rr/pull/3146 | Fix merged to master. Not yet released. |
| WebKitGTK | https://github.com/WebKit/WebKit/commit/0a4a03da45f774 | Fixed since 2.34.6 |
