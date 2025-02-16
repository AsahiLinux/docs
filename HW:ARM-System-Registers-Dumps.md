All implemented (readable) vendor-specific registers. Dumped while running m1n1 (after chicken bits):

| Name | Register | Access | Icestorm | Firestorm |
|-|-|-|-|-|
| SYS_APL_HID0 | s3_0_c15_c0_0 | RW | N/A | 0x10002990120e0e00 |
| unknow | s3_0_c15_c0_1 | RW | 0x7180080006000000 | N/A |
| SYS_APL_HID1 | s3_0_c15_c1_0 | RW | N/A | 0x40000002000000 |
| SYS_APL_EHID1 | s3_0_c15_c1_1 | RW | 0x129802000000 | N/A |
| SYS_APL_EHID20 | s3_0_c15_c1_2 | RW | 0x618100 | N/A |
| SYS_APL_HID21 | s3_0_c15_c1_3 | RW | N/A | 0x1040000 |
| unknow | s3_0_c15_c1_4 | RW | 0xce8e19f3b0a04081 | same |
| unknow | s3_0_c15_c1_5 | RW | 0x19d1c3862c081 | same |
| SYS_APL_HID2 | s3_0_c15_c2_0 | RW | N/A | 0x0 |
| SYS_APL_EHID2 | s3_0_c15_c2_1 | RW | 0x0 | N/A |
| SYS_APL_HID3 | s3_0_c15_c3_0 | RW | N/A | 0x4180000cf8001fe0 |
| SYS_APL_EHID3 | s3_0_c15_c3_1 | RW | 0x2030001fe0 | N/A |
| SYS_APL_HID4 | s3_0_c15_c4_0 | RW | N/A | 0x130800000800 |
| SYS_APL_EHID4 | s3_0_c15_c4_1 | RW | 0x100000000800 | N/A |
| SYS_APL_HID5 | s3_0_c15_c5_0 | RW | 0x2082df50e700df14 | 0x2082df205700ff12 |
| SYS_APL_HID6 | s3_0_c15_c6_0 | RW | 0x7dc8031f007f0e | 0x7dc8031f007c0e |
| SYS_APL_HID7 | s3_0_c15_c7_0 | RW | N/A | 0x3110000 |
| unknow | s3_0_c15_c7_1 | RW | 0x0 | N/A |
| SYS_APL_HID8 | s3_0_c15_c8_0 | RW | 0x381c109438000135 | 0x381c10a438000252 |
| SYS_APL_HID9 | s3_0_c15_c9_0 | RW | N/A | 0x100086c000000 |
| SYS_APL_EHID9 | s3_0_c15_c9_1 | RW | 0x600000811 | N/A |
| SYS_APL_HID10 | s3_0_c15_c10_0 | RW | N/A | 0x3180200 |
| SYS_APL_EHID10 | s3_0_c15_c10_1 | RW | 0x3000528002788 | N/A |
| unknow | s3_0_c15_c10_2 | RW | 0x40032014 | same |
| SYS_APL_HID11 | s3_0_c15_c11_0 | RW | N/A | 0x804000010000000 |
| SYS_APL_EHID11 | s3_0_c15_c11_1 | RW | 0x30000000010 | N/A |
| SYS_APL_HID18 | s3_0_c15_c11_2 | RW | N/A | 0x40004000 |
| unknow | s3_0_c15_c11_3 | RW | 0x0 | N/A |
| unknow | s3_0_c15_c12_0 | RW | 0xe10000000e020 | 0xe00000000e020 |
| unknow | s3_0_c15_c12_1 | RW | 0x1800 | same |
| unknow | s3_0_c15_c12_2 | RW | 0x40201008040201 | same |
| unknow | s3_0_c15_c13_0 | RW | 0x0 | same |
| SYS_APL_HID13 | s3_0_c15_c14_0 | RW | N/A | 0x332200211010205 |
| SYS_APL_HID14 | s3_0_c15_c15_0 | RW | N/A | 0x200000bb8 |
| SYS_APL_HID16 | s3_0_c15_c15_2 | RW | N/A | 0x6900000440000000 |
| unknow | s3_0_c15_c15_3 | RW | 0x20402000000 | same |
| SYS_APL_HID17 | s3_0_c15_c15_5 | RW | 0x54090afcfa9 | 0x50090af8faa |
| SYS_APL_PMCR0 | s3_1_c15_c0_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c0_1 | RW | 0x0 | same |
| unknow | s3_1_c15_c0_2 | RW | 0x6 | same |
| unknow | s3_1_c15_c0_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c0_4 | RW | 0x0 | same |
| SYS_APL_PMCR1 | s3_1_c15_c1_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c1_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c1_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c1_4 | RW | 0x0 | same |
| SYS_APL_PMCR2 | s3_1_c15_c2_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c2_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c2_3 | RW | 0x0 | same |
| SYS_APL_PMCR3 | s3_1_c15_c3_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c3_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c3_3 | RW | 0x0 | same |
| SYS_APL_PMCR4 | s3_1_c15_c4_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c4_2 | RW | 0x6 | same |
| unknow | s3_1_c15_c4_3 | RW | 0x0 | same |
| SYS_APL_PMESR0 | s3_1_c15_c5_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c5_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c5_3 | RW | 0x0 | same |
| SYS_APL_PMESR1 | s3_1_c15_c6_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c6_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c6_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c7_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c7_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c7_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c8_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c8_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c9_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c9_2 | RW | 0x6 | same |
| unknow | s3_1_c15_c9_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c10_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c10_2 | RW | 0x0 | same |
| unknow | s3_1_c15_c10_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c11_0 | RW | 0xfffff | same |
| unknow | s3_1_c15_c11_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c12_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c12_3 | RW | 0x0 | same |
| SYS_APL_PMSR | s3_1_c15_c13_0 | RO | 0x0 | same |
| unknow | s3_1_c15_c13_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c14_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c14_1 | RW | 0x0 | same |
| unknow | s3_1_c15_c14_3 | RW | 0x0 | same |
| unknow | s3_1_c15_c15_0 | RW | 0x0 | same |
| unknow | s3_1_c15_c15_3 | RW | 0x0 | same |
| SYS_APL_PMC0 | s3_2_c15_c0_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_1 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_2 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_3 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_4 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_5 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_6 | RW | 0x0 | same |
| unknow | s3_2_c15_c0_7 | RW | 0x0 | same |
| SYS_APL_PMC1 | s3_2_c15_c1_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c1_1 | RW | 0x0 | same |
| SYS_APL_PMC2 | s3_2_c15_c2_0 | RW | 0x0 | same |
| SYS_APL_PMC3 | s3_2_c15_c3_0 | RW | 0x0 | same |
| SYS_APL_PMC4 | s3_2_c15_c4_0 | RW | 0x0 | same |
| SYS_APL_PMC5 | s3_2_c15_c5_0 | RW | 0x0 | same |
| SYS_APL_PMC6 | s3_2_c15_c6_0 | RW | 0x0 | same |
| SYS_APL_PMC7 | s3_2_c15_c7_0 | RW | 0x0 | same |
| SYS_APL_PMC8 | s3_2_c15_c9_0 | RW | 0x0 | same |
| SYS_APL_PMC9 | s3_2_c15_c10_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c12_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c13_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c14_0 | RW | 0x0 | same |
| unknow | s3_2_c15_c15_0 | RW | 0x0 | same |
| SYS_APL_LSU_ERR_STS | s3_3_c15_c0_0 | RW | N/A | 0x0 |
| unknow | s3_3_c15_c0_4 | RW | 0x0 | same |
| unknow | s3_3_c15_c0_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c0_6 | RW | 0x0 | same |
| SYS_APL_LSU_ERR_CTL | s3_3_c15_c1_0 | RW | N/A | 0x1 |
| unknow | s3_3_c15_c1_4 | RW | 0x0 | same |
| unknow | s3_3_c15_c1_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c1_6 | RW | 0x0 | same |
| SYS_APL_E_LSU_ERR_STS | s3_3_c15_c2_0 | RW | 0x0 | N/A |
| unknow | s3_3_c15_c2_4 | RW | 0x0 | same |
| unknow | s3_3_c15_c2_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c3_0 | RW | 0x60 | N/A |
| unknow | s3_3_c15_c3_4 | RW | 0x0 | same |
| unknow | s3_3_c15_c3_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c4_0 | RW | 0x0 | same |
| unknow | s3_3_c15_c4_4 | RW | 0x0 | same |
| unknow | s3_3_c15_c4_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c4_6 | RW | 0x3ffffffffff | same |
| unknow | s3_3_c15_c5_0 | RW | 0x0 | same |
| unknow | s3_3_c15_c5_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c6_5 | RW | 0x0 | same |
| unknow | s3_3_c15_c7_0 | RW | 0xf1200 | 0xb1400 |
| unknow | s3_3_c15_c7_5 | RW | 0x0 | same |
| SYS_APL_L2C_ERR_STS | s3_3_c15_c8_0 | RW | 0x11000ffc00000000 | same |
| unknow | s3_3_c15_c8_1 | RW | 0x1 | 0x2 |
| unknow | s3_3_c15_c8_2 | RW | 0x1 | 0x2 |
| unknow | s3_3_c15_c8_3 | RW | 0x4 | same |
| SYS_APL_L2C_ERR_ADR | s3_3_c15_c9_0 | RW | 0x0 | same |
| SYS_APL_L2C_ERR_INF | s3_3_c15_c10_0 | RW | 0x0 | same |
| unknow | s3_3_c15_c11_0 | RW | 0x0 | same |
| unknow | s3_3_c15_c12_0 | RW | 0xfffffffff | same |
| unknow | s3_3_c15_c13_0 | RW | 0x238018600bc0024 | same |
| unknow | s3_3_c15_c13_1 | RW | 0x84005a002c0008 | same |
| unknow | s3_3_c15_c13_2 | RW | 0x1c8014e00a60024 | same |
| unknow | s3_3_c15_c13_3 | RW | 0x6a004e00260008 | same |
| unknow | s3_3_c15_c13_4 | RW | 0x20000 | same |
| unknow | s3_3_c15_c13_5 | RW | 0x40000 | same |
| unknow | s3_3_c15_c13_6 | RW | 0x80000 | same |
| unknow | s3_3_c15_c13_7 | RW | 0x100000 | same |
| unknow | s3_3_c15_c14_0 | RW | 0xf0000 | same |
| unknow | s3_3_c15_c15_0 | RW | 0x4ad4b4c00 | same |
| unknow | s3_3_c15_c15_1 | RW | 0x352b4b200 | same |
| unknow | s3_3_c15_c15_2 | RW | 0x10000 | same |
| unknow | s3_3_c15_c15_3 | RW | 0x20000 | same |
| unknow | s3_3_c15_c15_4 | RW | 0x8d48e9f929042518 | same |
| SYS_APL_FED_ERR_STS | s3_4_c15_c0_0 | RW | N/A | 0x0 |
| unknow | s3_4_c15_c0_1 | RW | N/A | 0x25 |
| SYS_APL_E_FED_ERR_STS | s3_4_c15_c0_2 | RW | 0x0 | N/A |
| unknow | s3_4_c15_c0_3 | RW | 0x7f | N/A |
| SYS_APL_APCTL_EL1 | s3_4_c15_c0_4 | RW | 0xc | same |
| unknow | s3_4_c15_c0_5 | RW | 0x0 | same |
| unknow | s3_4_c15_c0_7 | RW | 0x0 | same |
| SYS_APL_KERNELKEYLO_EL1 | s3_4_c15_c1_0 | RW | 0x0 | same |
| SYS_APL_KERNELKEYHI_EL1 | s3_4_c15_c1_1 | RW | 0x0 | same |
| SYS_APL_VMSA_LOCK | s3_4_c15_c1_2 | RW | 0x0 | same |
| unknow | s3_4_c15_c1_3 | RW | 0x0 | same |
| unknow | s3_4_c15_c1_4 | RW | 0x100 | same |
| unknow | s3_4_c15_c1_5 | RW | 0x0 | same |
| unknow | s3_4_c15_c1_6 | RW | 0x0 | same |
| unknow | s3_4_c15_c1_7 | RW | 0x0 | same |
| SYS_APL_CTRR_LOCK_EL1 | s3_4_c15_c2_2 | RW | 0x0 | same |
| SYS_APL_CTRR_A_LWR_EL1 | s3_4_c15_c2_3 | RW | 0x80485c000 | 0x0 |
| SYS_APL_CTRR_A_UPR_EL1 | s3_4_c15_c2_4 | RW | 0x804924000 | 0x0 |
| SYS_APL_CTRR_CTL_EL1 | s3_4_c15_c2_5 | RW | 0x0 | same |
| SYS_APL_APRR_JIT_ENABLE | s3_4_c15_c2_6 | RW | 0x0 | same |
| SYS_APL_APRR_JIT_MASK | s3_4_c15_c2_7 | RW | 0x0 | same |
| unknow | s3_4_c15_c3_0 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_1 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_2 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_3 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_4 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_5 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_6 | RO | 0x0 | same |
| unknow | s3_4_c15_c3_7 | RO | 0x0 | same |
| unknow | s3_4_c15_c4_0 | RO | 0x4 | same |
| unknow | s3_4_c15_c4_6 | RW | 0x0 | same |
| unknow | s3_4_c15_c4_7 | RW | 0x100 | same |
| SYS_APL_s3_4_c15_c5_0 | s3_4_c15_c5_0 | RW | 0x0 | same |
| unknow | s3_4_c15_c5_6 | RW | 0x0 | same |
| unknow | s3_4_c15_c5_7 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_0 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_1 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_2 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_3 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_4 | RW | 0x80485c000 | 0x0 |
| unknow | s3_4_c15_c6_5 | RW | 0x804924000 | 0x0 |
| unknow | s3_4_c15_c6_6 | RW | 0x0 | same |
| unknow | s3_4_c15_c6_7 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_0 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_1 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_2 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_3 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_4 | RW | 0x0 | same |
| unknow | s3_4_c15_c9_5 | RW | 0x0 | same |
| unknow | s3_4_c15_c10_4 | RW | 0x3 | same |
| unknow | s3_4_c15_c10_5 | RO | 0xfb8de8634 | 0x3edb4528 |
| unknow | s3_4_c15_c10_6 | RO | 0xfb8de8634 | 0x3edb4529 |
| SYS_APL_CTRR_A_LWR_EL2 | s3_4_c15_c11_0 | RW | 0x0 | same |
| SYS_APL_CTRR_A_UPR_EL2 | s3_4_c15_c11_1 | RW | 0x0 | same |
| unknow | s3_4_c15_c11_2 | RW | 0x0 | same |
| unknow | s3_4_c15_c11_3 | RW | 0x0 | same |
| SYS_APL_CTRR_CTL_EL2 | s3_4_c15_c11_4 | RW | 0x0 | same |
| SYS_APL_CTRR_LOCK_EL2 | s3_4_c15_c11_5 | RW | 0x0 | same |
| unknow | s3_4_c15_c12_5 | RW | 0x0 | same |
| unknow | s3_4_c15_c12_7 | RW | 0x0 | same |
| unknow | s3_5_c15_c0_2 | RW | 0xf | same |
| unknow | s3_5_c15_c0_3 | RW | 0xf | same |
| unknow | s3_5_c15_c0_4 | RW | 0x0 | same |
| SYS_APL_DPC_ERR_STS | s3_5_c15_c0_5 | RW | 0x0 | same |
| unknow | s3_5_c15_c0_6 | RW | 0x21f | same |
| unknow | s3_5_c15_c1_0 | RW | 0x0 | same |
| SYS_APL_IPI_SR | s3_5_c15_c1_1 | RW | 0x0 | same |
| SYS_APL_VM_LR | s3_5_c15_c1_2 | RW | 0x1b0000001b | same |
| SYS_APL_VM_TMR_MASK | s3_5_c15_c1_3 | RW | 0x3 | same |
| unknow | s3_5_c15_c2_0 | RW | 0x0 | same |
| unknow | s3_5_c15_c3_0 | RW | 0x0 | same |
| SYS_APL_IPI_CR | s3_5_c15_c3_1 | RW | 0x1800 | same |
| unknow | s3_5_c15_c3_2 | RW | 0x0 | same |
| unknow | s3_5_c15_c3_4 | RW | 0x0 | same |
| unknow | s3_5_c15_c3_5 | RO | 0x0 | same |
| SYS_APL_ACC_CFG | s3_5_c15_c4_0 | RW | 0xd | same |
| unknow | s3_5_c15_c4_1 | RW | 0x100003e485001f | 0x1030bc77e485001f |
| SYS_APL_CYC_OVRD | s3_5_c15_c5_0 | RW | 0x2000000 | same |
| unknow | s3_5_c15_c5_2 | RW | 0x0 | same |
| unknow | s3_5_c15_c5_4 | RW | 0x0 | same |
| SYS_APL_ACC_OVRD | s3_5_c15_c6_0 | RW | 0x180010102001c207 | same |
| unknow | s3_5_c15_c7_0 | RW | 0x100 | same |
| unknow | s3_5_c15_c8_0 | RW | 0x4 | same |
| unknow | s3_5_c15_c8_1 | RW | 0xffffffff | same |
| unknow | s3_5_c15_c9_0 | RW | 0x20001d1500f20014 | 0xc0000c0c00f20011 |
| unknow | s3_5_c15_c10_0 | RW | 0x2005f200102 | 0x2015fa00102 |
| unknow | s3_5_c15_c10_1 | RW | 0x0 | same |
| unknow | s3_5_c15_c12_0 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c12_1 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c12_2 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c12_3 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c12_4 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c12_5 | RW | N/A | 0x0 |
| unknow | s3_5_c15_c13_4 | RW | 0x0 | same |
| unknow | s3_5_c15_c13_5 | RW | 0x0 | same |
| unknow | s3_5_c15_c14_2 | RW | 0x0 | N/A |
| unknow | s3_5_c15_c14_3 | RW | 0x0 | N/A |
| unknow | s3_5_c15_c14_4 | RW | 0x0 | N/A |
| unknow | s3_5_c15_c14_5 | RW | 0x0 | N/A |
| unknow | s3_5_c15_c14_6 | RW | 0x0 | N/A |
| unknow | s3_5_c15_c14_7 | RW | 0x0 | N/A |
| SYS_APL_MMU_ERR_STS | s3_6_c15_c0_0 | RW | N/A | 0x0 |
| unknow | s3_6_c15_c1_0 | RW | 0x0 | same |
| unknow | s3_6_c15_c1_2 | RO | 0x0 | same |
| unknow | s3_6_c15_c1_4 | RO | 0x0 | same |
| SYS_APL_E_MMU_ERR_STS | s3_6_c15_c2_0 | RW | 0x0 | N/A |
| unknow | s3_6_c15_c2_1 | RW | 0x12fa1db611a4c14 | 0x0 |
| unknow | s3_6_c15_c2_2 | RW | 0x7bea3a52c6e474ab | 0x0 |
| unknow | s3_6_c15_c2_3 | RW | 0x0 | same |
| unknow | s3_6_c15_c2_4 | RW | 0x0 | same |
| SYS_APL_AFPCR | s3_6_c15_c2_5 | RW | 0x0 | same |
| unknow | s3_6_c15_c2_7 | RO | 0x10003 | same |
| unknow | s3_6_c15_c7_0 | RW | 0x3e094b905367a138 | 0x0 |
| unknow | s3_6_c15_c7_1 | RW | 0x729c61cc911db3d0 | 0x0 |
| unknow | s3_6_c15_c7_2 | RW | 0xdd3223b5c9807c14 | 0x0 |
| unknow | s3_6_c15_c7_3 | RW | 0x191277470b2e1017 | 0x0 |
| unknow | s3_6_c15_c7_4 | RW | 0xe5ac8d636d111ab8 | 0x0 |
| unknow | s3_6_c15_c7_5 | RW | 0x4c0a977780a1bf2e | 0x0 |
| unknow | s3_6_c15_c7_6 | RW | 0xd186cdb61af898a6 | 0x0 |
| unknow | s3_6_c15_c7_7 | RW | 0xfc9946bc0688369f | 0x0 |
| unknow | s3_6_c15_c8_0 | RO | 0x0 | same |
| unknow | s3_6_c15_c8_3 | RW | 0x2 | same |
| unknow | s3_6_c15_c8_6 | RW | 0x2 | same |
| unknow | s3_6_c15_c12_2 | RW | 0xc | same |
| unknow | s3_6_c15_c12_3 | RO | 0x1 | same |
| SYS_APL_APSTS_EL1 | s3_6_c15_c12_4 | RO | 0x1 | same |
| unknow | s3_6_c15_c12_5 | RW | 0x0 | same |
| unknow | s3_6_c15_c12_6 | RW | 0x0 | same |
| unknow | s3_6_c15_c12_7 | RW | 0x0 | same |
| unknow | s3_6_c15_c13_0 | RW | 0x7e1eb75eca93408c | 0x0 |
| unknow | s3_6_c15_c13_1 | RW | 0x69a4334ee673171b | 0x0 |
| unknow | s3_6_c15_c13_2 | RW | 0x7b0537a4c9237fd6 | 0x0 |
| unknow | s3_6_c15_c13_3 | RW | 0x356ec5ffdbda584e | 0x0 |
| unknow | s3_6_c15_c13_4 | RW | 0xc9dfbcc5b08d03b8 | 0x0 |
| unknow | s3_6_c15_c13_5 | RW | 0x5ecf1a29c0973432 | 0x0 |
| unknow | s3_6_c15_c13_6 | RW | 0x7684c29566e14dc9 | 0x0 |
| unknow | s3_6_c15_c13_7 | RW | 0x4bb4f32b76f2e6a9 | 0x0 |
| unknow | s3_6_c15_c14_0 | RW | 0x7fc148694e0bcc6d | 0x0 |
| unknow | s3_6_c15_c14_1 | RW | 0x2936a8c66238f8f4 | 0x0 |
| unknow | s3_6_c15_c14_2 | RW | 0x0 | same |
| unknow | s3_6_c15_c14_4 | RW | 0x0 | same |
| unknow | s3_6_c15_c14_5 | RW | 0x0 | same |
| ACTLR_EL12 | s3_6_c15_c14_6 | RW | 0xc00 | same |
| unknow | s3_6_c15_c14_7 | RW | 0x0 | same |
| unknow | s3_6_c15_c15_0 | RW | 0xc | same |
| unknow | s3_6_c15_c15_1 | RO | 0x0 | same |
| unknow | s3_6_c15_c15_4 | RO | 0x0 | same |
| unknow | s3_7_c15_c0_0 | RW | 0x0 | same |
| unknow | s3_7_c15_c0_1 | RW | 0x0 | same |
| unknow | s3_7_c15_c0_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c0_3 | RW | 0x0 | same |
| SYS_APL_UPMCR0 | s3_7_c15_c0_4 | RW | 0x0 | same |
| SYS_APL_UPMC8 | s3_7_c15_c0_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c1_0 | RW | 0x0 | same |
| unknow | s3_7_c15_c1_1 | RW | 0x0 | same |
| unknow | s3_7_c15_c1_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c1_3 | RW | 0x0 | same |
| SYS_APL_UPMESR0 | s3_7_c15_c1_4 | RW | 0x0 | same |
| SYS_APL_UPMC9 | s3_7_c15_c1_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c2_0 | RW | 0x0 | same |
| unknow | s3_7_c15_c2_1 | RW | 0x3db15f4dfc5d5724 | 0x3db1b249a1cd79ad |
| unknow | s3_7_c15_c2_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c2_3 | RW | 0x0 | same |
| unknow | s3_7_c15_c2_4 | RW | 0x0 | same |
| SYS_APL_UPMC10 | s3_7_c15_c2_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c3_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c3_3 | RW | 0x0 | same |
| SYS_APL_UPMECM0 | s3_7_c15_c3_4 | RW | 0x0 | same |
| SYS_APL_UPMC11 | s3_7_c15_c3_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c4_0 | RW | 0x0 | same |
| unknow | s3_7_c15_c4_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c4_3 | RW | 0x0 | same |
| SYS_APL_UPMECM1 | s3_7_c15_c4_4 | RW | 0x0 | same |
| SYS_APL_UPMC12 | s3_7_c15_c4_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c5_0 | RW | 0x0 | same |
| unknow | s3_7_c15_c5_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c5_3 | RW | 0x0 | same |
| SYS_APL_UPMPCM | s3_7_c15_c5_4 | RW | 0x0 | same |
| SYS_APL_UPMC13 | s3_7_c15_c5_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c6_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c6_3 | RW | 0x0 | same |
| SYS_APL_UPMSR | s3_7_c15_c6_4 | RW | 0x0 | same |
| SYS_APL_UPMC14 | s3_7_c15_c6_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c7_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c7_3 | RW | 0x0 | same |
| SYS_APL_UPMC0 | s3_7_c15_c7_4 | RW | 0x0 | same |
| SYS_APL_UPMC15 | s3_7_c15_c7_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c8_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c8_3 | RW | 0x0 | same |
| SYS_APL_UPMC1 | s3_7_c15_c8_4 | RW | 0x0 | same |
| SYS_APL_UPMECM2 | s3_7_c15_c8_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c9_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c9_3 | RW | 0x0 | same |
| SYS_APL_UPMC2 | s3_7_c15_c9_4 | RW | 0x0 | same |
| SYS_APL_UPMECM3 | s3_7_c15_c9_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c10_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c10_3 | RW | 0x0 | same |
| SYS_APL_UPMC3 | s3_7_c15_c10_4 | RW | 0x0 | same |
| unknow | s3_7_c15_c10_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c11_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c11_3 | RW | 0x0 | same |
| SYS_APL_UPMC4 | s3_7_c15_c11_4 | RW | 0x0 | same |
| SYS_APL_UPMESR1 | s3_7_c15_c11_5 | RW | 0x0 | same |
| unknow | s3_7_c15_c12_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c12_3 | RW | 0x0 | same |
| SYS_APL_UPMC5 | s3_7_c15_c12_4 | RW | 0x0 | same |
| unknow | s3_7_c15_c13_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c13_3 | RW | 0x0 | same |
| SYS_APL_UPMC6 | s3_7_c15_c13_4 | RW | 0x0 | same |
| unknow | s3_7_c15_c14_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c14_3 | RW | 0x0 | same |
| SYS_APL_UPMC7 | s3_7_c15_c14_4 | RW | 0x0 | same |
| unknow | s3_7_c15_c15_2 | RW | 0x0 | same |
| unknow | s3_7_c15_c15_3 | RW | 0x0 | same |

