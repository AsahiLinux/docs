# macOS-hosted tethered boot setup

This guide will give more details about tethered boot prerequisites setup for a macOS host.

## macOS host

Host's requirements:

* Any Apple computer running a decently recent MacOs version
  * Enough disk space on the host for installing and commpiling software
  * a freee USB port on the host
  * a USB-A/USB-C or USB-C/USB-C cable
  * [prerequisites installed](#installing-prerequisite-software)

Tested with:

* iMac 27' late 2015 running  macOs Big Sur 11.7 (20G817)

## Serial port setup

On macOs m1n1 UART device names are different from those of a Linux host (`/dev/m1n1` and `/dev/m1n1-sec` on Linux). Typically device names looks like:

* `/dev/cu.usbmodemP_01` for the primary UART device used by m1n1 propy client
* `/dev/cu.usbmodemP_03` for the secondary UART device used to hook into the m1n1 hypervisor early when the tethered machine boots

Beware that devices names might change on your particular machine or configuration, if in doubt check how you can [find actual device names](#find-actual-device-names).

## Activate m1n1 backdoor

Shutdown (powered-off state) and connect the USB cable to the target machine and then issue the following command on the host:

```shell
~/asahi/m1n1/proxyclient/tools/picocom-sec.sh
```

Now start the tethered machine. The `picocom-sec.sh` script waits for the device and connect to it once it appears, that will trigger m1n1 hypervisor backdoor and you should see some output on the terminal:

```console
picocom v3.1

port is        : /dev/cu.usbmodemP_03
flowcontrol    : none
baudrate is    : 500000
:
:
```

From now on m1n1 hypervisor is ready to accept command through m1n1 proxy client tools:

```shell
$ python3 ~/asahi/m1n1/proxyclient/tools/shell.py
:
:
TTY> Waiting for proxy connection... . Connected!
Fetching ADT (0x00058000 bytes)...
m1n1 base: 0x802848000
Have fun!
>>>
```

### Find actual device names

Install `pyserial` and issue the following command (make sure the target machine is plugged to the host):

```shell
while : ; do pyserial-ports ; sleep 1 ; done
```

Cold-boot (from powered-off state) the tethered machine and wait for new devices to appear: note down the device names (the one with the lower number should be the main m1n1 UART device and the other one the m1n1).

## Installing prerequisite software

### Installing Homebrew

The prefered way to install software on your macOS host is by using the `homebrew` package manager, this is the matter of running a simple chell command.

Open a terminal window (press `[Cmd]`+`[Space]` keys, then type `iterm`, then press `[enter]`) then type the following command (refer to [Homebrew web site](brew.sh) if in doubt):

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Installing Python >= 3.9

macOS bundles Python 3.8 but Python 3.9 or later is required for the m1n1 scripting part that runs on the host and puppeteers the m1n1 hypervisor on the tethered machine:

```shell
brew install python3
```

Check that you are able to access the desired python executable and that you get the minimum required version:

```shell
$ type python3
python3 is /usr/local/bin/python3
$ python3 --version
Python 3.10.8
```

### Installing LLVM

You'll need a C compiler to build m1n1 and its dependencies, and for building kernel too. LLVM is the recommended compiler for Asahi (I think ?):

```shell
brew install llvm
```

### Installing pyserial

Pyserial is required for m1n1 and can help identify the name of the serial port device exposed by macOS when m1n1 boots:

```shell
pip3 install pyserial construct serial.tool
```

Check `pyserial-ports` is installed:

```shell
$ type pyserial-ports
pyserial-ports is /usr/local/bin/pyserial-ports
```

### Installing picocom

A serial port communication software is required to establish communication with m1n1 proxy. We recommend installing `picocom` for use as a serial terminal, which is vailable with homebrew:

```shell
brew install picocom
```

### Installing img4tool (optional)

Either use Homebrew Tap or install it manually

#### Use Homebrew tap

I created a tap to ease installation through Homebrew, just add the tap and install:

```shell
brew tap aderuelle/homebrew-tap
brew install img4tool
```

#### Install manually

If you intend to boot a stock macOS kernel, you'll need these tools to extract the actual kernel file from the kernlecache of a macOS install on the target machine. In the absence of precompiled version for macOS you'll have to compile it.

For this step, setup a `asahi` folder in your home directory and clone everything there, additionaly install everything in an `~/asahi/deps` folder so as to not mess up with the rest of the system.

First clone, build and install `libgeneral`

```shell
cd ~/asahi
git clone https://github.com/tihmstar/libgeneral.git
cd libgeneral
./autogen.sh
./configure --prefix=/Users/alexis/asahi/deps
make && make install
```

Then clone, build and install `img4tool`

```shell
cd ~/asahi
git clone https://github.com/tihmstar/img4tool.git
cd img4tool
./autogen.sh
PKG_CONFIG_PATH=~/asahi/deps/lib/pkgconfig ./configure --prefix=~/asahi/deps
make && make install
```

Update your `PATH` variable so that you're able access `img4tool` binary

```shell
export PATH=~/asahi/deps/bin:$PATH
```
