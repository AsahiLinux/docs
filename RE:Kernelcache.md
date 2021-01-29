# READ THIS BEFORE PROCEEDING FURTHER

**Asahi Linux has a very strict [reverse engineering policy](asahilinux.org/copyright/). Do not start disassembling macOS code, including the Darwin kernel, unless you have fully read and understood the policy.**

We expect any contributors who wish to use binary reverse engineering as part of their contribution to their project to discuss the specifics with us in advance. This will usually mean arranging a clean-room environment, where their only job will be to write specifications, not any source code, on any related subsystems.

You may be banned from ever contributing code directly to our project if you do not do this. You have been warned.

**Distributing macOS binaries, in whole or in part, is a copyright violation.** Do not upload or share any such files. You have to extract the files from your own installation of macOS, on an Apple computer.

Again, **only proceed if you have talked to us first about this**.

## Extracting the Darwin kernelcache

* Find your kernelcache in the Preboot partition of your OS install
* Grab [img4tool](https://github.com/tihmstar/img4tool)
* `img4tool -a kernelcache -e -p kernelcache.im4p -m kernelcache.im4m`
* `img4tool kernelcache.im4p -e -o kernelcache.macho`
* The result is a standard Mach-O file. You can look at the headers with [machodump.py](https://gist.github.com/marcan/e1808a2f4a5e1fc562357550a770afb1) if you do not have a Mach-O toolchain handy.

