---
title: SPRR and GXF
summary:
  SPRR and GXF are in-silicon security features used to harden macOS/Darwin
---


# Guarded execution

Guarded execution mode is a lateral exception level next to EL1 and EL2 which uses the same pagetables but different permissions (see SPRR). These levels are called GL1 and GL2. It's enabled with bit 1 in S3_6_C15_1_2.

The instruction `0x00201420` is genter and switches from EL to GL and sets the PC to `S3_6_C15_C8_1`.
`0x00201420` is gexit which returns to EL.

```
#define SYS_GXF_ENTER_EL1 sys_reg(3, 6, 15, 8, 1)
```

Guarded mode has a separate set of ELR, FAR, ESR, SPSR, VBAR and TPIDR registers just like EL1/2.
Additionally the ASPSR register indicates if gexit should return to GL or EL.

```
#define SYS_TPIDR_GL1 sys_reg(3, 6, 15, 10, 1)
#define SYS_VBAR_GL1 sys_reg(3, 6, 15, 10, 2)
#define SYS_SPSR_GL1 sys_reg(3, 6, 15, 10, 3)
#define SYS_ASPSR_GL1 sys_reg(3, 6, 15, 10, 4)
#define SYS_ESR_GL1 sys_reg(3, 6, 15, 10, 5)
#define SYS_ELR_GL1 sys_reg(3, 6, 15, 10, 6)
#define SYS_FAR_GL1 sys_reg(3, 6, 15, 10, 7)
```


# SPRR

SPRR takes the permission bits from pagetable entries and converts them into an attribute index similar to how MAIR works:

```
   3      2      1     0
 AP[1]  AP[0]   UXN   PXN
```

Note that UXN and PXN are flipped compared to APRR!

This is then used to index into a system register where each entry has four bits:


```
    3     2     1     0
  GL[1] GL[0] EL[1] EL[0]
```

GL/EL can be treated mostly separate but there are two exceptions where a specific GL permissions
modifies what the two EL bits usually mean.


| register value | EL page permissions | GL page permissions |
|-|-|-|
| `0000` | `---` | `---` |
| `0001` | `r-x` | `---` |
| `0010` | `r--` | `---` |
| `0011` | `rw-` | `---` |
| `0100` | `---` | `r-x` |
| `0101` | `r-x` | `r-x` |
| `0110` | `r--` | `r-x` |
| `0111` | `---` | `r-x` |
| `1000` | `---` | `r--` |
| `1001` | `--x` | `r--` |
| `1010` | `r--` | `r--` |
| `1011` | `rw-` | `r--` |
| `1100` | `---` | `rw-` |
| `1101` | `r-x` | `rw-` |
| `1110` | `r--` | `rw-` |
| `1111` | `rw-` | `rw-` |


These four bits indicate the actual permissions when running in EL or GL mode.
EL0 and EL1 have separate registers such that the permissions are decoupled.

bit 1 in S3_6_C15_C1_0 / SPRR_CONFIG_EL1 enables SPRR and access to new system registers.

S3_6_C15_1_5 is the permissions register for EL0 and S3_6_C15_1_6 is for EL1/GL1.

```
#define SYS_SPRR_CONFIG_EL1       sys_reg(3, 6, 15, 1, 0)
#define SPRR_CONFIG_EN            BIT(0)
#define SPRR_CONFIG_LOCK_CONFIG   BIT(1)
#define SPRR_CONFIG_LOCK_PERM_EL0 BIT(4)
#define SPRR_CONFIG_LOCK_PERM_EL1 BIT(5)

#define SYS_SPRR_PERM_EL0 sys_reg(3, 6, 15, 1, 5)
#define SYS_SPRR_PERM_EL1 sys_reg(3, 6, 15, 1, 6)
```

