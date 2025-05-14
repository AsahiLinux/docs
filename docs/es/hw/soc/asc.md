---
title: ASC
---

## Registros ASC

```
0x40 - algunos flags/control

0x44 - CPU_CTRL
    4 - CPU_START

0x48 - CPU_STATUS
    5 - MBOXES_TO_AP_EMPTY
    4 - ?
    3 - FIQ_NOT_PENDING
    2 - IRQ_NOT_PENDING
    1 - CPU_STOPPED
    0 - CPU_IDLE
    
0x400
    10 - se establece cuando la CPU se inicia (probablemente por firmware)
    
0x80c - IRQ_CONFIG
    0 - IRQ_CONTROLLER_ENABLE

0x818 - IRQ_EVENT_IRQ?
0x820 - IRQ_EVENT_FIQ?

0xa00.. - IRQ_MASK_SET
0xa80.. - IRQ_MASK_CLEAR
0xb00.. - IRQ_MASK2_SET?
0xb80.. - IRQ_MASK2_CLEAR?

0x1000 - CFG?
    1 - ¿IPIs a IRQ, no FIQ?
0x1010 - A_SET
0x1014 - B_SET
0x1018 - A_CLR
    2 - ¿dispara IPI FIQ?
    1 - ¿dispara IPI IRQ?
0x101c - B_CLR

0x1030 - C_SET
0x1034 - D_SET
0x1038 - C_CLR
0x103c - D_CLR

0x8000 - ¿espejo de CPU_STATUS?

0x4000~ y 0x8000~ son cosas de buzón
```

## Buzones

La comunicación entre los núcleos CPU principales del M1 y los ASCs/IOPs (procesadores de I/O) utiliza buzones de hardware para enviar notificaciones de 128 bits de ida y vuelta entre los procesadores, además de mensajes más grandes enviados usando memoria compartida. El protocolo habitual es que uno de los procesadores escribe en la memoria compartida, luego envía una notificación por buzón al otro procesador que dispara una interrupción que hace que el otro procesador examine la memoria modificada e interprete un mensaje más grande.

Aunque los protocolos difieren entre procesadores, un elemento común parece ser que los 8 bits de menor orden de la segunda mitad de 64 bits del mensaje codifican el endpoint en el lado IOP del mensaje. Los primeros 64 bits parecen ser pasados por el buzón sin más cambios y se utilizan codificaciones muy diferentes para ellos.

El lado hardware del buzón se encuentra en el offset +0x8000 en el espacio MMIO, y utiliza cuatro interrupciones numeradas consecutivamente en el [AIC](aic.md), dos de las cuales nos son útiles.

Los datos se envían desde la CPU principal al IOP cuando dos escrituras de 64 bits apuntan a los offsets +0x8800 y +0x8808. Una vez que el IOP lee los datos y los elimina de la cola, la interrupción con el número más bajo en el AIC se disparará hasta que se deshabilite o se escriban más datos.

Los datos del IOP son leídos por la CPU principal, y eliminados de la cola, realizando lecturas MMIO de 64 bits en los offsets +0x8830 y +0x8838. Mientras hay datos disponibles, la interrupción con el número más alto en el AIC se disparará.

Un registro de estado de 32 bits en +0x8110 indica si la cola CPU-a-IOP está vacía (bit 17) o no vacía (bit 16). Simétricamente, el registro de estado en +0x8114 indica si la cola IOP-a-CPU está vacía (bit 17) o no vacía (bit 16).

Es posible que varios mensajes estén en cola en la misma dirección al mismo tiempo, y esto es utilizado por IOPs que envían más de una notificación a la CPU sin esperar un acuse de recibo. 