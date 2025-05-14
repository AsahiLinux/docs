---
title: Proceso de Arranque de Asahi
summary:
  Cómo arranca Asahi Linux en Macs con Apple Silicon, destinado para
  integradores de distribuciones/sistemas operativos
---

Esta página explica los paquetes/componentes involucrados en un sistema Asahi Linux arrancable, y cómo interactúan entre sí. Está dirigida a empaquetadores de distribuciones y personas que quieren crear/mantener sus propias compilaciones en lugar de usar paquetes. Se basa en la configuración utilizada en la distribución de referencia basada en Arch Linux ARM, pero debería aplicarse a la mayoría de los sistemas.

Esta es una guía práctica. Para una descripción/especificación más formal, incluyendo cómo manejamos el firmware del proveedor, consulte [Ecosistema de Sistemas Operativos Abiertos en Macs con Apple Silicon](../platform/open-os-interop.md). Para información sobre específicamente cómo todo está conectado en Fedora Asahi Remix, consulte su página [Cómo está hecho](https://docs.fedoraproject.org/en-US/fedora-asahi-remix/how-its-made/).

## Resumen de la cadena de arranque

[Cosas de Apple] → m1n1 etapa 1 → m1n1 etapa 2 → DT + U-Boot → GRUB → Linux

m1n1 etapa 1 es instalado por el instalador de Asahi Linux desde el modo de recuperación (en step2.sh), está firmado por una clave específica de la máquina interna en el proceso (como parte de la política de arranque seguro de Apple), y puede considerarse inmutable. Actualizarlo raramente debería ser necesario, crearemos herramientas para esto cuando sea necesario. Tiene el PARTUUID de la partición del sistema EFI asignada a este sistema operativo codificado en él (establecido en el momento de la instalación), y carga en cadena m1n1 etapa 2 desde `<ESP>/m1n1/boot.bin` (el ESP debe estar en almacenamiento NVMe interno, no se admite almacenamiento externo). También pasa este PARTUUID a la siguiente etapa (como una propiedad a establecer en /chosen, ver más abajo), por lo que la siguiente etapa sabe desde qué partición está arrancando.

Un sistema operativo/distribución es responsable de mantener y actualizar el resto de los componentes de arranque.

m1n1 etapa 2 es responsable de inicializar (más) hardware, elegir el DT apropiado para esta plataforma, completar propiedades dinámicas, y cargar U-Boot.

U-Boot inicializa más cosas (por ejemplo, teclado, USB), proporciona servicios UEFI, y (por defecto, en nuestra configuración de lanzamiento) carga un binario UEFI desde `<ESP>/EFI/BOOT/BOOTAA64.EFI`, respetando la magia. Tenga en cuenta que U-Boot tanto consume, modifica ligeramente*, y reenvía el DT.

GRUB es estándar, nada especial allí. Podrías usar cualquier otro binario EFI arm64.

\* Principalmente solo estableciendo la ruta stdout basada en si cree que deberías estar usando una consola física/teclado o una consola UART.

### Las cosas mágicas del ESP

Para Asahi tenemos una configuración no estándar donde cada instalación del sistema operativo tiene su propia partición del sistema EFI. Esto hace que sea más fácil encajar con el modelo del selector de arranque de Apple, ya que no sabe nada sobre EFI; desde su punto de vista, cada instancia de Asahi instalada es su propio sistema operativo separado, y por lo tanto aguas abajo usamos un ESP separado para cada uno. Nada te impide instalar múltiples cargadores de arranque o sistemas operativos dentro de un contenedor/ESP, pero:

* Sospechamos que esto causará problemas en el futuro una vez que empecemos a integrar con características relacionadas con la seguridad de la plataforma (por ejemplo, SEP), ya que podría tener un concepto de "identidad del sistema operativo actualmente arrancado".
* Como solo puede haber un conjunto de DTs, U-Boot, y versión de m1n1 etapa 2 por contenedor/ESP, no hay una forma sensata de que múltiples distribuciones cooperen para gestionar actualizaciones si comparten un contenedor.
* No tenemos almacenamiento persistente de variables EFI (y no tenemos una buena idea de cómo hacerlo en servicios en tiempo de ejecución), lo que significa que no hay forma de gestionar el orden de arranque EFI. Así que terminas solo con el predeterminado.

Por lo tanto, si estás añadiendo soporte de distribución para usuarios finales, por favor mantente en este modelo. Una excepción son las imágenes de rescate/instalador arrancables por USB, que deberían ser arrancables por el paquete m1n1.bin estándar que el instalador de Asahi Linux instala en modo contenedor UEFI plano, desde su propio ESP en la unidad USB conteniendo `/EFI/BOOT/BOOTAA64.EFI` (sin `m1n1/boot.bin`). Esas nunca deberían intentar gestionar el `boot.bin` en el ESP interno ellas mismas (hasta/a menos que se instalen correctamente, convirtiéndose así en propietarias de ese contenedor), y con suerte la situación del DT funcionará para el arranque USB.

El PARTUUID de la partición del sistema EFI asignada al sistema operativo actualmente arrancado es establecido por m1n1 como la propiedad `asahi,efi-system-partition` del nodo del árbol de dispositivos `/chosen`, que puede leerse desde Linux en `/proc/device-tree/chosen/asahi,efi-system-partition`. Nuestra rama de U-Boot también usa esto para encontrar el ESP correcto.

## Interacciones de versiones

Aquí es donde se pone un poco complicado. m1n1, u-boot, Linux, y los árboles de dispositivos tienen interdependencias de versiones algo complejas y sutiles.

* m1n1 etapa 2 es responsable de alguna inicialización de hardware, y parchear valores dinámicos en los árboles de dispositivos. Esto significa que el soporte de hardware más nuevo del kernel a menudo depende de una actualización de m1n1, ya sea para inicializar cosas o para añadir más datos al árbol de dispositivos, o ambos.
  * En general, preferimos mantener los controladores de Linux simples y poner la inicialización "mágica" (por ejemplo, conjuntos aleatorios de escrituras de registro mágicas, que Apple ama describir en su variante de un DT) en m1n1. Lo mismo con cosas relacionadas con el controlador de memoria, configuraciones de reloj que podemos razonablemente dejar estáticas, etc. La excepción es cuando Linux no tiene más remedio que hacer esto dinámicamente en tiempo de ejecución. A Apple le gusta dejar demasiado al kernel XNU (que m1n1 reemplaza), incluyendo cosas ridículas como encender la caché L3 a nivel de sistema, y no queremos que Linux tenga que lidiar con eso. Esto también aumenta enormemente nuestras posibilidades de que los kernels existentes funcionen (al menos parcialmente) en SoCs/plataformas más nuevos con solo cambios en el DT, lo cual es bueno para, por ejemplo, compatibilidad hacia adelante de imágenes de instalación de distribución. Por ejemplo, PCIe en M2 no requirió cambios a nivel de controlador, solo cambios en la inicialización de m1n1.
* U-Boot generalmente no cambia mucho una vez que está correctamente configurado en cualquier SoC dado, y solo se preocupa por un subconjunto de información del DT.
* Linux necesita datos del DT para inicializar hardware, por lo que el hardware nuevo necesita actualizaciones del DT. Nuestro repositorio canónico de DT es parte de nuestro árbol de Linux, pero recuerde que los cambios aquí a menudo necesitan actualizaciones de m1n1 (etapa 2) para hacer que las cosas funcionen realmente.

En un mundo ideal donde todo está en upstream y entendemos ~todo el hardware, los DTs deberían ser compatibles hacia adelante y hacia atrás con versiones de software. Es decir, las nuevas características requieren que todo esté actualizado, pero de lo contrario esas nuevas características simplemente no estarán disponibles.

En el mundo real,
* Los bindings de DT que aún no han sido upstreamed están sujetos a cambios incompatibles mientras pasan por revisión. Intentamos evitar esto, pero ha sucedido (por ejemplo, el binding del controlador de interrupciones AIC2 cambió, lo que notablemente rompió el arranque completamente para kernels más antiguos en t600x). A veces podemos tener DTs interinos que tienen ambos estilos de datos, para mantener la compatibilidad.
* m1n1 *debería* degradarse graciosamente cuando se encuentra con estructura DT faltante para los cambios que quiere parchear (es decir, versión de m1n1 > versión de DT), pero esas rutas de código no reciben mucha prueba. Por favor, reporte un error si ve que aborta o se bloquea cuando no debería.
* Los primeros días de U-Boot en cualquier SoC dado podrían ver algunos cambios en dependencias de DT (por ejemplo, el soporte de teclado MTP para plataformas M2 va junto con cambios en DT, aunque esto se degradará graciosamente si falta)
* En principio, es posible que un controlador de Linux se bloquee gravemente si m1n1 no se actualizó para inicializar el hardware correctamente (y si no está inyectando ninguna propiedad DT, el controlador no fallará debido a que falten). Obviamente intentamos manejar los errores graciosamente, pero es concebible que, por ejemplo, la inicialización faltante relacionada con energía o el controlador de memoria podría causar algo como un bloqueo duro del SoC cuando Linux intentara inicializar hardware dependiente. ¿Quizás deberíamos empezar a poner la versión de m1n1 en el DT, para que los controladores puedan fallar si se sabe que algo es inseguro con versiones más antiguas?
* Hay algunos cambios en DT que golpean casos límite en el ideal de "compatibilidad completa" y no son muy fáciles de arreglar. Por ejemplo, si un nodo DT introduce una dependencia en otro nodo (por ejemplo, una relación productor-consumidor), incluso si fuera opcional en principio, ese controlador podría fallar al sondear (o ni siquiera intentar sondear) si el controlador del productor no está disponible, no puede sondear, o no implementa la función productora adecuada. También tenemos problemas con dominios de energía: algunos están actualmente marcados como "siempre encendidos" porque rompen algo gravemente si se apagan, pero en el futuro podríamos aprender a manejar esto correctamente. Si esa bandera se elimina en DTs más nuevos, los kernels más antiguos estarían en problemas.

Como *puedes* tener múltiples kernels instalados, tienes que elegir de alguna manera de dónde obtienes tus DTs. La elección lógica sería el kernel más reciente. Para Arch, como solo hay un kernel instalado con el paquete estándar, podemos ignorar este problema (para usuarios típicos) y simplemente siempre actualizar los DTs en actualizaciones de paquete a esa versión.

TL;DR: Actualiza tus DTs cuando actualices tu kernel (a menos que sepas que no fueron tocados), y también actualiza tu m1n1 para hacer que las cosas nuevas grandes funcionen.

## Instrucciones de compilación

Asumiendo que todo se hace nativamente (sin compilación cruzada):

### m1n1

```shell
git clone --recursive https://github.com/AsahiLinux/m1n1
cd m1n1
make ARCH= RELEASE=1
```
Nota: RELEASE=1 actualmente solo desactiva la salida de registro detallada por defecto. Puedes habilitarla en compilaciones de lanzamiento usando `nvram boot-args=-v` desde recoveryOS.

La salida está en `build/m1n1.bin`.

### U-Boot

```shell
git clone https://github.com/AsahiLinux/u-boot
cd u-boot
git checkout asahi-releng # esta rama es lo que enviamos a los usuarios, tiene las cosas de detección automática de partición EFI
make apple_m1_defconfig
make
```

La salida está en `u-boot-nodtb.bin`.

### Árboles de Dispositivos

Los DTs canónicos son los que están en nuestro [árbol del kernel de Linux](https://github.com/AsahiLinux/linux). La compilación de kernels está fuera del alcance de este documento.

La salida está en `arch/arm64/boot/dts/apple/*.dtb`.

## Instalación

m1n1, el conjunto de árboles de dispositivos, y U-Boot están todos empaquetados juntos en un solo archivo que se convierte en m1n1 etapa 2, cargado desde `<ESP>/m1n1/boot.bin`. Esto se hace por simple concatenación, usando el script [update-m1n1](https://github.com/AsahiLinux/asahi-scripts/blob/main/update-m1n1).

Simplificado,
```shell
m1n1_dir="/boot/efi/m1n1"
src=/usr/lib/asahi-boot/
target="$m1n1_dir/boot.bin"
dtbs=/lib/modules/*-ARCH/dtbs/*

cat "$src/m1n1.bin" \
    $dtbs \
    <(gzip -c "$src/u-boot-nodtb.bin") \
    >"${target}"
```

Notas:
* U-boot debe estar comprimido con gzip para que m1n1 lo cargue de manera confiable (esto tiene que ver con el formato de imagen no siendo auto-delimitante)
* Se incluyen todos los árboles de dispositivos; m1n1 seleccionará el apropiado para la plataforma dada
* Los paquetes del kernel de Asahi Linux instalan los DTBs en `/lib/modules/$ver/dtbs/`. Esto no es estándar.
* Puedes añadir líneas de texto `var=valor\n` al .bin para configurar algunas cosas en m1n1. Tendremos mejores herramientas para esto en el futuro, pero por ahora es realmente solo para casos muy específicos.

Podrías querer renombrar el antiguo `m1n1.bin` después de una actualización. Si el arranque falla, puedes simplemente ir a macOS o modo de recuperación y poner el antiguo de vuelta, ya que macOS puede acceder al ESP FAT32 sin problemas (`diskutil list` luego montarlo con `diskutil mount`).

## Cosas varias

m1n1 coloca el código del teclado Apple en `/proc/device-tree/chosen/asahi,kblang-code` (como una celda u32 big-endian, estándar para DT). El mapeo está [aquí](https://github.com/AsahiLinux/asahi-calamares-configs/blob/main/bin/first-time-setup.sh#L109). Siéntete libre de iniciar una discusión sobre cómo estandarizar un binding adecuado para esto.

Tenemos toda una historia sobre cómo se maneja el firmware del proveedor (es decir, firmware que no es redistribuible como un paquete de distribución, pero se prepara en el momento de la instalación). Cómo funciona eso está cubierto en detalle [aquí](../platform/open-os-interop.md#firmware-provisioning). 