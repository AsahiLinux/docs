---
title: Registros del Sistema
---

Ver [Volcados de Registros del Sistema](system-register-dumps.md) para una enumeración e investigación exhaustiva.

## Glosario

Algunos de estos son conjeturas

* ACC: Apple Core Cluster
* HID: Registro Definido por Implementación de Hardware
* EHID: Registro Definido por Implementación de Hardware (núcleo-e)
* IPI: Interrupción entre Procesadores

## Definiciones de registros

Usando formato Linux:
```c

/* Estos tienen sentido... */
#define SYS_APL_HID0_EL1            sys_reg(3, 0, 15, 0, 0)
#define SYS_APL_EHID0_EL1           sys_reg(3, 0, 15, 0, 1)
#define SYS_APL_HID1_EL1            sys_reg(3, 0, 15, 1, 0)
#define SYS_APL_EHID1_EL1           sys_reg(3, 0, 15, 1, 1)
#define SYS_APL_HID2_EL1            sys_reg(3, 0, 15, 2, 0)
#define SYS_APL_EHID2_EL1           sys_reg(3, 0, 15, 2, 1)
#define SYS_APL_HID3_EL1            sys_reg(3, 0, 15, 3, 0)
#define SYS_APL_EHID3_EL1           sys_reg(3, 0, 15, 3, 1)
#define SYS_APL_HID4_EL1            sys_reg(3, 0, 15, 4, 0)
#define SYS_APL_EHID4_EL1           sys_reg(3, 0, 15, 4, 1)
#define SYS_APL_HID5_EL1            sys_reg(3, 0, 15, 5, 0)
#define SYS_APL_EHID5_EL1           sys_reg(3, 0, 15, 5, 1)
#define SYS_APL_HID6_EL1            sys_reg(3, 0, 15, 6, 0)
#define SYS_APL_HID7_EL1            sys_reg(3, 0, 15, 7, 0)
#define SYS_APL_EHID7_EL1           sys_reg(3, 0, 15, 7, 1)
#define SYS_APL_HID8_EL1            sys_reg(3, 0, 15, 8, 0)
#define SYS_APL_HID9_EL1            sys_reg(3, 0, 15, 9, 0)
#define SYS_APL_EHID9_EL1           sys_reg(3, 0, 15, 9, 1)
#define SYS_APL_HID10_EL1           sys_reg(3, 0, 15, 10, 0)
#define SYS_APL_EHID10_EL1          sys_reg(3, 0, 15, 10, 1)
#define SYS_APL_HID11_EL1           sys_reg(3, 0, 15, 11, 0)
#define SYS_APL_EHID11_EL1          sys_reg(3, 0, 15, 11, 1)

/* Uh oh */
#define SYS_APL_HID12_EL?           sys_reg(3, 0, 15, 12, 0)
#define SYS_APL_HID13_EL?           sys_reg(3, 0, 15, 14, 0)
#define SYS_APL_HID14_EL?           sys_reg(3, 0, 15, 15, 0)

/* Toda la cordura se fue por la ventana aquí */
#define SYS_APL_HID16_EL?           sys_reg(3, 0, 15, 15, 2)
#define SYS_APL_HID17_EL1           sys_reg(3, 0, 15, 15, 5)
#define SYS_APL_HID18_EL?           sys_reg(3, 0, 15, 11, 2)
#define SYS_APL_EHID20_EL1          sys_reg(3, 0, 15, 1, 2)
#define SYS_APL_HID21_EL?           sys_reg(3, 0, 15, 1, 3)

#define SYS_APL_PMCR0_EL1           sys_reg(3, 1, 15, 0, 0)
#define SYS_APL_PMCR1_EL1           sys_reg(3, 1, 15, 1, 0)
#define SYS_APL_PMCR2_EL1           sys_reg(3, 1, 15, 2, 0)
#define SYS_APL_PMCR3_EL1           sys_reg(3, 1, 15, 3, 0)
#define SYS_APL_PMCR4_EL1           sys_reg(3, 1, 15, 4, 0)
#define SYS_APL_PMESR0_EL1          sys_reg(3, 1, 15, 5, 0)
#define SYS_APL_PMESR1_EL1          sys_reg(3, 1, 15, 6, 0)
#define SYS_APL_PMSR_EL1            sys_reg(3, 1, 15, 13, 0)

#define SYS_APL_PMC0_EL1            sys_reg(3, 2, 15, 0, 0)
#define SYS_APL_PMC1_EL1            sys_reg(3, 2, 15, 1, 0)
#define SYS_APL_PMC2_EL1            sys_reg(3, 2, 15, 2, 0)
#define SYS_APL_PMC3_EL1            sys_reg(3, 2, 15, 3, 0)
#define SYS_APL_PMC4_EL1            sys_reg(3, 2, 15, 4, 0)
#define SYS_APL_PMC5_EL1            sys_reg(3, 2, 15, 5, 0)
#define SYS_APL_PMC6_EL1            sys_reg(3, 2, 15, 6, 0)
#define SYS_APL_PMC7_EL1            sys_reg(3, 2, 15, 7, 0)
#define SYS_APL_PMC8_EL1            sys_reg(3, 2, 15, 9, 0)
#define SYS_APL_PMC9_EL1            sys_reg(3, 2, 15, 10, 0)

#define SYS_APL_LSU_ERR_STS_EL1     sys_reg(3, 3, 15, 0, 0)
#define SYS_APL_E_LSU_ERR_STS_EL1   sys_reg(3, 3, 15, 2, 0)
#define SYS_APL_LSU_ERR_CTL_EL1     sys_reg(3, 3, 15, 1, 0)

#define SYS_APL_L2C_ERR_STS_EL1     sys_reg(3, 3, 15, 8, 0)
#define SYS_APL_L2C_ERR_ADR_EL1     sys_reg(3, 3, 15, 9, 0)
#define SYS_APL_L2C_ERR_INF_EL1     sys_reg(3, 3, 15, 10, 0)

#define SYS_APL_FED_ERR_STS_EL1     sys_reg(3, 4, 15, 0, 0)
#define SYS_APL_E_FED_ERR_STS_EL1   sys_reg(3, 4, 15, 0, 2)

#define SYS_APL_APCTL_EL1           sys_reg(3, 4, 15, 0, 4)
#define SYS_APL_KERNELKEYLO_EL1     sys_reg(3, 4, 15, 1, 0)
#define SYS_APL_KERNELKEYHI_EL1     sys_reg(3, 4, 15, 1, 1)

#define SYS_APL_VMSA_LOCK_EL1       sys_reg(3, 4, 15, 1, 2)

#define SYS_APL_APRR_EL0            sys_reg(3, 4, 15, 2, 0)
#define SYS_APL_APRR_EL1            sys_reg(3, 4, 15, 2, 1)

#define SYS_APL_CTRR_LOCK_EL1       sys_reg(3, 4, 15, 2, 2)
#define SYS_APL_CTRR_A_LWR_EL1      sys_reg(3, 4, 15, 2, 3)
#define SYS_APL_CTRR_A_UPR_EL1      sys_reg(3, 4, 15, 2, 4)
#define SYS_APL_CTRR_CTL_EL1        sys_reg(3, 4, 15, 2, 5)

#define SYS_APL_APRR_JIT_ENABLE_EL2 sys_reg(3, 4, 15, 2, 6)
#define SYS_APL_APRR_JIT_MASK_EL2   sys_reg(3, 4, 15, 2, 7)

#define SYS_APL_s3_4_c15_c5_0_EL1   sys_reg(3, 4, 15, 5, 0)

#define SYS_APL_CTRR_LOCK_EL2       sys_reg(3, 4, 15, 11, 5)
#define SYS_APL_CTRR_A_LWR_EL2      sys_reg(3, 4, 15, 11, 0)
#define SYS_APL_CTRR_A_UPR_EL2      sys_reg(3, 4, 15, 11, 1)
#define SYS_APL_CTRR_CTL_EL2        sys_reg(3, 4, 15, 11, 4)

#define SYS_APL_IPI_RR_LOCAL_EL1    sys_reg(3, 5, 15, 0, 0)
#define SYS_APL_IPI_RR_GLOBAL_EL1   sys_reg(3, 5, 15, 0, 1)

#define SYS_APL_DPC_ERR_STS_EL1     sys_reg(3, 5, 15, 0, 5)

#define SYS_APL_IPI_SR_EL1          sys_reg(3, 5, 15, 1, 1)

#define SYS_APL_VM_TMR_LR_EL2       sys_reg(3, 5, 15, 1, 2)
#define SYS_APL_VM_TMR_FIQ_ENA_EL2  sys_reg(3, 5, 15, 1, 3)

#define SYS_APL_IPI_CR_EL1          sys_reg(3, 5, 15, 3, 1)

#define SYS_APL_ACC_CFG_EL1         sys_reg(3, 5, 15, 4, 0)
#define SYS_APL_CYC_OVRD_EL1        sys_reg(3, 5, 15, 5, 0)
#define SYS_APL_ACC_OVRD_EL1        sys_reg(3, 5, 15, 6, 0)
#define SYS_APL_ACC_EBLK_OVRD_EL?   sys_reg(3, 5, 15, 6, 1)

#define SYS_APL_MMU_ERR_STS_EL1     sys_reg(3, 6, 15, 0, 0)

#define SYS_APL_E_MMU_ERR_STS_EL1   sys_reg(3, 6, 15, 2, 0)

#define SYS_APL_AFPCR_EL0           sys_reg(3, 6, 15, 2, 5)

#define SYS_APL_APSTS_EL1           sys_reg(3, 6, 15, 12, 4)

#define SYS_APL_UPMCR0_EL1          sys_reg(3, 7, 15, 0, 4)
#define SYS_APL_UPMESR0_EL1         sys_reg(3, 7, 15, 1, 4)
#define SYS_APL_UPMECM0_EL1         sys_reg(3, 7, 15, 3, 4)
#define SYS_APL_UPMECM1_EL1         sys_reg(3, 7, 15, 4, 4)
#define SYS_APL_UPMPCM_EL1          sys_reg(3, 7, 15, 5, 4)
#define SYS_APL_UPMSR_EL1           sys_reg(3, 7, 15, 6, 4)
#define SYS_APL_UPMECM2_EL1         sys_reg(3, 7, 15, 8, 5)
#define SYS_APL_UPMECM3_EL1         sys_reg(3, 7, 15, 9, 5)
#define SYS_APL_UPMESR1_EL1         sys_reg(3, 7, 15, 11, 5)

/* Nota: fuera de orden respecto a lo anterior */
#define SYS_APL_UPMC0_EL1           sys_reg(3, 7, 15, 7, 4)
#define SYS_APL_UPMC1_EL1           sys_reg(3, 7, 15, 8, 4)
#define SYS_APL_UPMC2_EL1           sys_reg(3, 7, 15, 9, 4)
#define SYS_APL_UPMC3_EL1           sys_reg(3, 7, 15, 10, 4)
#define SYS_APL_UPMC4_EL1           sys_reg(3, 7, 15, 11, 4)
#define SYS_APL_UPMC5_EL1           sys_reg(3, 7, 15, 12, 4)
#define SYS_APL_UPMC6_EL1           sys_reg(3, 7, 15, 13, 4)
#define SYS_APL_UPMC7_EL1           sys_reg(3, 7, 15, 14, 4)
#define SYS_APL_UPMC8_EL1           sys_reg(3, 7, 15, 0, 5)
#define SYS_APL_UPMC9_EL1           sys_reg(3, 7, 15, 1, 5)
#define SYS_APL_UPMC10_EL1          sys_reg(3, 7, 15, 2, 5)
#define SYS_APL_UPMC11_EL1          sys_reg(3, 7, 15, 3, 5)
#define SYS_APL_UPMC12_EL1          sys_reg(3, 7, 15, 4, 5)
#define SYS_APL_UPMC13_EL1          sys_reg(3, 7, 15, 5, 5)
#define SYS_APL_UPMC14_EL1          sys_reg(3, 7, 15, 6, 5)
#define SYS_APL_UPMC15_EL1          sys_reg(3, 7, 15, 7, 5)
```

