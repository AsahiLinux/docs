---
title: Registros de Depuración del Procesador de Aplicación
summary:
  Registros de depuración encontrados en núcleos ARM diseñados por Apple
---

Los diversos núcleos de CPU exportan entradas en el [ADT](../../fw/adt.md) que sugieren la existencia de registros de depuración. La cadena "coresight" aparece, y los archivos de registro coresight se desbloquean escribiendo `0xc5acce55` en el desplazamiento `0xfb0`, que es también lo que hace el código de inicio de CPU de Corellium. El registro de estado de bloqueo está en `0x210030fb4` para CPU0.

El PC de CPU0 se puede leer en `0x210040090` (los desplazamientos usuales se aplican a los otros núcleos), pero los otros registros no parecen tener apariciones obvias. 