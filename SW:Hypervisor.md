# Getting the MAC OS development kernel and creating the kernelcache

1. Create a mac os developer account (requires an icloud account.
2. Download the Mac OS Kernel Development Kit (KDK) from apple: https://developer.apple.com/download/more/
3. Install the KDK into Mac OS, the KDK will be installed to `/Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk`
4. Switch into the KDK folder and run the following command:
```
kmutil create -z -n boot -a arm64e -B ~/dev.kc.macho -k kernel.development.t8101 -V development -r . -r /System/Library/Extensions/ -r /System/Library/DriverExtensions -V development -x $(kmutil inspect -V release --no-header \
  | grep -v "SEPHiber" | awk '{print " -b "$1; }')
```