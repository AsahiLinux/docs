## SMP spin-up

From the ADT:

* `/arm-io/pmgr[reg]` power manager registers
    * CPU start block at + 0x54000
* `/cpus/cpu<n>[cpu-impl-reg]` CPU implementation registers

CPU start registers in PMGR:

```
54004: System-wide CPU core startup/active bitmask
54008: Cluster 0 (e) CPU core startup
5400c: Cluster 1 (p) CPU core startup
```

### Startup sequence

* Write start address to RVBAR at `cpu-impl-reg + 0x00`
    * This is locked for cpu0 by iBoot, other CPUs are free to change
* Set (1 << cpu) in pmgr[54004]
    * This seems to be some kind of system-wide "core alive" signal. It is not
      required for the core to spin up, but without it AIC interrupts won't
      work, and probably other things.
* Set (1 << core) in pgr[54008 + 4*cluster] (that's core from 0-3, cluster 0-1)
    * This starts up the core itself.

Core starts up at RVBAR. Chicken bits / etc must be applied as usual.
