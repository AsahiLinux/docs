This wiki page lists software known to have issues with 16k page size (default on Apple Silicon Macs)

| Software  | Fixed? | upstream report / PR / fix                      | Notes                                                  |
|-----------|--------|-------------------------------------------------|--------------------------------------------------------|
| chromium  | ✅ | https://bugs.chromium.org/p/chromium/issues/detail?id=1301788                                                | Includes electron-based apps (e.g. vscode, spotify, …) <br> Fix to appear in the yet-unreleased chromium 102 |
| jemalloc  | ❌ | https://github.com/archlinuxarm/PKGBUILDs/pull/1914                                                | Works when compiled for a page size greater than or equal to the system's    |
| libunwind | ✅ | https://github.com/libunwind/libunwind/pull/330 | fix in master, not yet released                        |
| webkitgtk | ✅ | https://github.com/WebKit/WebKit/commit/0a4a03da45f774 | Fixed since 2.34.6 (see [changelog](https://trac.webkit.org/wiki/WebKitGTK/2.34.x)) |
| f2fs      | ❌ | https://github.com/torvalds/linux/commit/5c9b469295fb |                                                        |
| lvm2 | ❌ | https://bugzilla.redhat.com/show_bug.cgi?id=2059734 | Seems to work, but will throw warnings. Examples: [1 (pvcreate)](https://sourceware.org/git/?p=lvm2.git;a=blob;f=lib/metadata/metadata.c;h=1cda1888f35698c43a0dbc0ca4d8693730ad9a0f;hb=HEAD#l134) [2 (pvck)](https://sourceware.org/git/?p=lvm2.git;a=blob;f=tools/pvck.c;h=5273da63ca4ea7f527972a392df998dcc88692cb;hb=HEAD#l1150) |
| fex-emu | ❌ | https://github.com/FEX-Emu/FEX/issues/1221 | Looks as though Ryan has no intention to ever properly support 16k pages. Builds fine but will not run, complaining about "incorrect" system page size. |
| emacs | ✅ | https://lists.gnu.org/archive/html/bug-gnu-emacs/2021-03/msg01260.html | Fix to appear in the yet-unreleased emacs-28 |
| hardened_malloc | ❌ | https://github.com/GrapheneOS/hardened_malloc/issues/183 | There are more changes necessary to hardened_malloc before 16k page support is done. It is also not a high priority at the moment as we need MTE |
| zig | ❌ | https://github.com/ziglang/zig/issues/11308 | 
| rust | ❌ | build issue | might use embedded jemalloc using the build system's page size by default, AsahiLinux/Arch Linux Arm [fix](https://github.com/AsahiLinux/alarm-PKGBUILDs/commit/c2459a0ae6fc04b7fe98bb04f10795248eca949b)
| btrfs | | https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/btrfs/subpage.c | blocksize==pagesize works, 4K blocksize support with 16K pages needs more work |
| rr | ❌ | https://github.com/rr-debugger/rr/pull/3146 |
