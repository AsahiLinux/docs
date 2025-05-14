---
title: Puesta en Marcha de Linux: USB
---

## root como unidad USB
* Inspirado por el [artículo de Alyssa en tomshardware](https://www.tomshardware.com/news/apple-m1-debian-linux)
* Crea un sistema de archivos raíz **arm64** como se indica en [debian rootfs](https://www.debian.org/releases/stretch/arm64/apds03.html.en)
* Nota: Lo siguiente se realiza como root en un sistema debian:
```
mkdir debinst-buster
debootstrap --arch arm64 --foreign buster debinst-buster http://ftp.au.debian.org/debian/
cp /usr/bin/qemu-aarch64-static debinst-buster/usr/bin
LANG=C.UTF-8 chroot debinst-buster qemu-aarch64-static /bin/bash
```
* En el chroot completa la configuración:
```
/debootstrap/debootstrap --second-stage
```
* Instala cualquier otro paquete que desees con apt
```
apt install file screenfetch procps openssh-server
```
* Configura el sshd para permitir acceso root y establece la contraseña que desees
```
# Agrega PermitRootLogin yes
vi /etc/ssh/sshd_config
# Establece la contraseña de root
passwd
```
* Crea una partición ext4 en un dispositivo USB (por ejemplo, /dev/sdb en el ejemplo)
```
fdisk /dev/sdb
# n => nueva partición
# w => guardar cambios
```
* Formatea el sistema de archivos ext4 ```mkfs.ext4 /dev/sdb1```
* Instala tu nuevo rootfs en él (también podrías haber creado el rootfs directamente en la partición... :-)
```
mount /dev/sdb1 /mnt/img
cp -a debinst-buster/. /mnt/img
umount /mnt/img
```
* Arranca linux con la unidad USB conectada (ahora debería ser /dev/sda1). Usé un hub USB simple en el segundo puerto con un teclado USB y la unidad USB conectados antes de encender el Mac.
```
python3.9 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/sda1 rootdelay=5 rootfstype=ext4'  Image-dart-dev.gz t8103-j274-dart-dev.dtb
```
* **Image-dart-dev.gz** - rama dart/dev de Asahi linux como arriba
* **t8103-j274-dart-dev.dtb** - el dtb del linux anterior
* NO se pasa initrd 