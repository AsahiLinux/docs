For accelerated graphics. Tested on Ubuntu 22.10 Asahi on M1 Air.

## 1) /etc/apt/sources.list

```
## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team. Also, please note that software in universe WILL NOT receive any
## review or updates from the Ubuntu security team.
deb http://ports.ubuntu.com/ubuntu-ports/ kinetic multiverse main universe restricted
deb-src http://ports.ubuntu.com/ubuntu-ports/ kinetic multiverse main universe restricted
deb http://ports.ubuntu.com/ubuntu-ports/ kinetic-security main multiverse universe restricted
deb-src http://ports.ubuntu.com/ubuntu-ports/ kinetic-security main multiverse universe restricted
deb http://ports.ubuntu.com/ubuntu-ports/ kinetic-updates main multiverse universe restricted
deb-src http://ports.ubuntu.com/ubuntu-ports/ kinetic-updates main multiverse universe restricted
deb http://ports.ubuntu.com/ubuntu-ports/ kinetic-backports main multiverse universe restricted
deb-src http://ports.ubuntu.com/ubuntu-ports/ kinetic-backports main multiverse universe restricted
```

## 2) Install dependencies

Mesa code is from https://gitlab.freedesktop.org/asahi/mesa/-/tree/asahi/oq

```
sudo apt update

sudo apt -y build-dep mesa

sudo apt -y install linux-edge-asahi build-essential wget meson ninja-build mesa-utils

wget https://gitlab.freedesktop.org/asahi/mesa/-/archive/asahi/oq/mesa-asahi-oq.tar.gz

tar -xzvf mesa-asahi-oq.tar.gz

cd mesa-asahi-oq

mkdir build
```

## 3) Build

Building below with meson https://docs.mesa3d.org/meson.html without options mentioned at
https://github.com/AsahiLinux/PKGBUILDs/blob/main/mesa-asahi-edge/PKGBUILD ,
because with those options came some errors.

```
meson build/

ninja -C build/

ninja -C build/ install
```

## 4) Reboot

```
sudo reboot
```

## 5) Test with glxgears

```
$ glxgears
Running synchronized to the vertical refresh.  The framerate should be
approximately the same as the monitor refresh rate.
302 frames in 5.0 seconds = 60.372 FPS
```

## 6) Test with glxinfo -B

```
$ glxinfo -B
name of display: :0
display: :0  screen: 0
direct rendering: Yes
Extended renderer info (GLX_MESA_query_renderer):
    Vendor: Asahi (0xffffffff)
    Device: Apple M1 (G13G B1) (0xffffffff)
    Version: 23.0.0
    Accelerated: yes
    Video memory: 15702MB
    Unified memory: yes
    Preferred profile: compat (0x2)
    Max core profile version: 0.0
    Max compat profile version: 2.1
    Max GLES1 profile version: 1.1
    Max GLES[23] profile version: 2.0
OpenGL vendor string: Asahi
OpenGL renderer string: Apple M1 (G13G B1)
OpenGL version string: 2.1 Mesa 23.0.0-devel
OpenGL shading language version string: 1.20

OpenGL ES profile version string: OpenGL ES 2.0 Mesa 23.0.0-devel
OpenGL ES profile shading language version string: OpenGL ES GLSL ES 1.0.16
```

## 7) Test with SuperTuxKart

For sound, used USB-C hub => USB3 port => USB wireless dongle => Jabra Link 380 Headset

https://supertuxkart.net/Download / Linux Show / Full game (.tar.xz) ARM 64-bit
```
./run-game.sh
```
Options / Interface / [X] Display FPS
