---
title: Multiprocesamiento Simétrico (SMP)
summary:
  Rutina de inicialización del procesador de aplicación secundario para SoCs
  Apple Silicon
---

## Arranque SMP

Desde el ADT:

* `/arm-io/pmgr[reg]` registros del gestor de energía
    * El bloque de inicio de CPU está en un desplazamiento dependiente del dispositivo a este registro
        * 0x30000 para A7-A8(X)
        * 0xd4000 para A9(X)-A11, T2
        * 0x54000 para serie M1
        * 0x34000 para M2 y M3
        * 0x28000 para M2 Pro/Max
        * 0x88000 para M3 Pro/Max
    * Para sistemas multi-die, cada die tiene sus propios registros del gestor de energía.
      Los registros del gestor de energía para cada die están en el desplazamiento 
      `die * 0x2000000000` desde los registros del die 0.
* `/cpus/cpu<n>[cpu-impl-reg]` registros de implementación de CPU
* `/cpus/cpu<n>[reg]` información de inicio de CPU
     * Bits [0:7] contienen el id del núcleo
     * Bits [8:10] contienen el id del cluster
     * Bits [11:14] contienen el id del die

A11 no maneja los clusters correctamente, por lo que tanto las CPUs P como E se consideran cluster 0.
Las CPUs E son 0-3 mientras que las CPUs P son 4-5.

Para firmwares antiguos, `/cpus/cpu<n>[cpu-impl-reg]` puede no existir, en este caso
`/arm-io/reg[2*n+2]` se puede usar para encontrar la ubicación donde escribir la dirección de inicio.

Registros de inicio de CPU en PMGR:

```
offset + 0x4: Máscara de bits de inicio/activo de núcleos de CPU a nivel de sistema
offset + 0x8: Inicio de núcleos de CPU del cluster 0 (e)
offset + 0xc: Inicio de núcleos de CPU del cluster 1 (p)
```

### Secuencia de inicio

* Escribir dirección de inicio en RVBAR en `cpu-impl-reg + 0x00`
    * Esto está bloqueado para cpu0 por iBoot, otras CPUs son libres de cambiar
* Establecer (1 << cpu) en `pmgr[offset + 0x4]`
    * Esto parece ser algún tipo de señal de "núcleo activo" a nivel de sistema. No es
      requerido para que el núcleo arranque, pero sin él las interrupciones AIC no
      funcionarán, y probablemente otras cosas.
* Establecer (1 << core) en `pmgr[(offset + 0x8) + 4*cluster]` (eso es core de 0-3, cluster 0-1)
    * Esto inicia el núcleo en sí.

El núcleo arranca en RVBAR. Los bits chicken / etc deben aplicarse como de costumbre. 