---
title: Guía de Desarrollador de m1n1
---

(Aún no escrito, solo agregando algunas cosas)

## Protocolo de arranque

El protocolo de arranque usado para imágenes m1n1 es un subconjunto trivial del protocolo de arranque de XNU. Los binarios raw pueden cargarse en cualquier lugar (en offsets alineados a 16K). El RVBAR está en el offset 0 (solo relevante para reanudar desde el modo de suspensión, debido a que iBoot bloquea ese registro). Las cargas útiles simplemente se concatenan al binario principal y se cargan junto con él. El punto de entrada está en 0x800 con traducción deshabilitada y la dirección física a la estructura [`boot_args`](https://github.com/AsahiLinux/m1n1/blob/main/src/xnuboot.h) de XNU en r0.

También hay imágenes Mach-O heredadas; estas actualmente solo son necesarias para versiones más antiguas de iBoot2 y para run_guest.py (TODO: arreglar eso). Estas son básicamente lo mismo con un encabezado Mach-O y la sección .bss recortada, ya que el archivo ya no se carga plano. Hay una sección de carga útil grande hackeada al final que se recorta a 0 bytes y "cuelga del final del archivo", para proporcionar espacio para que las cargas útiles se agreguen por concatenación. 