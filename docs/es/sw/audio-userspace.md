---
title: Pila de Audio en el Espacio de Usuario
---

# Soporte de Altavoces en Asahi Linux

Modelos actualmente soportados:

* MacBook Air M1 13" (J313)
* MacBook Air (13 pulgadas, M1, 2020)
* MacBook Air (13 pulgadas, M2, 2022)
* MacBook Air (15 pulgadas, M2, 2023)
* MacBook Pro (13 pulgadas, M1/M2, 2020/2022)
* MacBook Pro (14 pulgadas, M1/M2 Pro/Max, 2021/2023)
* MacBook Pro (16 pulgadas, M1/M2 Pro/Max, 2021/2023)
* Mac mini (M1/M2/M2 Pro, 2020/2023)
* Mac Studio (M1/M2 Max/Ultra, 2022/2023)

El soporte adecuado para altavoces ha sido un esfuerzo de desarrollo de varios años que involucra a muchas personas en todas las partes de la pila de audio de Linux. Queremos ofrecer el mejor soporte de altavoces de cualquier plataforma de portátiles Linux, y eso ha significado impulsar el audio de escritorio de Linux un par de décadas hacia adelante para poder hacer lo que se espera de un subsistema de audio moderno para portátiles.

## Estado actual

Estamos listos para comenzar a lanzar soporte preliminar de altavoces a los usuarios. Ten en cuenta que como Asahi Linux es la primera plataforma de escritorio Linux con DSP de altavoces integrado avanzado, es probable que haya errores. Además, los perfiles DSP se mejorarán y ajustarán con el tiempo, y no representan los resultados absolutos mejores posibles.

El DSP de altavoces actualmente solo es compatible con Fedora Asahi Remix (las cosas se mueven rápido), sin embargo, las distribuciones alternativas deberían poder integrar este trabajo relativamente sin problemas una vez que las cosas se estabilicen (ver la sección a continuación).

## Errores conocidos

* En KDE Plasma, si activas/desactivas el silencio usando la tecla de acceso rápido mientras el volumen maestro está configurado en cualquier valor que no sea 100%, al desactivar el silencio el volumen de los altavoces será demasiado bajo. Tocar el control de volumen (o presionar una tecla de acceso rápido de volumen) restaurará el volumen previsto.
* La cadena DSP introduce un retraso excesivo, y el audio final se "almacena en búfer" (si detienes la reproducción de algo y comienzas otra cosa, obtienes un poco del final de lo primero cuando comienza lo segundo).
* No hay un limitador/compresor final en las cadenas DSP actuales (aunque hay un compresor de entrada), por lo que las entradas con contenido en regiones de alta ganancia de la curva EQ podrían causar distorsión o recorte (y limitación de speakersafetyd). Esto es más prominente en la región de 200Hz en este momento. Esto no debería causar daños, pero recomendamos bajar el volumen si notas que el sonido está notablemente distorsionado.
* La curva EQ del MacBook Air de 13" podría ser un poco dura en los agudos; pendiente de recalibración con un micrófono calibrado individualmente para confirmar/corregir.
* Bankstown (el plugin de "bajo falso") usa un algoritmo relativamente ingenuo en este momento, que no funciona bien para toda la música.

## Objetivos del proyecto

Nuestros perfiles DSP apuntan a proporcionar un sonido equilibrado, con las características que la gente espera del audio de alta calidad para portátiles/altavoces pequeños. En particular, apuntamos a:

