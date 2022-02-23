This wiki page lists software known to have issues with 16k page size (default on Apple Silicon Macs)

| Software  | Fixed? | upstream report / PR / fix                      | Notes                                                  |
|-----------|--------|-------------------------------------------------|--------------------------------------------------------|
| chromium  | ❌     |                                                 | Includes electron-based apps (e.g. vscode, spotify, …) |
| jemalloc  | ❌     |                                                 | Works but isn’t portable once compiled in 4k or 16k    |
| libunwind | ❌     | https://github.com/libunwind/libunwind/pull/330 |                                                        |
| webkitgtk | ✅     | https://github.com/WebKit/WebKit/commit/0a4a03da45f7749d31ba63ca2d569e891ee58018 | Fixed since 2.34.6 (see [changelog](https://trac.webkit.org/wiki/WebKitGTK/2.34.x)) |
| f2fs      | ❌     |                                                 |                                                        |