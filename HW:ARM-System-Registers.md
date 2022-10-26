See [[HW:ARM System Registers Dumps]] for exhaustive enumeration and research.

## Glossary

Some of these are guesses

* ACC: Apple Core Cluster
* HID: Hardware Implementation Defined Register
* EHID: Hardware Implementation Defined Register (e-core)
* IPI: Inter-processor Interrupt

## Register definitions

Using Linux format:
```c

/* These make sense... */
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
#define SYS_APL_HID13_EL?           sys_reg(3, 0, 15, 14, 0)
#define SYS_APL_HID14_EL?           sys_reg(3, 0, 15, 15, 0)

/* All sanity went out the window here */
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

/* Note: out of order wrt above */
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

### HID registers

This naming convention most likely comes from PowerPC. A lot of chicken bits
seem to be located here.

These are mostly chicken bits to disable CPU features, and likely many only apply only to certain CPU generations. However, their definitions are global.

#### SYS_APL_HID0_EL1

* [20] Loop Buffer Disable
* [21] AMX Cache Fusion Disable
* [25] IC Prefetch Limit One "Brn"
* [28] Fetch Width Disable
* [33] PMULL Fuse Disable
* [36] Cache Fusion Disable
* [45] Same Pg (page?) Power Optimization
* [62:60] Instruction Cache Prefetch Depth

#### SYS_APL_EHID0_EL1

* [45] nfpRetFwdDisb

#### SYS_APL_HID1_EL1

* [14] Disable CMP-Branch Fusion
* [15] ForceMextL3ClkOn
* [23] rccForceAllIexL3ClksOn
* [24] rccDisStallInactiveIexCtl
* [25] disLspFlushWithContextSwitch
* [44] Disable AES Fusion across groups
* [49] Disable MSR Speculation DAIF
* [54] Trap SMC
* [58] enMDSBStallPipeLineECO
* [60] Enable Branch Kill Limit / SpareBit6

#### SYS_APL_EHID1_EL1

* [30] Disable MSR Speculation DAIF


#### SYS_APL_HID2_EL1

* [13] Disable MMU MTLB Prefetch
* [17] Force Purge MTB

#### SYS_APL_EHID2_EL1

* [17] Force Purge MTB

#### SYS_APL_HID3_EL1

* [2] Disable Color Optimization
* [25] Disable DC ZVA Command Only
* [44] Disable Arbiter Fix BIF CRD
* [54] Disable Xmon Snp Evict Trigger L2 Starvation Mode
* [63] Dev Pcie Throttle Enable

#### SYS_APL_EHID3_EL1

* [2] Disable Color Optimization
* [25] Disable DC ZVA Command Only

#### SYS_APL_HID4_EL1

* [1] Disable STNT Widget
* [9] Disable Speculative LS Redirect
* [11] Disable DC MVA Ops
* [33] Disable Speculative Lnch Read
* [39] Force Ns Ord Ld Req No Older Ld (Non-speculative Ordered Load Requires No Older Load?)
* [41:40] Cnf Counter Threshold
* [44] Disable DC SW L2 Ops
* [49] Enable Lfsr Stall Load Pipe 2 Issue
* [53] Enable Lfsr Stall Stq Replay

#### SYS_APL_HID5_EL1

* [15:14] Crd Edb Snp Rsvd
* [44] Disable HWP Load
* [45] Disable HWP Store
* [54] Enable Dn FIFO Read Stall
* [57] Disable Full Line Write
* [61] Disable Fill 2C Merge

#### SYS_APL_EHID5_EL1

* [35] Disable Fill Bypass

#### SYS_APL_HID6_EL1

* [9:5] Up Crd Tkn Init C2
* [55] Disable ClkDiv Gating

#### SYS_APL_HID7_EL1

* [7] Disable Cross Pick 2
* [10] Disable Nex Fast FMUL
* [16] Force Non Speculative If Spec Flush Ptr Invalid And MP Valid
* [20] Force Non Speculative If Stepping
* [25:24] Force Non Speculative Target Timer Sel

#### SYS_APL_HID8_EL1

* [7:4] DataSetID0
* [11:8] DataSetID1
* [35] Wke Force Strict Order
* [59:56] DataSetID2
* [63:60] DataSetID3

#### SYS_APL_HID9_EL1

* [16] TSO Enable
* [26] TSO Allow DC ZVA WC
* [29] TSO Serialize VLD Microops
* [48] EnableFixBug51667805
* [49] EnableFixBug51667717
* [50] EnableFixBug57817908
* [52] Disable STNT (Store Non-Temporal?) Widget For Unaligned
* [53] EnableFixBug58566122
* [54] EnableFixBug47221499
* [55] HidEnFix55719865

#### SYS_APL_EHID9_EL1

* [5] Dev Throttle 2 Enable

#### SYS_APL_HID10_EL1

* [0] Disable Hwp Gups

#### SYS_APL_EHID10_EL1

* [19] RCC Disable Power Save Prf (performance?) Clock Off
* [32] Force Wait State Drain UC
* [49] Disable ZVA Temporal TSO

#### SYS_APL_HID11_EL1

* [1] Disable X64 NT Lnch Optimization
* [7] Disable Fill C1 Bub(ble?) Optimization
* [15] HID Enable Fix UC 55719865
* [23] Disable Fast Drain Optimization
* [59] Disable LDNT (Load Non-Temporal?) Widget

#### SYS_APL_EHID11_EL1

* [41:40] SMB Drain Threshold

#### SYS_APL_HID13_EL1

* [17:14] PreCyc
* [63:60] Reset Cycle count

#### SYS_APL_HID14_EL1

* [?:0] Nex Sleep Timeout Cyclone
* [32] Nex Power Gating Enable

#### SYS_APL_HID16_EL1

* [18] LEQ Throttle Aggr
* [56] SpareBit0
* [57] Enable RS4 Sec
* [59] SpareBit3
* [60] Disable xPick RS 45
* [61] Enable MPx Pick 45
* [62] Enable MP Cyclone 7
* [63] SpareBit7

#### SYS_APL_HID17_EL1

* [2:0] Crd Edb Snp Rsvd

#### SYS_APL_HID18_EL1

* [14] HVC Speculation Disable
* [49] SpareBit17

#### SYS_APL_EHID20_EL1

* [8] Trap SMC
* [15] Force Nonspeculation If Oldest Redir Valid And Older
* [16] Force Nonspeculation If Spec Flush Pointer != Blk Rtr Pointer
* [22:21] Force Nonspeculation Targeted Timer

#### SYS_APL_HID21_EL1

* [19] Enable LDREX Fill Reply
* [33] LDQ RTR Wait For Old ST Rel Cmpl
* [34] Disable Cdp Reply Purged Trans

### ACC/CYC Registers

These seem to relate to the core complex and power management configuration

#### SYS_APL_ACC_OVRD_EL1

* [14:13] OK To Power Down SRM (3=deepsleep)
* [16:15] Disable L2 Flush For ACC Sleep (2=deepsleep)
* [18:17] OK To Train Down Link (3=deepsleep)
* [26:25] OK To Power Down CPM (2=deny 3=deepsleep)
* [28:27] CPM Wakeup (3=force)
* [29] Disable Clock Dtr
* [32] Disable PIO On WFI CPU
* [34] Enable Deep Sleep

#### SYS_APL_ACC_CFG_EL1

Branch predictor state retention across ACC sleep

* [3:2] BP Sleep (2=BDP, 3=BTP)

#### SYS_APL_CYC_OVRD_EL1

* [0] Disable WFI Return
* [25:24] OK To Power Down (2=force up, 3=force down)
* [21:20] FIQ mode (2=disable)
* [23:22] IRQ mode (2=disable)

### Memory subsystem registers

Mainly error control?

#### SYS_APL_LSU_ERR_STS_EL1

* [54] L1 DTLB Multi Hit Enable

#### SYS_APL_LSU_ERR_CTL_EL1

* [3] L1 DTLB Multi Hit Enable

#### SYS_APL_L2C_ERR_STS_EL1

L2 subsystem fault control and info. This register is cluster-level and shared among all cores within a cluster.

* [1] Recursive fault (fault occurred while another fault was pending?)
* [7] Access fault (unmapped physical address, etc)
* [38..34] Enable flags? (all 1 on entry from iBoot)
* [39] Enable SError interrupts (asynchronous errors)
* [43..40] Enable flags? (all 1 on entry from iBoot)
* [56] Enable write-1-to-clear behavior for fault flags
* [60] Some enable? (1 on entry)

#### SYS_APL_L2C_ERR_ADR_EL1

Fault address for L2 subsystem fault.

* [?:0] Physical address of the fault
* [42] ? sometimes 1 after a recursive instruction fetch fault
* [57:55] 5=data write 6=data read 7=instruction fetch?
* [62..61] Core within cluster that caused fault

#### SYS_APL_L2C_ERR_INF_EL1

L2 subsystem error information.

Low bits values seen:

Writes:

* 1: Write to unmapped or protected space, or nGnRnE write to PCIe BAR space
* 2: 8-bit or 16-bit write to 32-bit only peripheral
* 3: nGnRE write to SoC I/O space

Reads:

* 1: Read from unmapped or protected space

Higher bits:

* [26] Something to do with address alignment (seen on 16-bit and 32-bit reads/writes to addr 4 mod 8)

### CTRR Registers

Configurable Text Read-only Region

#### SYS_APL_CTRR_CTL_EL1

* [0] A MMU off write protect
* [1] A MMU on write protect
* [2] B MMU off write protect
* [3] B MMU on write protect
* [4] A PXN
* [5] B PXN
* [6] A UXN
* [7] B UXN

### APRR Registers

#### SYS_APL_APRR_EL0 / SYS_APL_APRR_EL1

This is a table. The value is a 4-bit field:

* [0] X
* [1] W
* [2] R

The index is the access protection and execution protection settings for a PTE.

* [0] XN
* [1] PXN
* [2] AP[0]
* [3] AP[1]

The register value is 16 4-bit fields, in natural order ((_rwx) << (4*prot)).

### IPI registers

These are used for "fast" IPIs not using AIC

#### SYS_APL_IPI_RR_LOCAL_EL1

* [3:0] Target CPU
* [29:28] RR Type (0=immediate, 1=retract, 2=deferred, 3=nowake)

#### SYS_APL_IPI_RR_GLOBAL_EL1

* [3:0] Target CPU
* [20:16] Target cluster
* [29:28] RR Type (0=immediate, 1=retract, 2=deferred, 3=nowake)

#### SYS_APL_IPI_CR_EL1

Global register.

* [15:0] Deferred IPI countdown value (in REFCLK ticks)

#### SYS_APL_VM_TMR_LR_EL2

(Name unofficial)

Seems to be similar to ICH_LR<n>_EL2 in GIC; state gets set to pending (63:62 == 1) when guest CNTV fires, is not masked in SYS_APL_HV_TMR_MASK, and is masked in HACR_EL2.

#### SYS_APL_VM_TMR_FIQ_ENA_EL2

(Name unofficial)

* [0] CNTV guest timer mask bit (1=enable FIQ, 0=disable FIQ)
* [1] CNTP guest timer mask bit (1=enable FIQ, 0=disable FIQ)

#### SYS_APL_IPI_SR_EL1

Status register

* [0] IPI pending (write 1 to clear)

Needs a barrier (ISB SY) after clearing to avoid races with IPI handling.

### Virtual Memory System Architecture Lock

#### SYS_APL_VMSA_LOCK_EL1

* [0] Lock VBAR
* [1] Lock SCTLR
* [2] Lock TCR
* [3] Lock TTBR0
* [4] Lock TTBR1
* [63] Lock SCTLR M bit

This is used to lock down writes to some Arm registers for security reasons at boot time.

### Pointer Authentication related registers

#### SYS_APL_APCTL_EL1

* [0] Apple Mode
* [1] Kernel Key enable
* [2] AP Key 0 Enable
* [3] AP Key 1 Enable
* [4] User Key Enable

#### SYS_APL_APSTS_EL1

* [0] M Key Valid

### Performance Counter registers

Writes to the control register need `isb` to take effect.

#### SYS_APL_PMC0-9_EL1

Performance counter. 48 bits, bit 47 triggers PMI.
* PMC #0: fixed cpu cycle count if enabled
* PMC #1: fixed instruction count if enabled

#### SYS_APL_PMCR0_EL1

* [7:0] Counter enable for PMC #7-0
* [10:8] Interrupt mode (0=off 1=PMI 2=AIC 3=HALT 4=FIQ)
* [11] PMI interrupt is active (write 0 to clear)
* [19:12] Enable PMI for PMC #7-0
* [20] Disable counting on a PMI
* [22] Block PMIs until after eret
* [23] Count global (not just core) L2C events
* [30] User-mode access to registers enable
* [33:32] Counter enable for PMC #9-8
* [45:44] Enable PMI for PMC #9-8

#### SYS_APL_PMCR1_EL1

Controls which ELx modes count events

* [7:0] EL0 A32 enable PMC #0-7 (not implemented on modern chips)
* [15:8] EL0 A64 enable PMC #0-7
* [23:16] EL1 A64 enable PMC #0-7
* [31:24] EL3 A64 enable PMC #0-7 (not implemented except on old chips with EL3)
* [33:32] EL0 A32 enable PMC #9-8 (not implemented on modern chips)
* [41:40] EL0 A64 enable PMC #9-8
* [49:48] EL1 A64 enable PMC #9-8
* [57:56] EL3 A64 enable PMC #9-8 (not implemented on modern chips)

#### SYS_APL_PMCR2_EL1

Controls watchpoint registers.

#### SYS_APL_PMCR3_EL1

Controls breakpoints and address matching.

#### SYS_APL_PMCR4_EL1

Controls opcode matching.

#### SYS_APL_PMSR_EL1

* [9:0] Overflow detected on PMC #9-0

#### SYS_APL_PMESR0_EL1

Event selection register for PMC #2-5

* [7:0] event for PMC #2
* [15:8] event for PMC #3
* [23:16] event for PMC #4
* [31:24] event for PMC #5

#### SYS_APL_PMESR1_EL1

Event selection register for PMC #6-9

* [7:0] event for PMC #6
* [15:8] event for PMC #7
* [23:16] event for PMC #8
* [31:24] event for PMC #9

#### SYS_APL_UPMCx_EL1

Uncore PMCs. 48 bits wide, bit 47 is an overflow bit and triggers a PMI.

#### SYS_APL_UPMCR0_EL1

* [15:0] Counter enable for counter #15-0
* [18:16] Interrupt mode (0=off 2=AIC 3=HALT 4=FIQ)
* [35:20] Enable PMI for counter #15-0

#### SYS_APL_UPMSR_EL1

* [0] Uncore PMI
* [1] CTI
* [17:2] Overflow on uncore counter #15-0

#### SYS_APL_UPMPCM_EL1

* [7:0] PMI core mask for uncore PMIs - which cores have PMIs delivered to them

#### SYS_APL_UPMESR0_EL1

Event selection register

#### SYS_APL_UPMESR1_EL1

Event selection register

#### SYS_APL_UPMECM[0-3]_EL1

Sets core masks for each event in the cluster, i.e. only events from those cores will be counted in uncore PMCs.

### General config registers

#### ACTLR_EL1 (ARM standard-not-standard)

* [1] Enable TSO
* [3] Disable HWP
* [4] Enable APFLG
* [5] Enable Apple FP extensions. This makes FPCR.FZ a don't care, and replaces it with AFPCR.DAZ and AFPCR.FTZ.
* [6] Enable PRSV
* [12] IC IVAU Enable ASID

#### HACR_EL2 (ARM standard-not-standard)

* [20] Mask guest CNTV timer (1=masked)

This works differently from SYS_APL_GTIMER_MASK; that one masks the timers earlier, this one leaves the FIQ "pending" in SYS_APL_HV_TMR_LR.

### Floating-point and AMX registers

#### SYS_APL_AFPCR_EL0

Apple-specific floating point related bits.

* [0] DAZ (Denormals as Zero)
* [1] FTZ (Flush to Zero)

These implement the SSE equivalent mode bits. This must be enabled to be useful, with ACTLR_EL1.AFP.

The AArch64 FEAT_AFT feature implements equivalent support, but Apple implemented it before it was standardized. The standard version is that you need to set FPSCR[1] (AH) to 1, and then FPCR[0] (FIZ) is like DAZ, and FPCR[24] (FZ) is like FTZ.

### ID registers

#### MIDR_EL1 (ARM standard)

* [15:4] PartNum
  * 2: Fiji (A8 / H7P)
  * 3: Capri (A8X / H7G)
  * 4: Maui (A9 / H8P)
  * 5: Elba (A9X / H8G)
  * 6: Cayman (A10 / H9P)
  * 7: Myst (A10X / H9G)
  * 8: Skye Monsoon (A11 / H10 p-core)
  * 9: Skye Mistral (A11 / H10 e-core)
  * 11: Cyprus Vortex (A12 / H11P p-core)
  * 12: Cyprus Tempest (A12 / H11P e-core)
  * 15: M9 (S4/S5)
  * 16: Aruba Vortex (A12X/Z / H11G p-core)
  * 17: Aruba Tempest (A12X/Z / H11G e-core)
  * 18: Cebu Lightning (A13 / H12 p-core)
  * 19: Cebu Thunder (A13 / H12 e-core)
  * 34: M1 Icestorm (H13G e-core)
  * 35: M1 Firestorm (H13G p-core)
  * 38: Turks (S6 / M10)

* [31:24] Implementer (0x61 = 'a' = Apple)

#### MPIDR_EL1 (ARM standard)

* [23:16] Aff2: 0: e-core, 1:p-core
* [15:8] Aff1: Cluster ID
* [7:0] Aff0: CPU ID

#### AIDR_EL1 (ARM standard-not-standard)

* [0] MUL53
* [1] WKDM
* [2] ARCHRETENTION
* [4] AMX
* [9] TSO
* [19] APFLG
* [20] PSRV

### Unknown registers

#### s3_6_c15_c1_0_EL1 / s3_6_c15_c1_5_EL1 / s3_6_c15_c1_6_EL1

These look like a newer version of APRR

#### s3_4_c15_c5_0_EL1

This gets written with the core ID (within the cluster) during init.

#### AHCR_EL2

Encoding unknown. Related to ACTLR_EL1[12].


#### s3_4_c15_c10_4

If a core writes 0x3 to it's copy of the register, AICv2 will not send IRQs to that core. FIQs unaffected, as those are part of the core complexes themselves. (0x1 and 0x2 are also valid values for this sysreg, however their effect is unknown). Maybe some kind of "affinity" for the hardware IRQ selection heuristic?