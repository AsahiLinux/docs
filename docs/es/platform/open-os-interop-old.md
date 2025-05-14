---
title: Interoperabilidad de Plataforma de Sistemas Operativos Abiertos (Versión Antigua)
---

## Prólogo

Este documento presenta nuestra visión sobre cómo los sistemas operativos abiertos deberían interoperar en Macs con Apple Silicon (es decir, M1 y posteriores). Recomendamos leer primero [Introducción a Apple Silicon](introduction.md) para aprender primero cómo está diseñada la plataforma desde la perspectiva de Apple.

Las ideas en este documento no están destinadas a establecer requisitos o reglas estrictas; cualquiera es, por supuesto, libre (y alentado) a seguir su propio camino si así lo desea. Más bien, nos gustaría acordar un conjunto de estándares que faciliten la coexistencia de diferentes sistemas operativos y su instalación por parte de los usuarios finales, con el objetivo de hacer el proceso lo más simple, fluido y preparado para el futuro posible.

Este documento es un borrador, y damos la bienvenida a todos los comentarios y discusiones para ayudar a dar forma al futuro de cómo construir un ecosistema de sistemas operativos abiertos en estas plataformas. Por favor, pasa por #asahi en OFTC si tienes preguntas o comentarios generales, o contáctanos en #asahi-dev si eres desarrollador y te gustaría discutir aspectos técnicos ([más información](https://asahilinux.org/community/)).

## Disposición del SO y arranque

Un sistema operativo en una máquina Apple Silicon, tal como lo ve el software de Apple, significa una porción de una partición de contenedor APFS. Como las máquinas soportan nativamente el arranque múltiple, y para ajustarse al diseño de seguridad de la plataforma (por ejemplo, el SEP debe saber qué SO se arrancó), recomendamos una correspondencia 1:1 entre un SO instalado y un SO tal como lo ve la plataforma.

Para sistemas operativos de terceros, proponemos la siguiente estructura de partición GPT por SO:

1. Partición de contenedor APFS ("stub macOS") (~2.5GB) con:
  * iBoot2, firmware, kernel XNU, RecoveryOS (todo requerido por la plataforma)
  * m1n1 como kernel fuOS, con configuración de encadenamiento apuntando a la partición EFI
  * ~subvolúmenes de sistema de archivos raíz/datos vacíos
2. Partición del sistema EFI (FAT32) (~512MB) con:
  * m1n1 etapa 2 + árboles de dispositivos + U-Boot
  * GRUB u otro cargador de SO UEFI que arranque el kernel objetivo
3. Particiones raíz/boot/etc. (específicas del SO)

Razón: esta disposición empareja un SO de terceros con un SO residente en APFS tal como lo ve el software de Apple, y permite a los usuarios usar el selector de arranque nativo (con soporte de accesibilidad). Evita posibles problemas futuros que podrían surgir de tener múltiples SO intentando gestionar el SEP bajo un contexto de SO compartido. También nos permite tener cadenas de arranque seguro independientes para los SO (una vez que se implemente), con la imagen fuOS conteniendo la raíz de confianza para las etapas de arranque posteriores, conectada a la cadena de confianza de la máquina por el usuario con sus credenciales de propietario durante la instalación.

Si bien sería posible compartir un contenedor APFS entre múltiples SO (e incluso macOS), no hay mucho sentido en esto aparte de ahorrar una pequeña cantidad de espacio en disco por SO. Usar una partición de contenedor separada para cada SO instalado hace que sea más fácil borrar y comenzar de nuevo, lo que de otra manera requeriría un proceso de limpieza más complicado donde se eliminan ciertos subvolúmenes APFS y se borran ciertos árboles de directorios en otros.

