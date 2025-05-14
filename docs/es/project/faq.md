---
title: Preguntas Frecuentes
---

## ¿Cuándo estará "terminado" Asahi Linux?

→ ["¿Cuándo estará terminado Asahi Linux?"](when-will-asahi-be-done-es.md)

## ¿Funciona $cosa ya?

→ [Soporte de Características](../platform/feature-support/overview.md)

## ¿Cómo lo instalo?

Consulta el sitio web para obtener instrucciones: https://asahilinux.org/

## ¿Cómo desinstalo / limpio una instalación fallida?

No hay un desinstalador automatizado, pero consulta la [Hoja de referencia de particionamiento](../sw/partitioning-cheatsheet.md) para aprender cómo eliminar las particiones manualmente.

## ¿Puedo tener doble arranque con Asahi Linux?

¡Sí! El instalador ya configura el doble arranque. Tendrías que hacer un esfuerzo adicional para borrar macOS, y *no se recomienda* hacerlo.

## ¿Puedo arrancar Asahi Linux únicamente desde una unidad USB?

No, lamentablemente no. El hardware de Apple Silicon no soporta el arranque desde almacenamiento USB, en absoluto. Es completamente imposible físicamente arrancar desde USB sin hacer cambios en el almacenamiento interno. Esto es por diseño, por razones de seguridad.

## ¡Tengo ~40GB de espacio libre en disco pero el instalador dice que no es suficiente!

El instalador siempre deja 38GB de espacio en disco *libre* para que funcionen las actualizaciones de macOS. Esto significa que necesitas suficiente espacio en disco para el nuevo sistema operativo *además de* esos 38GB.

Si deseas omitir esta verificación, habilita el modo experto al principio. ¡Ten en cuenta que podrías no poder actualizar macOS si no dejas suficiente espacio libre en disco!

## ¿Puedo instalar Asahi Linux en un iPad?

No, los iPads (y iPhones y otros dispositivos) no soportan la ejecución de kernels de sistemas operativos personalizados. Debido al diseño del sistema, incluso si se lograra la ejecución de código arbitrario en el espacio de usuario (por ejemplo, mediante un jailbreak), eso no ayudaría a ejecutar un kernel de Linux. Una explotación del ROM de arranque *podría* ayudar, si existiera, pero dar soporte a estos dispositivos no es un objetivo del proyecto para Asahi Linux.

## Problemas comunes

### Recibo un error durante el paso de redimensionamiento de macOS del instalador

Lee el mensaje de error cuidadosamente. Será uno de estos:

#### "La verificación o reparación del sistema de almacenamiento falló"

