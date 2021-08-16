# Getting the macOS development kernel and creating the kernelcache

1. Create a macOS developer account (requires an icloud account.
2. Download the Mac OS Kernel Debug Kit (KDK) from Apple: https://developer.apple.com/download/more/, it should match your Mac OS version.
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

Note: t8101 files(both kernel and dwarf symbols) are available starting with KDK for macOS 11.3. Marcan streams on booting macOs with hypervisor were done with 11.3. These notes have also been validated with macOS 11.5.2 and can get to login with wifi network on MacBookAir:
Kernel version:
 uname -a
Darwin MacBook-Air.home 20.6.0 Darwin Kernel Version 20.6.0: Wed Jun 23 00:26:27 PDT 2021; root:xnu-7195.141.2~5/RELEASE_ARM64_T8101 arm64

macOS version:
sw_vers 
ProductName:	macOS
ProductVersion:	11.5.2
BuildVersion:	20G95

If you see the apple logo(rainbow version) and not the progress bar, this means you probably had a macOS panic early in the boot process.
This can come from a mismatch of macOS version between the kernel cache (kernel+extensions) and the macOS root fs.
To figure out where the boot process is stuck, you can start a serial utility like minicom/picocom and the like, with 115200 baud rate (something like picocom -b 115200 /dev/ttyACM1).
Be patient when you are booting, with one cpu and the hypervisor, depending on what you are tracing, it is slower than normal and it is expected. Here are some numbers from some experiment with macOS 11.5.2 and m1n1 version commit bd5211909e36944cb376d66c909544ad23c203bc:
From run_guest command launched(t0) to start loading kernel: 9s
From t0 to login screen(without keyboard nor mouse cursor moving first): around 2min.
With keyboard and mouse cursor moving: around 2min35s.
From password entered to desktop and menu bar: around +2min


# Sources
Source for the kernelcache creation: https://kernelshaman.blogspot.com/2021/02/building-xnu-for-macos-112-intel-apple.html