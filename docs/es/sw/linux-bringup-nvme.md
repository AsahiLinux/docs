---
title: Inicio de Linux: NVME
---

# Arranque desde unidad USB
## La forma fácil
* Según las [notas de Glanzmann](https://tg.st/u/asahi.txt) descarga un rootfs de debian bullseye bajo MacOS y haz dd directamente en una partición nvme recién creada.
## La forma difícil
 * Esto se hace en otra máquina Linux - usa debian bullseye
### Construye tu rootfs
* [construye el tuyo propio](https://www.debian.org/releases/stretch/arm64/apds03.html.en)
```
mkdir debinst
sudo debootstrap --arch arm64 --foreign bullseye debinst http://ftp.au.debian.org/debian/
sudo cp /usr/bin/qemu-aarch64-static debinst/usr/bin
```
  * Inicia sesión vía chroot a un prompt de bash: `sudo LANG=C.UTF-8 chroot debinst qemu-aarch64-static /bin/bash`
  * Luego completa la segunda etapa `/debootstrap/debootstrap --second-stage`
  * Mientras estás ahí instala cualquier otro paquete que desees: `apt install file screenfetch procps`
  * Para ssh instala un servidor ssh `apt install openssh-server`
  * Permite el acceso root por ssh configurando `PermitRootLogin yes` en `vi /etc/ssh/sshd_config`
  * Lo más importante, establece la contraseña de root `passwd`
### Instala el rootfs en la unidad USB
  * Conecta tu unidad USB y crea una partición con fdisk (asume que la unidad es /dev/sdb) `sudo fdisk /dev/sdb`
  * Formatea la partición (asume que es la primera) `sudo mkfs.ext4 /dev/sdb1`
  * Monta la unidad en algún lugar como /mnt/img `sudo mount /dev/sdb1 /mnt/img`
  * Instala el rootfs que creaste arriba en la unidad `sudo cp -a debinst/. /mnt/img`
  * Desmonta la unidad `sudo umount /mnt/img`
### Arranca con la unidad USB como raíz
  * Vuelve a [arrancar por cable USB](linux-bringup.md#running-linux-via-usb-cable)
  * Asegúrate de tener cargado el último m1n1.macho `python3 proxyclient/tools/chainload.py build/m1n1.macho`
  * Compila un kernel con las características integradas (revisa que sea =m y cambia a =y en .config)
    * En particular necesitas CONFIG_EXT4_FS=y para poder arrancar!
  * Prueba este [snapshot de Asahi linux](https://github.com/amworsley/AsahiLinux/tree/asahi-kbd) y esta [configuración](https://raw.githubusercontent.com/amworsley/asahi-wiki/main/images/config-keyboard+nvme)
  * Luego arranca la imagen comprimida con gzip con la unidad USB como sistema de archivos raíz. Tuve que conectar la unidad en el segundo puerto USB tipo-C del MBA (MacBook Air) a través de un HUB de Tipo-C a USB-Tipo A.
  * Ten en cuenta que cuando conecté un dispositivo USB de menor velocidad (teclado) se reinició el HUB y corrompió mi unidad USB. Así que no uses un teclado, un adaptador de Tipo-A a Tipo-C funcionó bien
  * Por el cable USB carga el nuevo kernel y arranca con la unidad USB como sistema de archivos raíz:
```
python3 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/sda1 rootdelay=5 rootfstype=ext4'  Image.gz t8103-j313.dtb
```
  * El sistema de archivos raíz está en la primera partición de la unidad (/dev/sda1) y es un MBA (t8103-j313.dtb)
  * Si estás arrancando algo diferente revisa el archivo .dts en **arch/arm64/boot/dts/apple/** buscando el valor del campo **model**
### Instala el rootfs en el nvme
 * Bajo MacOS necesitas crear algo de espacio libre según las [notas de Glanzmann](https://tg.st/u/asahi.txt)
 * Ten mucho cuidado de saber exactamente qué partición especificas, esto es solo un **ejemplo**, tus números pueden variar
 * haz espacio - el último número es el espacio que ocupará macos `diskutil apfs resizeContainer disk0s2 200GB`
 * Lista las particiones y ve dónde está el espacio libre ahora `diskutil list`
 * Asigna una partición FAT32 para tu rootfs de linux en el NVME desde el espacio libre
 * **NOTA** tienes que especificar la partición **antes** del espacio libre `diskutil addPartition disk0s3 FAT32 LB 42.6GB`
 * Arranca con la unidad USB ext4 como raíz (como arriba)
 * Usa fdisk para confirmar cuál partición es la nueva FAT32 (debería tener el tamaño que creaste arriba también) `fdisk -l /dev/nvme0n1`
 * Una vez confirmada, formateala a ext4 `mkfs.ext4 /dev/nvme0n1p4`
 * Móntala `mount /dev/nvme0n1p4 /mnt`
 * Copia tu rootfs de la unidad USB como antes `cp -ax /. /mnt`
 * Creo que el -x debería evitar la recursión en el nuevo sistema de archivos en el nvme
 * Desmóntala `umount /mnt`
 * Luego intenta arrancar por el cable USB con tu nuevo sistema de archivos raíz en el nvme
```
python3 proxyclient/tools/linux.py -b 'earlycon console=tty0  console=tty0 debug net.ifnames=0 rw root=/dev/nvme0n1p6 rootfstype=ext4' Image.gz t8103-j313.dtb