### Registros HID

Esta convención de nombres probablemente viene de PowerPC. Muchos bits chicken
parecen estar ubicados aquí.

Estos son principalmente bits chicken para deshabilitar características de la CPU, y probablemente muchos solo se aplican a ciertas generaciones de CPU. Sin embargo, sus definiciones son globales.

#### SYS_APL_HID0_EL1

* [20] Deshabilitar Búfer de Bucle
* [21] Deshabilitar Fusión de Caché AMX
* [25] Límite de Prefetch de IC Uno "Brn"
* [28] Deshabilitar Ancho de Fetch
* [33] Deshabilitar Fusión PMULL
* [36] Deshabilitar Fusión de Caché
* [45] Optimización de Energía Same Pg (página?)
* [62:60] Profundidad de Prefetch de Caché de Instrucciones

#### SYS_APL_EHID0_EL1

* [45] nfpRetFwdDisb

#### SYS_APL_HID1_EL1

* [14] Deshabilitar Fusión CMP-Branch
* [15] ForceMextL3ClkOn
* [23] rccForceAllIexL3ClksOn
* [24] rccDisStallInactiveIexCtl
* [25] disLspFlushWithContextSwitch
* [44] Deshabilitar Fusión AES entre grupos
* [49] Deshabilitar Especulación MSR DAIF
* [54] Capturar SMC
* [58] enMDSBStallPipeLineECO
* [60] Habilitar Límite de Branch Kill / SpareBit6

