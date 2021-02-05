# Developer Quick Start Guide

So you want to help us bring Linux to M1 Macs? Read on! This guide describes the recommended set-up for developing for Linux on an M1.

This guide is meant for developers who want to hack on Asahi Linux. It is not representative of what the install process for end-users will look like. It is meant for experienced Linux developers who may not know anything about Macs or M1 machines.

It is extremely unlikely that you will damage your computer by following these steps, but we can make no guarantees at this time. Please proceed under your own responsibility.

## Introduction

### Objective

We will be setting up a dual-boot M1 computer with two OSes: a vanilla macOS install (optionally with reduced/permissive security), and a "stub" macOS install with permissive security that will serve as a boot wrapper for Linux (or anything else we want to run through m1n1). You will also learn about what options are available to get a hardware serial console.

### Prerequisites

* An Apple M1 machine 
    We recommend the Mac Mini as a baseline target. 
    * Mac Mini: Does not require Type C power, has additional on-board PCIe hardware (Ethernet & xHCI for type A ports). Requires an HDMI monitor.
    * Macbook Air: USB via DWC3/Type-C only. Built-in screen. SPI keyboard. Requires Type C power for charging.
    * Macbook Pro: Like the Air, but with a Touch Bar replacing the F keys, which means your keyboard will be crippled until the drivers for that are written.

* macOS installed on the machine (we assume you will start from a stock configuration with a single macOS partition)
    * No FileVault (encryption). This will just complicate things and is not tested.

* A Linux development machine (any architecture)
    * If not arm64: an `aarch64-linux-gnu` gcc crosscompiler/toolchain (clang is also supported to build m1n1 but less tested).

Highly recommended:
  
* A serial port solution. Read on for that.

### TL;DR on M1 Mac Boot

Storage: the internal SSD is a GPT partitioned disk containing (initially) APFS containers, each of which contains multiple APFS volumes.

The boot process:

1. SecureROM (Boot ROM) in M1 silicon starts
    * Either enters DFU mode (USB recovery) or
    * Boots iBoot1 from NOR (SPI) flash
2. iBoot1 (global) looks for boot policies in iSC Preboot and tries to boot the active one from its OS APFS Preboot volume (as defined in NVRAM)
    * If the power button is held down, boots 1TR instead
    * This is what initializes the screen and shows the Apple logo
3. iBoot2 (per-OS copy; ~= OS loader) boots the OS
    * Loads auxiliary CPU engine firmwares from OS APFS Preboot partition
    * Then loads a mach-o kernel wrapped in an img4 container from the Preboot partition
    * This is in charge of adjusting and passing in the ADT (Apple Device Tree)
4. The OS kernel (XNU/Darwin) boots
    * Mounts the root filesystem, etc

Read [[SW:Boot]] and [[M1 vs. PC Boot]] for more info.

Mini glossary:

* 1TR: One True Recovery: trusted system-level recovery, includes all boot user interaction too (boot picker). Lives in its own APFS container (last partition).
* APFS: Apple's fancypants filesystem
    * APFS Container: ~= ZFS pool (usually backed by a GPT partition)
    * APFS Volume: ~= ZFS dataset
    * APFS Snapshot: ~= ZFS snapshot
