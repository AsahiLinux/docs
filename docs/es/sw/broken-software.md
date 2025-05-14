---
title: Software Roto
---

Esta página enumera el software que se sabe que no funciona correctamente en máquinas Apple Silicon.
Lo publicamos con la esperanza de que incentive a los miembros interesados de la comunidad a contribuir
correcciones para los paquetes afectados en el upstream, mejorando el ecosistema de software AArch64 para todos.

### Si ${PACKAGE} soporta AArch64, ¿por qué no funciona?
Esto casi siempre se debe a soporte incorrecto/incompleto para páginas de 16K.
Los paquetes a veces se compilan asumiendo un tamaño de página de 4K, o son incompatibles
con páginas grandes. Esto no ha sido un problema serio para el software de escritorio Linux, ya que
x86/amd64 solo soporta páginas de 4K y PowerPC solo soporta páginas de 4K _o_ 64K.
AArch64 es único en que una máquina AArch64 puede usar páginas de 4K, 16K _o_ 64K.

### ¿Por qué no usar simplemente páginas de 4K entonces?
Si bien estas máquinas pueden arrancar kernels de 4K, hacerlo requiere algunos parches muy hacky,
ya que los IOMMUs solo soportan páginas alineadas a 16K. Esto no solo causa severas penalizaciones
de rendimiento, sino que no aborda el problema real que es el software de espacio de usuario con
soporte incompleto para AArch64. XNU (macOS) resuelve esto soportando tamaños de página
independientes en el espacio de usuario, sin embargo no tenemos tal mecanismo en Linux y probablemente nunca lo tendremos.

