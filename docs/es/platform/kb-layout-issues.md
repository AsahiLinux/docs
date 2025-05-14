---
title: Problemas de distribución de teclado en Mac
---

En resumen, las distribuciones de teclado de Mac en Linux son un completo desastre. Queremos arreglarlo. ¡Ayúdanos a descubrir qué está mal con *tu* distribución!

Nota: Esto es solo para teclados internos de MacBook y posiblemente teclados externos de Apple. Por favor, no reportes problemas con teclados de terceros.

# Cómo ayudar

Antes de comenzar, [identifica](https://support.apple.com/en-us/HT201794) tu distribución de teclado según la documentación oficial de Apple. Necesitamos saber dos cosas:

* El tipo de teclado (ANSI, ISO o Japonés)
* La distribución específica del país

A continuación, asegúrate de tener seleccionado correctamente tu modelo de teclado. En la configuración de tu teclado (KDE: Configuración del Sistema → Dispositivos de Entrada → Teclado → Hardware), deberías seleccionar el modelo de teclado correcto:

* Para distribuciones ANSI: **Apple | Apple Aluminium (ANSI)**
* Para distribuciones ISO: **Apple | Apple Aluminium (ISO)**
* Para distribuciones Japonesas (JIS): **Apple | Apple Aluminium (JIS)**

Finalmente, elige la distribución que se vea correcta para tu idioma. Esto *debería* ser simplemente el tipo de idioma básico, ya que las personalizaciones específicas de Mac deberían aplicarse según el modelo del teclado. Sin embargo, por favor prueba múltiples opciones (por ejemplo, algunos idiomas pueden tener una variante *Macintosh*, aunque esto puede empeorar las cosas).

Luego agrega un reporte usando la plantilla a continuación ([envía un PR](https://github.com/AsahiLinux/docs) siguiendo la sección de plantilla). Si tu distribución ya está listada pero tienes una experiencia diferente (por ejemplo, en otra máquina), agrega una nueva subsección *Configuración del sistema* y anota cualquier diferencia que veas en ella.

Por favor, agrega tantos detalles como puedas sobre lo que funciona, lo que es diferente de lo que está impreso en las teclas, cualquier peculiaridad o problema específico del idioma o región que necesitemos conocer, cualquier cosa especial que haga macOS, combinaciones ocultas que *no* están impresas en las teclas que deberían funcionar, cómo esto podría diferir de tu experiencia en Windows y escritorios Linux genéricos en teclados no-Apple, etc. Necesitamos tanta información como sea posible para hacer lo correcto en el futuro.

Ten en cuenta que esto *no* se trata de las diferencias entre macOS y Linux con respecto a las teclas de acceso rápido (por ejemplo, Option vs. Ctrl). Eso es esperado: no podemos (correctamente) hacer que el escritorio Linux emule macOS mediante cambios en la distribución del teclado. Nos interesan los problemas de distribución regional del teclado, no las diferencias generales entre macOS y Linux.

Problema conocido: en máquinas MacBook Air M2, actualmente el comportamiento predeterminado de la peculiaridad `iso_layout` del controlador `hid_apple` puede ser diferente de lo que es en otras máquinas, lo que puede intercambiar las teclas a la derecha de shift y a la izquierda de "1". Sin embargo, ninguna de las opciones es apropiada para todas las distribuciones, por lo que esto puede ser algo bueno o malo para tu distribución particular (esto es algo que queremos arreglar). Solo ten en cuenta la inconsistencia existente dependiente de la máquina. Esto se arreglará en la próxima versión estable del kernel para al menos ser consistente entre máquinas.

# Reportes

## (ANSI|ISO|JIS) - (distribución) - (máquina)
* Mejor distribución/variante XKB: (Tu distribución)

(Tus notas aquí)

### Configuración del sistema
```
# Salida de ejecutar:
cd /sys/module/hid_apple/parameters/; grep . *; pacman -Q xkeyboard-config-asahi; uname -r; cat /proc/device-tree/model; echo; find /sys/devices -name country | xargs cat; dmesg | grep "Keyboard type"
```

## JIS - Japonés
* Mejor distribución/variante XKB: `Japanese/Japanese`

El tipo de distribución correcto es simplemente *Japanese* (variante predeterminada). **No** elijas *Japanese (Macintosh)*: esta es una distribución kana inútil que hará imposible escribir tu contraseña.

Todas las teclas están mapeadas correctamente como están impresas en las teclas.

Si usas un IME (se recomienda fcitx5 + mozc), las asignaciones de teclas del IME probablemente no serán lo que esperas por defecto. Probablemente querrás ir a la configuración de tu IME y asignar 「英数」(*Alternar Eisu*) a *Desactivar Método de Entrada* y 「かな」(*Hiragana Katakana*) a *Activar Método de Entrada*.

Los teclados Mac japoneses no tienen tecla *\\* (barra invertida). Tienes dos opciones bajo *Avanzado* → *Configurar opciones de teclado* → *Opciones de compatibilidad*:

* *Los teclados Apple japoneses emulan la barra invertida OADG109A*: Coloca la barra invertida en la tecla "_" sin shift, como las distribuciones comunes de PC OADG109A.
* *Los teclados Apple japoneses emulan la barra invertida PC106*: Convierte la tecla '¥' en barra invertida. \*

\* En teoría, pero esta opción parece estar rota en este momento. Ese es el comportamiento previsto de todos modos...

### Configuración del sistema
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-6-1-edge-ARCH
Apple MacBook Pro (14-inch, M1 Pro, 2021)
0f
00
```

## ANSI - Coreano - M2 MBA
* Mejor distribución/variante XKB: `Korean`

### Configuración del sistema
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-11-1-edge-ARCH
Apple MacBook Air (13-inch, M2, 2022)
21
00
00
```

## ISO - Suizo - M1 Pro MBP
* Mejor distribución/variante XKB: "German (Switzerland)"

También existe "German (Switzerland, Macintosh)", pero falla al previsualizar. Como no encontré ningún problema con el anterior, no sé los beneficios de la variante Macintosh.

Ten en cuenta que en Suiza hay cuatro idiomas nacionales: Alemán, Francés, Italiano y Romanche. El Alemán y el Francés tienen sus propias variantes de distribución XKB ("French (Switzerland)") pero distribuciones físicas idénticas. Lo anterior se aplica a la variante Alemana, no sé mucho sobre la variante Francesa.

### Configuración del sistema
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-rc3-asahi-7-1-edge-ARCH
Apple MacBook Pro (14-inch, M1 Pro, 2021)
00
00
0d
00
```

## ISO - Alemán / Austriaco - M1 Air 2020
* Mejor distribución/variante XKB: "German (Austria)"

No se han encontrado problemas hasta ahora, todo funciona como se espera.

### Configuración del sistema
```
fnmode:2
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:1
swap_opt_cmd:1
xkeyboard-config-asahi 2.35.1_3-1
6.5.0-asahi-15-1-edge-ARCH
Apple MacBook Air (M1, 2020)
00
0d
```

## ISO - Italiano - MBP 16-inch M1 Pro
* Mejor distribución/variante XKB: **Italian**

Estoy en Gnome, un Italiano (Machinintosh) está presente, pero está completamente mal, usa una extraña distribución qzerty.
Con la distribución Italiana no tengo función alt gr, parece que el comando derecho está actuando como alt izquierdo, así que no puedo escribir @, #, €, etc.

```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-11-1-edge-ARCH
Apple MacBook Pro (16-inch, M1 Pro, 2021)
0d
00
```

## ISO - Italiano - MBP 14-inch M2 Pro
* Mejor modelo de hardware: **Apple|Apple**
* Mejor distribución/variante XKB: **Italian**

```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
```

## ISO - Francés - M1 Pro MBP
* Mejor distribución/variante XKB: **Apple | Apple Aluminium (ISO)** sin variante

Seleccionar una variante dará un mapeo incorrecto.

Esta prueba se realizó usando KDE, Wayland, xkeyboard-config-asahi, en Apple MacBook Pro (14-inch, M1 Pro, 2021)

## ISO - Griego - M1 Max MBP
* Mejor distribución/variante XKB: **US** y **Greek**

La tecla §± funciona como `~ (en ambas distribuciones)

La tecla `~ funciona como «» (en ambas distribuciones)

```
fmode:3
iso_layout:-1
swap_fn_leftctrl:0
xkeyboard-config-asahi 2.35.1_3-1
6.1.0-asahi-2-2-edge-ARCH
Apple Macbook Pro (14-inch, M1 Max, 2021)
0d
00
```

## ISO - Turco Q - M2 MBP
* Mejor distribución/variante XKB: Turkish o tr

El teclado funciona mayormente como debería en un teclado no-Mac. Las combinaciones que requieren Alt Gr (Alt derecho) solo funcionan con Option derecho, lo cual no es como funciona en macOS pero es la forma en que funciona normalmente. Una advertencia es que `Alt Gr + A` produce â, cuando normalmente debería producir æ.

### Configuración del sistema
```
fnmode:3  
iso_layout:-1  
swap_ctrl_cmd:0  
swap_fn_leftctrl:0  
swap_opt_cmd:0  
xkeyboard-config-asahi 2.35.1_3-1  
6.2.0-asahi-11-1-edge-ARCH  
Apple MacBook Pro (13-inch, M2, 2022)  
00  
00  
0d
```

## ANSI US - Polaco - M1 Max MBP 2021

* Mejor distribución/variante XKB: pl

El modelo de teclado al inicio se estableció por defecto en Genérico.

Letras con diacríticos (ąćęłóćżź) funcionan con la tecla option derecha: correcto  
Caracteres especiales (dígitos + shift): correcto  
Caracteres especiales a la derecha de las letras: correcto  
backtick / tilde a la izquierda de los dígitos: correcto  

### Configuración del sistema
```
fnmode:3
iso_layout:-1
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.1.0-rc6-asahi-4-1-ARCH
Apple MacBook Pro (16-inch, M1 Max, 2021)
21
00
```

## ANSI US - con puntuación china continental - físicamente remapeado a dvorak - M1 Pro MBP 2021

* Mejor distribución/variante XKB: zh-tw(Zhuyin/Chewing), en-us, ee, fi, variante dvorak para idiomas que usan alfabetos latinos.

Distribución del sistema como Inglés(Macintosh), al intentar seleccionar la distribución a Inglés(Dvorak, Macintosh), automáticamente vuelve a Inglés(Macintosh), fcitx5

Inglés(US) - Inglés(Dvorak, Macintosh): se comporta normalmente.

Chewing(Chinese Taiwan): Seleccionar distribución como dvorak, sin problemas, la puntuación también está mapeada a las posiciones dvorak correspondientes.

Estonian(Dvorak): äõöü con opt derecha + aoeu, puntuación dvorak ANSI normal.

Finnish(Dvorak): öÖ = ;: en ANSI, å = opt + o, no se puede escribir ä sin usar tecla muerta. opt + ; = ¨ super extraño.

### Configuración del sistema
```
fnmode:3
iso_layout:-1
``` 