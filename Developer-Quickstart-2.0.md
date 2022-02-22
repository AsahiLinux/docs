## Introduction
This guide will walk you though the steps required to set up your Apple Silicon Mac for booting a Linux kernel in a dual boot environment with macOS. As we all have our preferred userspace environments, this guide does not prescribe any particular distribution's root filesystem or AArch64 installation procedure. Instead, acquiring and pointing the kernel to a root filesystem is left as an exercise for the reader.

This guide is intended specifically for kernel developers and advanced users who wish to assist in testing patches in the <a href="https://github.com/AsahiLinux/linux">`linux-asahi`</a> branch. Building a kernel is outside the scope of this guide. If you are here, you should be capable of building an AArch64 kernel by yourself. A somewhat sane `.config` can be found at [[DesktopKernel]]. Keep in mind that m1n1 expects a gzipped kernel image, your target machine's Device Tree, and will also optionally take a gzipped initramfs.

If you are an end user after nice desktop Linux experience on their Apple Silicon Mac, this guide is not for you. Support for these machines is not yet at a point where it is ready for production use, or even your average power user. See [[Feature Support]] for what works and what doesn't (hint: most things you would expect from a modern desktop do not work yet or are unstable).


## Hardware Requirements
* An Apple Silicon Mac with _at least_ **macOS 12.0.1** installed and configured
  * You must have a password-protected administrator account. Typically, this will be the first account you created when setting up the machine for the first time. 
* A machine of any architecture running a GNU/Linux distribution
  * Both GCC and Clang/LLVM AArch64 cross-toolchains are supported.

If you are interested in low-level access to the SoC via its debug UART, you will also require a real, physical serial port solution. See [[Low level serial debug]] for more information on this. This is not necessary for general kernel development or reverse engineering, but is nice for easy debugging of low-level hardware issues.

## Installing m1n1 on your Apple Silicon Mac
m1n1 is our Apple Silicon playground/hypervisor/bootloader, and is required to boot a Linux kernel or U-Boot. There are three steps to installing it. You must first prepare the disk, run the Asahi Linux installer script from a Terminal inside macOS, then finalise the installation of m1n1 from inside 1TR.

### Step 1: Preparing your disk
Preparing the disk is rather trivial. You need only shrink the macOS APFS container to allocate some free space. m1n1 requires only about 3GB of space on the disk. Take into account any space you also wish to dedicate to a root filesystem on the internal SSD. 

macOS is space-inefficient, especially during OS upgrades, so we recommended that you do not shrink the macOS container to less than 70GB. By default, the main macOS container resides on `disk0s2`, however it is always a good idea to verify you are altering the right partition by running

```shell
diskutil list
```
before making any changes. To shrink the APFS container, run

```shell
diskutil apfs resizeContainer disk0s2 100GB
```
In this example, we shrink the macOS container to 100GB, leaving plenty of space for system updates and user files. This process takes a few minutes, and your machine may lock up for a couple of seconds during the process. If you are doing this on a MacBook, it is recommended that you have the machine plugged in while you do this.

### Step 2: The Asahi Linux installer
After allocating some space on the disk, it is time to install m1n1. This process is somewhat convoluted, and involves tricking the machine into thinking m1n1 is a full macOS installation. To simplify this process, we have an installer that automates most of this process for you. Run

```shell
curl -L https://mrcn.st/alxsh | sh
```
and follow the prompts. 

In this phase, the installer will:
1. Examine the disk for unallocated space
2. Set up ~3GB of this space as a 'stub' macOS container
3. Copy machine firmware and other files required for booting to the stub
4. Convince macOS that the stub is a real Startup Disk

The installer may ask you which version of macOS you want to use as the stub. We are currently working with macOS 12.1 as our base, so pick this if prompted. The installer will not offer a newer version of macOS than the one installed on your machine.

You will then go to System Preferences/Startup Disk and choose the newly created `Linux` disk and click Restart. Close System Preferences and then follow the instructions given to you by the installer. Do not be alarmed when your machine does not restart despite you having clicked Restart. The installer actually intervenes and initiates a full shutdown.

### Step 3: Configuring 1TR to allow m1n1 to boot
With your machine shut down completely, **hold down** the power button and **do not let go** until you see `Loading startup options...` appear under the Apple logo, _or_ a spinning cogwheel appears on screen. The boot menu is localised, so the text prompts may be slightly different depending on your locale. You will then click on Options, which will boot you into 1TR -- Apple's fully trusted playground with _real_ root access. You will be asked to authenticate yourself with your administrator user account and password. After this is done and 1TR is done `Examining disks`, find Utilities in the Menu Bar and open a Terminal window. From there, run

