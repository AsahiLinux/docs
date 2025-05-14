---
title: Ubuntu QEMU
---

**Esta página contiene información específica de la distribución. Este repositorio de documentación**
**no es para documentación específica de distribuciones. El lugar apropiado para**
**esto es el propio sistema de documentación de la distribución. Esta página será eliminada**
**pronto.**

Probado en Ubuntu 22.10 Asahi en M1 Air.

Consulta [esta página](../alt-distros.md) para más información sobre la instalación de Ubuntu Asahi.

También instala virt-manager.

Slirp incluido al compilar, para tener red de usuario:
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

make -j$(nproc)

sudo make install
```

## Ejemplos de red para varios sistemas operativos

https://wiki.qemu.org/Documentation/Networking

## ReactOS x86 32bit con red

https://reactos.org

```
wget reactos-32bit-bootcd-nightly.7z

7z x reactos-32bit-bootcd-nightly.7z

mv reactos*.iso ReactOS.iso
```
20G es el tamaño máximo de disco expandible aquí:
```
qemu-img create -f qcow2 ReactOS.qcow2 20G
```
Aquí `-m 3G` es 3 GB de RAM.

Edita `start.sh` y hazlo ejecutable `chmod +x start.sh` con este contenido:
```
qemu-system-i386 -m 3G -drive if=ide,index=0,media=disk,file=ReactOS.qcow2 \
-drive if=ide,index=2,media=cdrom,file=ReactOS.iso -boot order=d \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
Luego ejecuta `./start.sh`

## WinXP x86 32bit con red

1) Crea una imagen de disco duro expandible de 80 GB:
```
qemu-img create -f qcow2 winxp.qcow2 80G
```
2) Inicia la instalación desde winxp.iso

Edita `start.sh` y hazlo ejecutable `chmod +x start.sh`, aquí `-m 4G` es 4 GB de RAM:
```
qemu-system-i386 -m 4G -drive if=ide,index=0,media=disk,file=winxp.qcow2 \
-drive if=ide,index=2,media=cdrom,file=winxp.iso -boot order=d \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
3) Después de instalar, arranca sin el iso
```
qemu-system-i386 -m 4G -drive if=ide,index=0,media=disk,file=winxp.qcow2 \
-boot order=c \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```

## Win10 x86_64 con red

1) Crea una imagen de disco duro expandible de 80 GB:
```
qemu-img create -f qcow2 win10.qcow2 80G
```
2) Inicia la instalación desde win10.iso

Edita `start.sh` y hazlo ejecutable `chmod +x start.sh`, aquí `-m 4G` es 4 GB de RAM:
```
qemu-system-x86_64 -m 4G -drive if=ide,index=0,media=disk,file=win10.qcow2 \
-drive if=ide,index=2,media=cdrom,file=win10.iso -boot order=d \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
3) Después de instalar, arranca sin el iso
```
qemu-system-x86_64 -m 4G -drive if=ide,index=0,media=disk,file=win10.qcow2 \
-boot order=c \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```

## Win11 x86_64 con red

1) Crea una imagen de disco duro expandible de 80 GB:
```
qemu-img create -f qcow2 win11.qcow2 80G
```
2) Inicia la instalación desde win11.iso

Edita `start.sh` y hazlo ejecutable `chmod +x start.sh`, aquí `-m 4G` es 4 GB de RAM, `-usbdevice tablet` hace que el uso del mouse sea más preciso:
```
qemu-system-x86_64 -hda win11.qcow2 -cdrom win11.iso -boot d \
-smp 2 -m 4G -usbdevice tablet \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```

3) Al instalar Win11

a) Usa claves de registro para omitir requisitos:

https://blogs.oracle.com/virtualization/post/install-microsoft-windows-11-on-virtualbox

b) Investiga UEFI y TPM y cómo activarlo, no probado:

- <https://getlabsdone.com/how-to-install-windows-11-on-kvm/>
- <https://getlabsdone.com/how-to-enable-tpm-and-secure-boot-on-kvm/>
- <https://github.com/stefanberger/swtpm/wiki>
- <https://www.reddit.com/r/AsahiLinux/comments/y7hplo/virtual_machines_on_asahi_linux/>
- <https://that.guru/blog/uefi-secure-boot-in-libvirt/>
- <https://www.reddit.com/r/AsahiLinux/comments/107m4nb/windows_vm_on_asahi_qemukvm_virtmanager/>

```
sudo apt-get install dh-autoreconf libssl-dev \
     libtasn1-6-dev pkg-config libtpms-dev \
     net-tools iproute2 libjson-glib-dev \
     libgnutls28-dev expect gawk socat \
     libseccomp-dev make -y

git clone https://github.com/stefanberger/swtpm

cd swtpm

./autogen.sh --with-openssl --prefix=/usr

make -j4

make -j4 check

sudo make install
```

3) Después de instalar, arranca sin el iso
```
qemu-system-x86_64 -hda win11.qcow2 -boot c \
-smp 2 -m 8G -usbdevice tablet \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```

## Ubuntu x86_64 con red

1) Crea una imagen de disco duro expandible de 80 GB:
```
qemu-img create -f qcow2 ubuntu.qcow2 80G
```
2) Inicia la instalación desde ubuntu.iso

Edita `start.sh` y hazlo ejecutable `chmod +x start.sh`, aquí `-m 4G` es 4 GB de RAM:
```
qemu-system-x86_64 -m 4G -drive if=ide,index=0,media=disk,file=ubuntu.qcow2 \
-drive if=ide,index=2,media=cdrom,file=ubuntu.iso -boot order=d \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
3) Después de instalar, arranca sin el iso
```
qemu-system-x86_64 -m 4G -drive if=ide,index=0,media=disk,file=ubuntu.qcow2 \
-boot order=c \
-serial stdio -netdev user,id=n0 -device rtl8139,netdev=n0
```
