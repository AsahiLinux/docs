---
title: m1n1 User Guide
---

m1n1 is the bootloader developed by the Asahi Linux project to bridge the Apple (XNU) boot ecosystem to the Linux boot ecosystem.

GitHub: [AsahiLinux/m1n1](https://github.com/AsahiLinux/m1n1)

## What it does

* Initializes hardware
* Puts up a pretty logo
* Loads embedded (appended) payloads, which can be:
    * Device Trees (FDTs), with automatic selection based on the platform
    * Initramfs images (compressed CPIO archives)
    * Kernel images in Linux ARM64 boot format (optionally compressed)
    * Configuration statements
* Chainloads another version of itself from a FAT32 partition (if configured to do so)

Proxy mode enables a huge toolset of developer features, from reducing your Linux kernel test cycle to 7 seconds, to live hardware probing and experimentation, to a hypervisor capable of running macOS or Linux and tracing hardware accesses in real time while providing a virtual UART over USB. See the [m1n1 Developer Guide](m1n1-dev-guide.md) for that. This guide only describes trivial proxy use cases.

## Building

You need an `aarch64-linux-gnu-gcc` cross-compiler toolchain (or a native one, if running on ARM64).
You also need `convert` (from ImageMagick) for the boot logos.

```shell
$ git clone --recursive https://github.com/AsahiLinux/m1n1.git
$ cd m1n1
$ make
```

The output will be in build/m1n1.{bin,macho}.

To build on a native arm64 machine, use `make ARCH=`.

Building on ARM64 macOS is supported with clang and LLVM; you need to use Homebrew to
install the required dependencies:

```shell
$ brew install llvm imagemagick
```

After that, just type `make`.

### Building using the container setup

If you have a container runtime installed, like Podman or Docker, you can make use of the compose setup, which contains all build dependencies.

```shell
$ git clone --recursive https://github.com/AsahiLinux/m1n1.git
$ cd m1n1
$ podman-compose build m1n1
$ podman-compose run m1n1 make
$ # or
$ docker-compose run m1n1 make
```

### Build options

* `make RELEASE=1` enables m1n1 release behavior, which hides the console by default and provides an escape hatch to activate an early proxy mode (see [Proxy mode](#proxy-mode)).

* `make CHAINLOADING=1` enables chainloading support. This requires a Rust nightly toolchain with aarch64 support, which you can get with: `rustup toolchain install nightly && rustup target install aarch64-unknown-none-softfloat`.

m1n1 stage 1 release builds packaged with the Asahi Linux Installer have both of those options set. m1n1 stage 2 release builds packaged by distros should just have `RELEASE=1` (since they do not need to chainload further) and thus do not need Rust to build.

## Installation

### Stage 1 (as fuOS)

m1n1 (with your choice of payloads) can be installed from 1TR (macOS 12.1 OS/stub and later) as follows:

```
kmutil configure-boot -c m1n1-stage1.bin --raw --entry-point 2048 --lowest-virtual-address 0 -v <path to your OS volume>
```

On older versions (not recommended), you need the `macho` instead:

```
kmutil configure-boot -c m1n1-stage1.macho -v <path to your OS volume>
```

The Asahi Linux installer will normally do this for you, and most users will never have to do it again manually.

Each OS has its own recovery OS. You must go to the recovery for Asahi Linux to run this command, or you'll get errors with something like `not paired`. 

If you're not in the correct recovery OS, you can go to the correct one by:
```shell
/Volumes/Asahi\ Linux/Finish\ Installation.app/Contents/Resources/step2.sh
```

### Stage 2 (in the ESP)

Stage 2 m1n1 is normally stored in the EFI system partition, typically with U-Boot as a payload. Assuming your ESP is mounted at `/boot/efi`, you'd normally do:

```
cat build/m1n1.bin /path/to/dtbs/*.dtb /path/to/uboot/u-boot-nodtb.bin > /boot/efi/m1n1/boot.bin
```

For details on how to add dtb and uboot to m1n1, see `Configuring for stage 2` under `Payloads` below. 

## Payloads

m1n1 supports the following payloads:

* Device Trees (FDTs), optionally gzip/xz compressed
* Initramfs images, which *must* be gzip/xz compressed
* arm64 Linux style kernel images, which *should* be gzip/xz compressed
* Configuration variables in the form "var=value\n"

Payloads are simply concatenated after the initial m1n1 binary.

### Configuring for stage 1

m1n1 stage 1 is configured by the Asahi Linux Installer by appending variables like this:

```
cp build/m1n1.bin m1n1-stage1.bin
echo 'chosen.asahi,efi-system-partition=EFI-PARTITION-PARTUUID' >> m1n1-stage1.bin
echo 'chainload=EFI-PARTITION-PARTUUID;m1n1/boot.bin' >> m1n1-stage1.bin
```

**PITFALL:** Make sure the UUID is lowercase otherwise some consumers of the devicetree (notably U-Boot) won't find the system partion.

### Configuring for stage 2

m1n1 stage 2 will normally boot payloads directly, plus receive the `chosen.asahi,efi-system-partition` config from stage 1 automatically. Using device trees shipped with U-Boot:

```
cat build/m1n1.bin \
    ../uboot/arch/arm/dts/"t[86]*.dtb \
    <(gzip -c ../uboot/u-boot-nodtb.bin) \
    >m1n1-uboot.bin
```

Note that U-Boot is compressed before appending. Uncompressed kernels may cause issues with variables getting lost, since their size cannot be accurately determined.

### Configuring to boot Linux directly

m1n1 can boot a Linux kernel and initramfs directly, either as stage 1 or 2 (but you probably don't want to do this for stage 1). You can specify the boot arguments directly. Using device trees shipped with the kernel:

```shell
cat build/m1n1.bin \
    <(echo 'chosen.bootargs=earlycon debug root=/dev/nvme0n1p6 rootwait rw') \
    ${KERNEL}/arch/arm64/boot/dts/apple/*.dtb \
    ${INITRAMFS}/initramfs.cpio.gz \
    ${KERNEL}/arch/arm64/boot/Image.gz \
    >m1n1-linux.bin
```

Again note the use of a compressed kernel image. Also, if you want to concatenate multiple initramfs images, you should *uncompress them first*, then concatenate them and compress them again ([bug](https://github.com/AsahiLinux/m1n1/issues/157)).

### Configuring for proxy mode

If given no payloads, or if booting the payloads fails, m1n1 will fall back to proxy mode.

## Proxy mode

Proxy mode provides a USB device interface (available on all Thunderbolt ports) for debugging. To use it, connect your target device to your host device with a USB cable (e.g. a USB-C to USB-A cable, with the C side on the m1n1 target). See the [m1n1 Developer Guide](m1n1-dev-guide.md) for all the crazy details. These are just some simple examples of what you can do.

When in proxy mode, a Linux host will see two USB TTY ACM devices, typically /dev/ttyACM0 & /dev/ttyACM1. (In macOS this will be /dev/cu.usbmodemP_01 and /dev/cu.usbmodemP_03). The first one is the proper proxy interface, while the second one is reserved for use by the hypervisor's virtual UART feature. You should set the `M1N1DEVICE` environment variable to the path to the right device.

### Booting a Linux kernel

```
export M1N1DEVICE=/dev/ttyACM0
proxyclient/tools/linux.py <path/to/Image.gz> <path/to/foo.dtb> <path/to/initramfs.cpio.gz> -b "boot arguments here"
```

### Chainloading another m1n1

```
export M1N1DEVICE=/dev/ttyACM0
proxyclient/tools/chainload.py -r build/m1n1.bin
```

### Running a Linux kernel as a m1n1 hypervisor guest, with virtual UART

First, open the secondary port (e.g. `/dev/ttyACM1`) with a serial terminal:

```
picocom --omap crlf --imap lfcrlf -b 500000 /dev/ttyACM1
```

Then boot your kernel:

```
proxyclient/tools/chainload.py -r build/m1n1.bin
cat build/m1n1.bin \
    <(echo 'chosen.bootargs=earlycon debug rw') \
    ../linux/arch/arm64/boot/dts/apple/*.dtb \
    <initramfs path>/initramfs-fw.cpio.gz \
    ../linux/arch/arm64/boot/Image.gz \
    > /tmp/m1n1-linux.macho
python proxytools/tools/run_guest.py -r /tmp/m1n1-linux.macho
```

Note that we use the raw `m1n1.bin`, and pass `-r` to `run_guest.py`. Mach-O support for non-XNU
binaries has been deprecated. Please do not build Linux-based payloads with the Mach-O version of
m1n1.

Alternatively, use the `run_guest_kernel.sh` script to make this process significantly less
cumbersome

```sh
$ ./proxyclient/tools/run_guest_kernel.sh [kernel build root] [boot args] [initramfs (optional)]
```

### Running a macOS kernel as a m1n1 hypervisor guest

See [m1n1 Hypervisor](m1n1-hypervisor.md)

### Backdoor proxy mode in stage 1 release builds

If you have a standard release build of m1n1 installed as fuOS (i.e. what you get when you run the Asahi Linux installer), you can enable verbose messages and a backdoor proxy mode by going into 1TR and doing this from the macOS Terminal:

```
csrutil disable
```

You will be prompted to select the correct boot volume if you are multi booting and then asked to authenticate yourself. 

You can then enable verbose mode using:

```
nvram boot-args=-v
```

Once initially enabled, this feature can be toggled off with:

```
nvram boot-args=
```

By doing this, m1n1 will turn on verbose logging, and wait 5 seconds before booting its payloads. If it receives a USB proxy connection in that time, it will go into proxy mode. This is extremely useful when you want to have a working, auto-booting Linux install, but retain the ability to boot kernels via proxy mode if something goes wrong, or just for fast development.

Note that this state is less secure, as any installed OS can alter the `boot-args` property. Reset your boot policy with `csrutil enable` (do NOT choose to enable full security when prompted, as this will uninstall m1n1).

To break into proxy mode, the host needs to *open* the USB ACM device (either of the 2 will do). This can be done by e.g. running a serial terminal in a loop on the secondary interface (which you might want for the hypervisor anyway): _Note: for macOS use_ `/dev/cu.usbmodemP_01`

```
while true; do
    while [ ! -e /dev/ttyACM1 ]; do sleep 1; done
    picocom --omap crlf --imap lfcrlf -b 500000 /dev/ttyACM1
    sleep 1
done
```

Once picocom connects, you can then invoke proxy scripts with `M1N1DEVICE=/dev/ttyACM0`.

Note: the proxy backdoor requires both verbose mode (`boot-args=-v`) and disabled SIP (`csrutil disable`). Just using verbose mode may give you m1n1 debug output (depending on Apple's boot-arg filtering policy, which can change) but will not enable the proxy backdoor in recent m1n1 builds, for security.
