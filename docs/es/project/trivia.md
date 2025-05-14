---
title: Curiosidades de la Plataforma
---

Una lista de curiosidades aleatorias divertidas sobre esta plataforma y su legado.

# Legado del iPhone
## Mi M1 piensa que es un iPhone 5

Cuando un Mac Mini M1 se inicia sin una pantalla conectada, o incondicionalmente a partir de macOS 12.0, iBoot no inicializa la pantalla. En su lugar, crea un framebuffer falso de 640×1136. Esa es la resolución de pantalla del iPhone 5.

Entonces esto sucede:

![Framebuffer](../assets/m1_iphone_5_fb.png)

## Simplemente no puede soltar Samsung

El periférico de puerto serie en el M1 es ~idéntico al del SoC original del iPhone por Samsung (S5L8900), hasta el punto donde usamos el mismo controlador UART de Samsung en Linux. No sabemos si estos días es una reimplementación por Apple, o si todavía están licenciando la misma IP antigua de Samsung.

De hecho, la idea de que el Apple A4 fue el primer diseño "interno" por Apple es principalmente marketing. Los SoCs de Apple han estado liderando una lenta transición desde IP de terceros hacia IP de Apple, pero todavía usan muchos bloques de terceros. No hay una línea clara entre el diseño de terceros y el interno.

# Legado de PowerPC

## Registros ocultos

Los núcleos de CPU de Apple llaman a sus registros de configuración miscelánea/[chicken bit](https://en.wiktionary.org/wiki/chicken_bit) registros "HIDx", que significa registro "Hardware Implementation Dependent" (Dependiente de la Implementación de Hardware). Este nombre fue usado por primera vez por IBM en sus CPUs PowerPC para el mismo propósito.

## Volviendo al Power Mac G5

Los IOMMUs en los SoCs de Apple se llaman "DART"s. Esto significa "Device Address Resolution Table" (Tabla de Resolución de Direcciones de Dispositivo), que también era el nombre del IOMMU en el puente host U3H en sistemas Power Mac G5. Los detalles reales no están relacionados, sin embargo, así que no hay código compartido para esto; solo el nombre es el mismo.

## ¿Qué tienen en común un AmigaOne X1000 y una Mac M1?

El periférico I²C en el M1 y otros SoCs recientes de Apple es una versión modificada del periférico I²C en el chip PWRficient PA6T-1682M de P. A. Semi. Apple compró la empresa para iniciar su equipo de diseño de SoC/CPU, y decidió que un bloque de IP era lo suficientemente bueno como para mantenerlo. Esta es la misma CPU que se usa en el AmigaOne X1000, y extendimos el controlador Linux existente para soportar ambas plataformas.

# Legado de x86

## Mi M1 ejecuta código x86 nativamente

El chip puente DisplayPort a HDMI en el Mac Mini y MacBook Pros de 14"/16" (MDCP29xx) usa un núcleo de CPU V186. Ese es un clon del Intel 80186, ejecutando el buen código antiguo x86 de modo real de 16 bits. Sí, x86 de la era MS-DOS está en tu Mac.

# Atención al detalle

## ¡Ayúdame!

El [SecureROM](../fw/boot.md#stage-0-securerom) de la Mac es pequeño y no puede hacer mucho por sí mismo; en el Mac mini, no puede mostrar una imagen en la pantalla. Sin embargo, puede controlar el LED de encendido.
Si inicias la Mac en [modo DFU](glossary.md#d), el LED será ámbar en lugar de blanco.
Si inicias la Mac normalmente y el proceso de inicio temprano falla (por ejemplo, debido a una operación de restauración fallida), el LED de encendido será ámbar y parpadeará con el siguiente patrón: tres parpadeos cortos, tres parpadeos más largos, tres parpadeos cortos, una pausa, y repetir. ¡Eso es [código Morse para SOS](https://en.wikipedia.org/wiki/Morse_code#Applications_for_the_general_public)! La Mac está pidiendo silenciosamente ser salvada... 