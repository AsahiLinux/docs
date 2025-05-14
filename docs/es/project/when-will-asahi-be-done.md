---
title: ¿Cuándo estará terminado Asahi?
---

Si estás buscando el estado de soporte de una característica específica, [Soporte de Características](../platform/feature-support/overview.md) tiene una lista de todo el hardware principal incluido en las Mac con Apple Silicon, así como su nivel de soporte.

## Por qué no deberías hacer esta pregunta en IRC

Si preguntas en cualquiera de nuestros canales IRC cuándo estará terminado Asahi Linux, probablemente recibirás una de estas respuestas, o una variante de ellas:

* "Pronto"
* "Ya funciona"
* "Nunca"

Todas estas son en realidad correctas, y la confusión sembrada por tener todas estas respuestas correctas lanzadas hacia ti probablemente solo te dará un dolor de cabeza.

## Por qué todas son correctas
El problema con preguntar sobre el "estado de terminación" en una comunidad tan amplia es que la idea de "terminado" es diferente para cada persona. Tenemos una gran comunidad de desarrolladores, probadores y usuarios entusiastas de diversos orígenes, todos los cuales tienen diferentes expectativas del proyecto.

### "Pronto"
Para un usuario final que usa una distribución Just Works<sup>TM</sup>, Asahi Linux podría no estar "terminado" hasta que puedan iniciar el instalador de su distribución favorita desde una memoria USB y ejecutar su procedimiento de instalación como lo harían en una máquina amd64. Probablemente también esperan que características como aceleración 3D, modesetting, WiFi, Bluetooth, Thunderbolt, etc. funcionen directamente. Para que todo esto sea así, todos los parches relevantes del kernel tienen que ser aceptados upstream y luego incorporados al kernel genérico de la distribución y la máquina particular del usuario debe tener soporte en U-Boot. Considerando que al momento de escribir esto, muchos de estos controladores ni siquiera han sido enviados a `linux-asahi`, este punto probablemente está bastante lejos. Para las personas que esperan tales cosas, Asahi Linux probablemente no estará "terminado" por otro año, tal vez dos.

### "Ya funciona"
A continuación, consideramos el caso de alguien que está probando activamente controladores de última generación en `linux-asahi`. Alguien así puede estar esperando ansiosamente una sola característica o conjunto de características para probar lo que estas máquinas pueden hacer. Por ejemplo, alguien podría estar esperando una aceleración 3D adecuada para ver qué tan buena es la GPU en ciertas cargas de trabajo sin el cuello de botella de traducir primero a Metal. Otra persona podría querer probar usando el Mac Mini como una máquina de compilación en red, para lo cual probablemente solo querría redes, pstates y un controlador `cpufreq`. Para personas como estas, "terminado" podría muy bien significar cuando la característica específica que requieren llegue a la rama del kernel `linux-asahi`. Eso puede ser hoy, mañana, pronto, o puede que ni siquiera esté en la lista de cosas a considerar.

### "Nunca"
Finalmente, consideramos la perspectiva del desarrollador. El desarrollo para una plataforma no documentada es una cinta de correr de trabajo. Cada nueva característica requiere ingeniería inversa del hardware relevante, escribir controladores, probar esos controladores y luego hacerlos upstream. Incluso después de que un controlador está upstream, a veces se requiere mantenimiento y optimización, por ejemplo, si Apple introduce un cambio que rompe cualquier firmware con el que debamos interactuar. Para los desarrolladores, el trabajo nunca está realmente terminado, sin embargo, una especie de "estado de terminación" coloquial que usamos por aquí para decidir qué trabajo tiene prioridad es cuando un controlador se completa hasta un nivel de calidad donde es aceptado para fusionarse upstream.

## Lo que esto significa para ti
Nadie puede realmente decidir cuándo Asahi Linux está "terminado" excepto tú. Tu caso de uso, habilidad técnica, ambición y tolerancia al riesgo son tuyos. Como el trabajo de desarrollo está en curso, probablemente nunca tendremos una fecha oficial de "terminación" para que vivas por ella, así que tu mejor opción es usar tu propio juicio y la lista de características en [Soporte de Características](../platform/feature-support/overview.md) para decidir si es el momento adecuado para que pruebes Linux en Apple Silicon.

## Una nota sobre nuevo hardware
El tiempo que nos toma poner en línea nuevo hardware depende completamente de los cambios que Apple haga a ese subsistema particular en nuevas revisiones de silicio. Los bloques de construcción básicos del SoC probablemente seguirán funcionando Just Works<sup>TM</sup> durante mucho tiempo en muchas máquinas nuevas sin cambios, y otras cosas pueden requerir controladores totalmente nuevos y más trabajo en ingeniería inversa.

Apple nos hace las cosas algo más fáciles al introducir cambios en el hardware solo cuando es absolutamente necesario hacerlo. La iteración original del AIC (Apple Interrupt Controller) no cambió desde los primeros iPhones hasta el M1. Esperamos que AIC2, encontrado por primera vez en el M1 Pro y Max, tenga una vida útil similar, si no más larga. En general, los cambios en cualquier pieza de hardware serán soportados en menos tiempo que el que tomó inicialmente poner en marcha el hardware.

Los grandes cambios arquitectónicos en cosas como la GPU y el Neural Engine pueden tomar un poco más de tiempo para entenderlos. Como tal, no podemos garantizar fechas o tiempos de respuesta para cualquier nuevo lanzamiento de silicio de Apple. La respuesta a la pregunta "¿Cuándo será soportada [_característica_] en [_máquina_]?" es siempre "Cuando esté listada como soportada en la documentación." 