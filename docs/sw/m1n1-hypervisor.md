---
title: m1n1 Hypervisor
---

# Running macOS under the m1n1 hypervisor

You can run either a development kernel obtained from Apple, in which case you will have debug symbols, or use the stock kernel found in a macOS install.

## Supported macOS versions
As Apple make no ABI compatibility guarantees across versions, we cannot and will not support every single macOS
version either as reverse engineering targets or as guests of the hypervisor. Currently supported targets are:

- macOS 13.5 (M1 and M2 series)
- macOS 14.8.3 (M1-M3 series)

Due to numerous bugs and the requirement for SPTM to be running to boot XNU, we have not yet pinned a target for
M4 and newer machines.

## Preparation
While it is possible to non-destructively override the boot object of your main macOS install,
this approach is not recommended. Byond the increased risk of data loss, it also makes it difficult
to target specific macOS versions without constantly having to DFU restore the entire machine. We instead
install a second copy of macOS.

1. Create a second Volume on your macOS partition:

        diskutil apfs addVolume disk4 APFS macOSTest -mountpoint /Volumes/macOSTest

    Change disk4 and volume name (i.e `macOSTest`) for your particular system/preferences.  
    _Note: Don't make this a system role or it will mess with your existing system (no valid users in 1TR)_.

2. Download and install macOS. To download a specific version of macOS installer you can use the command:

        softwareupdate --fetch-full-installer --full-installer-version 14.8.3

    Substitute `14.8.3` for whichever version you require. The installer will be found in the Applications folder. Copy
    it out of here if you want to save it, otherwise it deletes itself once you have installed once.

### Using archived InstallAssistant.pkg
Unfortunately, Apple does not keep macOS installers on the CDN indefinitely. If you are unable to retrieve the full installer
using the above method, you will have to use an archived InstallAssistant.pkg. Known working archives of pertinent InstallAssistant
versions can be found below:

