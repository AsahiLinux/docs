---
title: Controlador de Interrupciones de Apple (AIC)
---

AIC es el Controlador de Interrupciones de Apple. Estas son algunas notas dispersas de ingeniería inversa.

A Apple le gusta usar un estilo particular de par de registros SET/CLR:

* SET: lee el estado actual, escribe bits establecidos a 1
* CLR: lee el estado actual, escribe bits de limpieza a 1

## Registros

```
0000~ cosas globales
  0004: ¿NR_IRQ?
  0010: ¿GLOBAL_CFG? (bits impl: f8fffff1)
2000~ acks de interrupción, IPIs, etc

3000~ IRQ_TGT (1 por reg, campo de bits CPU cada reg)
4000~ SW_GEN_SET (campos de bits)
4080~ SW_GEN_CLR (campos de bits)
4100~ IRQ_MASK_SET (campos de bits)
4180~ IRQ_MASK_CLR
4200~ HW_IRQ_MON (¿estado actual de línea de interrupción?)

8020 Bits bajos de 32 de MSR CNTPCT_EL0 (temporizador del sistema)
8028 Bits altos de 32 de MSR CNTPCT_EL0 (temporizador del sistema)

Acceso espejo al estado por núcleo para el núcleo CPU actual:
2004 IRQ_REASON
2008 IPI_SEND - Envía un IPI, bits 0..<31 envían un IPI "otro" a una CPU, bit 31 envía un IPI "propio" a esta CPU
200c IPI_ACK  - Acusa recibo de un IPI, bit 0 acusa recibo de un IPI "otro", y bit 31 acusa recibo de un IPI "propio"
2024 IPI_MASK_SET - Bits de máscara para IPIs corresponden al mismo tipo y posición de los bits para IPI_ACK
2028 IPI_MASK_CLR

TODO Documentar acceso directo a offsets de estado por núcleo
```

## Uso

Flujo de IPI:

* Escribir bit en IPI_SEND
* IRQ ARM activada
* Leer IRQ_REASON
    * IPI está enmascarado en IPI_MASK
    * IRQ ARM se desactiva
* Escribir bit en IPI_ACK
* Escribir bit en IPI_MASK_CLR
    * IPI se desenmascara
    * si IPI_ACK no se limpió, IRQ ARM se reactivaría aquí

Flujo de IRQ de hardware:

* Establecer campo de bits objetivo en IRQ_TGT
* Escribir bit en IRQ_MASK_CLR
* (más tarde) IRQ de hardware activada
* Leer IRQ_REASON
    * IRQ_MASK se establece automáticamente
    * IRQ ARM se desactiva
* (limpiar la IRQ en el hardware específico)
* Escribir bit en IRQ_MASK_CLR
    * IRQ se desenmascara
    * si la línea de hardware no se limpió, IRQ ARM se reactivaría aquí

¿Hay 11 objetivos? CPUs 0-7 y algunos auxiliares?
        
Los bits establecidos en SW_GEN se combinan con OR con las líneas IRQ de hardware

## Temporizador

El temporizador del sistema es el estándar MSR de ARM64, y evita AIC. Está conectado directamente a FIQ. 