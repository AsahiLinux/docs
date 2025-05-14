---
title: Deshaciendo Hacks Tempranos de los Altavoces
---

### Introducción
Probablemente estés aquí porque intentaste habilitar tus altavoces tempranamente, y un cambio en la configuración
entre cuando hiciste esto y el lanzamiento público del soporte para altavoces rompió algo. Fuiste
advertido.

A continuación se presentan algunas soluciones para hacks comunes de adoptantes tempranos. Por favor, intenta _todas_ ellas antes de reportar un error.
Tu error será ignorado si encontramos que no has rectificado cualquiera de los problemas
que se detallan a continuación.

### El perfil Pro Audio está/estaba habilitado para los altavoces internos / auriculares
Esto puede ocurrir de tres maneras:
* Has cambiado el perfil mientras los auriculares estaban conectados
* Has estado usando una versión muy, muy, _muy_ antigua de `asahi-audio`
* Has eludido los permisos de nodo de Wireplumber para experimentar con perfiles de dispositivo

En el primer caso, cambia el perfil de vuelta a `Default` (HiFi). En la configuración de Audio de KDE
cambia el perfil de vuelta a `Default`. Si no hay auriculares conectados, presiona
`Mostrar Dispositivos Inactivos`. Lo mismo debería ser posible con aplicaciones como `pavucontrol`.
En caso de duda, elimina el directorio de estado de WirePlumber (`rm -rf ~/.local/state/wireplumber/`)
y reinicia.

La solución en los otros dos casos es la misma:
1. `rm -rf ~/.local/state/wireplumber/`
2. Reinstala `asahi-audio`, Pipewire _y_ Wireplumber
3. Reinicia tu máquina

### Tienes archivos en /etc/ de una versión preliminar de asahi-audio
Versiones muy antiguas de `asahi-audio` almacenaban su configuración dentro de `/etc/pipewire/` y
`/etc/wireplumber/`. No debería haber nada relacionado con Asahi en _ninguno_ de estos directorios
o cualquiera de sus subdirectorios. Para solucionarlo:
```sh
rm -rf /etc/wireplumber/wireplumber.conf.d/*asahi*
rm -rf /etc/wireplumber/main.lua.d/*asahi*
rm -rf /etc/wireplumber/policy.lua.d/*asahi*
rm -rf /etc/pipewire/pipewire.conf.d/*asahi*
```
Una vez que hayas hecho esto, reinstala `asahi-audio`, Pipewire _y_ Wireplumber y luego reinicia
tu sistema.

### Tienes archivos en /usr/share/ de una versión preliminar de asahi-audio
Las versiones preliminares de `asahi-audio` tenían archivos en `/usr/share/` que no coinciden con los que
se enviaron con la versión 1.0. Estos archivos pueden entrar en conflicto con las versiones de lanzamiento, causando problemas.
Debes eliminar manualmente todos los archivos de `asahi-audio`:
```sh
rm -rf /usr/share/asahi-audio/
rm -rf /usr/share/wireplumber/wireplumber.conf.d/*asahi*
rm -rf /usr/share/wireplumber/main.lua.d/*asahi*
rm -rf /usr/share/wireplumber/policy.lua.d/*asahi*
rm -rf /usr/share/pipewire/pipewire.conf.d/*asahi*
```
Una vez que hayas hecho esto, reinstala `asahi-audio`, Pipewire _y_ Wireplumber y luego reinicia
tu sistema.

### Has intentado eludir manualmente nuestros controles de seguridad a nivel de kernel
Elimina `snd_soc_macaudio.please_blow_up_my_speakers` de donde lo hayas agregado. Esto podría estar en
la línea de comandos predeterminada del kernel, `modprobe.d`, o en algún otro lugar. Reinicia cuando hayas terminado.

### No se están aplicando las configuraciones necesarias del codec de los altavoces
Esto puede ocurrir si estás en un kernel antiguo, o has configurado manualmente `snd_soc_tas2764.apple_quirks`
a algún valor no estándar. Como se mencionó anteriormente, elimina cualquier referencia a este parámetro del módulo, actualiza tu kernel,
y luego reinicia. 