| macOS Version | Link                                                                  |
| ------------- | --------------------------------------------------------------------- |
| 13.5 Ventura  | [archive.org](https://archive.org/details/install-assistant_20240930) |
| 14.8.3 Sonoma | [archive.org](https://archive.org/details/install-assistant_20250207) |

Once you have downloaded the InstallAssistant.pkg, run it. It will extract the `Install macOS [version].app` application into
`/Applications`. Run the installed application and follow the prompts to install macOS into the APFS volume you created earlier.

## Retrieving a kernel
You will need an XNU image to pass to m1n1. You may either use the production kernel shipped with the version of
macOS you installed above, or use the unstripped Kernel Debug Kit (KDK) kernel.

### Production Kernel
Using the production kernel is easiest, as it does not require an Apple ID or any special preparatory work.

1. Boot into the copy of macOS you installed above
2. Retrieve the `kernelcache` file from `/System/Volumes/Preboot/[UUID]/boot/[hash]/System/Library/Caches/com.apple.kernelcaches/`
   and copy it to your host machine
3. Install [img4tool](https://github.com/tihmstar/img4tool) on your host machine
4. Extract the Mach-O binary from the IM4P:
        ```sh
        img4tool -ep out.im4p kernelcache
        img4tool -eo kernelcache.macho out.im4p
        ```

### KDK Kernel
Using the KDK is more involved, however may be of interest in certain cases where blind tracing is insufficient.

1. Download the macOS KDK for the version of macOS you installed from Apple [here](https://developer.apple.com/download/more/).
   You will need an Apple ID and a free Apple Developer Account.
3. Install the KDK. It will be installed to `/Library/Developer/KDK/KDK_[macOS ver]_[KDK ver].kdk/`
4. Open a terminal and change into the KDK kernels directory:
        `cd /Library/Developer/KDK/KDK_[macOS ver]_[KDK ver].kdk/Kernels`
5. Create a kernelcache for your machine:
        ```sh
        kmutil create -zn boot -a arm64e -B ~/dev.kc.macho -V development \
          -k kernel.development.t8103 \
          -r /System/Library/Extensions/ \
          -r /System/Library/DriverExtensions/ \
          -x $(kmutil inspect -V release --no-header | grep -v "SEPHiber" | awk '{print " -b "$1; }')
        ```
  `-B` specifies the location the kernelcache will be written to.
  `-k` must match a file in the `Kernels` directory, and is specific for the SoC in your Mac.
  the above example uses the T8103 (M1) kernel.

Apple also ships DWARFs for each kernel with the KDK. These can be passed to m1n1 for symbol resolution.
They can be found at `/Library/Developer/KDKs/KDK_[macOS ver]_[KDK ver].kdk/System/Library/Kernels/kernel.development.[SoC].dSYM/Contents/Resources/DWARF/kernel.development.[SoC]`
You will need to copy them to your host machine along with the created kernelcache if you wish to use them.

## Installing m1n1 as the macOS kernel
We now need to tell the platform to jump to m1n1 instead of XNU when we select our second copy of macOS as the
boot volume. To do this, we downgrade the security model for that APFS volume to allow running unsigned code,
then configure m1n1 as its boot object.

1. Make sure the second copy of macOS is the default Startup Disk for the macine
2. Boot into 1TR and open Terminal
3. Determine the UUID of the macOS volume by running `diskutil info [disk]`.
4. Downgrade security for the volume by running `bputil -nkcas`, making sure you select the correct UUID
5. Running `bputil` resets SIP, so explicitly disable it by running `csrutil disable`.
6. Enable verbose logging: `nvram boot-args=-v`.
7. Install [m1n1](m1n1-user-guide.md) as a custom boot object:
        ```sh
        kmutil configure-boot \
          -c build/m1n1.bin \
          --raw \
          --entry-point 2048 \
          --lowest-virtual-address 0 \
          -v /Volumes/macOSTest
        ```

## Booting XNU as a guest of m1n1
Now that we have m1n1 installed as the boot object, we can boot XNU as a guest of its hypervisor. Shut down
your Mac, connect it to your host machine _via its DFU port_, and then turn it back on. You should see m1n1
bring itself up and start its serial proxy.

### Production Kernel
Booting the production kernel as a guest of m1n1 is very simple:
```sh
python3 proxyclient/tools/run_guest.py \
    path/to/kernelcache.macho \
    -- "debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1 clpc=0"
```

### KDK Kernel
If you have created a development kernelcache using the KDK, you can pass debug symbols to m1n1:
```sh
python3 proxyclient/tools/run_guest.py \
    -s path/to/DWARF \
    path/to/kernelcache.macho\
    -- "debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1 clpc=0"
```

## Using hypervisor modules
While it is possible to trace hardware using only the m1n1 shell, this is not ergonomic. Instead,
m1n1 supports preloading and executing Python scripts. These have full access to m1n1's Python API.
The primary use for these is building fully-featured, automatic tracers for a given block of hardawre.
Prior art can be found in `proxyclient/hv/`. These are passed to `run_guest.py` as a module:
```sh
python3 proxyclient/tools/run_guest.py \
    -m proxyclient/hv/trace_dcp.py \
    path/to/kernelcache.macho \
    -- "debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1 clpc=0"
```

The above example will preload the DCP tracer and start it as soon as m1n1 is ready to jump to XNU.

## m1n1 ABI synchronisation
m1n1's ABI is not stable, and resources inside the source tree (e.g. `proxyclient`) are never guaranteed
to be backward-compatible with older m1n1 builds. It is expected that you will always chainload a build
of m1n1 from the working tree before attempting to use the hypervisor to ensure ABI compatibility:
```sh
python3 proxyclient/tools/chainload.py build/m1n1.macho
```

## Using a debugger
m1n1 supports networked debugging. Running `gdbserver` in the hypervisor shell will start a debug
server implementation that can be connected to from GDB or LLDB. We recommend using LLDB, as it
has better support for Mach-O, pointer authentication, and XNU's use of dyld.

An LLDB script is needed to load symbols for all kernel extensions. The shell script below
can be used from macOS to generate an LLDB script which will do this for you:
```sh
echo 'target create -s kernel.development.t8103.dSYM kernel.development.t8103' > target.lldb
for k in $(find Extensions); do
    [ "$(file -b --mime-type $k)" != 'application/x-mach-binary' ] || printf 'image add %q\n' $k;
done >> target.lldb
```

The above assumes that you are booted on macOS and inside the KDK `Kernels` directory.

From LLDB, you can then run the generated script and connect to m1n1's debug server:
```
command source -e false target.lldb
process connect unix-connect:///tmp/.m1n1-unix
```

Do not attempt to use both the hypervisor shell's builtin debugging features and an external
debugger at the same time. For example, do not attempt to add or edit breakpoints from the hypervisor
shell while using LLDB.

## Running the Hypervisor with SPTM/TXM on M4

1. Copy and extract the kernel cache as mentioned above and then also find `sptm.tXXXX.release.im4p` and `txm.macosx.release.im4p` in `/System/Volumes/Preboot` and use ipsw to extract the images:
   ```
   ipsw img4 im4p extract /System/Volumes/Preboot/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/restore/Firmware/txm.macosx.release.im4p -o path/to/extract/txm.macho
   ipsw img4 im4p extract /System/Volumes/Preboot/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/restore/Firmware/sptm.tXXXX.release.im4p -o path/to/extract/sptm.macho
   ```
   Alternatively, you can also get the images from an ipsw itself and extract them. Make sure to use the exact version you have installed on your Mac because the kernel will otherwise panic or hang during boot.

2. Boot the kernel, SPTM and TXM under the hypervisor:
   ```sh
   python3 proxyclient/tools/run_guest.py \
     --sptm-mode=emulation \
     --sptm path/to/sptm.macho --txm path/to/txm.macho \
     path/to/kernelcache.macho \
      -- "debug=0x14e serial=3 wdt=-1"
   ```
   Note that because some hardware features (GXF/SPRR) have to be emulated macOS will run slower than usual.


# Sources
Source for the kernelcache creation: [https://kernelshaman.blogspot.com/2021/02/building-xnu-for-macos-112-intel-apple.html](https://kernelshaman.blogspot.com/2021/02/building-xnu-for-macos-112-intel-apple.html)
