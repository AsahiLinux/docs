---
title: Interoperabilidad de Plataformas de Sistemas Operativos Abiertos
---

## Prólogo

Este documento presenta nuestra visión de cómo los sistemas operativos abiertos deberían interoperar en Macs con Apple Silicon (es decir, M1 y posteriores). Recomendamos leer primero la [Introducción a Apple Silicon](introduction.md) para comprender cómo está diseñada la plataforma desde la perspectiva de Apple.

Las ideas en este documento no pretenden establecer requisitos o reglas estrictas; cualquiera es, por supuesto, libre (y alentado) a seguir su propio camino si así lo desea. Más bien, nos gustaría acordar un conjunto de estándares que faciliten la coexistencia e instalación de diferentes sistemas operativos por parte de los usuarios finales, con el objetivo de hacer el proceso lo más simple, fluido y a prueba de futuro posible.

Este documento es un borrador, y agradecemos todos los comentarios y discusiones para ayudar a dar forma al futuro de cómo construir un ecosistema de sistemas operativos abiertos en estas plataformas. Por favor, pase por #asahi en OFTC si tiene preguntas generales o comentarios, o contáctenos en #asahi-dev si es desarrollador y desea discutir aspectos técnicos ([más información](https://asahilinux.org/community/)).

## Estructura del SO y arranque

Un sistema operativo en una máquina Apple Silicon, según las herramientas de Apple, significa una porción de una partición de contenedor APFS. Como las máquinas admiten de forma nativa el arranque múltiple, y para ajustarse al diseño de seguridad de la plataforma (por ejemplo, el SEP debe saber qué SO se arrancó), recomendamos una correspondencia 1:1 entre un SO instalado y un SO visto por la plataforma.

Para sistemas operativos de terceros, proponemos la siguiente estructura de particiones GPT por SO:

1. Partición de contenedor APFS ("stub macOS") (~2.5GB) con:
   * iBoot2, firmware, kernel XNU, RecoveryOS (todos requeridos por la plataforma)
   * m1n1 como kernel fuOS, con configuración de chainloading apuntando a la partición EFI
   * subvolúmenes de sistema de archivos raíz/datos ~vacíos
2. Partición del sistema EFI (FAT32) (~512MB) con:
   * m1n1 etapa 2 + device trees + U-Boot
   * GRUB u otro cargador UEFI que arranque el kernel objetivo
3. Particiones root/boot/etc. (específicas del SO)

Justificación: este esquema empareja un SO de terceros con un SO residente en APFS según las herramientas de Apple, y permite a los usuarios usar el selector de arranque nativo (con soporte de accesibilidad). Evita posibles problemas futuros derivados de que varios SO intenten gestionar el SEP bajo un contexto de SO compartido. También nos permite tener cadenas de arranque seguro independientes para los SO (una vez implementado), con la imagen fuOS conteniendo la raíz de confianza para las siguientes etapas de arranque, enlazada a la cadena de confianza de la máquina por el usuario con sus credenciales de propietario durante la instalación.

Aunque sería posible compartir un contenedor APFS entre varios SO (e incluso macOS), esto no aporta mucho más que ahorrar un pequeño espacio en disco por SO. Usar una partición de contenedor separada para cada SO instalado facilita borrar y empezar de nuevo, lo que de otro modo requeriría un proceso de limpieza más complicado donde se eliminan ciertos subvolúmenes APFS y se borran ciertos árboles de directorios en otros.

Este diseño, de forma poco convencional, proporciona una partición del sistema EFI para cada SO instalado. Hay dos razones para esto: primero, cada SO es lógicamente un "contenedor" e incluye la propia implementación EFI, por lo que tiene sentido aislar la ESP de la de otros SO. Segundo, debido a la ausencia de servicios de variables EFI en tiempo de ejecución (ver más abajo), sería difícil que varios SO coexistentes compartan una ESP y configuren sus respectivas entradas de arranque EFI. Tener ESPs separadas nos permite simplemente usar la ruta de arranque predeterminada (`\EFI\BOOT\BOOTAA64.EFI`) y evitar tener que persistir configuraciones de arranque. También permite que la ESP se use directamente como la partición `/boot` de un SO, sin que varios SO entren en conflicto (si se desea).

En el futuro, una vez que los controladores APFS abiertos sean lo suficientemente estables para usarse como sistema de archivos raíz, nos gustaría admitir la coexistencia total de espacio con macOS; en ese momento solo se requeriría la partición del sistema EFI además de un contenedor APFS de macOS existente.

