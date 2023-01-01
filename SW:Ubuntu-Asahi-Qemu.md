Tested on Ubuntu 22.10 Asahi on M1 Air.

Also installs virt-manager.

Slirp included when compiling, to have user networking:
https://bugs.launchpad.net/qemu/+bug/1917161

```
sudo apt -y install git libglib2.0-dev libfdt-dev \
libpixman-1-dev zlib1g-dev ninja-build \
git-email libaio-dev libbluetooth-dev \
libcapstone-dev libbrlapi-dev libbz2-dev \
libcap-ng-dev libcurl4-gnutls-dev libgtk-3-dev \
libibverbs-dev libjpeg8-dev libncurses5-dev \
libnuma-dev librbd-dev librdmacm-dev \
libsasl2-dev libsdl2-dev libseccomp-dev \
libsnappy-dev libssh-dev \
libvde-dev libvdeplug-dev libvte-2.91-dev \
libxen-dev liblzo2-dev valgrind xfslibs-dev \
libnfs-dev libiscsi-dev flex bison meson \
qemu-utils virt-manager

git clone https://gitlab.com/qemu-project/qemu.git

cd qemu

git submodule init

git submodule update

git clone https://gitlab.freedesktop.org/slirp/libslirp

cd libslirp

meson build

ninja -C build install

cd ..

mkdir build

cd build

../configure --enable-slirp
```
M1 Air `nproc` shows 8 cores, so using it as option `-j8` here:
```
make -j8

sudo make install
```

## Networking examples for various OS

https://wiki.qemu.org/Documentation/Networking

## ReactOS with networking

https://reactos.org

```
wget reactos-32bit-bootcd-nightly.7z

7z x reactos-32bit-bootcd-nightly.7z

mv reactos*.iso ReactOS.iso
```
20G is max growable disk size here:
```
qemu-img create -f qcow2 ReactOS.qcow2 20G
```
Here `-m 3G` is 3 GB RAM.

Edit `start.sh` and set it executeable `chmod +x start.sh` with this content:
```
qemu-system-i386 -m 3G -drive if=ide,index=0,media=disk,file=ReactOS.qcow2 \
-drive if=ide,index=2,media=cdrom,file=ReactOS.iso -boot order=d \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
Then run `./start.sh`