#### SYS_APL_EHID1_EL1

* [30] Deshabilitar Especulación MSR DAIF


#### SYS_APL_HID2_EL1

* [13] Deshabilitar Prefetch MTLB de MMU
* [17] Forzar Purgar MTB

#### SYS_APL_EHID2_EL1

* [17] Forzar Purgar MTB

#### SYS_APL_HID3_EL1

* [2] Deshabilitar Optimización de Color
* [25] Deshabilitar Solo Comando DC ZVA
* [44] Deshabilitar Corrección de Arbitraje BIF CRD
* [54] Deshabilitar Modo de Inanición L2 por Disparador de Expulsión Snp Xmon
* [63] Habilitar Limitación de Pcie Dev

#### SYS_APL_EHID3_EL1

* [2] Deshabilitar Optimización de Color
* [25] Deshabilitar Solo Comando DC ZVA

#### SYS_APL_HID4_EL1

* [1] Deshabilitar Widget STNT
* [9] Deshabilitar Redirección Especulativa LS
* [11] Deshabilitar Operaciones DC MVA
* [33] Deshabilitar Lectura Especulativa Lnch
* [39] Forzar Ns Ord Ld Req No Older Ld (¿Carga Ordenada No Especulativa Requiere No Carga Anterior?)
* [41:40] Umbral de Contador Cnf
* [44] Deshabilitar Operaciones DC SW L2
* [49] Habilitar Lfsr Stall Load Pipe 2 Issue
* [53] Habilitar Lfsr Stall Stq Replay

#### SYS_APL_HID5_EL1

* [15:14] Crd Edb Snp Rsvd
* [44] Deshabilitar Carga HWP
* [45] Deshabilitar Almacenamiento HWP
* [54] Habilitar Stall de Lectura Dn FIFO
* [57] Deshabilitar Escritura de Línea Completa
* [61] Deshabilitar Fusión Fill 2C

#### SYS_APL_EHID5_EL1 