---
title: Temporizador de Vigilancia (WDT)
---

El M1 incluye un temporizador de vigilancia que puede reiniciar el sistema automáticamente en caso de que el kernel falle al arrancar o funcionar correctamente. También puede ser (ab)usado para provocar un reinicio inmediato o retrasado en otras circunstancias.

El macho inicial (generalmente m1n1) se arranca con el temporizador de vigilancia habilitado, por lo que si no hace nada con él, el sistema se reiniciará automáticamente después de un tiempo.

Hay un temporizador de 24MHz de 32 bits en 0x23d2b0000+0x10, un valor de comparación en 0x23d2b0000+0x14 (inicialmente establecido en 120 segundos), y un registro de control en 0x23d2b0000+0x1c. Cuando el temporizador excede o iguala el valor de comparación, y el bit 0x04 en el registro de control está establecido, se provoca un reinicio.

El WDT se deshabilita escribiendo 0 en +0x1c, y se habilita escribiendo 4 en +0x1c.

Dado que los contadores son valores de 32 bits y se desbordan, eso significa que el tiempo máximo de espera es de poco menos de tres minutos.

Los registros 0x23d2b0000+0x0/0x4/0xc y 0x23d2b0000+0x20/0x24/0x2c parecen funcionar como +0x10,+0x14,0x1c, pero provocan un reinicio en modo de recuperación en su lugar. 