Este diseño, de manera no convencional, proporciona una partición del sistema EFI para cada SO instalado. Hay dos razones para esto: primero, cada SO es lógicamente un "contenedor" e incluye la implementación EFI en sí, por lo que tiene sentido aislar el ESP del de otros SO. Segundo, debido a la ausencia de servicios de tiempo de ejecución de variables EFI (ver más abajo), sería difícil para múltiples SO coexistentes compartir un ESP y configurar sus respectivas entradas de arranque EFI. Tener ESPs separados nos permite simplemente usar la ruta de arranque predeterminada (`\EFI\BOOT\BOOTAA64.EFI`) y evitar tener que persistir configuraciones de arranque. También permite que el ESP se use directamente como la partición `/boot` para un SO, sin que múltiples SO colisionen entre sí (si se desea).

En el futuro, una vez que los controladores APFS abiertos se consideren lo suficientemente estables para usar como sistema de archivos raíz, nos gustaría soportar la coexistencia completa con compartimiento de espacio con macOS; en ese punto solo se requeriría la partición del sistema EFI además de un contenedor APFS de macOS existente.

Debido a la presencia de múltiples ESPs, los SO necesitarán una forma de determinar cuál es el suyo. Para montajes típicos y propósitos de arranque, eso se puede hacer con IDs de partición/FS; esto debería ser principalmente una preocupación para los instaladores de SO que necesitan determinar en qué ESP instalar su cargador de arranque durante la instalación. Para este propósito, m1n1 etapa 1 normalmente se configura durante la instalación para proporcionar (y reenviar) una propiedad del Árbol de Dispositivos `/chosen` llamada `asahi,efi-system-partition`, que contiene el valor PARTUUID de la partición del sistema EFI.

### Resumen del arranque

Un arranque típico de un sistema Linux de referencia seguirá los siguientes pasos, continuando desde la sección Flujo de Arranque anterior:

* iBoot2 carga el kernel personalizado, que es una compilación de m1n1
* m1n1 etapa 1 se ejecuta y
  * Analiza el Árbol de Dispositivos de Apple (ADT) para obtener información específica de la máquina
  * Realiza inicialización adicional de hardware (específica de la máquina)
    * Por ejemplo, detalles del controlador de memoria, carga USB-C, pantalla HDMI (en Mac Mini)
  * Muestra su logo en la pantalla (reemplazando el logo de Apple)
  * Carga su configuración integrada, que lo dirige a encadenar desde una partición FAT32
  * Inicializa el controlador NVMe
  * Busca en la GPT la partición configurada para encadenamiento, por PARTUUID.
  * Monta la partición como FAT32
  * Busca el nombre de archivo configurado para encadenamiento y lo carga
  * Apaga el controlador NVMe
  * Encadena a la instancia cargada de m1n1 (como un blob binario raw), incluyendo reenviar cualquier configuración de propiedad /chosen encontrada en su configuración integrada.
* m1n1 etapa 2 se ejecuta y
  * Analiza el Árbol de Dispositivos de Apple (ADT) para obtener información específica de la máquina
  * Reinicializa el hardware, incluyendo cualquier cosa que la etapa 1 no hizo (por ejemplo, por ser más antigua)
  * Busca en sus cargas útiles integradas para encontrar Árboles de Dispositivos y una imagen U-Boot integrada
  * Selecciona un Árbol de Dispositivos (FDT) integrado apropiado para la plataforma actual
  * Personaliza el FDT con información dinámica trasplantada del ADT
  * Realiza cualquier otra inicialización de hardware para preparar el entorno de la máquina para Linux
  * Carga la imagen U-Boot integrada y salta a ella
* U-Boot se ejecuta y
  * Analiza el FDT
  * Inicializa el teclado para entrada
  * Inicializa NVMe
  * Solicita al usuario que entre en un shell si se solicita
  * Monta la Partición del Sistema EFI apropiada
  * Inicia servicios EFI básicos
  * Localiza el cargador de arranque EFI predeterminado en el ESP, por ejemplo, GRUB, y lo arranca
* GRUB se ejecuta y
  * Usa servicios de acceso a disco EFI para montar el sistema de archivos /boot (podría ser el ESP mismo, podría ser otra cosa)
  * Localiza su archivo de configuración y componentes adicionales
  * Presenta al usuario un menú de arranque, usando servicios de consola/entrada EFI
  * Carga el kernel y el initramfs desde /boot
  * Salta al kernel