```shell
/Volumes/Linux/step2.sh
```
and follow the prompts given. When asked for a username and password, enter the same administrator account details you used to authenticate 1TR. In this phase, the installer will:

1. Prepare the machine to boot custom kernels
2. Provide m1n1 as the custom kernel for the `Linux` stub

This process may take a couple of minutes. Once this is completed, your machine is now ready to boot into m1n1 and be fed a kernel from a host Linux machine. Do not reboot your machine just yet, however.

## Preparing your host machine
Before you can feed a kernel to the Apple Silicon machine, you must prepare your host machine for working with m1n1.


### m1n1 prerequisites
m1n1's interactive host components are written in Python, and communicate with the Apple Silicon machine via a USB serial device set up by m1n1 at boot time (`/dev/ttyACM0` on your host machine). This is exposed on the machine's debug port. On MacBooks, this is the rearmost left Thunderbolt port and on the Mac Mini it is the Thunderbolt port closest to the the power button. Any USB cable with at least one Type-C end will work. In order to work with m1n1, ensure that your machine has Python 3.9 or later installed, as well as `pip`. To get the Python modules required for interacting with m1n1, run

```shell
pip3 install --user pyserial construct serial.tool
```

### Preparing m1n1
You must clone the m1n1 git repo and build it.
```shell
git clone --recursive https://github.com/AsahiLinux/m1n1.git
cd m1n1
make
```

m1n1 is now prepared on the host side. 

## Booting your kernel
Place your `Image.gz` and Device Tree (and optionally your initramfs) inside the m1n1 directory. Connect your Apple Silicon machine's debug port to your host machine and reboot it. Once it has rebooted, you should be greeted by the Asahi Linux logo and m1n1's boot log. To boot your kernel, run these commands as root:

```shell
M1N1DEVICE=/dev/ttyACM0
export M1N1DEVICE
python3 proxyclient/tools/linux.py -b 'earlycon debug rootwait[your other boot args go here]' Image.gz t6000-j314s.dtb
```
In this example, we pass m1n1 a gzipped kernel and the Device Tree for the 14" MacBook Pro with M1 Pro SoC. Keep in mind that the order of arguments you pass to `linux.py` matters -- you must pass it the kernel first, Device Tree second, and optionally an initramfs last. If all goes well, you should see penguins in the framebuffer. Note that `earlycon debug rootwait` should always be passed to the kernel, especially `rootwait`.

## Some tips
* If you need to get back to macOS power down the machine, bring up the startup options by holding the power button and select Macintosh HD.
* When passing `root=` to your kernel, use a UUID. macOS updates sometimes shift the partition numbers.
* MacBooks will charge under Linux, there is no need to reboot into macOS to charge them.
* Power management does not work. Shutting down from Linux will halt execution, but will not power down the machine. Once your console cursor stops blinking, it is safe to power off the machine by holding in the power button. 


## ADVANCED: Booting Linux without serial intervention
**This section is provided for educational purposes only. I would not recommend doing this, as it is extremely annoying to have to run `kmutil` in 1TR every time you want to change your kernel or initramfs configuration. Only do this if you are absolutely sick to death of tethered booting and could not possibly stand typing `linux.py` one more time!**

m1n1 supports directly booting a kernel untethered. In this example, we will prepare an M1 Pro 14" MacBook Pro for untethered booting, this time with an initramfs. Ensure that your kernel is built with whatever boot arguments you want to start with in the default bootargs string, which can be found in `Boot options` in `menuconfig`.


### Preparing a boot payload
On the host machine, you will concatenate m1n1, the gzipped kernel, your machine's Device Tree, and optionally a gzipped initramfs. As above, the order in which you concatenate these payloads matters.
```shell
cd build/
cat m1n1.bin /path/to/Image.gz /path/to/t6000-j314s.dtb /path/to/initramfs.gz > payload.bin
python3 -m http.server
```
This will create your new Apple Silicon boot payload and start an HTTP server. This is required to transfer the payload to the Apple Silicon machine in 1TR.

### Replacing m1n1 with your payload
Boot the Apple Silicon machine into 1TR as you did when first installing m1n1 by holding the power button and selecting Options at the boot menu. Authenticate yourself, and open a Terminal window.
```shell
curl [host machine hostname]:8000/payload.bin -o payload.bin
kmutil configure-boot -c payload.bin --raw --entry-point 2048 --lowest-virtual-address 0 -v /Volumes/Linux
```
You will be asked once again to authenticate yourself, and after a moment you will be able to reboot straight into Linux, bypassing the need for booting tethered to your host machine.
