This wiki page lists software known to have issues with 16k page size (default on Apple Silicon Macs)

| Software  | Fixed? | upstream report / PR / fix                      | Notes                                                  |
|-----------|--------|-------------------------------------------------|--------------------------------------------------------|
| chromium  | ❌     |                                                 | Includes electron-based apps (e.g. vscode, spotify, …) |
| jemalloc  | ❌     |                                                 | Works but isn’t portable once compiled in 4k or 16k    |
| libunwind | ❌     | https://github.com/libunwind/libunwind/pull/330 |                                                        |
| webkitgtk | ✅     | https://github.com/WebKit/WebKit/commit/0a4a03da45f7749d31ba63ca2d569e891ee58018 | Fixed since 2.34.6 (see [changelog](https://trac.webkit.org/wiki/WebKitGTK/2.34.x)) |
| f2fs      | ❌     |                                                 |                                                        |
| lvm2 | ❌ | |Seems to work, but will throw warnings. Examples: [1 (pvcreate)](https://sourceware.org/git/?p=lvm2.git;a=blob;f=lib/metadata/metadata.c;h=1cda1888f35698c43a0dbc0ca4d8693730ad9a0f;hb=HEAD#l134) [2 (pvck)](https://sourceware.org/git/?p=lvm2.git;a=blob;f=tools/pvck.c;h=5273da63ca4ea7f527972a392df998dcc88692cb;hb=HEAD#l1150) |
| fex-emu | ❌ | https://github.com/FEX-Emu/FEX/issues/1221 | Looks as though Ryan has no intention to ever properly support 16k pages. Builds fine but will not run, complaining about "incorrect" system page size. |