* El kernel de Linux arranca como lo haría en cualquier otra plataforma UEFI+FDT

Esta cadena de arranque está diseñada para acercar progresivamente el sistema a una máquina ARM64 "típica", de modo que las capas posteriores tengan que preocuparse menos por los detalles particulares de las máquinas Apple Silicon.

### m1n1

m1n1 es nuestro bootstrap de primera etapa para sistemas Apple Silicon. Su propósito es tender un puente entre el protocolo de arranque XNU y el protocolo de arranque de Árbol de Dispositivos / ARM64 Linux, y realizar la inicialización de bajo nivel para que las etapas de arranque posteriores no tengan que preocuparse por ello. Consulta la [Guía de Usuario de m1n1](../sw/m1n1-user-guide.md) para más detalles sobre cómo funciona.

m1n1 también puede ser controlado vía USB para desarrollo y propósitos de ingeniería inversa, incluyendo cargar kernels para permitir un ciclo de construcción-prueba muy rápido. También incluye un hipervisor bare-metal que puede arrancar Linux o macOS y proporcionar un UART virtualizado sobre USB, e incluye un marco avanzado de seguimiento de eventos basado en Python. Estas características no están destinadas a usuarios finales, pero esperamos que hagan el desarrollo y prueba de SO en estas plataformas lo más agradable posible.

m1n1 puede instalarse como una sola etapa, pero en sistemas de producción debería dividirse en dos versiones, con la compilación de la etapa 1 encadenando una segunda etapa desde la partición del sistema EFI. Esto es importante porque la etapa 1 solo puede ser modificada por el usuario mediante arranque en 1TR, lo que impide que sea actualizada por otro SO directamente. Al cargar una segunda etapa desde NVMe, podemos hacer que sea actualizable, junto con sus cargas útiles.

En el futuro, pretendemos permitir que el encadenamiento de la etapa 2 mantenga una cadena de arranque seguro, mediante imágenes m1n1 firmadas. Por esta razón, el código actual de encadenamiento para cargar la etapa 2 desde FAT32 está escrito en Rust, ya que es parte de la superficie de ataque de arranque seguro. Esto esencialmente elimina la posibilidad de errores de seguridad de memoria explotables en esa parte del código. La verificación de firma también se implementará en Rust por esta razón. La clave pública para verificación se configurará durante la instalación de la etapa 1, y será la de la entidad esperada para proporcionar compilaciones de la etapa 2 para ese contenedor de SO particular.

### U-Boot

U-Boot proporciona el primer punto de interacción local del usuario (teclado) y soporte para arrancar desde USB u otros dispositivos externos. También implementa servicios EFI que ocultan los detalles de la plataforma, haciéndola parecer una máquina UEFI típica.

Notablemente, U-Boot no puede proporcionar servicios de tiempo de ejecución EFI particularmente útiles. Como la plataforma no tiene un almacén de variables EFI, y no es práctico compartir, por ejemplo, acceso NVMe con un SO en ejecución, no será posible hacer modificaciones a configuraciones de arranque EFI desde un SO en ejecución. En su lugar, esas modificaciones tendrían que hacerse cambiando archivos de configuración directamente. Esto no debería ser un problema si diferentes SO usan diferentes ESPs.

### GRUB

GRUB hace la carga final de Linux y proporciona a los usuarios el familiar menú de selección de kernel y edición de opciones. GRUB no necesita ningún parche para funcionar en máquinas Apple Silicon, ya que se basa completamente en servicios EFI para hacer su trabajo. Depende de la distribución del SO decidir qué usar aquí; GRUB es meramente un ejemplo.

### Esquemas de arranque

Los SO instalados tienen control de la cadena de arranque a partir de m1n1 etapa 2, y por lo tanto son libres de gestionarla como deseen. Por ejemplo, una distro Linux podría adjuntar kernels Linux directamente a m1n1 etapa 2, o usar U-Boot directamente para arrancar kernels, o usar el stub EFI de Linux, o GRUB.