Tienes corrupción existente del sistema de archivos APFS (no causada por el instalador) que está impidiendo un redimensionamiento exitoso de tu partición de macOS. Consulta [este issue](https://github.com/AsahiLinux/asahi-installer/issues/81) para más información y pasos para solucionarlo.

#### "Tu solicitud de redimensionamiento del Contenedor APFS está por debajo del tamaño mínimo de contenedor impuesto por el sistema APFS (quizás causado por el uso de Instantáneas APFS por Time Machine)"

Como implica el mensaje, esto es causado por instantáneas de Time Machine que ocupan espacio "libre" en tu disco. Consulta [este issue](https://github.com/AsahiLinux/asahi-installer/issues/86) para más información y pasos para solucionarlo.

### ¡El Utilidad de Discos no funciona para mí después de instalar / para desinstalar / en cualquier otro momento!

No uses el Utilidad de Discos, está roto y solo funciona para configuraciones de particiones realmente simples. Consulta la [Hoja de referencia de particionamiento](../sw/partitioning-cheatsheet.md) para aprender cómo gestionar particiones con la línea de comandos.

## ¿Necesito reinstalar para obtener nuevas características / actualizaciones?

¡No! Simplemente actualiza tu sistema usando `dnf upgrade`. Las actualizaciones del kernel requerirán un reinicio. Considera una herramienta como `needrestart` para determinar si hay servicios desactualizados o un kernel desactualizado en ejecución.

## Dos de las teclas de mi teclado están intercambiadas

Esta es una propiedad inherente a algunos teclados de Apple. Por favor, lee https://wiki.archlinux.org/title/Apple_Keyboard para aprender cómo solucionar este problema.

## ¡Mi sistema sigue arrancando en macOS, ¡no en Asahi!

macOS puede estar configurado como tu medio de arranque predeterminado. Entra en One True Recovery (1TR) apagando y encendiendo mientras mantienes presionado el botón de encendido durante 15 segundos. Puedes seleccionar Asahi Linux mientras mantienes presionada la tecla Opción o entrar en la página de Configuración, desbloquear macOS, y luego configurar el cargador de arranque para reiniciar en Asahi.

## Estoy teniendo problemas de rendimiento/desgarro/características en Xorg

Por favor, deja de usar Xorg y cambia a Wayland. Xorg como servidor de pantalla principal está prácticamente sin mantenimiento, y su arquitectura está en desacuerdo con el hardware de pantalla moderno como el presente en dispositivos Apple Silicon. No tenemos el ancho de banda de desarrollo para dedicar tiempo a Xorg y sus idiosincrasias. Las distribuciones y los entornos de escritorio derivados ya están eliminando el soporte de Xorg. Eres libre de seguir usándolo si lo deseas, pero no lo soportaremos más allá de "inicia y muestra un escritorio básico correctamente".

[Fedora Asahi Remix](https://asahilinux.org/fedora/) (la distribución de referencia insignia) es solo Wayland por defecto por esta razón.

## El software lector de pantalla u otras características de accesibilidad no funcionan por defecto

A partir de febrero de 2025, las características de accesibilidad se habilitaron por defecto, y pronto deberían estar disponibles en la pantalla de bloqueo después de la instalación. Esto se implementó en el siguiente [https://pagure.io/fedora-asahi/calamares-firstboot-config/pull-request/5](https://pagure.io/fedora-asahi/calamares-firstboot-config/pull-request/5).

## La grabación de pantalla es lenta

Asegúrate de tener instalados los controladores de GPU. Si la grabación de pantalla sigue siendo lenta, probablemente estés usando una aplicación de grabación de pantalla o un compositor que lee o copia directamente las superficies de visualización de la GPU desde la CPU. Las superficies de visualización de la GPU están optimizadas para acceso desde la GPU, y la lectura directa desde la CPU probablemente ni siquiera funcionará una vez que cambiemos a búferes de fotogramas primarios comprimidos. En otras palabras, enfoques como [kmsgrab](http://underpop.online.fr/f/ffmpeg/help/kmsgrab.htm.gz) son fundamentalmente defectuosos, tendrán un rendimiento deficiente y dejarán de funcionar por completo en el futuro. Deberías usar un compositor de pantalla y una aplicación de grabación que compartan correctamente las texturas de la GPU y luego optimicen la lectura para la codificación por CPU. KWin de KDE y OBS son conocidos por funcionar bien juntos, así como la aplicación independiente Spectacle de KDE para capturas de pantalla/grabación.

## Chromium / VS Code / Slack / Discord / alguna otra aplicación Electron o navegador basado en Chrome dejó de renderizar después de una actualización.

Este es un [error de Chromium upstream](https://bugs.chromium.org/p/chromium/issues/detail?id=1442633) que afecta a todos los frameworks basados en Chromium como [Electron](https://github.com/electron/electron/issues/40366). Tienes que eliminar manualmente tu caché de shaders (por ejemplo, `~/.config/Slack/GPUCache`). No podemos hacer nada al respecto hasta que la corrección se retroporte/libere a los usuarios.

## Arrancar automáticamente después de un fallo de energía

Esta configuración está disponible en `/sys/bus/platform/devices/macsmc-reboot/ac_power_mode`. Las opciones válidas son `off` y `restore`, que es equivalente al interruptor en Configuración del Sistema en macOS. No es posible configurar la máquina para que se encienda incondicionalmente cuando se conecta la energía.

## Despertar para acceso de red (WoL/WoWLAN)

- Wake on LAN no funciona. El controlador Ethernet gigabit BCM57762 soporta WoL mediante paquetes mágicos, se puede habilitar con `ethtool -s REEMPLAZAR_CON_TU_INTERFAZ wol g`, pero la máquina no se despierta cuando recibe paquetes mágicos.
- Wake on Wireless LAN no ha sido probado.

## Gestión Lights Out (LOM)

LOM solo está soportado en dispositivos con [tarjetas Ethernet de 10Gbps](https://support.apple.com/guide/deployment/dep580cf25bc/web) inscritos en una solución de gestión de dispositivos móviles (MDM). Esta característica aún no ha sido invertida en ingeniería. 