## SMP spin-up

From the ADT:

* `/arm-io/pmgr[reg]` power manager registers
    * CPU start block is at a device-dependent offset to this register
        * 0x30000 for A8(X)
        * 0xd4000 for A9(X)-A11
        * 0x54000 for M1 series
        * 0x34000 for M2 and M3
        * 0x28000 for M2 Pro/Max
        * 0x88000 for M3 Pro/Max
    * For multi-die systems, each die has its own power manager registers.
      The power manager registers for each die is at offset 
      `die * 0x2000000000` from the registers of die 0.
* `/cpus/cpu<n>[cpu-impl-reg]` CPU implementation registers
     * Bits [0:7] holds the core id
     * Bits [8:10] holds the cluster id
     * Bits [11:14] holds the die id

The cluster id in the cpu-impl-reg is possibly only for CPU start purposes.
On A11 the cluster id field is both 0 for P and E CPUs, which conflicted with
the `/cpus/cpu<n>[cluster-id]` property in the ADT.

CPU start registers in PMGR:

```
offset + 0x4: System-wide CPU core startup/active bitmask
offset + 0x8: Cluster 0 (e) CPU core startup
offset + 0xc: Cluster 1 (p) CPU core startup
```

### Startup sequence

* Write start address to RVBAR at `cpu-impl-reg + 0x00`
    * This is locked for cpu0 by iBoot, other CPUs are free to change
* Set (1 << cpu) in `pmgr[offset + 0x4]`
    * This seems to be some kind of system-wide "core alive" signal. It is not
      required for the core to spin up, but without it AIC interrupts won't
      work, and probably other things.
* Set (1 << core) in `pmgr[(offset + 0x8) + 4*cluster]` (that's core from 0-3, cluster 0-1)
    * This starts up the core itself.

Core starts up at RVBAR. Chicken bits / etc must be applied as usual.