Debido a la presencia de múltiples ESPs, los SO necesitarán una forma de identificar cuál es la suya. Para montajes y arranques típicos, esto puede hacerse con IDs de partición/FS; esto debería ser principalmente una preocupación para los instaladores de SO que necesitan determinar en qué ESP instalar su cargador de arranque en el momento de la instalación. Para este propósito, m1n1 etapa 1 normalmente se configura en el momento de la instalación para proporcionar (y reenviar) una propiedad `/chosen` en el Device Tree llamada `asahi,efi-system-partition`, que contiene el PARTUUID de la partición del sistema EFI.

### Resumen del arranque

Un arranque típico de un sistema Linux de referencia será así, continuando desde la sección [Flujo de Arranque](introduction.md#boot-flow):

* iBoot2 carga el kernel personalizado, que es una compilación de m1n1
* m1n1 etapa 1 se ejecuta y
  * Analiza el Apple Device Tree (ADT) para obtener información específica de la máquina
  * Realiza inicialización adicional de hardware (específica de la máquina)
    * Ej. detalles del controlador de memoria, carga por USB-C, pantalla HDMI (en Mac Mini)
  * Muestra su logo en pantalla (reemplazando el logo de Apple)
  * Carga su configuración embebida, que le indica hacer chainload desde una partición FAT32
  * Inicializa el controlador NVMe
  * Busca en la GPT la partición configurada para chainloading, por PARTUUID
  * Monta la partición como FAT32
  * Busca el archivo configurado para chainloading y lo carga
  * Apaga el controlador NVMe
  * Hace chainload a la instancia cargada de m1n1 (como blob binario), reenviando cualquier configuración de propiedades /chosen encontrada en su configuración embebida.
* m1n1 etapa 2 se ejecuta y
  * Analiza el ADT para obtener información específica de la máquina
  * Re-inicializa hardware, incluyendo lo que la etapa 1 no hizo (por ejemplo, por ser más antigua)
  * Busca sus payloads embebidos para encontrar Device Trees y una imagen U-Boot embebida
  * Selecciona un Device Tree (FDT) embebido apropiado para la plataforma actual
  * Personaliza el FDT con información dinámica trasplantada del ADT
  * Realiza cualquier otra inicialización de hardware para preparar el entorno para Linux
  * Carga la imagen U-Boot embebida y salta a ella
* U-Boot se ejecuta y
  * Analiza el FDT
  * Inicializa el teclado para entrada
  * Inicializa NVMe
  * Permite al usuario entrar a un shell si lo solicita
  * Monta la partición del sistema EFI correspondiente
  * Levanta los servicios EFI básicos
  * Localiza el cargador EFI predeterminado en la ESP, ej. GRUB, y lo arranca
* GRUB se ejecuta y
  * Usa los servicios de acceso a disco EFI para montar el sistema de archivos /boot (puede ser la propia ESP, o algo diferente)
  * Localiza su archivo de configuración y componentes adicionales
  * Presenta al usuario un menú de arranque, usando la consola/entrada EFI
  * Carga el kernel y el initramfs desde /boot
  * Salta al kernel
* El kernel de Linux arranca como lo haría en cualquier otra plataforma UEFI+FDT

Esta cadena de arranque está diseñada para acercar progresivamente el sistema a una máquina ARM64 "típica", de modo que las capas siguientes tengan que preocuparse menos por los detalles particulares de las máquinas Apple Silicon.

### m1n1

m1n1 es nuestro bootstrap de primera etapa para sistemas Apple Silicon. Su propósito es servir de puente entre el protocolo de arranque XNU y el protocolo Device Tree / ARM64 Linux, y realizar la inicialización de bajo nivel para que las siguientes etapas de arranque no tengan que preocuparse por ello. Vea la [Guía de Usuario de m1n1](../sw/m1n1-user-guide.md) para más detalles sobre su funcionamiento.

m1n1 también puede ser manipulado vía USB para propósitos de desarrollo e ingeniería inversa, incluyendo la carga de kernels para permitir un ciclo de construcción-prueba muy rápido. También cuenta con un hipervisor bare-metal que puede arrancar Linux o macOS y proporcionar una UART virtualizada por USB, e incluye un avanzado marco de trazado de eventos basado en Python. Estas características no están destinadas a usuarios finales, pero esperamos que hagan el desarrollo y prueba de SO en estas plataformas lo más agradable posible.

m1n1 puede instalarse como una sola etapa, pero en sistemas de producción debe dividirse en dos versiones, con la etapa 1 haciendo chainload a una segunda etapa desde la partición del sistema EFI. Esto es importante porque la etapa 1 solo puede ser modificada por el usuario arrancando en 1TR, lo que impide que otro SO la actualice directamente. Al cargar una segunda etapa desde NVMe, podemos hacer que sea actualizable, junto con sus payloads.

En el futuro, pretendemos permitir que el chainload de la etapa 2 mantenga una cadena de arranque seguro, mediante imágenes m1n1 firmadas. Por esta razón, el código actual de chainloading para cargar la etapa 2 desde FAT32 está escrito en Rust, ya que forma parte de la superficie de ataque de arranque seguro. Esto elimina esencialmente la posibilidad de bugs explotables de seguridad de memoria en esa parte del código. La verificación de firmas también se implementará en Rust por esta razón. La clave pública para la verificación se configurará en la instalación de la etapa 1, y será la de la entidad que se espera proporcione builds de la etapa 2 para ese contenedor de SO en particular.

### U-Boot

U-Boot proporciona el primer punto de interacción local (teclado) con el usuario, y soporte para arrancar desde USB u otros dispositivos externos. También implementa servicios EFI que ocultan los detalles de la plataforma, haciendo que parezca una máquina UEFI típica.

Notablemente, U-Boot no puede proporcionar servicios EFI de tiempo de ejecución particularmente útiles. Como la plataforma no tiene un almacén de variables EFI, y no es práctico, por ejemplo, compartir acceso NVMe con un SO en ejecución, no será posible hacer modificaciones a las configuraciones de arranque EFI desde un SO en ejecución. En su lugar, esas modificaciones deberán hacerse cambiando archivos de configuración directamente. Esto no debería ser un problema si diferentes SO usan diferentes ESPs.

### GRUB

GRUB realiza la carga final de Linux y proporciona a los usuarios el menú familiar de selección de kernel y edición de opciones. GRUB no necesita parches para funcionar en máquinas Apple Silicon, ya que depende completamente de los servicios EFI para hacer su trabajo. Corresponde a la distribución del SO decidir qué usar aquí; GRUB es solo un ejemplo.

### Esquemas de arranque

Los SO instalados controlan la cadena de arranque a partir de m1n1 etapa 2, y por tanto son libres de gestionarla como deseen. Por ejemplo, una distro Linux podría añadir kernels de Linux directamente a m1n1 etapa 2, o usar U-Boot directamente para arrancar kernels, o usar el stub EFI de Linux, o GRUB.

Los instaladores de SO arrancados vía USB deben usar el protocolo de arranque UEFI estándar desde una partición FAT32 del sistema EFI si quieren funcionar con el modo de configuración solo UEFI del instalador de Asahi Linux (que instala m1n1 etapa 2 + U-Boot configurados así). El instalador puede sobrescribir esto con otro mecanismo como parte de la instalación, si se desea, aunque esto no se recomienda sin una buena razón: mantener el blob de segunda etapa instalado por el instalador de Asahi Linux puede permitir arrancar en máquinas aún no soportadas por una versión dada del SO, proporcionando nuevos device trees, si esas plataformas son suficientemente compatibles hacia atrás.

Para los SO que usan el enfoque típico m1n1+U-Boot, se recomienda que verifiquen la versión existente en la ESP y se nieguen a degradarla automáticamente si el paquete proporcionado por el SO es más antiguo. Esto, de nuevo, permite que hardware futuro sea parcialmente soportado solo con una actualización del instalador. TODO: especificar cómo debe funcionar esta verificación de versión (necesitamos empezar a etiquetar las compilaciones de m1n1 correctamente).

## Instalación inicial

En estas máquinas, hay una discrepancia entre el punto donde arranca un kernel de terceros (después de iBoot2), y los componentes de arranque requeridos por SO (incluyendo iBoot2, firmware y otros archivos, así como la imagen recoveryOS y el kernel XNU para ella). Además, las herramientas de Apple requieren que estos archivos estén dispuestos de cierta manera en la partición Preboot para funcionar correctamente en los menús de selección de SO, más allá de los requisitos impuestos por iBoot1/2. En efecto, crear un nuevo contenedor de SO requiere, esencialmente, instalar macOS menos el sistema de archivos raíz.

Afortunadamente, todos los componentes requeridos pueden obtenerse de las imágenes de restauración (archivos IPSW) que están disponibles públicamente en URLs [bien conocidas](https://ipsw.me/), y estables. Hemos implementado este proceso en [asahi-installer](https://github.com/AsahiLinux/asahi-installer), un framework de instalación basado en Python que está pensado para ejecutarse desde 1TR. Transmite los bits requeridos del archivo IPSW, evitando una descarga completa, y configura las particiones y contenidos según lo requerido para arrancar recoveryOS y posteriormente un kernel personalizado.

No esperamos que los SO quieran reinventar esta rueda en particular (créanos, no quiere hacerlo), así que nos gustaría que el instalador sea lo suficientemente flexible como para admitir diferentes flujos de instalación.

### Lanzamiento del instalador

Actualmente, el instalador de Asahi Linux solo está soportado como instalador puramente en línea (al estilo `curl | sh`), que puede lanzarse desde macOS o desde recoveryOS. Los SO a instalar se descargan bajo demanda (transmitidos directamente al disco de destino sin almacenamiento intermedio). Alternativamente, los usuarios pueden optar por instalar solo un entorno de arranque UEFI, que luego puede arrancar cualquier SO desde USB usando los mecanismos estándar, dejando espacio sin particionar para que, por ejemplo, un instalador de SO lo use.

Opciones de instalación futuras podrían incluir:

* Imágenes/paquetes de netinstall USB, configurando el instalador como "medio de instalación arrancable". Esto puede configurarse simplemente desempaquetando algunos archivos en una partición FAT32 de una unidad USB, por lo que es fácil de usar para los usuarios, y les permitirá seleccionar el instalador desde el selector de arranque ([más información](introduction.md#boot-picker) sobre cómo funciona esta magia). Aun así, obtendría el SO a instalar de internet.
* Imágenes/paquetes de instalación local USB, que también pueden servir como medio de instalación UEFI para más tarde o para otras plataformas. Esto instalará el SO objetivo desde USB, pero aun así descargará los componentes de Apple desde la CDN de Apple, por lo que la instalación no será realmente offline.
  * Una opción para que los usuarios agreguen los componentes de Apple, por ejemplo, ejecutando un script desde la unidad USB, haciéndolo completamente offline
  * Una opción para que los usuarios agreguen los componentes de Apple al crear el instalador USB, por ejemplo, ejecutando un script que los descargue y prepare el instalador de una vez, en lugar de una imagen pre-hecha.
    * Queremos añadir esto como una función al instalador en línea, por ejemplo, "crear un instalador USB arrancable" en lugar de hacer la instalación realmente.
* Empaquetado como una app de macOS (esto ya sería parte de los modos de instalación USB de todos modos)
  * Aunque esto tiene problemas con GateKeeper por descargas no firmadas si los usuarios lo descargan "normalmente" desde un navegador...
  
## Provisión de firmware

Las máquinas Apple Silicon dependen de una gran cantidad de blobs de firmware para funcionar. Si bien la mayoría de estos ya están cargados cuando arranca un SO de terceros, hay un pequeño subconjunto que no lo está. Como estos blobs no tienen una licencia redistribuible, esto presenta un problema para los SO que necesitan acceder a ellos. Afortunadamente, los blobs están disponibles en los archivos IPSW creados por el instalador inicial. Proponemos un mecanismo de "vendor-firmware" para pasar esos blobs al SO instalado/arrancado.

Nota: Actualmente hay un truco en el instalador para volcar todo el firmware en bruto a otro lugar en la ESP, por lo que podemos proporcionar un script para que los usuarios extraigan el resto en una forma compatible con esta especificación. Esto desaparecerá una vez que todos los extractores estén listos, y está pensado como algo temporal y ad-hoc.

### Blobs empaquetados

Actualmente, estos blobs están empaquetados:

* Firmware WiFi Broadcom FullMAC
* Firmware Bluetooth Broadcom
* Firmware ASMedia xHCI
* Firmware multitouch Apple MTP (máquinas M2)

Y estos blobs aún no están empaquetados:

* Firmware AVD (Apple Video Decoder) Cortex-M3

Detalles sobre el nombre del firmware WiFi Broadcom FullMAC: <https://lore.kernel.org/all/20220104072658.69756-10-marcan@marcan.st/>

### Paquete VendorFW

El instalador stub del SO recopila el firmware de la plataforma disponible del IPSW, y lo empaqueta como un archivo cpio. El archivo cpio contiene:

* Los firmwares en formato de jerarquía `/lib/firmware`, bajo el subdirectorio `vendorfw` (ej. `/vendorfw/brcm/foo.bin`).
* `/vendorfw/.vendorfw.manifest`: Un archivo de texto que contiene líneas de las siguientes dos formas:
  * `LINK <src> <tgt>` : enlace duro
  * `FILE <name> SHA256 <hash>`: archivo

Este cpio se llama `firmware.cpio` y se coloca en la partición del sistema EFI bajo el directorio `vendorfw`.

### Manejo por el SO

Idealmente, el cargador de arranque debería cargar el archivo `firmware.cpio` directamente como un initrd temprano, lo que permite que el SO acceda al firmware sin condiciones de carrera ni complicaciones. Sin embargo, este mecanismo puede ser práctico solo para arrancar SO instalados directamente, no para arrancar instaladores desde USB, y puede que no funcione con todos los cargadores de arranque.

Los SO deben comprobar si el initrd fue cargado por el cargador de arranque. Si no lo fue, deben usar el siguiente algoritmo para localizarlo y cargarlo:

* Buscar la propiedad `/chosen` Device Tree `asahi,efi-system-partition`, para encontrar el UUID de la ESP (ver arriba). Si no se encuentra, abortar.
* Cargar los controladores NVMe internos y esperar a que el dispositivo esté disponible.
* Localizar la ESP usando el UUID obtenido arriba.
* Montar la ESP (solo lectura está bien)
* Buscar el archivo /vendorfw/firmware.cpio
* Extraerlo o ponerlo disponible según sea necesario

El SO debe asegurarse de que el firmware cargado se mantenga en memoria durante todo el arranque actual.

#### Específico de Linux

Para Linux, proponemos un parche para añadir `/lib/firmware/vendor` a la lista de rutas de carga de firmware del kernel. Esto nos permite mantener el firmware del proveedor separado del firmware gestionado por la distro (por ejemplo, linux-firmware), y significa que puede vivir en un tmpfs u otro montaje, separado del sistema de archivos raíz (que podría ser inmutable). También puede sobrescribir firmwares instalados por linux-firmware, si es necesario (aunque no anticipamos esto, es útil tener la opción si surge la necesidad).

Las distros deben entonces enviar un initramfs con un enlace simbólico `/lib/firmware/vendor -> /vendorfw`, para permitir que el kernel cargue el firmware cargado temprano directamente. Cuando sea posible, deberían hacer que su cargador de arranque cargue directamente el CPIO. Sin embargo, esto podría ser difícil para escenarios de arranque externo, o cuando /boot no es directamente la ESP. Para admitir el escenario alternativo, hay algunos requisitos:

* Todos los controladores que requieran firmware deben compilarse como módulos
* El firmware debe localizarse y cargarse *antes* de que udev se inicie. Esto se debe a que udev puede hacer que los módulos se carguen y los dispositivos se detecten arbitrariamente (incluso si no se activan directamente, el kernel puede, por ejemplo, descubrir dispositivos PCI mientras el initramfs ya se está ejecutando), y esto crea condiciones de carrera donde el firmware podría no estar disponible cuando se necesita.

El initramfs debe entonces reenviar este firmware al sistema de archivos raíz final. El mecanismo recomendado para esto es montar un tmpfs en `/lib/firmware/vendor` bajo el árbol del sistema de archivos raíz de destino, y copiar el firmware allí.

Una implementación de ejemplo para Linux puede encontrarse en el repositorio [asahi-scripts](https://github.com/AsahiLinux/asahi-scripts/tree/main/dracut/modules.d/99asahi-firmware).

La carga directa de CPIO puede lograrse con GRUB estándar si `/boot` es el punto de montaje de la ESP (es decir, GRUB y los kernels están instalados directamente en la ESP), usando `GRUB_EARLY_INITRD_LINUX_STOCK=vendorfw/firmware.cpio` en `/etc/default/grub`.

Nota: una [versión anterior](open-os-interop-old.md) de este documento proponía un mecanismo alternativo con un tarball y actualizaciones incrementales de firmware en el sistema de archivos raíz. Se descubrió que esto era propenso a errores, insuficiente cuando el initramfs no está involucrado, e incompatible con configuraciones de raíz inmutable, y ahora está obsoleto. 