* AP Ticket: signed blob from Apple that allows you to run a given macOS version on a specific machine. "macOS version" ~= iBoot2 & firmware bundles. "Generic" ones available for use with reduced-security modes (i.e. no phone home requirement in that case).
* Boot Policy: declares an OS bootable on a given machine. Signed and validated by SEP (locally). Stored in iSC.
* iBoot1: First stage bootloader, finds an OS to boot
* iBoot2: Second stage bootloader, spins up on-die auxiliary core firmwares and boots the XNU kernel (or m1n1)
* iSC: iBoot System Container, APFS container with boot configs/stuff
* kernelcache: kernel + kexts blob (~=linux + initramfs containing modules)
* kext: kernel module
* NOR: SPI NOR Flash on board containing iBoot1, product customization data, nvram
* SecureROM: Boot ROM on the M1 silicon die
* SEP: Secure Enclave Processor ~= TPM or Secure Monitor in other platforms (it's a separate core here).
* SFR: System Firmware and Recovery (iBoot1 + iSC partition + 1TR partition). Downgrade protected.
* Startup Security modes
    * Full Security: Full secureboot, no non-Apple software can run except for signed & ad-hoc userspace binaries under macOS if allowed by the user, enforces AP tickets (no macOS downgrades).
    * Reduced Security: Allows third-party kexts, management, etc.
    * Permissive Security: Allows unsigned kernels (this is what we want).
* XNU: the base of Darwin, the macOS kernel

Notes:

* M1 machines do not support *any* bootloader-level user interaction or keyboard shortcuts or anything.
    * The only thing iBoot1 can see is whether you're holding down the power button or not.
    * The "boot picker" is a macOS application running under 1TR. Yes, really.
* M1 machines *cannot* boot from external storage.
    * Picking an external disk in the boot picker will *copy its entire Preboot partition to the iSC* and generate a boot policy. This is morally equivalent to having the entire /boot on Linux on internal storage. **These machines cannot boot macOS kernels from external storage, ever**, at least using current firmware.

### Further Reading

* [[Glossary]]
* [[SW:Boot]]
* [[M1 vs. PC Boot]]
* [[SW:NVRAM]]
* [[SW:NVRAM]]
* [[SW:Storage]]


### If things go wrong

M1 Macs are effectively unbrickable as long as you do not write to SPI Flash (we highly discourage declaring the NOR Flash in the Linux devicetree: we are not aware of any reason to touch it at this point, so all it does is massively increase the risk of catastrophe; we will proceed with caution and safeguards if it ever becomes necessary to access directly). However, they do rely on software installed on the internal SSD storage to boot normally and into 1TR.

If you end up with your Mac in an unbootable state, follow [apple's DFU recovery instructions](https://support.apple.com/en-in/guide/apple-configurator-2/apdd5f3c75ad/mac). You will need another Mac running macOS to perform this process (Intel ones are fine). This should not happen if you follow the steps on this guide normally, but may happen if you end up accidentally writing to internal storage incorrectly (e.g. wiping the entire block device or screwing up the GPT partition table).

Eventually, it should be possible to use [idevicerestore](https://github.com/libimobiledevice/idevicerestore) to perform this same process from a Linux machine, but this isn't ready yet.

While DFU boot works with a totally corrupted NOR flash, vital product identification and calibration data is stored there and you cannot restore this without Apple's help; you will have to send the machine in for repairs so they can re-provision its identity and run manufacturing testing and calibration. So, stay away from touching NOR flash.

## Setup

### Step 0: Upgrade macOS

You need at least macOS 11.2. Don't bother with older versions, they won't work.

You will need to have gone through the macOS first-setup, including having created a primary administrator user/password.

### Step 1: Partitioning

You are starting here:

* disk0s1: iBoot System Container
* disk0s2: Macintosh HD (OS #1 APFS container)
* disk0s3: 1TR (One True Recovery OS)

We want to get here:

* disk0s1: iBoot System Container
* disk0s2: Macintosh HD (OS #1 macOS APFS container)
* disk0s3: Linux (OS #2 "fake macOS" APFS container)
* disk0s4: Linux /boot (FAT32)
* disk0s5: Linux / (ext4)
* disk0s6: 1TR (One True Recovery OS)

Note that storage is not yet supported in our tree or bootloader, but we are targeting this partition layout a priori. disk0s3 will be our "stub" macOS, which at this time will be used to hold a full macOS install (eventually we will provide tooling to allow this to be a minimal partition containing only boot files, to avoid wasted space, but this is not ready yet).

Assuming you have a 500GB model:

```shell
# diskutil apfs resizeContainer disk0s2 200GB
# diskutil addPartition disk0s2 APFS Linux 70GB
# diskutil addPartition disk0s5 FAT32 LB 1GB
# diskutil addPartition disk0s4 FAT32 LR 0
```

You need at least 70GB for the stub partition, because the macOS install/update process is very inefficient. This will not be necessary in the future, once we have our own setup process.

Shrinking the OS APFS partition can be done on-line.

Each invocation of `diskutil addPartition` needs to be passed the partition node
of the partition *prior* to the new partition to be created. This can vary, so
run `diskutil list` prior to every instance and pick the device name of the last
created partition. In the example above, `Linux` ended up as disk0s5 and `LB`
ended up as disk0s4. Go figure. This gets reset after a reboot.

The volume name of the stub partition will determine the OS name in the boot picker, so call it "Linux".

We can change the FS and GPT type of the true Linux root and boot partitions later.

### Step 2: Install macOS in the stub partition

Shut down the machine. Boot with the power button held down, until "Loading startup options..." appears. This enters 1TR, the OS recovery environment.

Select "Options" in the boot picker.

In the main recovery menu, select "Reinstall macOS Big Sur".

Follow the prompts, and select "Linux" as the target volume.

Wait a while. This will reboot the machine into the new OS automatically.

### Step 3: Go through initial setup

Go through OS first-time setup. Create an administrator user and password.

Check the OS version. If it is not 11.2, you should update this OS too.

Shut down the machine again.

### Step 4: Downgrade security

Boot into 1TR again ("Options" entry in the boot picker).

In the top menu bar, go to Utilities → Terminal. This brings up a root shell.

Find the volume group ID of your stub partition:

```shell
# diskutil apfs listVolumeGroups | grep -B3 Linux | grep Group
```

Then downgrade security:

```shell
# bputil -nkcas
```

Select the matching OS install ID, and follow the prompts. You will need to enter the credentials that you created in step 3.

Further disable SIP for good measure. This one is nice enough to ask you to pick the OS by name:

```shell
# csrutil disable
```

At this point you are ready to use custom kernels. Congrats!

## Getting a serial console

Having a serial console is indispensable for a fast development cycle and to debug low-level issues.

M1 Macs expose their debug serial port over one of their Type C ports (the same one used for DFU). On MacBooks, this is the rear left port. On the Mac Mini, this is the port closest to the power plug.

The serial port is a UART using 1.2V logic levels, and requires vendor-specific USB-PD VDM commands to enable. Thus, making a compatible cable is nontrivial. You have the following options.

The target machine can also be hard-rebooted using USB-PD commands, making for a quick test cycle (no holding down power buttons).

See also [[HW:USB-PD]] for details on the VDM commands and what you can do with them.

### Using an M1 machine

If you have two M1 boxes, this is the simplest solution. Just grab [macvdmtool](https://github.com/AsahiLinux/macvdmtool/), connect both machines with a standard Type C cable (needs to be the USB 3 / SuperSpeed type, USB 2 only cables won't work) using the DFU port on *both* machines, and that's it!

```shell
$ xcode-select --install
$ git clone https://github.com/AsahiLinux/macvdmtool
$ cd macvdmtool
$ make
$ sudo ./macvdmtool reboot serial
```

See the macvdmtool page or just run it without arguments for a list of supported commands. Your serial port device is `/dev/cu.debug-console`.

NOTE: if you have enabled serial debug output on your host machine (via nvram settings), the serial port device will be in use by the kernel. You need to turn that off to use it as a generic serial port.

### DIY Arduino-based USB-PD interface

You can build a DIY USB-PD interface with the following parts:

* An Arduino or clone
* A FUSB302 chip, either stand-alone or on a breakout board
* A USB Type C breakout board (get a male one, plugging in directly into the target, for the most flexibility
* A 1.2V compatible UART interface

Note that most FUSB302 breakout boards will not usefully break out the Type C pins you need, so it's best to use a separate full breakout board.

Go to the [vdmtool](https://github.com/AsahiLinux/vdmtool) repository for more information and a wiring list. Documentation is a bit sparse at the moment. You can ask us on IRC (freenode/#asahi) if you need help.

1.2V compatible UART interfaces are relatively rare. 1.8V ones will usually work for input (RX); you can use a resistor divider to step down the TX voltage (`TX -- 470Ω -+- 220Ω -- GND` will step down 1.8V TX to 1.22V at the `+` point).

The default `vdmtool` code will put serial on the SBU1/SBU2 pins. At the device side connector (no cable), TX (output from the Mac) will be on the SBU1 pin on the connector side that has the active CC line (you should only connect one), and RX (input to the Mac) will be directly opposite the CC line.

This is all rather rudimentary because it's a stop-gap for the proper solution, which is...

### Flexible USB-PD Debug Interface (project name TBD)

In the coming weeks we'll be designing an open hardware interface for interfacing to M1 serial ports, and more (supporting other debug pinsets on Apple devices, as well as UARTs on other devices such as certain Android phones, etc). Stay tuned for more information. Established kernel developers who want to get an early prototype when they become available should contact [marcan](mailto:marcan@marcan.st).

## Using m1n1

m1n1 is our initial bootloader, which is in charge of pretending to be a XNU kernel and performing Apple-specific initialization.

Currently, m1n1 works as a serial "proxy" server, controlled via Python scripts from a host. In this way, you can load kernels via serial and also explore the hardware interactively, with a Python console.

### Building

You need an `aarch64-linux-gnu-gcc` cross-compiler toolchain (or a native one, if running on ARM64). You also need `dtc` (the devicetree compiler) and `convert` (from ImageMagick) for the boot logos.

```shell
$ git clone --recursive https://github.com/AsahiLinux/m1n1.git
$ cd m1n1
$ make
```

The output will be in `build/m1n1.macho`.

### Installation

Boot your Mac into 1TR, then pull up the terminal. You can use the network to copy files over - either SSH from the Mac or just use curl.

For example, on your build machine:

```shell
$ cd m1n1/build
$ python3 -m http.server
```

And on your target machine:

```shell
# curl buildmachine.lan:8000/m1n1.macho > m1n1.macho
```

To install m1n1 into the stub partition as a custom kernelcache:

```shell
# kmutil configure-boot -c m1n1.macho -C -v /volumes/Linux
```

Type in your credentials. If everything went well, you can restart and boot into m1n1!

### Host setup

m1n1 currently requires a serial console to do anything. Go to the [getting a serial console](#getting-a-serial-console) section to learn more about available options.

**NOTE(2021-02-05)**: we will add a framebuffer console and support for built-in payloads to m1n1 to remove this requirement in the following few days, at the expense of a long test cycle (you need to re-`kmutil` every kernel you want to test). Stay tuned. USB OTG support is also planned in the future, so you will be able to interact with m1n1 with a standard USB C cable and load kernels faster.

To use the m1n1 proxyclient, you need the Python packages `pyserial` and `construct`. If your distribution does not provide them for you, you can use:

```shell
$ pip install --user pyserial construct
```

If you are on macOS, install python3.9 using Homebrew. The OS version of Python has problems with readline history files (?):

```shell
$ arch -x86_64 brew install python
$ pip3.9 install --user pyserial construct
```

### Usage

To use the proxyclient scripts, you need to set `M1N1DEVICE` to your serial port device. When using another M1 mac as the host, use `export M1N1DEVICE=/dev/cu.debug-console`.

Things to do:

#### Playground shell

Run `python shell.py` for an interactive debug shell.

```python
>>> read32(0x800000000) # Read the first word of RAM
0x484f6666
>>> memset32(fb, 0x000003ff, 1920 * 1080 * 4) # turn the framebuffer blue
>>> mrs(HCR_EL2) # only some registers supported, feel free to add more in utils.py
0x30488000000
>>> d = readmem(base, 0x10) # read and hexdump the first 16 bytes of m1n1 (mach-o header)
>>> chexdump(d)
00000000  cf fa ed fe 0c 00 00 01  02 00 00 00 0c 00 00 00  |................|
# allocate a buffer, read the AIC registers, and dump them
# using a buffer is recommended for registers because `readmem` will read
# byte-by-byte twice and complain if the data changes (checksum).
>>> AIC = 0x23b100000
>>> data = malloc(0x8000) # this is python-side malloc, allocs vanish when the script exits
>>> memcpy32(data, AIC, 0x8000)
>>> chexdump32(d)
00000000  00000007 000a0380 00180018 00000000 e0477971 00000000 000000f0 00000000
00000020  00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
00000040  *
00003320  00000000 00000000 00000000 00000001 00000000 00000000 00000000 00000000
[...]
>>> u.msr(DAIF, u.mrs(DAIF) & ~0x3c0) # Enable IRQs             
>>> mon.add(AIC, 0x8000) # Monitor the AIC registers
[...]
>>> write32(AIC + 0x2008, 1) # Fire off an IPI to ourselves
TTY> Exception: IRQ          # These debug messages are from m1n1's IRQ handler
TTY>  type: 4 num: 1
# Then the register monitor prints changed registers automatically,
# with color coding we can't show here 
000000023b100020 00000000 00000000 00000000 00000000 00000001 00000000 00000000 00000000 
000000023b102000 00000000 00000000 00000001 00000001 00000000 00000000 00000000 00000000 
000000023b102020 00000000 00000001 00000001 00000000 00000000 00000000 00000000 00000000 
000000023b105000 00000000 00000000 00000001 00000001 00000000 00000000 00000000 00000000 
[...]
# There is support for recovering from simple faults
>>> read64(0)
TTY> Exception: SYNC
TTY> Running in EL2
TTY> MPIDR: 0x80000000
TTY> Registers: (@0x81368bde0)
TTY>   x0-x3: 0000000000000000 000000081360c004 0000000000000002 000000081360c004
TTY>   x4-x7: 000000081368bfa8 0000000000007a69 000000081360c004 0000000000000000
TTY>  x8-x11: 0000000000000000 0000000000000000 0000000000000000 00000000aaaaaaab
TTY> x12-x15: 000000000000002c 00000008135b5488 000000081368bb80 0000000000000000
TTY> x16-x19: 00000008135aaabc 0000000000000000 0000000000000000 000000081368bf88
TTY> x20-x23: 000000081368bfb0 0000000813608000 0000000000000000 0000000002aa55ff
TTY> x24-x27: 0000000003aa55ff 000000081360c000 0000000001aa55ff 000000081368bfb0
TTY> x28-x30: 0000000000000000 000000081368bee0 00000008135abb98
TTY> PC:       0x8135aaa9c (rel: 0xaa9c)
TTY> SPSEL:    0x1
TTY> SP:       0x81368bee0
TTY> SPSR_EL2: 0x80000009
TTY> FAR_EL2:  0x0
TTY> ESR_EL2:  0x96000018 (data abort (current))
TTY> L2C_ERR_STS: 0x11000ffc00000080
TTY> L2C_ERR_ADR: 0x300000000000000
TTY> L2C_ERR_INF: 0x1
TTY> SYS_E_LSU_ERR_STS: 0x0
TTY> SYS_E_FED_ERR_STS: 0x0
TTY> SYS_E_MMU_ERR_STS: 0x0
TTY> Recovering from exception (ELR=0x8135aaaa0)
0xacce5515abad1dea
```

#### Loading another m1n1

Useful to test changes without using `kmutil` again.

```shell
$ python chainload.py ../build/m1n1.macho 
Base at: 0x803c5c000
FB at: 0x9e0df8000
Loading 442368 bytes to 0x812ce0000
....................................................
Jumping to 0x812ce4800
TTY> m1n1
TTY> sc: Initializing
TTY> CPU init... CPU: M1 Icestorm
[...]
TTY> m1n1 vf14489f
TTY> Copyright (C) 2021 The Asahi Linux Contributors
TTY> Licensed under the MIT license
[...]
Proxy is alive again
```

#### Boot a Linux kernel

This is what you're here for, right? :-)

```shell
$ python linux.py ../../linux/arch/arm64/boot/Image.gz ../build/dtb/apple-j274.dtb ../../../initramfs/initramfs.cpio.gz
```

<details>
 <summary>sample boot log</summary>

```
Base at: 0x815300000
FB at: 0x9e0df8000
Loading 2046483 bytes to 0x8214fc000..0x8216efa13...
..........................................................................................................................................................................................................................................................
Loading DTB to 0x8216efa40...
Kernel_base: 0x821800000
Loading 953623 initramfs bytes to 0x821700000...
.....................................................................................................................
TTY> Starting secondary CPUs...
TTY> Starting CPU 1 (0:1)... OK
TTY>   Stack base: 0x8153ac040
TTY>   MPIDR: 0x80000001
TTY>   CPU: M1 Icestorm
TTY>   Index: 1 (table: 0x8153c4080)
TTY> 
TTY> Starting CPU 2 (0:2)... OK
TTY>   Stack base: 0x8153b0040
TTY>   MPIDR: 0x80000002
TTY>   CPU: M1 Icestorm
TTY>   Index: 2 (table: 0x8153c40c0)
TTY> 
TTY> Starting CPU 3 (0:3)... OK
TTY>   Stack base: 0x8153b4040
TTY>   MPIDR: 0x80000003
TTY>   CPU: M1 Icestorm
TTY>   Index: 3 (table: 0x8153c4100)
TTY> 
TTY> Starting CPU 4 (1:0)... OK
TTY>   Stack base: 0x8153b8040
TTY>   MPIDR: 0x80010100
TTY>   CPU: M1 Firestorm
TTY>   Index: 4 (table: 0x8153c4140)
TTY> 
TTY> Starting CPU 5 (1:1)... OK
TTY>   Stack base: 0x8153bc040
TTY>   MPIDR: 0x80010101
TTY>   CPU: M1 Firestorm
TTY>   Index: 5 (table: 0x8153c4180)
TTY> 
TTY> Starting CPU 6 (1:2)... OK
TTY>   Stack base: 0x8153c0040
TTY>   MPIDR: 0x80010102
TTY>   CPU: M1 Firestorm
TTY>   Index: 6 (table: 0x8153c41c0)
TTY> 
TTY> Starting CPU 7 (1:3)... OK
TTY>   Stack base: 0x8153c4040
TTY>   MPIDR: 0x80010103
TTY>   CPU: M1 Firestorm
TTY>   Index: 7 (table: 0x8153c4200)
TTY> 
TTY> FDT: initrd at 0x821700000 size 0xe8d17
TTY> FDT: framebuffer@9e0df8000 base 0x9e0df8000 size 0x7e9000
TTY> FDT: DRAM at 0x800000000 size 0x200000000
TTY> FDT: Usable memory is 0x80134c000..0x9db5e0000 (0x1da294000)
TTY> FDT: CPU 0 MPIDR=0x0 release-addr=0x8153c4050
TTY> FDT: CPU 1 MPIDR=0x1 release-addr=0x8153c4090
TTY> FDT: CPU 2 MPIDR=0x2 release-addr=0x8153c40d0
TTY> FDT: CPU 3 MPIDR=0x3 release-addr=0x8153c4110
TTY> FDT: CPU 4 MPIDR=0x10100 release-addr=0x8153c4150
TTY> FDT: CPU 5 MPIDR=0x10101 release-addr=0x8153c4190
TTY> FDT: CPU 6 MPIDR=0x10102 release-addr=0x8153c41d0
TTY> FDT: CPU 7 MPIDR=0x10103 release-addr=0x8153c4210
TTY> FDT prepared at 0x8193f0000
Uncompressing...
5758984
Decompress OK...
Ready to boot
DAIF: 3c0
MMU: shutting down...
MMU: shutdown successful, clearing caches
Booting kernel at 0x821800000 with fdt at 0x8193f0000
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x611f0221]
[    0.000000] Linux version 5.11.0-rc6-00015-gdc1ce163506d (marcan@raider) (aarch64-linux-gnu-gcc (Gentoo 10.2.0-r5 p6) 10.2.0, GNU ld (Gentoo 2.35.1 p2) 2.35.1) #201 SMP PREEMPT Fri Feb 5 03:15:40 JST 2021
[    0.000000] Machine model: Apple Mac Mini M1 2020
[    0.000000] earlycon: s5l0 at MMIO32 0x0000000235200000 (options '1500000')
[    0.000000] printk: bootconsole [s5l0] enabled
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x000000080134c000-0x00000009db5dffff]
[    0.000000]   DMA32    empty
[    0.000000]   Normal   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x000000080134c000-0x00000009db5dffff]
[    0.000000] Zeroed struct page in unavailable ranges: 648 pages
[    0.000000] Initmem setup node 0 [mem 0x000000080134c000-0x00000009db5dffff]
[    0.000000] On node 0 totalpages: 485541
[    0.000000]   DMA zone: 1897 pages used for memmap
[    0.000000]   DMA zone: 0 pages reserved
[    0.000000]   DMA zone: 485541 pages, LIFO batch:15
[    0.000000] percpu: Embedded 6 pages/cpu s57888 r0 d40416 u98304
[    0.000000] pcpu-alloc: s57888 r0 d40416 u98304 alloc=6*16384
[    0.000000] pcpu-alloc: [0] 0 [0] 1 [0] 2 [0] 3 [0] 4 [0] 5 [0] 6 [0] 7 
[    0.000000] Detected VIPT I-cache on CPU0
[    0.000000] CPU features: detected: Virtualization Host Extensions
[    0.000000] CPU features: kernel page table isolation disabled by kernel configuration
[    0.000000] CPU features: detected: Spectre-v4
[    0.000000] CPU features: detected: Address authentication (IMP DEF algorithm)
[    0.000000] CPU features: detected: FIQs
[    0.000000] alternatives: patching kernel code
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 483644
[    0.000000] Kernel command line: earlycon debug
[    0.000000] Dentry cache hash table entries: 1048576 (order: 9, 8388608 bytes, linear)
[    0.000000] Inode-cache hash table entries: 524288 (order: 8, 4194304 bytes, linear)
[    0.000000] mem auto-init: stack:off, heap alloc:off, heap free:off
[    0.000000] Memory: 7715584K/7768656K available (3136K kernel code, 1144K rwdata, 640K rodata, 512K init, 455K bss, 53072K reserved, 0K cma-reserved)
[    0.000000] random: get_random_u64 called from __kmem_cache_create+0x30/0x4b4 with crng_init=0
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=8, Nodes=1
[    0.000000] rcu: Preemptible hierarchical RCU implementation.
[    0.000000] rcu:     RCU restricting CPUs from NR_CPUS=16 to nr_cpu_ids=8.
[    0.000000]  Trampoline variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 100 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=8
[    0.000000] NR_IRQS: 64, nr_irqs: 64, preallocated irqs: 0
[    0.000000] aic_of_ic_init: AIC: initialized with 896 IRQs, 2 FIQs, 2 IPIs, 32 vIPIs
[    0.000000] arch_timer: cp15 timer(s) running at 24.00MHz (phys).
[    0.000000] clocksource: arch_sys_counter: mask: 0xffffffffffffff max_cycles: 0x588fe9dc0, max_idle_ns: 440795202592 ns
[    0.000000] sched_clock: 56 bits at 24MHz, resolution 41ns, wraps every 4398046511097ns
[    0.000650] Console: colour dummy device 80x25
[    0.000958] printk: console [tty0] enabled
[    0.001273] printk: bootconsole [s5l0] disabled

BusyBox v1.30.1 (Debian 1:1.30.1-6+b1) built-in shell (ash)
Enter 'help' for a list of built-in commands.

/bin/sh: can't access tty; job control turned off
/ #
```

</details>

The script currently does output only for the TTY passthrough. TODO: support input.