Los instaladores de SO arrancados vía USB deben usar el protocolo de arranque UEFI estándar desde una Partición del Sistema EFI FAT32 si quieren funcionar con el modo de configuración solo UEFI del Instalador de Asahi Linux (que instala m1n1 etapa 2 + U-Boot configurado así). El instalador puede sobrescribir esto con otro mecanismo como parte de la instalación, si se desea, aunque esto no se recomienda sin una buena razón: mantener el blob de segunda etapa instalado por el Instalador de Asahi Linux puede permitir arrancar en máquinas aún no soportadas por una versión de SO dada, proporcionando nuevos árboles de dispositivos, si esas plataformas son suficientemente compatibles hacia atrás.

Para SO que usan el enfoque típico m1n1+U-Boot, se recomienda que verifiquen la versión existente en el ESP y se nieguen a degradarla automáticamente si el paquete proporcionado por el SO es más antiguo. Esto, nuevamente, permite que hardware futuro sea parcialmente soportado con solo una actualización del instalador. TODO: especificar cómo debería funcionar esta verificación de versión (necesitamos comenzar a etiquetar las compilaciones de m1n1 correctamente).

## Instalación inicial

En estas máquinas, hay una discrepancia entre el punto donde arranca un kernel de terceros (después de iBoot2), y los componentes de arranque requeridos por SO (incluyendo el propio iBoot2, firmware, y otros archivos, así como la imagen recoveryOS y el kernel XNU para ella). Además, el software de Apple requiere que estos archivos estén dispuestos de cierta manera en la partición Preboot para funcionar correctamente en los menús de selección de SO, más allá de los requisitos impuestos por iBoot1/2 mismos. En efecto, crear un nuevo contenedor de SO requiere, esencialmente, instalar macOS menos el sistema de archivos raíz.

