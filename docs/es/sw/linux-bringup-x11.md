---
title: Puesta en Marcha de Linux: X11
---

# Ejecutando X11
 * Puedes ejecutar un X11 sin aceleración si compilas el kernel con
`CONFIG_DRM_FBDEV_EMULATION=y`
 * Después de arrancar ese kernel, instala el xserver fbdev correspondiente (en debian)
`sudo apt install xserver-xorg-video-fbdev`
 * Luego puedes intentar iniciar X
`startx`
 * Si tienes problemas, busca mensajes de error en el log de Xserver
`less /var/log/Xorg.0.log`
 * Si logras que X inicie, necesitarás configurar un gestor de ventanas, según tu distribución, por ejemplo, consulta este [sistema GUI de Debian](https://www.debian.org/doc/manuals/debian-reference/ch07.en.html)
 * Yo instalé el muy ligero fluxbox, basado en teclado
`apt install fluxbox`
 * Para obtener una pantalla gráfica de inicio de sesión sencilla
`apt install xdm`
 * Instalé el terminal X **konsole**
`apt install konsole`
 * Para un navegador web, instala firefox ya que Chrome requiere soporte especial de paginación de kernel (no disponible por ahora)
`sudo apt install firefox-esr`

(![X11 ejecutándose en Macbook Air 2020](../assets/mba-xorg-fbdev.png)) 