### ¿Por qué no simplemente alojar una versión fija de ${PACKAGE} ustedes mismos?
Las máquinas AArch64 de clase escritorio solo se volverán más comunes en los próximos años.
Al tener una política de upstream-first podemos asegurarnos de que estas correcciones se propaguen a todos
a través de los repositorios de distribución, ¡mejorando el ecosistema AArch64 para todos! Vea [Paquetes corregidos](#fixed-packages)
para una lista de software que ha sido corregido para todos como resultado de esto. No querrías
que nos quedáramos con Emacs solo para nosotros, ¿verdad?

### ¿Por qué "no funciona" a veces significa "segfault instantáneo"?
Si un ejecutable o biblioteca ELF tiene secciones que no están alineadas a páginas de 16K, el cargador
no podrá mapear el binario en memoria y señalará este fallo causando
un fallo de segmentación antes de que el programa incluso técnicamente comience la ejecución.

Puede confirmar que este es el caso usando `readelf -l /ruta/al/binario`. Todas las secciones
de encabezado de programa de tipo `LOAD` deben tener un valor `ALIGN` de al menos `0x4000` para
cargar exitosamente en una máquina de 16K como Apple Silicon. La biblioteca ilustrada aquí
solo está alineada para páginas de 4K (`0x1000`) por lo que no puede cargar.

```
$ readelf -l lib64/ld-android.so

Elf file type is DYN (Shared object file)
Entry point 0x0
There are 9 program headers, starting at offset 64

Program Headers:
  Type           Offset             VirtAddr           PhysAddr
                 FileSiz            MemSiz              Flags  Align
  PHDR           0x0000000000000040 0x0000000000000040 0x0000000000000040
                 0x00000000000001f8 0x00000000000001f8  R      0x8
  LOAD           0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000874 0x0000000000000874  R      0x1000
  LOAD           0x0000000000001000 0x0000000000001000 0x0000000000001000
                 0x0000000000000004 0x0000000000000004  R E    0x1000
  LOAD           0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x00000000000000a0  RW     0x1000
  DYNAMIC        0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x00000000000000a0  RW     0x8
  GNU_RELRO      0x0000000000002000 0x0000000000002000 0x0000000000002000
                 0x00000000000000a0 0x0000000000001000  R      0x1
  GNU_EH_FRAME   0x000000000000082c 0x000000000000082c 0x000000000000082c
                 0x0000000000000014 0x0000000000000014  R      0x4
  GNU_STACK      0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000000 0x0000000000000000  RW     0x0
  NOTE           0x0000000000000238 0x0000000000000238 0x0000000000000238
                 0x0000000000000020 0x0000000000000020  R      0x4

 Section to Segment mapping:
  Segment Sections...
   00     
   01     .note.gnu.build-id .dynsym .gnu.hash .dynstr .eh_frame_hdr .eh_frame 
   02     .text 
   03     .dynamic 
   04     .dynamic 
   05     .dynamic 
   06     .eh_frame_hdr 
   07     
   08     .note.gnu.build-id 
```

Aunque el valor predeterminado para los compiladores AArch64 es producir archivos ELF con secciones alineadas
a 64K para compatibilidad con todas las máquinas AArch64, errores en las herramientas (como binarios
manipulados por versiones antiguas de `patchelf`) o flags de compilador personalizados (como
muchos programas de Google, incluyendo versiones antiguas de Chrome (y Electron) y la mayoría de los programas
actuales de Android) pueden resultar en un binario cuyas secciones solo están alineadas a 4K.

## ¿Hay alguna solución alternativa disponible?

El paquete `muvm` de Fedora Linux Asahi Remix está, por defecto, configurado para virtualizar un kernel
de 4K (junto con configurar FEX como el manejador binfmt x86_64 para que se puedan ejecutar programas x86_64).
Puede tener varios niveles de éxito intentando ejecutar su software en `muvm`.

## Paquetes rotos
| Paquete | Reporte upstream | Notas |
| ------- | --------------- | ----- |
| hardened_malloc | <https://github.com/GrapheneOS/hardened_malloc/issues/183> | Hay más cambios necesarios en hardened_malloc antes de que el soporte de páginas de 16k esté listo. Tampoco es una alta prioridad en este momento ya que necesitamos MTE |
| jemalloc | <https://github.com/jemalloc/jemalloc/issues/467> | Upstream no está dispuesto a arreglar, Necesita opciones de compilación si se compila en un sistema con tamaño de página de 4k. Abordado en [ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1914). |
| MEGAsync | <https://github.com/meganz/MEGAsync/pull/801> |
| notion-app(-enhancer) | <https://github.com/notion-enhancer/notion-repackaged/issues/107> | electron + flags de compilación rotos |

\* La ejecución de software x86-64 está soportada a través de una microVM con tamaño de página de 4k ejecutando FEX.

## Paquetes corregidos
| Paquete | Commit de corrección | Notas |
| ------- | ------------- | ----- |
| 1Password | _propietario_ | Corregido desde la beta 8.8.0-119. |
| Android Cuttlefish | <https://android-review.googlesource.com/c/device/google/cuttlefish/+/2545951> | Corregido en la rama principal de AOSP cambiando a musl. |
| box64 | <https://github.com/ptitSeb/box64/issues/384> | Corregido desde 0.2.8 |
| btrfs | <https://lore.kernel.org/lkml/cover.1653327652.git.dsterba@suse.com/> | Corregido desde Linux 5.19 ([advertencias](https://web.archive.org/web/20241204022740/https://social.treehouse.systems/@marcan/111493984306764821)) |
| Chromium | <https://bugs.chromium.org/p/chromium/issues/detail?id=1301788> | Incluye apps de Electron.<br>Corregido desde 102. |
| Emacs | <https://lists.gnu.org/archive/html/bug-gnu-emacs/2021-03/msg01260.html> | Corregido desde 28.0 |
| f2fs | <https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=d7e9a9037de27b642d5a3edef7c69e2a2b460287> | Corregido desde Linux 6.7 |
| fd | <https://github.com/sharkdp/fd/issues/1085> | Corregido desde 10.1 |
| k3s-io | <https://github.com/k3s-io/k3s/issues/7335> | Corregido desde 1.27.2 |
| KiCad | <https://gitlab.com/kicad/code/kicad/-/issues/16008> | Corregido desde 7.0.10 |
| libglvnd | <https://gitlab.freedesktop.org/glvnd/libglvnd/-/merge_requests/262> | Corregido desde 1.5.0 |
| libunwind | <https://github.com/libunwind/libunwind/pull/330> | Corregido desde 1.7.0 |
| libunwind | <https://github.com/libunwind/libunwind/issues/260> | Corregido desde 1.8.0 |
| libvirt/QEMU/KVM | <https://patchew.org/QEMU/20230727073134.134102-1-akihiko.odaki@daynix.com/> | Corregido desde QEMU 7.2.6 / 8.0.5 / 8.1.1 |
| lvm2 | <https://bugzilla.redhat.com/show_bug.cgi?id=2059734> | Corregido desde 2.03.21 |
| pdfium | <https://bugs.chromium.org/p/pdfium/issues/detail?id=1853> | Corregido y enviado con Chromium 108 |
| qt5-webengine | <https://bugreports.qt.io/browse/QTBUG-105145> | chromium 87, probablemente no será corregido upstream. [Corregido en downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| qt6-webengine | <https://bugreports.qt.io/browse/QTBUG-105145> | chromium 94 para 6.3, parcialmente corregido upstream en 6.4 para webview pero no para QtPdf. [Corregido en downstream ArchLinuxARM](https://github.com/archlinuxarm/PKGBUILDs/pull/1928) |
| Redis | <https://bugzilla.redhat.com/show_bug.cgi?id=2240293> <https://bodhi.fedoraproject.org/updates/FEDORA-2023-bdb1515542> | Corregido en fedora desde redis-7.0.13-2.fc38 y redis-7.2.1-2.fc39) |
| rr | <https://github.com/rr-debugger/rr/pull/3146> | Corregido desde 5.6.0 |
| Rust | <https://github.com/archlinuxarm/PKGBUILDs/commit/19a1393> | Corregido para `rust-1.62.1-1.1` en ALARM/extra |  
| Telegram Desktop | <https://github.com/telegramdesktop/tdesktop/issues/26103> | Corregido desde 4.1.1 |
| Visual Studio Code | <https://aur.archlinux.org/packages/visual-studio-code-bin> | Corregido desde 1.71.0 (usa Electron 19) |
| WebKitGTK | <https://github.com/WebKit/WebKit/commit/0a4a03da45f774> | Corregido desde 2.34.6 |
| Wine | <https://bugs.winehq.org/show_bug.cgi?id=52715> | Corregido desde 10.5 |
| Zig | <https://github.com/ziglang/zig/issues/11308> | Corregido desde [0.14.0](https://ziglang.org/download/0.14.0/release-notes.html#Runtime-Page-Size) |

## Errores

Problemas (además de problemas de tamaño de página y soporte arquitectónico) en software de terceros, reportados y/o rastreados por miembros del equipo central de Asahi:

### Errores Abiertos

| Paquete          | Problema | Notas |
| ---------------- | ----- | ----- |
| firefox          | [wayland: El primer frame al inicio a veces está sin inicializar por un momento (también quizás en x11)](https://bugzilla.mozilla.org/show_bug.cgi?id=1831051) |
| gnome-bluetooth/bluez | Frecuentes cortes de audio y desconexiones de salida de audio A2DP (no hay problemas usando blueman) | No hay errores reportados aún |
| hyprland         | [Las líneas de tiempo de Explicit Sync fallan al importar, matando al cliente](https://github.com/hyprwm/Hyprland/issues/8158) |
| kwin             | [Las regiones de daño del fondo raíz se calculan incorrectamente con múltiples pantallas](https://bugs.kde.org/show_bug.cgi?id=477454) |
| plasmashell      | [startplasma rompe la fusión de variables entre profile.d y environment.d](https://bugs.kde.org/show_bug.cgi?id=491579) |
| systemsettings   | [el modelo de teclado del sistema por defecto no se configura correctamente en Wayland](https://bugs.kde.org/show_bug.cgi?id=475435) |
| wireplumber      | [No se pueden pasar argumentos a módulos PW desde lua](https://gitlab.freedesktop.org/pipewire/wireplumber/-/issues/538) |
| wlroots          | [Añadir soporte para Matriz de Transformación de Color DRM (Útil para ej. redshift)](https://gitlab.freedesktop.org/wlroots/wlroots/-/issues/1078) | [PR relacionado](https://gitlab.freedesktop.org/wlroots/wlroots/-/merge_requests/4815) |
| wlroots          | [no se puede abrir render como master cuando se usa seatd](https://gitlab.freedesktop.org/wlroots/wlroots/-/issues/3911) |
| xkeyboard-config | [Manejo de teclas Fn de Mac en xkeyboard](https://gitlab.freedesktop.org/xkeyboard-config/xkeyboard-config/-/issues/379) |

### Errores Cerrados

| Paquete          | Problema | Notas |
| ---------------- | ----- | ----- |
| abrt             | [ABRT no puede enviar reporte de crash: falló el procesamiento](https://bugzilla.redhat.com/show_bug.cgi?id=2238248) | Problema Cerrado |
| blender          | [blender hace core dump en la ejecución en lugar de dar retroalimentación sensata sobre hardware no soportado](https://bugzilla.redhat.com/show_bug.cgi?id=2237821) | Problema Cerrado |
| chromium         | [Error de compilación de shader Skia](https://bugs.chromium.org/p/chromium/issues/detail?id=1442633) | Corregido en Chromium 121.0.6167.85 |
| chromium         | [cppgc se bloquea en Linux con páginas de 16KiB debido a kGuardPageSize codificado](https://issues.chromium.org/issues/378017037) | Corregido en Chromium 133.0.6943.141 |
| dracut           | [Memorizar find_kmod_module_from_sysfs_node](https://github.com/dracut-ng/dracut-ng/pull/408) | Corregido en dracut 103 |
| firefox          | [YouTube está limitando resoluciones a 1080 en user agents Linux aarch64](https://bugzilla.mozilla.org/show_bug.cgi?id=1869521) | Corregido en Firefox 123 |
| gcc              | [Mala compilación LTO de ceph en aarch64 y x86_64](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=113359) | Corregido en gcc 13.3 / 14.1 |
| glibc            | [La reutilización de modid TLS rompe accesos TLS](https://bugzilla.redhat.com/show_bug.cgi?id=2251557) | Corregido en glibc 2.39 |
| gtk              | [GSK emite operaciones de render ilegales con load=dont-care y blend=over con escalado fraccional Wayland, causando corrupción gráfica](https://gitlab.gnome.org/GNOME/gtk/-/issues/7146) | Corregido en gtk 4.17.6 |
| gtk              | [GSK/vulkan usa mipmaps sin verificar los formatos/tiling `VkImageFormatProperties.maxMipLevels`](https://gitlab.gnome.org/GNOME/gtk/-/issues/7229) | Corregido en gtk 4.17.5 |
| hyprland         | [problema con aplicaciones OpenGL bloqueándose cuando se usa Hyprland 0.42.0](https://github.com/hyprwm/Hyprland/issues/7364) | Corregido en hyprland 0.43.0 |
| kpipewire        | [Spectacle falla al grabar una ventana con h264 en dimensiones específicas](https://bugs.kde.org/show_bug.cgi?id=475472) | Problema Cerrado |
| kpipewire        | [Soporte de códec OpenH264](https://bugs.kde.org/show_bug.cgi?id=476187) | Corregido en Plasma 6.1.4 |
| kwin             | [Las salidas se congelan en multi-pantalla cuando los cursores de hardware no están soportados](https://bugs.kde.org/show_bug.cgi?id=477451) | Corregido en Plasma 6.0 |
| kwin             | [Los repintados de cursor de software son defectuosos con escalado fraccional a veces](https://bugs.kde.org/show_bug.cgi?id=477455) | Corregido en Plasma 6.0 |
| lsp-common-lib   | [Arreglar operaciones atómicas para AArch64](https://github.com/lsp-plugins/lsp-plugins/issues/463) | Corregido en lsp-common-lib 1.0.40 |
| lib-dsp-lib      | [Arreglar código msmatrix aarch64](https://github.com/lsp-plugins/lsp-dsp-lib/pull/20) | Corregido en lsp-dsp-lib 1.0.20 |
| plasmashell      | [startplasma rompe la fusión de variables entre profile.d y environment.d](https://bugs.kde.org/show_bug.cgi?id=491579) |
| qqc2-desktop-style | [Algunos glifos de texto en software QML están mal alineados verticalmente o aplastados cuando se usa un factor de escala fraccional](https://bugs.kde.org/show_bug.cgi?id=479891) | Corregido en KDE Frameworks 6.9.0 |
| wireplumber      | [Wireplumber ignora el volumen de reproducción por defecto](https://gitlab.freedesktop.org/pipewire/wireplumber/-/issues/655#) | Corregido en wireplumber 0.5.3 | 