`perf stat` works on Asahi Linux on bare metal, using Apple's proprietary performance counters (which are supported in the kernel).

Since this is a big.LITTLE system, there are some caveats. Profiling across core types is confusing, so you should pin your task to one core type. And since performance counters can differ per core type, you have to explicitly qualify counters with the core type when you specify them.

For example, to profile `echo` on core 4 (a big Firestorm core on all M1 variants):

    $ taskset -c 4 perf stat -e apple_firestorm_pmu/cycles/ -e apple_firestorm_pmu/instructions/ echo

    Performance counter stats for 'echo':

            116,874      apple_firestorm_pmu/cycles/u                                   
            181,687      apple_firestorm_pmu/instructions/u                                   

        0.000352959 seconds time elapsed

        0.000000000 seconds user
        0.000357000 seconds sys

On core 0 (a LITTLE Icestorm core on all M1 variants):

    $ taskset -c 0 perf stat -e apple_icestorm_pmu/cycles/ -e apple_icestorm_pmu/instructions/ echo

    Performance counter stats for 'echo':

            185,564      apple_icestorm_pmu/cycles/u                                   
            181,669      apple_icestorm_pmu/instructions/u                                   

        0.000491126 seconds time elapsed

        0.000510000 seconds user
        0.000000000 seconds sys

Note how Icestorm gets ~1 IPC while Firestorm gets ~1.6 IPC in this example; this is why you have to pin your tasks to get meaningful numbers. You can technically not pin your task and specify all counters, and then you will get independent counts for how many cycles/instructions were spent on each core type (aggregated across all cores of that type). Whether this is actually useful to anyone is unclear.

This will never work in a VM, because Apple do not support the standard ARM performance counters (they use a custom PMU) and they do not expose proprietary features to VM guests (and nor will KVM/qemu for that matter). But it does work on bare metal (and on the m1n1 hypervisor, though benchmarking on it is probably a very bad idea).

You can also get more counters other than cycles/instructions, by specifying the raw event IDs. These are not currently mapped to friendly names in Linux, but you can use `r<hex ID>`. Dougall has documented a bunch of them [here](https://github.com/dougallj/applecpu/blob/main/timer-hacks/bench.py#L85). For example, to get DCACHE_LOAD_MISS:

    $ taskset -c 4 perf stat -e apple_firestorm_pmu/rbf/ echo  

    Performance counter stats for 'echo':

                3,136      apple_firestorm_pmu/rbf/u                                   

        0.000288042 seconds time elapsed

        0.000301000 seconds user
        0.000000000 seconds sys

Note that it is not guaranteed that all of these will be the same across big/LITTLE cores, and some will differ with newer core types.