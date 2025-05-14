---
title: Particularidades de la Plataforma Apple Silicon
---

Esta página es básicamente un resumen de [Ecosistema de Sistemas Operativos Abiertos en Macs con Apple Silicon](open-os-interop.md). Está escrita para usuarios avanzados de Linux que están acostumbrados al proceso de arranque en otras plataformas. Lea esa página para obtener todos los detalles.

## Esta no es una plataforma UEFI típica

En sistemas UEFI típicos, UEFI es el firmware de arranque nativo y se espera que gestione todos los sistemas operativos instalados. **Este no es el caso en Apple Silicon**. Solo usamos la capa UEFI de U-Boot como una capa puente para permitirle usar cargadores de arranque existentes/familiares y mantener la compatibilidad con sistemas típicos. Esto tiene algunas implicaciones:

* No hay almacenamiento de variables UEFI, porque la plataforma no tiene soporte UEFI nativo que pueda acomodarlo. Esto significa que no puede configurar el arranque UEFI. U-Boot *siempre* arrancará desde el ejecutable UEFI predeterminado (`\EFI\BOOT\BOOTAA64.EFI`).
* Puede tener *múltiples* instancias UEFI y cada instancia está destinada a arrancar *solo un* sistema operativo. El multi-arranque se logra en la capa de instalación nativa del sistema operativo y el selector de arranque nativo, *no* a través de UEFI. Instalar múltiples sistemas operativos bajo un subsistema UEFI *no está soportado* y es susceptible de romperse en el futuro por múltiples razones.
* Eso significa que puede haber *múltiples Particiones del Sistema EFI*, lo que significa que encontrar la ESP por UUID de tipo *no es confiable*. Cualquier herramienta que intente hacerlo estará rota para algún subconjunto de usuarios.

Cuando arranca un sistema operativo en una plataforma Apple Silicon, hay dos conceptos de ESP:

* La ESP desde la que se arrancó el sistema operativo, que podría estar en una unidad USB si le dijo a U-Boot que arrancara desde USB.
* La ESP del Sistema que es donde están instalados U-Boot y m1n1 etapa 2, junto con el firmware del proveedor. Esto siempre está en el NVMe interno.

La ESP del Sistema puede identificarse buscando la variable elegida `asahi,efi-system-partition` en el árbol de dispositivos, que puede encontrar en `/proc/device-tree/chosen/asahi,efi-system-partition`. Esta variable siempre contiene el PARTUUID de la ESP del Sistema, independientemente de dónde le haya dicho a U-Boot que arranque.

La ESP del sistema operativo generalmente se configura en `/etc/fstab` por UUID o PARTUUID y se monta en `/boot/efi` o `/boot`.

En instalaciones estándar de NVMe interno, hay una única ESP que cumple ambos roles.

## El firmware se carga y proporciona en el arranque

No distribuimos firmware nativo de la plataforma en `linux-firmware` ni en ningún otro paquete de firmware separado. En su lugar, hay tres tipos de firmware:

* Firmware *global del sistema* que se actualiza por macOS junto con las actualizaciones de macOS. Esto solo avanza en versión, nunca retrocede (a menos que haga un borrado DFU completo), y está diseñado para ser compatible con versiones anteriores. Se carga en el arranque por iBoot.
* Firmware *emparejado con el sistema operativo* que es instalado por el instalador de Asahi Linux en la partición stub APFS y cargado directamente por iBoot. Esto *no* es compatible con versiones anteriores y cualquier sistema operativo que instale *debe* soportar la versión específica de firmware utilizada. Esta es la razón por la que entrar en modo experto en el instalador y elegir una versión no predeterminada (a pesar de todas las advertencias) romperá su sistema. Actualmente no hay forma de actualizar esto, pero la habrá en el futuro una vez que haya una buena razón para actualizarlo.
* Firmware del proveedor *extraído* que es recopilado por el instalador de Asahi Linux y colocado en `\vendorfw\vendorfw.cpio` en su ESP del Sistema. Esto se carga en memoria por su cargador de arranque (como un initramfs) o por su initramfs, y se extrae en un tmpfs montado en `/lib/firmware/vendor` en cada arranque para que el kernel pueda cargarlo. Esto *debería* coincidir con su versión de firmware emparejada con el sistema operativo. El paquete `asahi-fwextract` contiene el mismo script de extracción que el instalador de Asahi Linux y se usa para actualizar `vendorfw.cpio` cuando se agregan nuevos tipos de firmware, para evitar tener que volver a macOS y ejecutar el instalador de Asahi Linux.

## Los sistemas operativos deben considerarse emparejados con su entorno UEFI y ESP

El kernel de Linux incluye árboles de dispositivos, y en configuraciones típicas con nuestros scripts de habilitación de Asahi, estos árboles de dispositivos se instalan junto con m1n1 y u-boot en la *ESP del Sistema* y se actualizan cuando actualiza su kernel. U-Boot y m1n1 también se instalan como paquetes y se actualizan de esa manera. Eso significa que **solo puede haber un sistema operativo instalado que posea la ESP del Sistema y gestione el cargador de arranque allí**.

Nada le impide arrancar otros sistemas operativos desde un entorno UEFI, como arrancar temporalmente desde una unidad USB para fines de recuperación, pero *no hay garantía absoluta de que kernels no coincidentes funcionarán con árboles de dispositivos ajenos*. En el pasado, los cambios han roto el arranque por completo. Esto es menos probable en estos días, pero aún podría suceder. Más probablemente, puede experimentar características faltantes o controladores rotos. En general, todos los enlaces de árbol de dispositivos que ya están en el kernel principal deberían seguir siendo compatibles con versiones anteriores, pero no hay garantías con ningún controlador que aún no esté en el kernel principal.

Si aún así desea arrancar más de un sistema operativo desde la misma partición UEFI (lo que realmente solo debería hacerse para fines experimentales o de recuperación o si tiene la intención de gestionar todo esto manualmente usted mismo, no como una configuración a largo plazo, y no está soportado por nosotros), debe asegurarse de que *solo un sistema operativo* posea su ESP del Sistema y actualizará el archivo `/m1n1/boot.bin` allí. Eso significa que necesita editar/crear el archivo `/etc/default/update-m1n1` en *todos menos uno* de los sistemas operativos que tiene la intención de ejecutar, y agregar la variable `M1N1_UPDATE_DISABLED=1` allí. Esto detendrá la ejecución del script de actualización estándar de m1n1, y por lo tanto deshabilitará las actualizaciones de m1n1, u-boot y árbol de dispositivos.

Las características futuras, como el soporte SEP para encriptación y almacenamiento de secretos, pueden depender aún más de este emparejamiento y no se espera que funcionen con múltiples sistemas operativos compartiendo un contenedor ESP/UEFI.

Por otro lado, es perfectamente aceptable tener una única instalación USB externa que siempre arranque (por ejemplo, desde una instalación "solo UEFI" con el instalador de Asahi Linux, que solo configura el stub APFS y la ESP del Sistema), y permitir que esa instalación gestione su ESP del Sistema en el disco interno. En ese caso, las herramientas del sistema operativo necesitan usar `/boot/efi` o `/boot` (dependiendo de la configuración) cuando quieran actualizar su propio cargador de arranque EFI (por ejemplo, GRUB), y localizar la ESP del Sistema usando el UUID en `/proc/device-tree/chosen/asahi,efi-system-partition` cuando necesiten actualizar m1n1/u-boot/árboles de dispositivos o localizar `vendorfw.cpio`. Este ya es el caso en nuestra implementación de referencia en asahi-scripts. 