---
title: ACE3
---

ACE3 es el nuevo controlador USB-C / USB-PD en los productos M3. Tiene un valor compatible con sn201202x en el ADT.

## Transporte SPMI

A diferencia de sus predecesores, el ACE3 se accede a través de SPMI en lugar de I2C. Sin embargo, la interfaz subyacente no ha cambiado, una capa delgada de transporte permite acceder a lo que anteriormente eran registros I2C (a los que nos referiremos como "registros lógicos") a través de los registros SPMI.

- **0x00 (dirección del registro lógico) [RW]:** escribir `0x80 | dirección_registro_lógico` en este registro SPMI iniciará un proceso de selección de registro lógico, actualizando los registros SPMI a continuación. Una vez que la selección haya terminado, el MSB se borrará.

  Nota 1: El comando SPMI "escritura de registro 0" también se puede usar, porque el valor de 7 bits se completa con MSB=1 y por lo tanto activará una selección de registro lógico.
  Nota 2: Las escrituras con MSB=0 actualizarán el valor del registro, pero no seleccionarán un nuevo registro.

- **0x1F (tamaño del registro lógico) [RO]:** cuando se selecciona un registro lógico, su tamaño en bytes se escribe aquí.

- **0x20..0x5F (datos del registro lógico) [RW]:** cuando se selecciona un registro lógico, sus datos se leen, se rellenan con ceros y se escriben aquí. Las escrituras en cualquier parte de esta área hacen que el contenido del área se escriba (truncado según corresponda) en el último registro lógico seleccionado.

  Nota 1: No parece haber una forma de monitorear la finalización de una escritura de registro lógico, pero parece bloquear selecciones posteriores.
  Nota 2: No parece haber una forma de retrasar la escritura del registro lógico hasta más tarde, por lo que solo los registros lógicos de tamaño ≤ 16 pueden escribirse de forma atómica.

Otras observaciones:

- Solo las primeras 0x60 direcciones están mapeadas, pero los bits de dirección 7 y superiores parecen ser ignorados, causando que el bloque se alias cada 0x80 bytes. Se pueden acceder muchos registros SPMI consecutivos a la vez usando comandos extendidos (o extendidos largos).

- El dispositivo también soporta comandos de suspensión y activación, y está en suspensión al arrancar. Cuando está en suspensión, las escrituras son ACK pero ignoradas. El dispositivo tarda un tiempo en activarse después de recibir el comando.

- Las interrupciones ya no se entregan a través de un pin GPIO, sino a través de la funcionalidad de interrupción del controlador SPMI. (No sé cómo funciona esto a nivel de bus, tal vez las interrupciones se activan mediante un comando de escritura maestro?)

- Por alguna razón, cada dispositivo parece tener dos esclavos SPMI (uno escuchando en la dirección del ADT, y otro en la siguiente). Cada esclavo mantiene su propia selección, y enviar comandos de suspensión/activación a cualquiera de ellos se refleja en ambos... excepto que el segundo esclavo parece ignorar los comandos de suspensión.

Estas observaciones se realizaron en un J516c, SN2012024 HW00A1 FW002.062.00. 