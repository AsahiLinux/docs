---
title: Aceleradores de Apple Silicon
---

El SoC tiene varias unidades aceleradoras integradas, esta es una lista útil de los nombres y a qué se refieren. La mayoría de los aceleradores ejecutan firmware que se puede encontrar en la partición pre-boot `/System/Volumes/Preboot/[UUID]/restore/Firmware`, empaquetado como archivos im4p que pueden extraerse con <https://github.com/19h/ftab-dump/blob/master/rkos.py> y algo de dd.

*Actualización: ninguno de los im4p de ANE, AVE, ADT se extraen con eso. No estoy seguro de cuáles sí. Es mejor seguir los pasos de extracción de im4p en [ADT](../../fw/adt.md). ¿Podemos hacer una matriz de progreso con respecto al firmware?

## Nombres

Los nombres pueden formatearse de las siguientes maneras dependiendo de su oficialidad:
* Nombres entre comillas con un signo de interrogación como: "<nombre>?" son invenciones/origen incierto.
* Nombres en **negrita** como: **<nombre>** se encuentran en la documentación oficial de Apple.
* Nombres en *cursiva* como: *<nombre>* son nombres no oficiales comunes o tienen fuentes inciertas pero seguras.

### A
* **AGX**: "¿Apple Graphics? ¿Accel(x)lerator?" (vía `gfx`) El nombre interno para la serie de GPU de Apple.
* **AMX**: *Apple Matrix eXtensions*. Un coprocesador de matrices parcialmente integrado en el ISA.
* **ANE**: **Apple Neural Engine** Aceleración de ejecución de redes neuronales basada en convoluciones. Piensa en el TPU de Google.
* **AOP**: **Always On Processor**. Activación de "hey siri" y "otras cosas de sensores".
* **APR**: **APR ProRes**. Maneja la codificación y decodificación de video ProRes.
* **AVE**: **AVE Video Encoder**. Maneja la codificación de video. Presumiblemente la A es por Apple [cita necesaria], pero veo un acrónimo recursivo.
* **AVD**: **AVD Video Decoder**. Maneja la decodificación de video. ^

### D
* **DCP**: "¿Display Compression Processor?/¿Display Control Processor?". Control de Displayport/Pantalla de algún tipo.

### P
* **PMP**: "¿Power Management Processor?". Maneja la funcionalidad de energía.

### S
* **SEP**: **Secure Enclave Processor**. El dispositivo HSM/TPM/etc integrado del M1. Maneja Touch ID y la mayoría de la criptografía, así como decisiones de política de arranque. Inofensivo para Linux, pero podemos usar sus características si queremos. Contrastar con AP. 