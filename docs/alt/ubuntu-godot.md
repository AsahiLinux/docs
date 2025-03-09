---
title: Ubuntu Godot
---

**This page contains distro-specific information. This documentation**
**repo is not for distro-specific documentation. The proper place for**
**this is the distro's own documentation system. This page will be removed**
**soon.**

Tested on Ubuntu 22.10 Asahi on M1 Air.

https://godotengine.org

Building Godot 3.5, because currently 4.x seems to crash when starting.

https://docs.godotengine.org/en/latest/development/compiling/compiling_for_linuxbsd.html

```
sudo apt -y install build-essential scons \
pkg-config libx11-dev libxcursor-dev libxinerama-dev \
libgl1-mesa-dev libglu-dev libasound2-dev \
libpulse-dev libudev-dev libxi-dev libxrandr-dev

git clone https://github.com/godotengine/godot.git

git checkout remotes/origin/3.5

cd godot

scons -j$(nproc) platform=linuxbsd

cd bin

./godot.x11.tools.64
```
If you don't have hardware acceleration version of Asahi,
you can use slower software GL:
```
LIBGL_ALWAYS_SOFTWARE=1 ./godot.x11.tools.64
```
