---
title: Das U-Boot
---

U-Boot es la carga útil predeterminada para m1n1 etapa 2, y se utiliza para proporcionar un entorno de prearranque estándar familiar para
los desarrolladores de AArch64. El arranque externo no es compatible con las herramientas nativas de arranque de Apple Silicon, lo que hace que U-Boot sea una
necesidad absoluta para proporcionar un entorno de arranque similar a PC. Esta página explica cómo usamos U-Boot y cómo compilarlo e
instalarlo manualmente. Se asume que estás trabajando en una máquina Apple Silicon usando una distribución bien soportada, es decir, ya sea
Asahi en sí o una de las listadas en [Distribuciones Alternativas](../alt/alt-distros.md).

Ten en cuenta que el proceso para compilar e instalar U-Boot listado aquí es solo para fines de documentación y desarrollo.
Si eres un usuario de Asahi y no estás interesado en hackear U-Boot o m1n1, estos se gestionan automáticamente
a través de `pacman`. Lo mismo debería ser cierto para todas (la mayoría) de las distribuciones listadas en [Distribuciones Alternativas](../alt/alt-distros.md).

## Flujo de arranque estándar
Utilizamos la implementación UEFI de U-Boot para cargar y ejecutar un binario UEFI ubicado en `/EFI/BOOT/BOOTAA64.EFI`
en la Partición del Sistema EFI emparejada. La carga útil predeterminada para las instalaciones de Asahi es GRUB. U-Boot pasa a GRUB un puntero
al FDT automáticamente.

## Arreglos alternativos
El script predeterminado de U-Boot puede ser interrumpido en tiempo de ejecución para alterar manualmente el flujo de arranque. Esto permite al usuario
hacer cosas como arrancar desde medios externos, ejecutar código UEFI arbitrario, cargar y saltar directamente a un kernel, etcétera.

## Problemas conocidos
* Los puertos USB-A en máquinas que los tienen no funcionarán debido a que su controlador requiere firmware que no podemos redistribuir
* Lo mismo ocurre con los dos puertos USB Type-C más alejados del cable de alimentación en los iMac, y los dos puertos frontales en el Mac Studio con M1 **Max**.
* Ciertos dispositivos USB que exponen múltiples funciones (hubs con NICs, teclados gaming sofisticados, etc.) no funcionan.
* Los hubs USB con lectores de tarjetas SD integrados causarán que tu máquina se reinicie forzosamente si la ranura está vacía. La solución para esto está en cola.

## Prerrequisitos
* Una máquina Apple Silicon ejecutando Asahi o una distribución listada en [Distribuciones Alternativas](../alt/alt-distros.md)
* Una compilación limpia de m1n1, ver la [Guía de Usuario de m1n1](m1n1-user-guide.md)
* Los DTBs de Apple de `AsahiLinux/linux`. La compilación de estos está fuera del alcance de este documento.
* La Partición del Sistema EFI de Asahi montada en `/boot/efi/`.

## Compilación
1. Clona el repositorio `AsahiLinux/u-boot`.
2. `make apple_m1_defconfig`
3. `make -j$(nproc)`

No te dejes engañar por el nombre del defconfig, compilará soporte para **todas** las máquinas Apple Silicon, no solo el M1. Puedes modificar
la configuración, sin embargo intenta no jugar con las cosas específicas de Apple ya que la mayoría (todas) son absolutamente necesarias solo para arrancar limpiamente.

También puedes compilar usando Clang/LLVM.

## Instalación
Instalar tu compilación de U-Boot implica crear una nueva etapa 2 de m1n1, por lo que requerimos una compilación limpia de m1n1 y los DTBs.
Haz una copia de seguridad de `/boot/efi/m1n1/boot.bin`, luego concatena m1n1, los DTBs y U-Boot. Esto debe ejecutarse como root.

```sh
cat build/m1n1.bin /ruta/a/dtbs/*.dtb <(gzip -c /ruta/a/uboot/u-boot-nodtb.bin) > /boot/efi/m1n1/boot.bin
```

### Nota importante para mantenedores de paquetes
Recomendamos que instales las imágenes desnudas de m1n1/U-Boot y los DTBs en una ubicación específica en el
sistema de archivos raíz, y envíes un script que haga una copia de seguridad de la imagen existente y cree una nueva. Esto previene que las regresiones hagan que la instalación del SO
se bloquee. Los usuarios pueden simplemente montar el ESP en macOS, eliminar el nuevo `boot.bin` y renombrar la copia de seguridad para recuperar su máquina a un
estado conocido bueno. Para un ejemplo de cómo hacemos esto en Asahi, ver `uboot-asahi` y `asahi-scripts/update-m1n1` en el
repositorio `AsahiLinux/PKGBUILDs`.

## Trucos útiles de U-Boot

### Arranque desde USB
1. Asegúrate de que el único dispositivo de almacenamiento USB conectado sea del que quieres arrancar
2. Interrumpe el script predeterminado de U-Boot cuando se te solicite.
```
run bootcmd_usb0
```

Si el USB falla al cargar, es posible que necesites reiniciar el USB, lo que se puede hacer mediante:
```
usb start
usb reset
```

Si estás usando un USB para cargar una recuperación / "Live CD", asegúrate de tener también `usbhid xhci_hcd` bajo MÓDULOS en `/etc/mkinitcpio.conf`. También lee [Install_Arch_Linux_on_a_removable_medium](https://wiki.archlinux.org/title/Install_Arch_Linux_on_a_removable_medium) para consejos y trucos.

### Otros comandos útiles de U-Boot
```sh
bootd # Continuar con el script predeterminado de U-Boot
reset # Reiniciar la máquina
poweroff # Apagar la máquina completamente
nvme scan # Descubrir discos NVMe (requerido para que el siguiente comando tenga éxito)
ls nvme 0:4 / # Listar el contenido de la Partición del Sistema EFI emparejada
``` 