# Getting the macOS development kernel and creating the kernelcache

1. Create a macOS developer account (requires an icloud account.
2. Download the Mac OS Kernel Development Kit (KDK) from apple: https://developer.apple.com/download/more/, it should match your macOS version.
3. Install the KDK into Mac OS, the KDK will be installed to `/Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk`
4. Change to the kernels directory: `cd /Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk/System/Library/Kernels`
5. Switch into the KDK folder and run the following command:
```
kmutil create -z -n boot -a arm64e -B ~/dev.kc.macho -V development \
-k kernel.development.t8101 \
-r /System/Library/Extensions/ \
-r /System/Library/DriverExtensions \
-x $(kmutil inspect -V release --no-header | grep -v "SEPHiber" | awk '{print " -b "$1; }')
```
`-B` designates the output file, our kernel cache is written to `dev.kc.macho` in the home directory

# Starting macOS using the m1n1 hypervisor
1. Copy the kernelcache to your development machine
2. Copy the debug DWARF from `/Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk/System/Library/Kernels/kernel.development.t8101.dSYM/Contents/Resources/DWARF/kernel.development.t8101`
3. Run 
```python3 proxyclient/run_guest.py -s <PATH_TO_DEBUG_DWARF> <PATH_TO_DEVELOPMENT_KERNEL_CACHE> -- "cpus=1 debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1"```
to start macOS with the m1n1 hypervisor.

# Sources
Source for the kernelcache creation: https://github.com/AsahiLinux/docs/wiki/SW:Hypervisor