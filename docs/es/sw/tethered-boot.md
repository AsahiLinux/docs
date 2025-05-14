---
title: Arranque Tethered
---

## Introducción
Esta guía te guiará a través de los pasos necesarios para configurar tu Mac Apple Silicon para arrancar un kernel de Linux en un entorno de arranque dual con macOS.

Esta guía está destinada específicamente a desarrolladores de kernel y usuarios avanzados que deseen ayudar a probar parches en la rama <a href="https://github.com/AsahiLinux/linux">`asahi`</a>. La compilación de un kernel está fuera del alcance de esta guía. Si estás aquí, deberías ser capaz de compilar un kernel AArch64 por ti mismo. Un `.config` razonable se puede encontrar [aquí](https://github.com/AsahiLinux/PKGBUILDs/blob/main/linux-asahi/config). Ten en cuenta que m1n1 espera una imagen de kernel comprimida en gzip, el Device Tree de tu máquina objetivo, y opcionalmente también un _initramfs_ comprimido en gzip.

## Requisitos de hardware

* Un Mac Apple Silicon con al menos **macOS 12.3** instalado y configurado
  * Debes tener una cuenta de administrador protegida por contraseña. Normalmente, esta será la primera cuenta que creaste al configurar la máquina por primera vez.
* Una máquina anfitriona de cualquier arquitectura ejecutando una distribución GNU/Linux (macOS también es compatible, pero está menos probado; ver [Configuración de arranque tethered en macOS](tethered-boot-macos-host.md))
  * Se admiten toolchains cruzados AArch64 tanto de `GCC` como de `Clang/LLVM`.

Si te interesa el acceso de bajo nivel al SoC a través de su UART de depuración, también necesitarás una solución de puerto serie física real. Consulta [Depuración Serie](../hw/soc/serial-debug.md) para más información. Esto no es necesario para el desarrollo general del kernel o ingeniería inversa, y la mayoría de los desarrolladores encontrarán que el puerto serie virtual ofrecido por el hipervisor m1n1 es suficiente para todo (a menos que estés depurando KVM y no puedas usarlo).

## Pasos de preparación

`m1n1` es nuestro entorno de pruebas/hipervisor/bootloader para Apple Silicon y es necesario para arrancar un kernel de Linux o U-Boot. Para trabajar con las herramientas de `m1n1`, asegúrate de que tu máquina tenga Python 3.9 o posterior instalado, así como `pip`. Para obtener los módulos de _Python_ necesarios para interactuar con `m1n1`, ejecuta:

```shell
pip3 install --user pyserial construct serial.tool
```

Luego, clona el repositorio git de `m1n1` y compílalo.
```shell
git clone --recursive https://github.com/AsahiLinux/m1n1.git
cd m1n1
make
```

Si estás en una máquina aarch64 nativa, usa `make ARCH=` en su lugar.

Instala las [reglas de udev](https://github.com/AsahiLinux/m1n1/blob/main/udev/80-m1n1.rules) en `/etc/udev/rules.d` para obtener nombres de dispositivos bonitos para m1n1. Es posible que debas agregar tu usuario a un grupo específico (por ejemplo, `uucp`) para obtener acceso sin root a los dispositivos, o modificar las reglas de udev para cambiar los permisos de los dispositivos.

También recomendamos instalar `picocom` para usarlo como terminal serie, que debería estar disponible en el repositorio de paquetes de tu distribución.

## Instalando m1n1 en tu Mac Apple Silicon

Puedes usar el instalador público de Asahi Linux para instalarlo. Abre una terminal en macOS y ejecuta:

```shell
curl https://alx.sh | sh
```

Sigue las indicaciones para elegir tu modo de instalación preferido. Puedes optar por instalar una de las imágenes de Fedora Asahi Remix, o la opción solo UEFI para obtener solo m1n1+u-boot, que arrancará ejecutables UEFI desde una unidad USB (o desde el almacenamiento interno, una vez instalado). La instalación de tu rootfs/kernel preferido queda como ejercicio para el lector en ese caso.

Alternativamente, si habilitas el modo experto en el instalador, puedes optar por instalar m1n1 solo en modo proxy tethered. En este caso, puedes saltarte la siguiente sección, ya que tu m1n1 ya arrancará (incondicionalmente) en modo proxy.

## Habilitando el modo proxy backdoor

m1n1 consta de dos etapas. La Etapa 1 se instala durante el paso 1TR de la instalación (después del primer reinicio en la recuperación de macOS) y no se puede modificar sin pasar por la recuperación. La Etapa 2 se carga desde la partición del sistema EFI en `m1n1/boot.bin`, y puede ser actualizada por las distribuciones para añadir nuevas funciones y soporte de hardware. Las compilaciones de lanzamiento de la etapa 1 tienen un modo proxy backdoor, que permite el arranque tethered opcional. Esto debe habilitarse desde 1TR y requiere autenticación de la máquina por seguridad.

Usamos el flag de desactivación de SIP (System Integrity Protection) aplicado al volumen de Asahi Linux para controlar este modo. En volúmenes de macOS esto normalmente desactiva ciertas funciones de seguridad del kernel, mientras que m1n1 lo usa para indicar que debe habilitar el modo proxy backdoor si el sistema arranca en modo verbose. Este cambio es por sistema operativo, así que hacerlo para el volumen de Asahi/m1n1 no afectará ninguna instalación de macOS.

Para habilitar este modo, primero asegúrate de que m1n1 / Asahi Linux sea el volumen de arranque predeterminado (esto será así después de una instalación nueva), luego arranca la máquina manteniendo presionado el botón de encendido desde un estado completamente apagado hasta que aparezca "Cargando opciones de inicio...". Selecciona "Opciones", ingresa tus credenciales de propietario de la máquina macOS si se solicita, luego haz clic en el menú Utilidades y abre una ventana de Terminal.

Desde allí, ejecuta:

```shell
csrutil disable && nvram boot-args=-v
```

Selecciona tu volumen de Asahi Linux cuando se te pida y autentícate cuando se te solicite. Una vez hecho esto, apaga la máquina. Si obtienes un error de emparejamiento, significa que el sistema operativo de arranque predeterminado no coincide con el sistema operativo para el que estás haciendo el cambio (solo puedes bajar la configuración de seguridad para el sistema operativo de arranque predeterminado, ya que eso controla qué recoveryOS arranca).

En este modo, m1n1 esperará 5 segundos al arrancar. Si se detecta una conexión USB y el dispositivo TTY correspondiente (cualquiera de los dos) se abre en la máquina anfitriona, abortará el proceso de arranque normal y entrará en modo proxy. Esto te permite arrancar en modo tethered cuando lo necesites, mientras que la máquina arranca de forma independiente en otros casos.

## Estableciendo la conexión USB

Conecta tu anfitrión y objetivo con un cable USB Tipo C (cualquier cable razonable debería funcionar). Asegúrate de usar un puerto Thunderbolt en el objetivo, para máquinas con puertos que no son TB (por ejemplo, algunos iMac y algunas variantes de Mac Studio). También puedes usar un cable C a A, con el lado A en tu anfitrión. Recomendamos también conectar un cable de carga a otro puerto en tu objetivo.

En tu máquina anfitriona, abre una terminal y ejecuta `proxyclient/tools/picocom-sec.sh`. Esto esperará hasta que se conecte un dispositivo m1n1, luego abrirá su dispositivo USB secundario como terminal serie. Esto sirve para dos propósitos: romper en modo proxy (ver la sección anterior), y también será tu consola serie virtual cuando ejecutes kernels bajo el hipervisor.

Una vez que ese script esté ejecutándose y las máquinas estén conectadas, arranca tu dispositivo objetivo. m1n1 entrará en modo proxy. Confirma que esto funciona ejecutando `proxyclient/tools/shell.py`, lo que te dejará en un shell interactivo de Python (sal con ^D).

## Arrancando un kernel directamente

Para arrancar un kernel de Linux, usa este comando:

```shell
python3 proxyclient/tools/linux.py -b 'earlycon debug rootwait root=/dev/nvme0n1p5 <otros argumentos>' /ruta/a/Image.gz /ruta/a/t6000-j314s.dtb [initramfs opcional]
```
En este ejemplo, le pasamos a `m1n1` un kernel comprimido en gzip y el Device Tree para el MacBook Pro de 14" con SoC M1 Pro, indicándole que monte /dev/nvme0n1p5 como el sistema de archivos raíz. Ten en cuenta que el orden de los argumentos que pasas a `linux.py` importa: debes pasar primero el kernel, segundo el Device Tree y opcionalmente un initramfs al final. Si todo va bien, deberías ver pingüinos en el framebuffer.

Si usas el rootfs de Asahi Linux (Arch Linux ARM), para arranque tethered recomendamos un kernel con módulos deshabilitados (todo integrado). Puedes ignorar el initramfs de Arch Linux, pero deberías proporcionar un initramfs con `/lib/firmware/{brcm/apple}` para asegurarte de que los módulos integrados puedan encontrar su firmware temprano. Luego, simplemente pasa `root=/dev/nvme0n1p5` (sustituye por el número de partición de tu rootfs; 5 es el número típico para instalaciones vanilla) para arrancar directamente al sistema.

## Arrancando un kernel bajo el hipervisor

Usa este script utilitario para arrancar correctamente un kernel de Linux bajo el hipervisor m1n1:

```shell
tools/run_guest_kernel.sh /ruta/a/tu/build/de/linux 'earlycon rootwait root=/dev/nvme0n1p5' [initramfs opcional]
```

Ten en cuenta que el script espera la ruta al árbol de compilación de Linux (es decir, el directorio donde están `.config` y `Makefile`). Elegirá el kernel y los device trees correspondientes desde allí.

Esto hará:

* Construir una imagen guest con m1n1, el kernel deseado, la línea de comandos, initramfs si hay, y todos los device trees disponibles del árbol del kernel (m1n1 seleccionará automáticamente el correcto)
* Encadenar un binario m1n1 plano primero, para asegurar que la máquina objetivo esté ejecutando una versión que coincida con el árbol/herramientas m1n1 en el anfitrión (ya que el ABI del proxy no es estable)
* Arrancar la imagen guest bajo el hipervisor

m1n1 primero se cargará como guest dentro de m1n1 (¡inception!), y el guest interno luego cargará el kernel y el initramfs embebidos. Deberías ver la salida de depuración del guest m1n1 y la consola del kernel en la terminal secundaria que iniciaste antes (con `picocom-sec.sh`).

Ten en cuenta que si usas un initramfs con este script, *debe estar comprimido en gzip* (y ser una sola imagen gzip - concatena y luego comprime, no comprimas y luego concatena). Esto se debe a limitaciones de cómo m1n1 maneja los payloads embebidos.

Puedes usar ^C en la consola del hipervisor para romper en el guest. El script carga automáticamente `System.map`, así que puedes usar el comando `bt` para obtener un stack trace con símbolos. Prueba `cpu(1)` (etc.) para cambiar entre CPUs guest, `ctx` para imprimir el contexto de ejecución, `reboot` para forzar un reinicio duro del sistema, o `cont` (o simplemente ^D) para reanudar la ejecución.

También es posible depurar con GDB o LLDB para obtener la ubicación de línea fuente, investigar structs, etc. Ejecuta el comando `gdbserver` en la consola del hipervisor y conecta GDB/LLDB al socket UNIX `/tmp/.m1n1-unix`. Hay algunas advertencias con gdbserver:
- GDB no soporta la autenticación de punteros en el kernel. Desactiva `CONFIG_ARM64_PTR_AUTH_KERNEL` o usa LLDB para evitar problemas con los punteros.
- No ejecutes comandos de consola del hipervisor que interfieran con GDB/LLDB, o se desincronizarán. Por ejemplo, no edites breakpoints desde ambas consolas al mismo tiempo. 