## System Registers dump while running Darwin

Dump from Darwin version: 20.3.0 XNU: 7195.81.3~1

| Name | Register | Icestorm | Firestorm |
|-|-|-|-|
| SYS_APL_HID0 | s3_0_c15_c0_0 | N/A | 0x10002990120e0e00 |
| unknow | s3_0_c15_c0_1 | 0x7180080006000000 | N/A |
| SYS_APL_HID1 | s3_0_c15_c1_0 | N/A | 0x1440000002000000 |
| SYS_APL_EHID1 | s3_0_c15_c1_1 | 0x129802000000 | N/A |
| SYS_APL_EHID20 | s3_0_c15_c1_2 | 0x618100 | N/A |
| SYS_APL_HID21 | s3_0_c15_c1_3 | N/A | 0x1040000 |
| unknow | s3_0_c15_c1_4 | 0xce8e19f3b0a04081 | same |
| unknow | s3_0_c15_c1_5 | 0x19d1c3862c081 | same |
| SYS_APL_HID2 | s3_0_c15_c2_0 | N/A | 0x0 |
| SYS_APL_EHID2 | s3_0_c15_c2_1 | 0x0 | N/A |
| SYS_APL_HID3 | s3_0_c15_c3_0 | N/A | 0x4180000cf8001fe0 |
| SYS_APL_EHID3 | s3_0_c15_c3_1 | 0x2030001fe0 | N/A |
| SYS_APL_HID4 | s3_0_c15_c4_0 | N/A | 0x22130800000800 |
| SYS_APL_EHID4 | s3_0_c15_c4_1 | 0x100000000800 | N/A |
| SYS_APL_HID5 | s3_0_c15_c5_0 | 0x2082df50e700df14 | 0x2082df205700ff12 |
| SYS_APL_HID6 | s3_0_c15_c6_0 | 0x7dc8031f007f0e | 0x7dc8031f007c0e |
| SYS_APL_HID7 | s3_0_c15_c7_0 | N/A | 0x3110000 |
| unknow | s3_0_c15_c7_1 | 0x0 | N/A |
| SYS_APL_HID8 | s3_0_c15_c8_0 | 0x381c109438000135 | 0x381c10a438000252 |
| SYS_APL_HID9 | s3_0_c15_c9_0 | N/A | 0x8100086c000000 |
| SYS_APL_EHID9 | s3_0_c15_c9_1 | 0x600000811 | N/A |
| SYS_APL_HID10 | s3_0_c15_c10_0 | N/A | 0x3180200 |
| SYS_APL_EHID10 | s3_0_c15_c10_1 | 0x3000528002788 | N/A |
| unknow | s3_0_c15_c10_2 | 0x40032014 | same |
| SYS_APL_HID11 | s3_0_c15_c11_0 | N/A | 0x804000010008000 |
| SYS_APL_EHID11 | s3_0_c15_c11_1 | 0x30000000010 | N/A |
| SYS_APL_HID18 | s3_0_c15_c11_2 | N/A | 0x2000040004000 |
| unknow | s3_0_c15_c11_3 | 0x0 | N/A |
| unknow | s3_0_c15_c12_0 | 0xe10000000e020 | 0xe00000000e020 |
| unknow | s3_0_c15_c12_1 | 0x1800 | same |
| unknow | s3_0_c15_c12_2 | 0x40201008040201 | same |
| unknow | s3_0_c15_c13_0 | 0x0 | same |
| SYS_APL_HID13 | s3_0_c15_c14_0 | N/A | 0xc332200211010205 |
| SYS_APL_HID14 | s3_0_c15_c15_0 | N/A | 0x100000bb8 |
| SYS_APL_HID16 | s3_0_c15_c15_2 | N/A | 0x6900000440000000 |
| unknow | s3_0_c15_c15_3 | 0x20402000000 | same |
| SYS_APL_HID17 | s3_0_c15_c15_5 | 0x54090afcfa9 | 0x50090af8faa |
| SYS_APL_PMCR0 | s3_1_c15_c0_0 | 0x3403 | same |
| unknow | s3_1_c15_c0_1 | 0x0 | same |
| unknow | s3_1_c15_c0_2 | 0x6 | same |
| unknow | s3_1_c15_c0_3 | 0x80500000801 | same |
| unknow | s3_1_c15_c0_4 | 0x0 | same |
| SYS_APL_PMCR1 | s3_1_c15_c1_0 | 0x30300 | same |
| unknow | s3_1_c15_c1_2 | 0x0 | same |
| unknow | s3_1_c15_c1_3 | 0x300000807 | same |
| unknow | s3_1_c15_c1_4 | 0x0 | same |
| SYS_APL_PMCR2 | s3_1_c15_c2_0 | 0x0 | same |
| unknow | s3_1_c15_c2_2 | 0x0 | same |
| unknow | s3_1_c15_c2_3 | 0x0 | same |
| SYS_APL_PMCR3 | s3_1_c15_c3_0 | 0x0 | same |
| unknow | s3_1_c15_c3_2 | 0x0 | same |
| unknow | s3_1_c15_c3_3 | 0x0 | same |
| SYS_APL_PMCR4 | s3_1_c15_c4_0 | 0x0 | same |
| unknow | s3_1_c15_c4_2 | 0x6 | same |
| unknow | s3_1_c15_c4_3 | 0x0 | same |
| SYS_APL_PMESR0 | s3_1_c15_c5_0 | 0x0 | same |
| unknow | s3_1_c15_c5_2 | 0x0 | same |
| unknow | s3_1_c15_c5_3 | 0x0 | same |
| SYS_APL_PMESR1 | s3_1_c15_c6_0 | 0x0 | same |
| unknow | s3_1_c15_c6_2 | 0x30300 | same |
| unknow | s3_1_c15_c6_3 | 0x0 | same |
| unknow | s3_1_c15_c7_0 | 0x0 | same |
| unknow | s3_1_c15_c7_2 | 0x0 | same |
| unknow | s3_1_c15_c7_3 | 0x0 | same |
| unknow | s3_1_c15_c8_0 | 0x0 | same |
| unknow | s3_1_c15_c8_3 | 0: 0xffff00015dad1b9a, 1: 0xffff00013c07d1ae, 2: 0xffff00010d3399b5, 3: 0xffff0000fc8892c3 | 0: 0xffff0001c29f5dd0, 1: 0xffff0001375cbabc, 2: 0xffff0000c2b2a4b8, 3: 0xffff00009a43c504 |
| unknow | s3_1_c15_c9_0 | 0x0 | same |
| unknow | s3_1_c15_c9_2 | 0x6 | same |
| unknow | s3_1_c15_c9_3 | 0: 0xffff00009aeea3bb, 1: 0xffff00007dc5fbe5, 2: 0xffff0000660cb0c6, 3: 0xffff00005d7fdabf | 0: 0xffff00003e8775eb, 1: 0xffff000026318b6c, 2: 0xffff000016ec8cc5, 3: 0xffff000010745587 |
| unknow | s3_1_c15_c10_0 | 0x0 | same |
| unknow | s3_1_c15_c10_2 | 0x0 | same |
| unknow | s3_1_c15_c10_3 | 0: 0xffff0000412fb58f, 1: 0xffff00003dc93e81, 2: 0xffff000037cf721c, 3: 0xffff000034709f1a | 0: 0xffff0000c2c8baa0, 1: 0xffff0000aa18522e, 2: 0xffff000063cd70c9, 3: 0xffff00006b181a68 |
| unknow | s3_1_c15_c11_0 | 0xfffff | same |
| unknow | s3_1_c15_c11_3 | 0: 0xffff00005a9fed59, 1: 0xffff0000514a2097, 2: 0xffff000048aa25d5, 3: 0xffff000042bb1277 | 0: 0xffff0000c5791d2a, 1: 0xffff00008bff5c12, 2: 0xffff000050596295, 3: 0xffff00004514c293 |
| unknow | s3_1_c15_c12_0 | 0x0 | same |
| unknow | s3_1_c15_c12_3 | 0x0 | same |
| SYS_APL_PMSR | s3_1_c15_c13_0 | 0x0 | same |
| unknow | s3_1_c15_c13_3 | 0x0 | same |
| unknow | s3_1_c15_c14_0 | 0x0 | same |
| unknow | s3_1_c15_c14_1 | 0x0 | same |
| unknow | s3_1_c15_c14_3 | 0x0 | same |
| unknow | s3_1_c15_c15_0 | 0x0 | same |
| unknow | s3_1_c15_c15_3 | 0x0 | same |
| SYS_APL_PMC0 | s3_2_c15_c0_0 | 0: 0x7fff6dcc72fb, 1: 0x7ffde00f42b2, 2: 0x7ffe9854b633, 3: 0x7ffd654fd77b | 0: 0x7fff93f9cfc6, 1: 0x7fffd82b8c54, 2: 0x7ffd90dde9a5, 3: 0x7ffddccadc50 |
| unknow | s3_2_c15_c0_1 | 0x0 | same |
| unknow | s3_2_c15_c0_2 | 0x0 | same |
| unknow | s3_2_c15_c0_3 | 0x0 | same |
| unknow | s3_2_c15_c0_4 | 0x0 | same |
| unknow | s3_2_c15_c0_5 | 0x0 | same |
| unknow | s3_2_c15_c0_6 | 0x0 | same |
| unknow | s3_2_c15_c0_7 | 0x0 | same |
| SYS_APL_PMC1 | s3_2_c15_c1_0 | 0: 0x15698d458f, 1: 0x13b43063a0, 2: 0x1136c37f97, 3: 0xfc52e5b82 | 0: 0x2c8b8d79e7, 1: 0x177ec47d14, 2: 0xfb15411c1, 3: 0xad9cb527b |
| unknow | s3_2_c15_c1_1 | 0x0 | same |
| SYS_APL_PMC2 | s3_2_c15_c2_0 | 0x0 | same |
| SYS_APL_PMC3 | s3_2_c15_c3_0 | 0x0 | same |
| SYS_APL_PMC4 | s3_2_c15_c4_0 | 0x0 | same |
| SYS_APL_PMC5 | s3_2_c15_c5_0 | 0x0 | same |
| SYS_APL_PMC6 | s3_2_c15_c6_0 | 0x0 | same |
| SYS_APL_PMC7 | s3_2_c15_c7_0 | 0x0 | same |
| SYS_APL_PMC8 | s3_2_c15_c9_0 | 0x0 | same |
| SYS_APL_PMC9 | s3_2_c15_c10_0 | 0x0 | same |
| unknow | s3_2_c15_c12_0 | 0x0 | same |
| unknow | s3_2_c15_c13_0 | 0x0 | same |
| unknow | s3_2_c15_c14_0 | 0x0 | same |
| unknow | s3_2_c15_c15_0 | 0x0 | same |
| SYS_APL_LSU_ERR_STS | s3_3_c15_c0_0 | N/A | 0x0 |
| unknow | s3_3_c15_c0_4 | 0x0 | same |
| unknow | s3_3_c15_c0_5 | 0x0 | same |
| unknow | s3_3_c15_c0_6 | 0x0 | same |
| SYS_APL_LSU_ERR_CTL | s3_3_c15_c1_0 | N/A | 0x1 |
| unknow | s3_3_c15_c1_4 | 0x0 | same |
| unknow | s3_3_c15_c1_5 | 0x0 | same |
| unknow | s3_3_c15_c1_6 | 0x0 | same |
| SYS_APL_E_LSU_ERR_STS | s3_3_c15_c2_0 | 0x0 | N/A |
| unknow | s3_3_c15_c2_4 | 0x0 | same |
| unknow | s3_3_c15_c2_5 | 0x0 | same |
| unknow | s3_3_c15_c3_0 | 0x60 | N/A |
| unknow | s3_3_c15_c3_4 | 0x0 | same |
| unknow | s3_3_c15_c3_5 | 0x0 | same |
| unknow | s3_3_c15_c4_0 | 0x0 | same |
| unknow | s3_3_c15_c4_4 | 0x0 | same |
| unknow | s3_3_c15_c4_5 | 0x0 | same |
| unknow | s3_3_c15_c4_6 | 0x3ffffffffff | same |
| unknow | s3_3_c15_c5_0 | 0x0 | same |
| unknow | s3_3_c15_c5_5 | 0x0 | same |
| unknow | s3_3_c15_c6_5 | 0x0 | same |
| unknow | s3_3_c15_c7_0 | 0xf1200 | 0xb1400 |
| unknow | s3_3_c15_c7_5 | 0x0 | same |
| SYS_APL_L2C_ERR_STS | s3_3_c15_c8_0 | 0x11000ffc00000000 | same |
| unknow | s3_3_c15_c8_1 | 0x1 | 0x2 |
| unknow | s3_3_c15_c8_2 | 0x1 | 0x2 |
| unknow | s3_3_c15_c8_3 | 0x4 | same |
| SYS_APL_L2C_ERR_ADR | s3_3_c15_c9_0 | 0x0 | same |
| SYS_APL_L2C_ERR_INF | s3_3_c15_c10_0 | 0x0 | same |
| unknow | s3_3_c15_c11_0 | 0x0 | same |
| unknow | s3_3_c15_c12_0 | 0xfffffffff | same |
| unknow | s3_3_c15_c13_0 | 0x238018600bc0024 | same |
| unknow | s3_3_c15_c13_1 | 0x84005a002c0008 | same |
| unknow | s3_3_c15_c13_2 | 0x1c8014e00a60024 | same |
| unknow | s3_3_c15_c13_3 | 0x6a004e00260008 | same |
| unknow | s3_3_c15_c13_4 | 0x20000 | same |
| unknow | s3_3_c15_c13_5 | 0x40000 | same |
| unknow | s3_3_c15_c13_6 | 0x80000 | same |
| unknow | s3_3_c15_c13_7 | 0x100000 | same |
| unknow | s3_3_c15_c14_0 | 0xf0000 | same |
| unknow | s3_3_c15_c15_0 | 0x4ad4b4c00 | same |
| unknow | s3_3_c15_c15_1 | 0x352b4b200 | same |
| unknow | s3_3_c15_c15_2 | 0x10000 | same |
| unknow | s3_3_c15_c15_3 | 0x20000 | same |
| unknow | s3_3_c15_c15_4 | 0x8d48e9f929042518 | same |
| SYS_APL_FED_ERR_STS | s3_4_c15_c0_0 | N/A | 0x0 |
| unknow | s3_4_c15_c0_1 | N/A | 0x25 |
| SYS_APL_E_FED_ERR_STS | s3_4_c15_c0_2 | 0x0 | N/A |
| unknow | s3_4_c15_c0_3 | 0x7f | N/A |
| SYS_APL_APCTL_EL1 | s3_4_c15_c0_4 | 0x19 | same |
| unknow | s3_4_c15_c0_5 | 0xfc787ffff7ffffef | same |
| unknow | s3_4_c15_c0_7 | 0xfc787ffff7ffffef | same |
| SYS_APL_KERNELKEYLO_EL1 | s3_4_c15_c1_0 | msr_trap | same |
| SYS_APL_KERNELKEYHI_EL1 | s3_4_c15_c1_1 | msr_trap | same |
| SYS_APL_VMSA_LOCK | s3_4_c15_c1_2 | 0x8000000000000011 | same |
| unknow | s3_4_c15_c1_3 | 0x0 | same |
| unknow | s3_4_c15_c1_4 | 0x100 | same |
| unknow | s3_4_c15_c1_5 | 0x8000000000000011 | same |
| unknow | s3_4_c15_c1_6 | 0x0 | same |
| unknow | s3_4_c15_c1_7 | 0x0 | same |
| SYS_APL_CTRR_LOCK_EL1 | s3_4_c15_c2_2 | 0x0 | same |
| SYS_APL_CTRR_A_LWR_EL1 | s3_4_c15_c2_3 | 0: 0x803764000, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| SYS_APL_CTRR_A_UPR_EL1 | s3_4_c15_c2_4 | 0: 0x807e78000, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| SYS_APL_CTRR_CTL_EL1 | s3_4_c15_c2_5 | 0x0 | same |
| SYS_APL_APRR_JIT_ENABLE | s3_4_c15_c2_6 | 0x0 | same |
| SYS_APL_APRR_JIT_MASK | s3_4_c15_c2_7 | 0x0 | same |
| unknow | s3_4_c15_c3_0 | 0x0 | same |
| unknow | s3_4_c15_c3_1 | 0x0 | same |
| unknow | s3_4_c15_c3_2 | 0x0 | same |
| unknow | s3_4_c15_c3_3 | 0x0 | same |
| unknow | s3_4_c15_c3_4 | 0x0 | same |
| unknow | s3_4_c15_c3_5 | 0x0 | same |
| unknow | s3_4_c15_c3_6 | 0x0 | same |
| unknow | s3_4_c15_c3_7 | 0x0 | same |
| unknow | s3_4_c15_c4_0 | 0x4 | same |
| unknow | s3_4_c15_c4_6 | 0x0 | same |
| unknow | s3_4_c15_c4_7 | 0x100 | same |
| SYS_APL_s3_4_c15_c5_0 | s3_4_c15_c5_0 | 0: 0x0, 1: 0x1, 2: 0x2, 3: 0x3 | 0: 0x0, 1: 0x1, 2: 0x2, 3: 0x3 |
| unknow | s3_4_c15_c5_6 | 0x0 | same |
| unknow | s3_4_c15_c5_7 | 0x0 | same |
| unknow | s3_4_c15_c6_0 | 0x0 | same |
| unknow | s3_4_c15_c6_1 | 0x0 | same |
| unknow | s3_4_c15_c6_2 | 0x0 | same |
| unknow | s3_4_c15_c6_3 | 0x0 | same |
| unknow | s3_4_c15_c6_4 | 0: 0x803764000, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_4_c15_c6_5 | 0: 0x807e78000, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_4_c15_c6_6 | 0x0 | same |
| unknow | s3_4_c15_c6_7 | 0x0 | same |
| unknow | s3_4_c15_c9_0 | 0x0 | same |
| unknow | s3_4_c15_c9_1 | 0x0 | same |
| unknow | s3_4_c15_c9_2 | 0x0 | same |
| unknow | s3_4_c15_c9_3 | 0x0 | same |
| unknow | s3_4_c15_c9_4 | 0x0 | same |
| unknow | s3_4_c15_c9_5 | 0x0 | same |
| unknow | s3_4_c15_c10_4 | 0x3 | same |
| unknow | s3_4_c15_c10_5 | 0: 0xf78f2d05, 1: 0xf78f2d00, 2: 0xf78f2d26, 3: 0xf78f2c9e | 0: 0xf78f2dad, 1: 0xf78f2dc0, 2: 0xf78f2c61, 3: 0xf78f2d96 |
| unknow | s3_4_c15_c10_6 | 0: 0xf7a4d1e7, 1: 0xf7a4d206, 2: 0xf7a4d1a9, 3: 0xf7a4d1f8 | 0: 0xf7a4d17d, 1: 0xf7a4d155, 2: 0xf7a4d13b, 3: 0xf7a4d0ce |
| SYS_APL_CTRR_A_LWR_EL2 | s3_4_c15_c11_0 | 0x0 | same |
| SYS_APL_CTRR_A_UPR_EL2 | s3_4_c15_c11_1 | 0x0 | same |
| unknow | s3_4_c15_c11_2 | 0x0 | same |
| unknow | s3_4_c15_c11_3 | 0x0 | same |
| SYS_APL_CTRR_CTL_EL2 | s3_4_c15_c11_4 | 0x0 | same |
| SYS_APL_CTRR_LOCK_EL2 | s3_4_c15_c11_5 | 0x0 | same |
| unknow | s3_4_c15_c12_5 | 0x1 | same |
| unknow | s3_4_c15_c12_7 | 0x1 | same |
| unknow | s3_5_c15_c0_2 | 0xf | same |
| unknow | s3_5_c15_c0_3 | 0xf | same |
| unknow | s3_5_c15_c0_4 | 0x0 | same |
| SYS_APL_DPC_ERR_STS | s3_5_c15_c0_5 | 0x0 | same |
| unknow | s3_5_c15_c0_6 | 0x21f | same |
| unknow | s3_5_c15_c1_0 | 0x0 | same |
| SYS_APL_IPI_SR | s3_5_c15_c1_1 | 0x0 | same |
| SYS_APL_VM_LR | s3_5_c15_c1_2 | 0x1b0000001b | same |
| SYS_APL_VM_TMR_MASK | s3_5_c15_c1_3 | 0x0 | same |
| unknow | s3_5_c15_c2_0 | 0x0 | same |
| unknow | s3_5_c15_c3_0 | 0x0 | same |
| SYS_APL_IPI_CR | s3_5_c15_c3_1 | 0x600 | same |
| unknow | s3_5_c15_c3_2 | 0x0 | same |
| unknow | s3_5_c15_c3_4 | 0x0 | same |
| unknow | s3_5_c15_c3_5 | 0x0 | same |
| SYS_APL_ACC_CFG | s3_5_c15_c4_0 | 0xd | same |
| unknow | s3_5_c15_c4_1 | 0x103000f3e485001f | 0x1030108ee485001f |
| SYS_APL_CYC_OVRD | s3_5_c15_c5_0 | 0x0 | same |
| unknow | s3_5_c15_c5_2 | 0x0 | same |
| unknow | s3_5_c15_c5_4 | 0x0 | same |
| SYS_APL_ACC_OVRD | s3_5_c15_c6_0 | 0x180010102001c207 | same |
| unknow | s3_5_c15_c7_0 | 0x100 | same |
| unknow | s3_5_c15_c8_0 | 0x4 | same |
| unknow | s3_5_c15_c8_1 | 0xffffffff | same |
| unknow | s3_5_c15_c9_0 | 0x20001d1500f20014 | 0xc0000c0c00f20011 |
| unknow | s3_5_c15_c10_0 | 0: 0x135f81d102, 1: 0x155f81d102, 2: 0x155f81d102, 3: 0x155f81d102 | 0x125f81d102 |
| unknow | s3_5_c15_c10_1 | 0x0 | same |
| unknow | s3_5_c15_c12_0 | N/A | 0x0 |
| unknow | s3_5_c15_c12_1 | N/A | 0x0 |
| unknow | s3_5_c15_c12_2 | N/A | 0x0 |
| unknow | s3_5_c15_c12_3 | N/A | 0x0 |
| unknow | s3_5_c15_c12_4 | N/A | 0x0 |
| unknow | s3_5_c15_c12_5 | N/A | 0x0 |
| unknow | s3_5_c15_c13_4 | 0x0 | same |
| unknow | s3_5_c15_c13_5 | 0x0 | same |
| unknow | s3_5_c15_c14_2 | 0x0 | N/A |
| unknow | s3_5_c15_c14_3 | 0x0 | N/A |
| unknow | s3_5_c15_c14_4 | 0x0 | N/A |
| unknow | s3_5_c15_c14_5 | 0x0 | N/A |
| unknow | s3_5_c15_c14_6 | 0x0 | N/A |
| unknow | s3_5_c15_c14_7 | 0x0 | N/A |
| SYS_APL_MMU_ERR_STS | s3_6_c15_c0_0 | N/A | 0x0 |
| unknow | s3_6_c15_c1_0 | 0xff | same |
| unknow | s3_6_c15_c1_2 | 0x2d | same |
| unknow | s3_6_c15_c1_4 | 0x2d | same |
| SYS_APL_E_MMU_ERR_STS | s3_6_c15_c2_0 | 0x0 | N/A |
| unknow | s3_6_c15_c2_1 | 0: 0xa98f72dd06cff78c, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c2_2 | 0: 0xed4cec8ba2dfcb7a, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c2_3 | 0x0 | same |
| unknow | s3_6_c15_c2_4 | 0x0 | same |
| unknow | s3_6_c15_c2_5 | 0x0 | same |
| unknow | s3_6_c15_c2_7 | 0x10003 | same |
| unknow | s3_6_c15_c7_0 | 0: 0x9d2eb6e10fc2de1c, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_1 | 0: 0xb320fa6fe33ebf0c, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_2 | 0: 0x69a862c408583431, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_3 | 0: 0xc3377419c4330515, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_4 | 0: 0x3a3d2426c08769b, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_5 | 0: 0x178bc3c29bd833e3, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_6 | 0: 0x3fb11db82e47adc0, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c7_7 | 0: 0xe9e7ab1e3b357af9, 1: 0x0, 2: 0x0, 3: 0x0 | 0x0 |
| unknow | s3_6_c15_c8_0 | 0x0 | same |
| unknow | s3_6_c15_c8_3 | 0x0 | same |
| unknow | s3_6_c15_c8_6 | 0: 0x4, 1: 0x0, 2: 0x0, 3: 0x2 | 0x0 |
| unknow | s3_6_c15_c12_2 | 0x19 | same |
| unknow | s3_6_c15_c12_3 | 0x1 | same |
| SYS_APL_APSTS_EL1 | s3_6_c15_c12_4 | 0x1 | same |
| unknow | s3_6_c15_c12_5 | msr_trap | same |
| unknow | s3_6_c15_c12_6 | msr_trap | same |
| unknow | s3_6_c15_c12_7 | 0x0 | same |
| unknow | s3_6_c15_c13_0 | msr_trap | same |
| unknow | s3_6_c15_c13_1 | msr_trap | same |
| unknow | s3_6_c15_c13_2 | msr_trap | same |
| unknow | s3_6_c15_c13_3 | msr_trap | same |
| unknow | s3_6_c15_c13_4 | msr_trap | same |
| unknow | s3_6_c15_c13_5 | msr_trap | same |
| unknow | s3_6_c15_c13_6 | msr_trap | same |
| unknow | s3_6_c15_c13_7 | msr_trap | same |
| unknow | s3_6_c15_c14_0 | msr_trap | same |
| unknow | s3_6_c15_c14_1 | msr_trap | same |
| unknow | s3_6_c15_c14_2 | 0xff | same |
| unknow | s3_6_c15_c14_4 | 0x0 | same |
| unknow | s3_6_c15_c14_5 | 0x0 | same |
| ACTLR_EL12 | s3_6_c15_c14_6 | 0x1c00 | same |
| unknow | s3_6_c15_c14_7 | 0x0 | same |
| unknow | s3_6_c15_c15_0 | 0xc | same |
| unknow | s3_6_c15_c15_1 | 0x0 | same |
| unknow | s3_6_c15_c15_4 | 0x0 | same |
| unknow | s3_7_c15_c0_0 | 0x0 | same |
| unknow | s3_7_c15_c0_1 | 0xa000000000000000 | same |
| unknow | s3_7_c15_c0_2 | 0x0 | same |
| unknow | s3_7_c15_c0_3 | 0: 0x2a567a31, 1: 0x8cd7fb37, 2: 0x85d69856, 3: 0x5f962515 | 0: 0xa01c7ebb, 1: 0xf1d040e2, 2: 0x26a7089, 3: 0xca819736 |
| SYS_APL_UPMCR0 | s3_7_c15_c0_4 | 0xffff40000 | same |
| SYS_APL_UPMC8 | s3_7_c15_c0_5 | 0x0 | same |
| unknow | s3_7_c15_c1_0 | 0x0 | same |
| unknow | s3_7_c15_c1_1 | 0: 0x3e9e3dbaca, 1: 0x3a337f6378, 2: 0x3397a1018c, 3: 0x2fa9b50ecd | 0: 0x265ae446414, 1: 0x142af81376a, 2: 0xdaa770cf5b, 3: 0x9bd5f09dbf |
| unknow | s3_7_c15_c1_2 | 0x0 | same |
| unknow | s3_7_c15_c1_3 | 0x8000 | same |
| SYS_APL_UPMESR0 | s3_7_c15_c1_4 | 0x0 | same |
| SYS_APL_UPMC9 | s3_7_c15_c1_5 | 0x0 | same |
| unknow | s3_7_c15_c2_0 | 0x0 | same |
| unknow | s3_7_c15_c2_1 | 0: 0x46ef23ffce, 1: 0x46ef23f595, 2: 0x46ef24aabb, 3: 0x46ef24b798 | 0: 0x19bd9345ce3, 1: 0x19bd932c7a1, 2: 0x19bd932ea66, 3: 0x19bd9324fda |
| unknow | s3_7_c15_c2_2 | 0: 0x52c45d4fdd, 1: 0x52c45cacd5, 2: 0x52c45e3324, 3: 0x52c45d4132 | 0: 0x65798551b9, 1: 0x657984f629, 2: 0x657983bb88, 3: 0x65798393f2 |
| unknow | s3_7_c15_c2_3 | 0: 0xa46fb60c, 1: 0xf14de1df, 2: 0x5871e658, 3: 0xd72193aa | 0: 0xa7358631, 1: 0x2bc883bc, 2: 0x69180c1b, 3: 0x40bcc243 |
| unknow | s3_7_c15_c2_4 | 0x0 | same |
| SYS_APL_UPMC10 | s3_7_c15_c2_5 | 0x0 | same |
| unknow | s3_7_c15_c3_2 | 0x8100 | same |
| unknow | s3_7_c15_c3_3 | 0x8100 | same |
| SYS_APL_UPMECM0 | s3_7_c15_c3_4 | 0x0 | same |
| SYS_APL_UPMC11 | s3_7_c15_c3_5 | 0x0 | same |
| unknow | s3_7_c15_c4_0 | 0x1 | same |
| unknow | s3_7_c15_c4_2 | 0x2d | 0x0 |
| unknow | s3_7_c15_c4_3 | 0: 0x3166, 1: 0x2823, 2: 0x2288, 3: 0x21c6 | 0: 0x11ac, 1: 0xa95, 2: 0x5c0, 3: 0xd0d5 |
| SYS_APL_UPMECM1 | s3_7_c15_c4_4 | 0x0 | same |
| SYS_APL_UPMC12 | s3_7_c15_c4_5 | 0x0 | same |
| unknow | s3_7_c15_c5_0 | 0x1 | same |
| unknow | s3_7_c15_c5_2 | 0x8e00 | same |
| unknow | s3_7_c15_c5_3 | 0x8700 | same |
| SYS_APL_UPMPCM | s3_7_c15_c5_4 | 0x1 | 0x10 |
| SYS_APL_UPMC13 | s3_7_c15_c5_5 | 0x0 | same |
| unknow | s3_7_c15_c6_2 | 0x7d38 | 0x0 |
| unknow | s3_7_c15_c6_3 | 0: 0x0, 1: 0x0, 2: 0xe, 3: 0x1f | 0x0 |
| SYS_APL_UPMSR | s3_7_c15_c6_4 | 0x0 | same |
| SYS_APL_UPMC14 | s3_7_c15_c6_5 | 0x0 | same |
| unknow | s3_7_c15_c7_2 | 0x9e00 | same |
| unknow | s3_7_c15_c7_3 | 0x8e00 | same |
| SYS_APL_UPMC0 | s3_7_c15_c7_4 | 0x0 | same |
| SYS_APL_UPMC15 | s3_7_c15_c7_5 | 0x0 | same |
| unknow | s3_7_c15_c8_2 | 0: 0x3b191f3d7d, 1: 0x3b190bb126, 2: 0x3b191dcc2d, 3: 0x3b190c3f84 | 0: 0x31976d0490, 1: 0x31976abc74, 2: 0x31976d1d56, 3: 0x31976e2460 |
| unknow | s3_7_c15_c8_3 | 0x0 | same |
| SYS_APL_UPMC1 | s3_7_c15_c8_4 | 0x0 | same |
| SYS_APL_UPMECM2 | s3_7_c15_c8_5 | 0x0 | same |
| unknow | s3_7_c15_c9_2 | 0x8000 | same |
| unknow | s3_7_c15_c9_3 | 0x0 | same |
| SYS_APL_UPMC2 | s3_7_c15_c9_4 | 0x0 | same |
| SYS_APL_UPMECM3 | s3_7_c15_c9_5 | 0x0 | same |
| unknow | s3_7_c15_c10_2 | 0: 0x11151b5a1f, 1: 0x11151b601a, 2: 0x11151b7681, 3: 0x11151b6a85 | 0: 0xecf8ce277, 1: 0xecf8c527b, 2: 0xecf8c3e25, 3: 0xecf8c2c1c |
| unknow | s3_7_c15_c10_3 | 0x0 | same |
| SYS_APL_UPMC3 | s3_7_c15_c10_4 | 0x0 | same |
| unknow | s3_7_c15_c10_5 | 0x0 | same |
| unknow | s3_7_c15_c11_2 | 0x8600 | same |
| unknow | s3_7_c15_c11_3 | 0x0 | same |
| SYS_APL_UPMC4 | s3_7_c15_c11_4 | 0x0 | same |
| SYS_APL_UPMESR1 | s3_7_c15_c11_5 | 0x0 | same |
| unknow | s3_7_c15_c12_2 | 0x265be | 0x1a4ee |
| unknow | s3_7_c15_c12_3 | 0x0 | same |
| SYS_APL_UPMC5 | s3_7_c15_c12_4 | 0x0 | same |
| unknow | s3_7_c15_c13_2 | 0x9c00 | same |
| unknow | s3_7_c15_c13_3 | 0x0 | same |
| SYS_APL_UPMC6 | s3_7_c15_c13_4 | 0x0 | same |
| unknow | s3_7_c15_c14_2 | 0x46c0 | 0x7fde |
| unknow | s3_7_c15_c14_3 | 0x0 | same |
| SYS_APL_UPMC7 | s3_7_c15_c14_4 | 0x0 | same |
| unknow | s3_7_c15_c15_2 | 0x9d00 | same |
| unknow | s3_7_c15_c15_3 | 0x0 | same |

