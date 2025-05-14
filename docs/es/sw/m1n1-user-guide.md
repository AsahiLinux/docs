---
title: Guía de Usuario de m1n1
---

m1n1 es el cargador de arranque desarrollado por el proyecto Asahi Linux para conectar el ecosistema de arranque de Apple (XNU) con el ecosistema de arranque de Linux.

GitHub: [AsahiLinux/m1n1](https://github.com/AsahiLinux/m1n1)

## Lo que hace

* Inicializa el hardware
* Muestra un bonito logo
* Carga cargas útiles incrustadas (adjuntas), que pueden ser:
  * Árboles de dispositivos (FDTs), con selección automática basada en la plataforma
  * Imágenes Initramfs (archivos CPIO comprimidos)
  * Imágenes de kernel en formato de arranque Linux ARM64 (opcionalmente comprimidas)
  * Declaraciones de configuración
* Carga en cadena otra versión de sí mismo desde una partición FAT32 (si está configurado para hacerlo)

El modo proxy permite un gran conjunto de herramientas para desarrolladores, desde reducir tu ciclo de prueba del kernel de Linux a 7 segundos, hasta la exploración y experimentación en vivo del hardware, hasta un hipervisor capaz de ejecutar macOS o Linux y rastrear accesos al hardware en tiempo real mientras proporciona un UART virtual a través de USB. Consulta la [Guía de Desarrollador de m1n1](m1n1-dev-guide.md) para eso. Esta guía solo describe casos de uso triviales del proxy.

## Compilación

Necesitas un toolchain de compilación cruzada `aarch64-linux-gnu-gcc` (o uno nativo, si estás ejecutando en ARM64).
También necesitas `convert` (de ImageMagick) para los logos de arranque.

```shell
$ git clone --recursive https://github.com/AsahiLinux/m1n1.git
$ cd m1n1
$ make
```

La salida estará en build/m1n1.{bin,macho}.

Para compilar en una máquina arm64 nativa, usa `make ARCH=`.

La compilación en macOS ARM64 es compatible con clang y LLVM; necesitas usar Homebrew para
instalar las dependencias requeridas:

```shell
$ brew install llvm imagemagick
```

Después de eso, simplemente escribe `make`.

### Compilación usando la configuración de contenedor

Si tienes un runtime de contenedor instalado, como Podman o Docker, puedes hacer uso de la configuración compose, que contiene todas las dependencias de compilación.

```shell
$ git clone --recursive https://github.com/AsahiLinux/m1n1.git
$ cd m1n1
$ podman-compose build m1n1
$ podman-compose run m1n1 make
$ # o
$ docker-compose run m1n1 make
```

### Opciones de compilación

* `make RELEASE=1` habilita el comportamiento de lanzamiento de m1n1, que oculta la consola por defecto y proporciona una salida de emergencia para activar un modo proxy temprano (ver [Modo proxy](#modo-proxy)).

* `make CHAINLOADING=1` habilita el soporte de carga en cadena. Esto requiere un toolchain de Rust nightly con soporte aarch64, que puedes obtener con: `rustup toolchain install nightly && rustup target install aarch64-unknown-none-softfloat`.

Las compilaciones de lanzamiento de m1n1 etapa 1 empaquetadas con el Instalador de Asahi Linux tienen ambas opciones configuradas. Las compilaciones de lanzamiento de m1n1 etapa 2 empaquetadas por las distribuciones solo deberían tener `RELEASE=1` (ya que no necesitan cargar en cadena más) y por lo tanto no necesitan Rust para compilar.

## Instalación

### Etapa 1 (como fuOS)

m1n1 (con tu elección de cargas útiles) puede instalarse desde 1TR (macOS 12.1 OS/stub y posteriores) de la siguiente manera:

```
kmutil configure-boot -c m1n1-stage1.bin --raw --entry-point 2048 --lowest-virtual-address 0 -v <ruta a tu volumen OS>
```

En versiones anteriores (no recomendado), necesitas el `macho` en su lugar:

```
kmutil configure-boot -c m1n1-stage1.macho -v <ruta a tu volumen OS>
```

El instalador de Asahi Linux normalmente hará esto por ti, y la mayoría de los usuarios nunca tendrán que hacerlo manualmente de nuevo.

Cada OS tiene su propio OS de recuperación. Debes ir a la recuperación de Asahi Linux para ejecutar este comando, o obtendrás errores con algo como `not paired`.

Si no estás en el OS de recuperación correcto, puedes ir al correcto mediante:
```shell
/Volumes/Asahi\ Linux/Finish\ Installation.app/Contents/Resources/step2.sh
```

### Etapa 2 (en el ESP)

La etapa 2 de m1n1 normalmente se almacena en la partición del sistema EFI, típicamente con U-Boot como carga útil. Asumiendo que tu ESP está montado en `/boot/efi`, normalmente harías:

```
cat build/m1n1.bin /path/to/dtbs/*.dtb /path/to/uboot/u-boot-nodtb.bin > /boot/efi/m1n1/boot.bin
```

Para detalles sobre cómo agregar dtb y uboot a m1n1, ver `Configuración para etapa 2` bajo `Cargas útiles` más abajo.

## Cargas útiles

m1n1 soporta las siguientes cargas útiles:

* Árboles de dispositivos (FDTs), opcionalmente comprimidos con gzip/xz
* Imágenes Initramfs, que *deben* estar comprimidas con gzip/xz
* Imágenes de kernel estilo Linux arm64, que *deberían* estar comprimidas con gzip/xz
* Variables de configuración en la forma "var=valor\n"

Las cargas útiles simplemente se concatenan después del binario m1n1 inicial.

### Configuración para etapa 1

m1n1 etapa 1 está configurado por el Instalador de Asahi Linux agregando variables así:

```
cp build/m1n1.bin m1n1-stage1.bin
echo 'chosen.asahi,efi-system-partition=EFI-PARTITION-PARTUUID' >> m1n1-stage1.bin
echo 'chainload=EFI-PARTITION-PARTUUID;m1n1/boot.bin' >> m1n1-stage1.bin
```

**TRAMPA:** Asegúrate de que el UUID esté en minúsculas, de lo contrario algunos consumidores del árbol de dispositivos (notablemente U-Boot) no encontrarán la partición del sistema.

### Configuración para etapa 2

m1n1 etapa 2 normalmente arrancará las cargas útiles directamente, además de recibir la configuración `chosen.asahi,efi-system-partition` de la etapa 1 automáticamente. Usando árboles de dispositivos enviados con U-Boot:

```
cat build/m1n1.bin \
    ../uboot/arch/arm/dts/"t[86]*.dtb \
    <(gzip -c ../uboot/u-boot-nodtb.bin) \
    >m1n1-uboot.bin
```

Ten en cuenta que U-Boot se comprime antes de agregarlo. Los kernels sin comprimir pueden causar problemas con variables que se pierden, ya que su tamaño no puede determinarse con precisión.

### Configuración para arrancar Linux directamente

m1n1 puede arrancar un kernel de Linux e initramfs directamente, ya sea como etapa 1 o 2 (pero probablemente no quieras hacer esto para la etapa 1). Puedes especificar los argumentos de arranque directamente. Usando árboles de dispositivos enviados con el kernel:

```shell
cat build/m1n1.bin \
    <(echo 'chosen.bootargs=earlycon debug root=/dev/nvme0n1p6 rootwait rw') \
    ${KERNEL}/arch/arm64/boot/dts/apple/*.dtb \
    ${INITRAMFS}/initramfs.cpio.gz \
    ${KERNEL}/arch/arm64/boot/Image.gz \
    >m1n1-linux.bin
```

De nuevo, ten en cuenta el uso de una imagen de kernel comprimida. Además, si quieres concatenar múltiples imágenes initramfs, deberías *descomprimirlas primero*, luego concatenarlas y comprimirlas de nuevo ([bug](https://github.com/AsahiLinux/m1n1/issues/157)).

### Configuración para modo proxy

Si no se dan cargas útiles, o si el arranque de las cargas útiles falla, m1n1 volverá al modo proxy.

## Modo proxy

El modo proxy proporciona una interfaz de dispositivo USB (disponible en todos los puertos Thunderbolt) para depuración. Para usarlo, conecta tu dispositivo objetivo a tu dispositivo host con un cable USB (por ejemplo, un cable USB-C a USB-A, con el lado C en el objetivo m1n1). Consulta la [Guía de Desarrollador de m1n1](m1n1-dev-guide.md) para todos los detalles locos. Estos son solo algunos ejemplos simples de lo que puedes hacer.

Cuando está en modo proxy, un host Linux verá dos dispositivos USB TTY ACM, típicamente /dev/ttyACM0 y /dev/ttyACM1. (En macOS esto será /dev/cu.usbmodemP_01 y /dev/cu.usbmodemP_03). El primero es la interfaz proxy adecuada, mientras que el segundo está reservado para uso por la característica UART virtual del hipervisor. Deberías establecer la variable de entorno `M1N1DEVICE` a la ruta del dispositivo correcto.

### Arrancando un kernel de Linux

```
export M1N1DEVICE=/dev/ttyACM0
proxyclient/tools/linux.py <ruta/a/Image.gz> <ruta/a/foo.dtb> <ruta/a/initramfs.cpio.gz> -b "argumentos de arranque aquí"
```

### Cargando en cadena otro m1n1

```
export M1N1DEVICE=/dev/ttyACM0
proxyclient/tools/chainload.py -r build/m1n1.bin
```

### Ejecutando un kernel de Linux como invitado del hipervisor m1n1, con UART virtual

Primero, abre el puerto secundario (por ejemplo, `/dev/ttyACM1`) con un terminal serie:

```
picocom --omap crlf --imap lfcrlf -b 500000 /dev/ttyACM1
```

Luego arranca tu kernel:

```
proxyclient/tools/chainload.py -r build/m1n1.bin
cat build/m1n1.bin \
    <(echo 'chosen.bootargs=earlycon debug rw') \
    ../linux/arch/arm64/boot/dts/apple/*.dtb \
    <ruta initramfs>/initramfs-fw.cpio.gz \
    ../linux/arch/arm64/boot/Image.gz \
    > /tmp/m1n1-linux.macho
python proxytools/tools/run_guest.py -r /tmp/m1n1-linux.macho
```

Ten en cuenta que usamos el `m1n1.bin` raw, y pasamos `-r` a `run_guest.py`. El soporte Mach-O para binarios no-XNU
ha sido deprecado. Por favor no compiles cargas útiles basadas en Linux con la versión Mach-O de
m1n1.

Alternativamente, usa el script `run_guest_kernel.sh` para hacer este proceso significativamente menos
engorroso:

```sh
$ ./proxyclient/tools/run_guest_kernel.sh [directorio de compilación del kernel] [argumentos de arranque] [initramfs (opcional)]
```

### Ejecutando un kernel de macOS como invitado del hipervisor m1n1

Ver [Hipervisor m1n1](m1n1-hypervisor.md)

### Modo proxy de puerta trasera en compilaciones de lanzamiento de etapa 1

Si tienes una compilación de lanzamiento estándar de m1n1 instalada como fuOS (es decir, lo que obtienes cuando ejecutas el instalador de Asahi Linux), puedes habilitar mensajes verbosos y un modo proxy de puerta trasera yendo a 1TR y haciendo esto desde la Terminal de macOS:

```
csrutil disable
```

Se te pedirá que selecciones el volumen de arranque correcto si estás haciendo multi-boot y luego se te pedirá que te autentiques.

Luego puedes habilitar el modo verboso usando:

```
nvram boot-args=-v
```

Una vez habilitado inicialmente, esta característica puede desactivarse con:

```
nvram boot-args=
```

Al hacer esto, m1n1 activará el registro verboso y esperará 5 segundos antes de arrancar sus cargas útiles. Si recibe una conexión proxy USB en ese tiempo, entrará en modo proxy. Esto es extremadamente útil cuando quieres tener una instalación de Linux funcional que arranque automáticamente, pero conservar la capacidad de arrancar kernels a través del modo proxy si algo sale mal, o simplemente para desarrollo rápido.

Ten en cuenta que este estado es menos seguro, ya que cualquier OS instalado puede alterar la propiedad `boot-args`. Restablece tu política de arranque con `csrutil enable` (NO elijas habilitar la seguridad completa cuando se te solicite, ya que esto desinstalará m1n1).

Para entrar en modo proxy, el host necesita *abrir* el dispositivo USB ACM (cualquiera de los 2 servirá). Esto se puede hacer ejecutando, por ejemplo, un terminal serie en un bucle en la interfaz secundaria (que podrías querer para el hipervisor de todos modos): _Nota: para macOS usa_ `/dev/cu.usbmodemP_01`

```
while true; do
    while [ ! -e /dev/ttyACM1 ]; do sleep 1; done
    picocom --omap crlf --imap lfcrlf -b 500000 /dev/ttyACM1
    sleep 1
done
```

Una vez que picocom se conecte, puedes invocar scripts proxy con `M1N1DEVICE=/dev/ttyACM0`. 