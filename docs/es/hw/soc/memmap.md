---
title: Mapa de Memoria T8103
---

# Mapa de memoria M1 (T8103)

(Incompleto)

```
0 00000000      sin mapear (fallos L2C)

== Apple Core Cluster (E) ==

2 10x10000 :    40000    cpu<x> coresight (tamaño probablemente incorrecto en adt)
2 10x40000 :    10000    cpu<x> uttdbg
2 10x50000 :    10000    cpu<x> impl reg

2 10e40000 :    10000    cpm impl reg
2 10f00000 :    50000    registros impl ACC

== Apple Core Cluster (P) ==

2 11x10000 :    40000    cpu<x> coresight (tamaño probablemente incorrecto en adt)
2 11x40000 :    10000    cpu<x> uttdbg
2 11x50000 :    10000    cpu<x> impl reg

2 11e40000 :    10000    cpm impl reg
2 11f00000 :    50000    registros impl ACC

== I2C ==

2 35010000 :     4000    I2C0 (controladores Type C)
2 35014000 :     4000    I2C1 (amplificador de altavoz)
2 35018000 :     4000    I2C2 (códec de audio)

== UARTs ==

2 35200000 :     4000    UART0 (consola de depuración)
2 35204000 :     4000    UART1? (¿no está en adt?)
2 35208000 :     4000    UART2 (depuración wlan)

== AIC ==

2 3b100000 :     c000    AIC

== PMGR ==

2 3b700000 :   100000    PMGR

== GPIO ==

2 3c100000 :   100000    GPIO

== WDT ==

2 3d2b0000 :     4000    WDT

== DRAM ==

8 00000000 :  (8/16G)    DRAM principal (¡cuidado con las reservas!)
