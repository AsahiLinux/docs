---
title: Instalando Gentoo
---

**Esta página contiene información específica de la distribución. Este repositorio de documentación**
**no es para documentación específica de distribución. El lugar apropiado para**
**esto es el propio sistema de documentación de la distribución. Esta página será eliminada**
**pronto.**

## Tabla de Contenidos
- [Introducción](#introducción)
- [Prerrequisitos](#información-importante-de-prerrequisitos)
- [Instalación](#paso-1-configurar-el-entorno-asahi-u-boot)
  * [Paso 1: Configurar el Entorno Asahi U-Boot](#paso-1-configurar-el-entorno-asahi-u-boot)
  * [Paso 2: Obtener la imagen Gentoo Asahi LiveCD](#paso-2-obtener-la-imagen-gentoo-asahi-livecd)
  * [Paso 3: Arrancar en la LiveCD](#paso-3-arrancar-en-la-livecd)
  * [Paso 4: Instalar archivos de soporte de Asahi](#paso-4-instalar-archivos-de-soporte-de-asahi)
  * [Paso 5: ¡Diviértete!](#paso-5-diviértete)
- [Mantenimiento](#mantenimiento)
  * [Actualizando U-Boot y m1n1](#actualizando-u-boot-y-m1n1)
  * [Actualizando el kernel](#actualizando-el-kernel)
  * [Sincronizando el overlay de Asahi](#sincronizando-el-overlay-de-asahi)

## Introducción
Instalar Gentoo en Apple Silicon no es muy diferente a hacerlo en una máquina amd64 estándar.
Tenemos una imagen LiveCD que es casi idéntica a la Gentoo arm64 estándar, personalizada solo para
permitir que arranque en dispositivos Apple Silicon.

La única desviación importante del Manual es usar el paquete [chadmed's `asahi-gentoosupport`](https://github.com/chadmed/asahi-gentoosupport) para automatizar la
instalación del kernel, GRUB, overlay, m1n1 y U-Boot. Por supuesto, eres bienvenido a intentar instalar
estos manualmente, sin embargo te tomará más tiempo que el bootstrap del resto del sistema combinado.

Esta guía asumirá que estás familiarizado con el instalador de Asahi Linux y no te guiará a través de su uso.

Si nunca has usado un overlay de Portage antes, tómate unos minutos para leer la sección final sobre el mantenimiento del sistema.
No hacerlo correctamente puede resultar en que te pierdas actualizaciones críticas del sistema o dejes tu máquina en un estado no arrancable.

## Información importante de prerrequisitos
* Por favor no uses `genkernel` para construir tu initramfs. El único generador de initramfs soportado es `dracut`. El paquete `asahi-configs`
  instalado más tarde proporcionará los archivos de configuración necesarios para hacer que `dracut` funcione sin problemas.
  
* La pila USB de U-Boot no es fantástica, por decir lo menos. Puedes encontrar que varios USB sticks o teclados no funcionan de manera confiable
  con él. Desafortunadamente, no hay nada que podamos hacer al respecto en este momento y tendrás que probar diferentes dispositivos USB
  hasta encontrar uno que funcione.

## Paso 1: Configurar el Entorno Asahi U-Boot
Usa el Instalador de Asahi para configurar el entorno UEFI mínimo de m1n1 + U-boot. Asegúrate de decirle al instalador que
deje la cantidad de espacio libre que quieres para tu sistema Gentoo. Puede ser más fácil simplemente usar la opción de
instalación Fedora Asahi Remix Minimal. No la usaremos, pero garantizará que el espacio esté reservado para tu sistema de archivos raíz.

Se asume de aquí en adelante que has "completado" completamente la instalación de Asahi.

## Paso 2: Obtener la imagen Gentoo Asahi LiveCD
Construimos LiveCDs de Gentoo ligeramente personalizadas que permiten arrancar en máquinas Apple Silicon. Obtén la más reciente desde
https://chadmed.au/pub/gentoo/.

Las LiveCDs se construyen usando las herramientas estándar de ingeniería de lanzamiento de Gentoo. Los archivos spec de Catalyst se pueden encontrar en
https://github.com/chadmed/gentoo-asahi-releng.

Graba esto en un USB stick usando tu método favorito. Como siempre, el viejo y simple `dd` funciona mejor.

## Paso 3: Arrancar en la LiveCD
Arranca la máquina con el USB stick que grabaste conectado. U-Boot enumerará tus dispositivos USB, luego te dará 2 segundos
para interrumpir su secuencia de arranque automática. Si optaste por la opción de instalación m1n1 + U-Boot, deberías estar seguro
de simplemente dejar que continúe arrancando. Arrancará automáticamente desde tu USB stick.

Si instalaste una de las imágenes de sistema operativo completo, necesitarás interrumpir el proceso de arranque y forzar
a U-Boot a arrancar desde el USB. Una vez que hayas interrumpido la secuencia de arranque automática de U-Boot, ejecuta esta serie de comandos:

```
setenv boot_targets "usb"
setenv bootmeths "efi"
boot
```

Si tu U-Boot se lleva bien con tu USB stick, esto te arrancará en el GRUB de la LiveCD. Desde aquí, puedes simplemente
seguir el Manual de Gentoo para amd64, deteniéndote solo cuando sea hora de instalar un kernel.

**NOTA**: Al particionar tu máquina, es absolutamente vital que no alteres ninguna partición que no sea
el espacio reservado para tu rootfs. Esto incluye la Partición del Sistema EFI configurada por el Instalador de Asahi. Eres libre
de particionar el espacio rootfs de cualquier manera que desees, pero no modifiques ninguna otra estructura en el disco. Lo más probable
es que requieras una restauración DFU de tu Mac si lo haces.

## Paso 4: Instalar archivos de soporte de Asahi
Instala Git ejecutando `emerge -av dev-vcs/git`, luego clona `chadmed/asahi-gentoosupport` desde GitHub. Ejecuta `./install.sh` y sigue las indicaciones. Esto
* Instalará el Overlay de Asahi, que proporciona el kernel, herramientas de arranque y (posiblemente) paquetes parcheados
* Instalará el paquete `sys-apps/asahi-meta`, que traerá todas las cosas específicas de Asahi necesarias para el arranque,
  incluyendo un dist-kernel.
* Instalará y actualizará GRUB.

Esto te permite saltarte la configuración de GRUB, el kernel y las herramientas de arranque tú mismo, lo cual puede ser un poco complicado en estas
máquinas y puede dejarte con una configuración de Linux no arrancable.

## Paso 5: ¡Diviértete!
Termina el resto de tu procedimiento de instalación de Gentoo habitual, reinicia, ¡y diviértete! Es una buena idea personalizar el kernel como
te parezca ya que la configuración en ejecución se basará en Arch/Asahi Linux. Recuerda guardar el kernel en ejecución y el initramfs como
una copia de seguridad para que puedas arrancarlo fácilmente desde GRUB si algo sale mal.

## Mantenimiento
Obtener y aplicar actualizaciones del sistema es un poco más complicado que una instalación de Gentoo totalmente vanilla. Necesitas mantener
el overlay de Asahi sincronizado y asegurarte de que el firmware del sistema se actualice correctamente.

### Actualizando U-Boot y m1n1
Cuando actualices los paquetes de U-Boot o m1n1, Portage solo instalará los binarios resultantes en `/usr/lib/asahi-boot/`.
Esto es tanto una medida de seguridad como de confiabilidad. m1n1 viene con un script, `update-m1n1`, que debe ejecutarse como root
cada vez que actualices el kernel, U-Boot o m1n1 mismo. Este script es responsable de recopilar los blobs de m1n1, U-Boot
y Devicetree, empaquetarlos en un único objeto binario, e instalarlo en la Partición del Sistema EFI.
Para más información sobre cómo funciona esto y por qué debe funcionar de esta manera, consulta [Ecosistema de Sistemas Operativos Abiertos en Macs con Apple Silicon](../platform/open-os-interop.md)

### Actualizando el kernel
Cuando estés pasando por una actualización del kernel, es extremadamente importante que actualices la carga útil de m1n1 Etapa 2 al
mismo tiempo. m1n1 Etapa 2 contiene los blobs de Devicetree requeridos para que el kernel encuentre el hardware, lo sondee correctamente, y
arranque el sistema. Los Devicetrees no son estables, y una actualización del kernel con nuevos DTs puede resultar en un sistema no arrancable, pérdida de
función, o perder una característica recién habilitada. Para asegurarte de que esto no ocurra, es imperativo que ejecutes
```bash
root# update-m1n1
```
después de *cada* actualización del kernel. 

**Nota para desarrolladores y usuarios avanzados:** También puedes querer instalar múltiples kernels, y hacer uso de `eselect kernel`
para cambiar el enlace simbólico a `/usr/src/linux`. Esto es compatible, sin embargo *debes* ejecutar `eselect kernel set` y `update-m1n1`
antes de *cada* reinicio en un kernel diferente. Esto es para asegurar que siempre estés arrancando con los DTB correctos.

### Sincronizando el overlay de Asahi
Para recibir actualizaciones específicas de Asahi, debes asegurarte de que el overlay de Asahi permanezca sincronizado. Portage
hará esto por ti si usas `emerge --sync`, pero *no* si usas `emerge-webrsync`. Para sincronizar el overlay manualmente, ejecuta
```bash
root# emaint -r asahi sync
```
antes de intentar actualizar. No se necesitan otros pasos para asegurarte de que los paquetes se actualicen, solo actualiza 
tu sistema como lo harías normalmente en este punto. 