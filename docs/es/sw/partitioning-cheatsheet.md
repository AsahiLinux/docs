---
title: Guía Rápida de Particionamiento
---

# ADVERTENCIA: NUNCA ELIMINES LA PARTICION `Apple_APFS_Recovery`

La última partición en tu disco, listada como tipo `Apple_APFS_Recovery` en diskutil, contiene componentes críticos de recuperación del sistema. **Si eliminas esta partición por accidente, las actualizaciones de macOS dejarán de funcionar, y cualquier otro problema con tu sistema lo dejará sin arranque y requerirá una restauración de fábrica y un borrado completo**. Restaurar esta partición sin un borrado completo de la máquina es [un gran dolor de cabeza](https://www.reddit.com/r/AsahiLinux/comments/1fmnzm5/guide_how_to_fix_failed_to_find_sfr_recovery/). NO, bajo ninguna circunstancia, manipules esta partición.

No es posible que el instalador de Asahi Linux cause esto por sí mismo, ya que no contiene ningún código de eliminación de particiones y nunca lo ha tenido, ni accede a la tabla de particiones en bruto de ninguna manera. Si te encuentras en esta situación, entonces o bien eliminaste la partición tú mismo sin saberlo (desde Linux o desde macOS/recoveryOS), o algún tipo de error de Apple lo hizo.

## Introducción

La gestión de particiones desde macOS puede ser confusa. Con suerte, esto ayuda a explicar las cosas.

Nota: Pronto agregaremos opciones de desinstalación/limpieza al instalador, pero por definición siempre será una herramienta simplificada que solo está garantizada para funcionar en el caso común de instalaciones vanilla de Asahi Linux; si haces tu propia gestión de particiones o instalas otra distribución, tendrás que saber cómo hacerlo manualmente como se describe aquí para limpiar correctamente.

**Nota: Si estás eliminando Asahi Linux, tendrás que configurar macOS como el sistema operativo de arranque predeterminado nuevamente si aún no lo has hecho.** Puedes hacer esto desde Configuración del Sistema en el propio macOS, o manteniendo presionada la tecla Opción mientras lo seleccionas en las Opciones de Arranque. No hacer esto de antemano no romperá tu computadora, pero es posible que no puedas arrancar automáticamente hasta que lo hagas. Si descubres que no puedes entrar en la pantalla de Opciones de Arranque normalmente, intenta iniciar con un doble toque (toca, suelta, toca y mantén presionado el botón de encendido).

## No uses la aplicación *Utilidad de Discos*

La aplicación gráfica Utilidad de Discos que viene con macOS apenas funciona para casos triviales donde tienes uno o más contenedores APFS, sin espacio sin particionar, todas las particiones en el orden correcto, y sin particiones extranjeras. Incluso para cosas supuestamente "soportadas" como crear particiones FAT32/HFS, es propensa a errores. Simplemente no la uses. Te confundirá, te mostrará números imposibles, y hará lo incorrecto. No está diseñada como una herramienta de gestión de discos adecuada; es una interfaz de usuario frágil que solo puede manejar las tareas y situaciones más simples y se descompone completamente en caso contrario.

El `diskutil` de línea de comandos tiene una interfaz extraña y es más difícil de entender, pero al menos generalmente funciona correctamente.

## Si todo sale mal

Las máquinas Apple Silicon no pueden ser "brickeadas", pero pueden quedar sin arranque si rompes tu Recuperación del Sistema. Para arreglar esto, necesitarás conectar otra máquina a ella y usar un procedimiento especial de recuperación DFU para restaurarla vía USB. Si tienes otra Mac a mano (Intel funciona), sigue la [documentación oficial](https://support.apple.com/guide/apple-configurator-mac/revive-or-restore-a-mac-with-apple-silicon-apdd5f3c75ad/mac) de Apple. Si no, puedes usar [idevicerestore](https://github.com/libimobiledevice/idevicerestore) en su lugar. Aquí hay una [guía rápida](https://tg.st/u/idevicerestore_quickstart.txt) para eso.

Si rompiste la recuperación de tu sistema operativo, podrías encontrarte en un bucle de arranque, incluso mientras mantienes presionado el botón de encendido. Si esto sucede, apaga la máquina, luego arranca con un *doble-toque-mantener* rápido del botón de encendido (toca, suelta, presiona y mantén). Si estás en una laptop, podrías descubrir que no puedes forzar un apagado desde el bucle de arranque. Si esto sucede, cuenta tres segundos desde el punto donde el logo de Apple desaparece durante un ciclo del bucle, luego haz el doble toque. Esto debería llevarte a la Recuperación del Sistema y podrás arreglar las cosas desde allí sin un flash DFU completo.

## Disposición física del disco en Apple Silicon

* La unidad NVMe tiene namespaces. Solo te importa el primario, que es `disk0` en macOS o `nvme0n1` en Linux.
  * Los otros se usan para logs de kernel panic y cosas así. Eso es bastante de bajo nivel que no tienes que preocuparte. Esto es una cosa de NVMe, como "particiones de bajo nivel". Simplemente no pienses demasiado en ello.
* El namespace primario está formateado como una tabla de particiones GPT, igual que en la mayoría de los sistemas Linux/Windows/Mac Intel en estos días
* La GPT contiene particiones, que pueden ser tradicionales (FAT32, HFS+, Linux...) o contenedores APFS
* Un contenedor APFS contiene múltiples volúmenes lógicos compartiendo espacio en disco
* Cada máquina Apple Silicon tiene dos contenedores APFS especiales del sistema, el primero en el disco (Contenedor del Sistema iBoot) y el último en el disco (Recuperación del Sistema). Estos nunca deben tocarse. Solo crea/elimina particiones entre ellos.

Advertencia: Algunas de las herramientas de Apple no les gustan las particiones no ordenadas en la tabla de particiones GPT. Como necesitas mantener la primera y última partición en su lugar, eso significa que la mayoría de las operaciones de gestión de discos desde Linux agregarán particiones a la GPT, y la pondrán fuera de orden. Asegúrate de arreglar esto. Con el comando `fdisk` de Linux esto se puede hacer con `x` (entrar en modo experto) → `f` (arreglar orden de particiones) → `r` (volver al menú principal) → `w` (escribir cambios y salir).

## Conceptos básicos de gestión de discos en macOS

`disk0` es tu unidad NVMe. `disk0sN` es una partición GPT dentro de ella. `N` *no* es estable y se asigna dinámicamente por el kernel de macOS. *No* corresponde al índice de ranura física en la GPT, ni corresponde al orden físico de los datos de la partición en la unidad. Cada vez que creas una partición, N puede asignarse a un número diferente, y todos pueden renumerarse al reiniciar.

`diskN` (`N` >= 1) podría ser una imagen de disco o un disco externo, pero más probablemente es un *contenedor APFS*. Este es un truco que Apple ideó para representar subvolúmenes. Las "particiones" dentro de tal disco no son particiones reales, solo representan volúmenes dentro de un contenedor APFS. El contenedor en sí existe dentro de una partición física en `disk0`. Eso significa que para operaciones APFS, por ejemplo, `disk0s2` y `disk1` podrían significar lo mismo, el primero referenciando el contenedor por su partición física, y el segundo por el número de disco virtual (*sintetizado*).

Múltiples instalaciones de macOS pueden compartir un contenedor APFS. Cada sistema operativo tiene un *grupo de volúmenes* que consiste en dos subvolúmenes emparejados, un volumen *Sistema* y un volumen *Datos*. Hay volúmenes extra: `Preboot`, `Recovery`, `VM`, `Update`. Estos se comparten entre todos los sistemas operativos en ese contenedor. No todos necesariamente existen.

Cada instalación de macOS tiene dentro *su propia copia de recoveryOS*. Luego hay un recoveryOS del Sistema global, y (raramente) un recoveryOS de Respaldo del Sistema adicional.

## Instalaciones de Asahi Linux

Para Asahi Linux, no instalamos junto a macOS en el mismo contenedor, porque eso requeriría usar APFS para Linux (que aún no es estable ni está en la línea principal). Simplemente creamos particiones GPT normales para Linux. Asahi Linux también necesita instalarse de la misma manera que lo haría macOS, en un contenedor APFS como un grupo de volúmenes, para ser realmente arrancable. Esto es lo que llamamos el "stub de macOS" y es lo que vincula el mundo Apple con el mundo Linux. Piensa en ello como una partición de cargador de arranque. *Podríamos* compartir un contenedor con macOS para esto, pero *elegimos* no hacerlo porque lo hace menos propenso a errores y más fácil de eliminar, y ya estamos particionando el disco de todos modos.

Entonces el instalador (para una instalación normal de Asahi Linux = Arch Linux ARM) creará tres particiones:

* Un contenedor APFS de 2.5GB, que contiene los bits de iBoot/macOS que necesitamos para arrancar la máquina incluyendo una copia de recoveryOS
  * m1n1 etapa 1 se instala aquí
* Una Partición del Sistema EFI de 500MB
  * m1n1 etapa 2, U-Boot, y la imagen core de GRUB viven aquí
* Una partición ext4 de Linux que llena el resto del espacio
  * Los módulos de GRUB y el kernel/initramfs de Linux viven aquí

Para desinstalar, necesitas eliminar las tres.

Asahi Linux es inusual en que, a diferencia de los sistemas UEFI tradicionales, creamos una Partición del Sistema EFI *para cada instancia que instalas*. Tenemos un mecanismo personalizado para que los sistemas operativos encuentren la ESP correcta para instalar/arrancar para manejar esto. Esto es porque cada ESP está lógicamente vinculada al stub de 2.5G, y hace que la gestión del sistema operativo sea más fácil si lo tratamos todo como una unidad, y usamos el selector de arranque nativo para elegir entre diferentes sistemas operativos (y por lo tanto ESPs). Deberías pensar en el contenedor APFS stub de 2.5GB, la Partición del Sistema EFI, y cualquier partición raíz/... que se cree después de eso como un "contenedor" lógico para un sistema operativo de código abierto dentro de un sistema Apple Silicon. En cierto modo, m1n1+U-Boot convierten tu máquina en un sistema UEFI, y cada vez que instalas estás creando un nuevo "entorno UEFI virtual" dentro de tu Mac Apple Silicon (nota: esto no es una VM).

## Listando particiones con el instalador de Asahi Linux

`diskutil` puede ser muy barroco y enumerar sistemas operativos instalados puede ser doloroso, así que el instalador de Asahi Linux intenta condensar la información de disco más importante en un formato fácilmente comprensible. Puedes ejecutarlo como de costumbre (`curl https://alx.sh | sh`) y simplemente salir sin hacer nada si solo quieres ver esta información.

Aquí hay un ejemplo de justo después de instalar Asahi Linux, antes de completar el segundo paso de la instalación:

```
Partitions in system disk (disk0):
  1: APFS [Macintosh HD] (380.00 GB, 6 volumes)
    OS: [B ] [Macintosh HD] macOS v12.3 [disk3s1, D44D4ED9-B162-4542-BF50-9470C7AFDA43]
  2: APFS [Asahi Linux] (2.50 GB, 4 volumes)
    OS: [ *] [Asahi Linux] incomplete install (macOS 12.3 stub) [disk4s2, 53F853CF-4851-4E82-933C-2AAEB247B372]
  3: EFI (500.17 MB)
  4: Linux Filesystem (54.19 GB)
  5: (free space: 57.19 GB)
  6: APFS (System Recovery) (5.37 GB, 2 volumes)
    OS: [  ] recoveryOS v12.3 [Primary recoveryOS]

  [B ] = Booted OS, [R ] = Booted recovery, [? ] = Unknown
  [ *] = Default boot volume
```

Esto muestra:

* Un contenedor APFS (380GB) que contiene 6 volúmenes (no listados) que comprenden una instalación de macOS 12.3 ("Macintosh HD"). Nota: "Macintosh HD" es en realidad el nombre del subvolumen Sistema, y así es como macOS mismo muestra los volúmenes.
  * Si tuvieras otra instalación de macOS compartiendo espacio en el mismo contenedor, se listaría como otra línea `OS:` bajo la misma partición.
  * disk3s1 es el *volumen* para este sistema macOS, lo que significa que `disk3` es el disco virtual que representa esta partición de contenedor APFS
  * El UUID es el ID del Grupo de Volúmenes de este sistema operativo, que es el identificador principal para él (por ejemplo, cómo la máquina lo encuentra para arrancarlo, cómo lo seleccionas en los prompts de `bputil`, el nombre del subdirectorio asociado dentro de los subvolúmenes Preboot y Recovery, y más)
* Un contenedor APFS (2.5GB) que contiene 4 volúmenes que es en realidad un stub de cargador de arranque de Asahi Linux, usando macOS 12.3 como su versión base, nombrado "Asahi Linux"
  * Si la instalación estuviera completa, esto mostraría tu versión de m1n1 etapa 1. Sin embargo, porque no lo está, se lista como `incomplete install` hasta que reinicies en él manteniendo presionado el botón de encendido y completes el segundo paso de la instalación.
  * disk4s2 es el *volumen* para el sistema de este stub, lo que significa que `disk4` es el disco virtual que representa esta partición de contenedor APFS
* Una partición del sistema EFI (FAT32)
* Una partición de sistema de archivos Linux (ext4 en este caso, pero el sistema de archivos específico no se identifica/muestra)
* Alguno espacio libre (sin particionar) - nota que el instalador representa esto como su propia "partición"
  * `diskutil` en cambio le gusta referirse al espacio libre por el identificador de partición de la partición justo antes de él en orden físico de disco, lo cual es innecesario decir bastante confuso y propenso a errores. Pensamos que darle su propio número tiene más sentido.
* La partición de Recuperación del Sistema (siempre existe al final), que contiene 2 volúmenes APFS y tiene una instancia de recoveryOS instalada (versión 12.3).
  * No quieres tocar esto, pero lo mostramos ya que saber qué versión de recoveryOS está presente es útil. Podría haber una versión de respaldo también.

Nota cómo te dice que actualmente estás arrancado en el sistema operativo *Macintosh HD* (`[B ]`), pero que el sistema operativo de arranque predeterminado está configurado en Asahi Linux (`[ *]`). Si ejecutaras esto desde recoveryOS, se mostraría como un `[R*]` (ejecutando el recoveryOS que es parte de tu sistema operativo de arranque predeterminado), a menos que termines cayendo en la Recuperación del Sistema, en cuyo caso la marca de arranque estaría en la última línea, comenzando `[R ] recoveryOS...`.

Ten en cuenta que el instalador de Asahi Linux *no* te mostrará la partición del Contenedor del Sistema iBoot (para no confundir demasiado a los usuarios) pero *sí* te mostrará tu partición de Recuperación del Sistema, para que puedas ver qué versión(es) de Recuperación del Sistema tienes (pero no te dejará hacer nada con ella). Tampoco muestra números de partición de disco físico.

## Listando particiones con `diskutil`

Usa `diskutil list`. La misma configuración anterior se ve así:

```
/dev/disk0 (internal):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                         500.3 GB   disk0
   1:             Apple_APFS_ISC ⁨⁩                        524.3 MB   disk0s1
   2:                 Apple_APFS ⁨Container disk3⁩         380.0 GB   disk0s2
   3:                 Apple_APFS ⁨Container disk4⁩         2.5 GB     disk0s5
   4:                        EFI ⁨EFI - ASAHI⁩             500.2 MB   disk0s4
   5:           Linux Filesystem ⁨⁩                        54.2 GB    disk0s7
                    (free space)                         57.2 GB    -
   6:        Apple_APFS_Recovery ⁨⁩                        5.4 GB     disk0s3

/dev/disk3 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +380.0 GB   disk3
                                 Physical Store disk0s2
   1:                APFS Volume ⁨Macintosh HD⁩            15.2 GB    disk3s1
   2:              APFS Snapshot ⁨com.apple.os.update-...⁩ 15.2 GB    disk3s1s1
   3:                APFS Volume ⁨Preboot⁩                 887.6 MB   disk3s2
   4:                APFS Volume ⁨Recovery⁩                798.7 MB   disk3s3
   5:                APFS Volume ⁨Data⁩                    157.1 GB   disk3s5
   6:                APFS Volume ⁨VM⁩                      20.5 KB    disk3s6

/dev/disk4 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +2.5 GB     disk4
                                 Physical Store disk0s5
   1:                APFS Volume ⁨Asahi Linux - Data⁩      884.7 KB   disk4s1
   2:                APFS Volume ⁨Asahi Linux⁩             1.1 MB     disk4s2
   3:                APFS Volume ⁨Preboot⁩                 63.6 MB    disk4s3
   4:                APFS Volume ⁨Recovery⁩                1.8 GB     disk4s4
```

Esto muestra las particiones físicas en el orden en que están presentes en disk0 primero:

* `disk0` (mostrado como tipo "GUID_partition_scheme") en realidad representa todo el disco (500GB)
* `disk0s1` es el Contenedor del Sistema iBoot (tipo `Apple_APFS_ISC`), no mostrado en la salida del Instalador
  * Esto es en realidad un contenedor APFS con más subvolúmenes, ¡pero `diskutil` mismo también te oculta esos detalles!
  * Esto almacena un montón de información crítica del sistema, no quieres meterte con esto
* `disk0s2` es el primer contenedor APFS, que contiene el volumen "Macintosh HD" de macOS
  * Nota cómo dice "Container disk3" para indicar que esto se muestra como el disco virtual/sintetizado `disk3`.
* `disk0s5` es el stub del cargador de arranque de Asahi Linux
  * ¡El índice de partición está fuera de orden! Esto está lógicamente después de `disk0s2` y también en esa posición en la GPT. Estos números de partición no significan nada, es lo que a macOS le apetece asignar ese día.
  * Este es el disco virtual `disk4`.
* `disk0s4` es la Partición del Sistema EFI FAT32 (mostrada como tipo `EFI`, y con nombre `EFI - ASAHI` porque se trunca para estos)
* `disk0s7` es la partición raíz de Linux (mostrada como tipo `Linux filesystem`)
* Luego hay algo de espacio libre
* `disk0s3` es la partición de Recuperación del Sistema (tipo `Apple_APFS_Recovery`)
  * Realmente, no te metas con esto. Es la única forma de recuperar localmente si tu sistema operativo está roto.

Después de esto, puedes ver los dos contenedores APFS desglosados en volúmenes, cada uno como su propio disco virtual: `disk3` y `disk4`. De hecho, hay dos más: `disk1` es el Contenedor del Sistema iBoot (respaldado por `disk0s1`) y `disk2` es la Recuperación del Sistema (respaldado por `disk0s3`), pero estos están ocultos de la salida de diskutil. ¡Recuerda, la numeración puede/será diferente para ti!

# **No copies y pegues estos comandos ciegamente**

Todos los siguientes ejemplos *usan números de disco/partición de la salida anterior*. Necesitas sustituir los números correctos para tu sistema. Estos *serán diferentes para ti*. Has sido advertido.

## Eliminando particiones con `diskutil`

Eliminar particiones funciona *diferentemente* para particiones APFS y no APFS.

### Eliminando contenedores APFS

Para eliminar el contenedor APFS de *Asahi Linux*, usa una de estas formas:

`diskutil apfs deleteContainer disk4`

`diskutil apfs deleteContainer disk0s5`

La primera lo identifica por *disco virtual*, la segunda por *partición física*. Son exactamente equivalentes y tienen el mismo resultado, siempre que estés usando los números correctos.

### Eliminando otras particiones

Para eliminar las particiones EFI y Linux, haz esto:

```
diskutil eraseVolume free free disk0s4
diskutil eraseVolume free free disk0s7
```

Esto se llama "eraseVolume free free" porque la interfaz increíblemente intuitiva de diskutil representa el concepto de eliminar particiones como "formatearlas como espacio libre" (excepto para APFS). Sí, realmente.

## Redimensionando contenedores APFS

Después de eliminar Asahi Linux, podrías reinstalarlo de nuevo (no es necesario usar la opción de redimensionar en el instalador). Pero si quieres hacer crecer macOS para usar el tamaño completo del disco de nuevo, usa cualquiera de estos:

`diskutil apfs resizeContainer disk0s2 0`

`diskutil apfs resizeContainer disk3 0`

De nuevo, puedes usar el identificador de partición física o el número de disco lógico. Son equivalentes. El `0` significa redimensionar para llenar todo el espacio libre disponible después de la partición. Si en cambio quieres expandir/encoger a un tamaño dado, especifícalo allí, por ejemplo `100GB`.

Ten en cuenta que ejecutar este comando podría congelar momentáneamente tu terminal de macOS. No entres en pánico y déjalo ejecutar durante unos minutos.

### `Storage system verify or repair failed`

Si obtienes este error durante la operación de redimensionamiento APFS, significa que tienes corrupción latente del sistema de archivos APFS. Este problema es causado por errores en los controladores APFS de Apple, no por Asahi Linux (que no toca las particiones APFS en absoluto). Para arreglarlo, **arranca en recoveryOS** (esto no funcionará desde macOS), luego ejecuta el siguiente comando (sustituyendo disk0s2 por el nombre de tu disco de contenedor APFS, como arriba):

`diskutil repairVolume disk0s2`

Si esto se queja de "volúmenes encriptados y bloqueados", tendrás que ejecutar `diskutil apfs unlockVolume <diskName>` en cada volumen de macOS protegido por FileVault en tu sistema. Ejecuta `diskutil apfs list` y busca `FileVault: Yes (locked)` para identificarlos. Puedes omitir con seguridad los volúmenes del Sistema (solo los volúmenes de Datos necesitan ser desbloqueados). Luego, reintenta la operación `diskutil repairVolume`.

Finalmente, reintenta la operación de redimensionamiento después de que la reparación se complete con éxito.

Si esto no repara tu volumen con éxito y la operación de redimensionamiento sigue fallando, desafortunadamente, no hay una solución conocida que no sea un borrado completo y reformateo del volumen de macOS (perdiendo todos los datos). El proyecto Asahi Linux no puede ofrecer correcciones de errores o soporte para los propios controladores y herramientas del sistema de Apple. Si encuentras una forma reproducible de causar corrupción APFS, por favor repórtala directamente a Apple.

## Adenda: Montando la partición EFI
Hay dos métodos para montar la partición EFI. El primero es este:

```
diskutil list
diskutil mount disk0s4
mount
cd /Volumes/...
```

El segundo es este:

```
mkdir /Volumes/efi
mount -t msdos /dev/disk0s4 /Volumes/efi
``` 