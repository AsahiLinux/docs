## Introduction
This guide will walk you through the steps required to set up your Apple Silicon Mac for booting a Linux kernel in a dual boot environment with macOS.

This guide is intended specifically for kernel developers and advanced users who wish to assist in testing patches in the <a href="https://github.com/AsahiLinux/linux">`asahi`</a> branch. Building a kernel is outside the scope of this guide. If you are here, you should be capable of building an AArch64 kernel by yourself. A somewhat sane `.config` can be found at [[_DesktopKernel_]]. Keep in mind that m1n1 expects a gzipped kernel image, your target machine's Device Tree, and will also optionally take a gzipped _initramfs_.

## Hardware Requirements

* An Apple Silicon Mac with _at least_ **macOS 12.3** installed and configured
  * You must have a password-protected administrator account. Typically, this will be the first account you created when setting up the machine for the first time. 
* A host machine of any architecture running a GNU/Linux distribution (macOS is also supported, but less well tested)
  * Both `GCC` and `Clang/LLVM` AArch64 cross-toolchains are supported.

If you are interested in low-level access to the SoC via its debug UART, you will also require a real, physical serial port solution. See [[Low-level-serial-debug]] for more information on this. This is not necessary for general kernel development or reverse-engineering, and most developers will find the virtual serial port offered by the m1n1 hypervisor to be adequate for everything (unless you're debugging KVM and can't use it).

## Preparation steps

`m1n1` is our Apple Silicon playground/hypervisor/bootloader and is required to boot a Linux kernel or U-Boot. In order to work with `m1n1` tooling, ensure that your machine has Python 3.9 or later installed, as well as `pip`. To get the _Python_ modules required for interacting with `m1n1`, run

```shell
pip3 install --user pyserial construct serial.tool
```

Then, clone the `m1n1` git repo and build it.
```shell
git clone --recursive https://github.com/AsahiLinux/m1n1.git
cd m1n1
make
```

If you are on a native aarch64 machine, use `make ARCH=` instead.

