---
title: Perfilado de Software Linux
---

`perf stat` funciona en Asahi Linux en metal desnudo, usando los contadores de rendimiento propietarios de Apple (que están soportados en el kernel).

Dado que este es un sistema big.LITTLE, hay algunas advertencias. El perfilado a través de tipos de núcleos es confuso, así que deberías fijar tu tarea a un tipo de núcleo. Y dado que los contadores de rendimiento pueden diferir por tipo de núcleo, tienes que calificar explícitamente los contadores con el tipo de núcleo cuando los especifiques.

Por ejemplo, para perfilar `echo` en el núcleo 4 (un núcleo grande Firestorm en todas las variantes M1):

    $ taskset -c 4 perf stat -e apple_firestorm_pmu/cycles/ -e apple_firestorm_pmu/instructions/ echo

    Performance counter stats for 'echo':

            116,874      apple_firestorm_pmu/cycles/u                                   
            181,687      apple_firestorm_pmu/instructions/u                                   

        0.000352959 seconds time elapsed

        0.000000000 seconds user
        0.000357000 seconds sys

En el núcleo 0 (un núcleo pequeño Icestorm en todas las variantes M1):

    $ taskset -c 0 perf stat -e apple_icestorm_pmu/cycles/ -e apple_icestorm_pmu/instructions/ echo

    Performance counter stats for 'echo':

            185,564      apple_icestorm_pmu/cycles/u                                   
            181,669      apple_icestorm_pmu/instructions/u                                   

        0.000491126 seconds time elapsed

        0.000510000 seconds user
        0.000000000 seconds sys

Nota cómo Icestorm obtiene ~1 IPC mientras que Firestorm obtiene ~1.6 IPC en este ejemplo; es por esto que tienes que fijar tus tareas para obtener números significativos. Técnicamente puedes no fijar tu tarea y especificar todos los contadores, y entonces obtendrás conteos independientes de cuántos ciclos/instrucciones se gastaron en cada tipo de núcleo (agregados a través de todos los núcleos de ese tipo). Si esto es realmente útil para alguien no está claro.

Esto nunca funcionará en una VM, porque Apple no soporta los contadores de rendimiento estándar de ARM (usan un PMU personalizado) y no exponen características propietarias a invitados de VM (ni lo hará KVM/qemu por cierto). Pero sí funciona en metal desnudo (y en el hipervisor m1n1, aunque hacer benchmarking en él probablemente sea una muy mala idea).

También puedes obtener más contadores además de ciclos/instrucciones, especificando los IDs de eventos en bruto. Estos no están actualmente mapeados a nombres amigables en Linux, pero puedes usar `r<ID hexadecimal>`. Dougall ha documentado varios de ellos [aquí](https://github.com/dougallj/applecpu/blob/main/timer-hacks/bench.py#L85). Por ejemplo, para obtener DCACHE_LOAD_MISS:

    $ taskset -c 4 perf stat -e apple_firestorm_pmu/rbf/ echo  

    Performance counter stats for 'echo':

                3,136      apple_firestorm_pmu/rbf/u                                   

        0.000288042 seconds time elapsed

        0.000301000 seconds user
        0.000000000 seconds sys

Ten en cuenta que no está garantizado que todos estos sean los mismos a través de núcleos big/LITTLE, y algunos diferirán con tipos de núcleos más nuevos. 