Afortunadamente, todos los componentes requeridos pueden obtenerse de las imágenes de restauración (archivos IPSW) que están públicamente disponibles en URLs [bien conocidas](https://ipsw.me/) y estables. Hemos implementado este proceso en [asahi-installer](https://github.com/AsahiLinux/asahi-installer), un marco de instalación basado en Python que está destinado a ejecutarse desde 1TR. Transmite los bits requeridos del archivo IPSW, evitando una descarga completa, y configura las particiones y contenidos según sea necesario para arrancar recoveryOS y posteriormente un kernel personalizado.

No esperamos que los SO quieran reinventar esta rueda en particular (confía en nosotros, no quieres), así que nos gustaría hacer que el instalador sea lo suficientemente flexible para soportar la inicialización de diferentes flujos de instalación.

### Lanzando el instalador

En este momento, el instalador de Asahi Linux es soportado como un instalador puramente en línea (estilo `curl | sh`), que puede ser lanzado desde macOS o desde recoveryOS. Los SO a instalar se descargan bajo demanda (transmitidos directamente al disco objetivo sin almacenamiento intermedio). Alternativamente, los usuarios pueden elegir instalar solo un entorno de arranque UEFI, que luego puede arrancar cualquier SO desde USB usando los mecanismos estándar, dejando espacio sin particionar para que, por ejemplo, un instalador de SO lo use.

Las opciones futuras de instalación podrían incluir:

* Imágenes/paquetes de instalación en red USB, configurando el instalador como "medio de instalación arrancable". Esto puede configurarse simplemente descomprimiendo algunos archivos en una partición FAT32 en una unidad USB, por lo que es fácil de usar para los usuarios, y les permitirá seleccionar el instalador desde el selector de arranque ([más información](introduction.md#boot-picker) sobre cómo funciona esta magia). Aún así obtendría el SO a instalar desde internet.
* Imágenes/paquetes de instalación local USB, que también pueden servir como medio de instalación UEFI para más tarde o para otras plataformas. Esto instalará el SO objetivo desde USB, pero aún así accederá a la CDN de Apple para los componentes de Apple, haciendo que la instalación no sea verdaderamente sin conexión.
  * Una opción para que los usuarios finales agreguen los componentes de Apple, por ejemplo, ejecutando un script desde la unidad USB, haciéndola completamente sin conexión
  * Una opción para que los usuarios finales agreguen los componentes de Apple al crear el instalador USB, por ejemplo, ejecutando un script que los descarga y provisiona el instalador de una vez, en lugar de una imagen pre-cocinada.
    * Queremos agregar esto como una característica al instalador en línea, por ejemplo, "crear un instalador USB arrancable" en lugar de realmente hacer la instalación.
* Empaquetado como una aplicación macOS (esto ya sería parte de los modos de instalación USB de todos modos)
  * Aunque esto se topa con problemas de GateKeeper con descargas no firmadas si se descargan "normalmente" por los usuarios desde un navegador...

## Provisionamiento de firmware

Las máquinas Apple Silicon dependen de un gran número de blobs de firmware para funcionar. Si bien la mayoría de estos ya están cargados cuando arranca un SO de terceros, hay un pequeño subconjunto que no lo está. Como estos blobs no tienen una licencia redistribuible, esto presenta un problema para aquellos SO que necesitan tener acceso a los blobs. Afortunadamente, los blobs están disponibles en los archivos IPSW creados por el instalador inicial. Proponemos un mecanismo "vendor-firmware" para pasar esos blobs al SO arrancado/instalado.

Nota: Actualmente hay un hack en el instalador para volcar todo el firmware raw a otro lugar en el ESP, así que podemos proporcionar un script para que los usuarios extraigan el resto en una forma compatible con esta especificación. Esto desaparecerá una vez que todos los extractores estén terminados, y está destinado como una cosa ad-hoc temporal.

### Blobs empaquetados

Actualmente, se empaqueta el firmware Broadcom FullMAC WiFi. Estos blobs también han sido identificados como necesarios, pero aún no están empaquetados:

* Firmware Broadcom Bluetooth
* Firmware AVD (Apple Video Decoder) Cortex-M3
* Firmware USB xHCI (solo necesario para modelos iMac con 4 puertos USB-C).

Detalles sobre el nombramiento del firmware Broadcom FullMAC WiFi: <https://lore.kernel.org/all/20220104072658.69756-10-marcan@marcan.st/>

### Paquete VendorFW

El instalador de SO stub recopila el firmware de plataforma disponible del IPSW, y lo empaqueta como dos archivos:

* firmware.tar: Tarball conteniendo el firmware, en una estructura compatible con la jerarquía `/lib/firmware` (por ejemplo, `brcm/foo.bin`).
* manifest.txt: Un archivo de texto conteniendo líneas de las siguientes dos formas:
  * `LINK <src> <tgt>` : enlace duro
  * `FILE <name> SHA256 <hash>`: archivo

Estos archivos se colocan luego en la partición del sistema EFI bajo el directorio `vendorfw`.

### Manejo del SO

Un SO arrancado debe montar el ESP e inspeccionar el archivo `manifest.txt`. Si se encuentra que es diferente del firmware de vendedor existente instalado en la partición del SO (si hay alguno), debe actualizarlo extrayendo `firmware.tar` en `/lib/firmware`, y luego comparando ambos archivos de manifiesto y eliminando cualquier archivo que ya no esté presente en el manifiesto del ESP. Esto debe hacerse antes de que se carguen los controladores que requieren firmware.

Alternativamente, un SO que soporte un mecanismo más complejo de carga dinámica de firmware podría leer el archivo `firmware.tar` directamente a medida que se solicita el firmware.

Una implementación de ejemplo de este proceso está disponible en el repositorio asahi-scripts [aquí](https://github.com/AsahiLinux/asahi-scripts/blob/main/update-vendor-firmware).

El paquete de firmware debe verificarse en cada arranque, para recoger cambios de usuarios que actualicen su SO stub volviendo a ejecutar el instalador. Esto será raro, pero vale la pena soportarlo correctamente. 