Install the [udev rules](https://github.com/AsahiLinux/m1n1/blob/main/udev/80-m1n1.rules) into `/etc/udev/rules.d` to get pretty device names for m1n1. You may have to add your user to a specific group (e.g. `uucp`) to get non-root access to the devices, or otherwise modify the udev rules to change the device permissions.

We also recommend installing `picocom` for use as a serial terminal, which should be available in your distro's package repository.

## Installing m1n1 on your Apple Silicon Mac

You can use the public Asahi Linux installer to install it. Open up a macOS terminal and run:

```shell
curl https://alx.sh | sh
```

Follow the prompts to choose your desired installation mode. You can opt to install the Desktop or Minimal images (which will get you an Arch Linux ARM based rootfs), or the UEFI only option to get just m1n1+u-boot, which will boot UEFI executables off of a USB drive (or off of the internal storage, once installed). Installation of your preferred rootf/kernel is left as an exercise for the reader in that case.

Alternatively, if you enable expert mode in the installer, you can opt to install m1n1 in tethered-only proxy mode. In this case, you can skip the next section, as your m1n1 will already (unconditionally) boot in proxy mode.

## Enabling the backdoor proxy mode

m1n1 consists of two stages. Stage 1 is installed during the 1TR step of the installation (after the first reboot into macOS recovery) and cannot be modified without a trip through recovery. Stage 2 is loaded from the EFI system partition at `m1n1/boot.bin`, and can be updated by distributions to add new features and hardware support. Release builds of stage 1 have a backdoor proxy mode, which allows for optional tethered boot. This has to be enabled from 1TR, and requires machine authentication for security.

To enable the proxy mode, ensure that m1n1 / Asahi Linux is the default boot volume (this will be the case after a fresh install), then boot the machine by holding down the power button from a fully shut down state until "Loading startup options..." appears. Select "Options", enter your macOS machine owner credentials if prompted, then click on the Utilities menu and open a Terminal window.

From there, run:

```shell
csrutil disable && nvram boot-args=-v
```

Select your Asahi Linux volume when prompted, and authenticate yourself when prompted. Once this is done, shut down the machine.

In this mode, m1n1 will wait for 5 seconds on boot. If a USB connection is detected and the corresponding TTY device (either of the two) is opened in the host machine, it will abort the regular boot process and go into proxy mode. This allows you to boot in tethered mode when needed, while letting the machine boot stand-alone otherwise.

## Establishing the USB connection

Connect your host and target with a USB Type C cable (any reasonable cable should work). Make sure you use a Thunderbolt port on the target, for machines with non-TB ports (e.g. some iMac and some Mac Studio variants). You can also use a C to A cable, with the A side on your host. We recommend also connecting a charge cable to another port on your target.

On your host machine, pull up a terminal window and run `proxyclient/tools/picocom-sec.sh`. This will wait until a m1n1 device connects, then open its secondary USB device as a serial terminal. This serves two purposes: to break into proxy mode (see the previous section), and also will be your virtual serial console when you run kernels under the hypervisor.

Once that script is running and the machines are connected, boot your target device. m1n1 will break into proxy mode. Confirm that this works by running `proxyclient/tools/shell.py`, which will drop you into an interactive Python shell (exit with ^D).

## Booting a kernel directly

To boot a Linux kernel, use this command:

```shell
python3 proxyclient/tools/linux.py -b 'earlycon debug rootwait root=/dev/nvme0n1p5 <other args>' /path/to/Image.gz /path/to/t6000-j314s.dtb [optional initramfs]
```
In this example, we pass `m1n1` a gzipped kernel, and the Device Tree for the 14" MacBook Pro with M1 Pro SoC, telling it to mount /dev/nvme0n1p5 as the root filesystem. Keep in mind that the order of arguments you pass to `linux.py` matters -- you must pass it the kernel first, Device Tree second, and optionally an initramfs last. If all goes well, you should see penguins in the framebuffer.

If you are using the Asahi Linux (Arch Linux ARM) rootfs, for tethered boot we recommend a kernel with modules disabled (all built-in). You can ignore the Arch Linux initramfs, but you should instead provide an initramfs with `/lib/firmware/{brcm/apple}` to make sure the built-in modules can find their firmware early. Then, just pass `root=/dev/nvme0n1p5` (substitute whatever your rootfs partition number is; 5 is the typical number for vanilla installs) to boot directly into the system.

## Booting a kernel under the hypervisor

Use this utility script to properly boot a Linux kernel under the m1n1 hypervisor:

```shell
tools/run_guest_kernel.sh /path/to/linux/build/dir 'earlycon rootwait root=/dev/nvme0n1p5' [optional initramfs]
```

Note that the script expects the path to the Linux build tree (i.e. the directory where `.config` and `Makefile` are). It will pick out the kernel and corresponding device trees from within.

This will:

* Build a guest image with m1n1, the desired kernel, the command line, initramfs if any, and all available device trees from the kernel tree (m1n1 will autoselect the correct one)
* Chainload a plain m1n1 binary first, to ensure the target machine is running a version that matches the m1n1 tree/tools in the host (since the proxy ABI is not stable)
* Boot the guest image under the hypervisor

m1n1 will first load as a guest inside m1n1 (inception!), and the inner guest will then load the embedded kernel and initramfs. You should see the guest m1n1 debug output and the kernel console in the secondary terminal you started earlier (with `picocom-sec.sh`).

Note that if you use an initramfs with this script, *it must be gzipped* (and be a single gzipped image - concatenate then gzip, don't gzip then concatenate). This is due to limitations of how m1n1 handles embedded payloads.

You can use ^C in the hypervisor console to break into the guest. The script automatically loads `System.map`, so you can use the `bt` command to get a stack trace with symbols. Try `cpu(1)` (etc.) to switch between guest CPUs, `ctx` to print execution context, `reboot` to force a hard system reboot, or `cont` (or just ^D) to resume execution.

Debugging with GDB or LLDB to get source line location, to investigate structs, etc, is also possible. Run `gdbserver` command in the hypervisor console, and connect GDB/LLDB to `/tmp/.m1n1-unix` UNIX domain socket. There are some caveats with gdbserver:
- GDB lacks with in-kernel pointer-authentication support. Disable `CONFIG_ARM64_PTR_AUTH_KERNEL` or use LLDB to avoid problems with pointers.
- Do not run hypervisor console commands interfering with GDB/LLDB, or they will be out-of-sync. For example, do not edit breakpoints from both of hypervisor console and GDB/LLDB at the same time.