- Un tono equilibrado (neutral) a volúmenes de escucha moderados, con una respuesta de frecuencia mayormente plana desde una posición de escucha típica
- Volumen pico razonablemente alto con degradación de sonido aceptable (compresión, limitación, etc.)
- Procesamiento de ["bajo falso"](https://en.wikipedia.org/wiki/Missing_fundamental#Audio_processing_applications) para hacer audibles frecuencias que no pueden ser reproducidas físicamente por los altavoces, extendiendo la respuesta de frecuencia percibida del sistema.
- [Compensación de volumen de igual sonoridad](https://en.wikipedia.org/wiki/Equal-loudness_contour), para que el sonido no se vuelva notablemente metálico cuando se reduce el volumen maestro del sistema.

Estas son todas técnicas que están en uso generalizado en sistemas de microaltavoces de consumo en tabletas y teléfonos, aunque lamentablemente no son comunes en portátiles de la mayoría de las marcas no-Apple. Todos estos trucos de procesamiento también son utilizados por macOS.

Nuestro objetivo explícitamente *no* es clonar la experiencia de audio completa/exacta de macOS. Consideramos que el procesamiento DSP de altavoces de macOS es demasiado forzado; algunas de las cosas que hace funcionan bien, algunas no (¡o son directamente defectuosas!), y algunas son simplemente extrañas. Aunque el audio es en última instancia subjetivo, y reconocemos que algunas personas podrían preferir el "sonido de macOS", apuntamos a un sonido más objetivamente neutral y equilibrado que macOS como línea base. Se anima a los usuarios a intentar agregar sus propios efectos (por ejemplo, con EasyEffects) si quieren personalizar su experiencia y lograr ciertos perfiles sonoros. Creemos que una línea base equilibrada que permite a los usuarios dar forma al sonido según sus propias preferencias si así lo desean es una mejor opción que codificar efectos específicos (como el procesamiento de audio espacial de macOS) sin opción para desactivarlos. No hay una forma amigable para el usuario (GUI) de modificar o ajustar nuestras cadenas DSP, por lo que es mejor si los efectos adicionales se dejan a utilidades existentes como EasyEffects que pueden ser fácilmente personalizadas por el usuario.

Dicho esto, para los tipos de procesamiento que *sí* pretendemos aplicar, fallar en funcionar correctamente donde macOS lo hace (por ejemplo, calidad de audio objetivamente mala para ciertos tipos de entradas en particular, como compresión de mal sonido o distorsión a volúmenes altos donde macOS suena mejor a un volumen de salida igual) se considera un error. No dudes en reportar problemas si encuentras casos de prueba donde macOS hace un trabajo claramente mejor. Estamos hablando particularmente de problemas dependientes del programa aquí, no de "me gusta mejor el EQ/espacial/cualquier cosa de macOS en general".

## Soporte de "Smart Amp" / seguridad

Además del procesamiento DSP, también tenemos la primera implementación de "smart amp" de código abierto (que sepamos). Esto permite que los altavoces sean conducidos a niveles pico mucho más altos que el nivel de volumen seguro del peor caso, extendiendo enormemente su rango dinámico. Nuestra implementación, [speakersafetyd](https://github.com/AsahiLinux/speakersafetyd), monitorea señales de retroalimentación de los amplificadores, estima la temperatura de la bobina de voz del altavoz usando un modelo térmico de dos etapas, y reduce los volúmenes de hardware de los altavoces cuando estos se calientan demasiado. También tenemos interbloqueos del lado del kernel para deshabilitar o limitar los volúmenes de los altavoces si speakersafetyd no está en ejecución o no responde.

En este momento, estamos enviando con un límite de reducción de volumen duro de -7dBFS para detectar posibles errores o mal comportamiento. Si notas que tus altavoces se cortan durante aproximadamente un segundo y luego vuelven a un nivel de volumen reducido, es probable que hayas activado este límite de seguridad. Detén la reproducción para dejar que los altavoces se enfríen (por si acaso) y que el límite se reactive, y luego verifica `/var/lib/speakersafetyd/blackbox` para ver si hay volcados de blackbox y [reporta un error]() adjuntándolos junto con cualquier registro de speakersafetyd (prueba `journalctl -S '10m ago' -u speakersafetyd`). Si reproduces tonos de prueba a escala completa o música "extrema" a volumen máximo, es de esperar que alcances este límite y actives un volcado de blackbox / pánico. Esto está destinado a ayudar a detectar cualquier problema mientras se reproduce música normal, y eliminaremos este límite conservador una vez que estemos seguros de la pila de software (speakersafetyd tiene otros límites de seguridad incorporados y ganará más con el tiempo).

Puedes ver speakersafetyd en acción usando `sudo journalctl -fu speakersafetyd`. Como regla general, con el volumen del altavoz al máximo, deberías esperar que speakersafetyd no se active cuando reproduces música normalizada en sonoridad (por ejemplo, YouTube). Reproducir música excesivamente fuerte sin normalización (por ejemplo, aumentar el volumen de la aplicación del navegador al 100% en el applet de Plasma mientras usas YouTube, lo que evita el límite de normalización que aplica, o usar reproductores multimedia sin normalización) probablemente activará alguna reducción de ganancia de speakersafetyd, pero no debería alcanzar el límite de pánico de -7 dB a menos que sea algo [ridículo](https://open.spotify.com/album/6uvGw7zcCyMzYKKqXp9D3z).

**ADVERTENCIA:** Los modelos de seguridad de altavoces aún no han sido completamente validados en todos los modelos. Estamos habilitando el audio solo en modelos donde estamos seguros de que las cosas están listas y son seguras de usar. Si usas cualquier anulación no documentada para forzar la habilitación de altavoces en cualquier otro modelo de máquina, **estás completamente por tu cuenta** y podrías muy bien explotar tus altavoces.

## Notas de integración de distribución

Requisitos según el [README.md](https://github.com/AsahiLinux/asahi-audio/blob/main/README.md) de [asahi-audio](https://github.com/AsahiLinux/asahi-audio).

El orden correcto de despliegue es asahi-audio/speakersafetyd > (lo que uses para que esos se instalen para los usuarios, por ejemplo, metapaquete) > kernel. Si envías el kernel primero antes que asahi-audio, los usuarios obtendrán un dispositivo de altavoz sin procesar que es no funcional (si no hay speakersafetyd) o funcional pero de mal sonido (si speakersafetyd está instalado) sin DSP.

# Soporte de Micrófono

Modelos actualmente soportados:

 * MacBook Pro 13" (M1/M2)
 * MacBook Air 13" (M1/M2)
 * MacBook Pro 14" (M1 Pro/Max, M2 Pro/Max)
 * MacBook Pro 16" (M1 Pro/Max, M2 Pro/Max)
 * MacBook Air 15" (M2)

Los MacBooks tienen tres micrófonos de Modulación de Densidad de Pulsos (PDM) conectados a un ADC
y decimador en el AOP. Los tres micrófonos se conectan directamente al espacio de usuario en
canales separados, sin preamplificación.

Son muy sensibles y omnidireccionales, por lo que para poder usarlos, se necesita
aplicar algún tipo de formación de haz.

Para esto, se construyó [Triforce](https://github.com/chadmed/triforce),
implementando un formador de haz adaptativo de Respuesta Sin Distorsión de Varianza Mínima.

`asahi-audio` incluye la configuración necesaria de wireplumber para configurar esto.

## Errores Conocidos

### Requiere `os-fw-version` > 13.5
El soporte de micrófono actualmente solo funciona si tu `asahi,os-fw-version` es >= 13.5.
Esto se debe a que `BOOTARGS_OFFSET` y `BOOTARGS_SIZE` son diferentes en `12.4`.

Si tu `/proc/device-tree/chosen/asahi,os-fw-version` muestra una versión anterior, y ves un

```
apple_aop 24ac00000.aop: probe with driver apple_aop failed with error -22
```

en dmesg, se necesita una actualización del contenedor APFS (o agregar soporte para la
versión anterior al controlador del kernel).

### Problemas de sondeo en Macbook Pro 14" M2 (J414)
Ha habido informes sobre el Macbook Pro 14" M2, donde el AOP no hace sondeo
correctamente y el soporte de micrófono no funciona.

### Indicador de micrófono constantemente activo
Con el soporte de micrófono configurado, `gnome-shell` y `plasma` reportan permanentemente
que el micrófono está siendo usado.

Esto se debe a que wireplumber reporta que tiene un handle abierto en un "dispositivo
de micrófono".

Arreglar esto probablemente requiere reestructurar muchos conceptos como nodos y
handles en Pipewire / Wireplumber. 