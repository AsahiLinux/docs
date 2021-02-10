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
#define SYS_APL_HID0            sys_reg(3, 0, 15, 0, 0)
#define SYS_APL_HID1            sys_reg(3, 0, 15, 1, 0)
#define SYS_APL_EHID1           sys_reg(3, 0, 15, 1, 1)
#define SYS_APL_HID2            sys_reg(3, 0, 15, 2, 0)
#define SYS_APL_EHID2           sys_reg(3, 0, 15, 2, 1)
#define SYS_APL_HID3            sys_reg(3, 0, 15, 3, 0)
#define SYS_APL_EHID3           sys_reg(3, 0, 15, 3, 1)
#define SYS_APL_HID4            sys_reg(3, 0, 15, 4, 0)
#define SYS_APL_EHID4           sys_reg(3, 0, 15, 4, 1)
#define SYS_APL_HID5            sys_reg(3, 0, 15, 5, 0)
#define SYS_APL_EHID5           sys_reg(3, 0, 15, 5, 1)
#define SYS_APL_HID6            sys_reg(3, 0, 15, 6, 0)
#define SYS_APL_HID7            sys_reg(3, 0, 15, 7, 0)
#define SYS_APL_HID8            sys_reg(3, 0, 15, 8, 0)
#define SYS_APL_HID9            sys_reg(3, 0, 15, 9, 0)
#define SYS_APL_EHID9           sys_reg(3, 0, 15, 9, 1)
#define SYS_APL_HID10           sys_reg(3, 0, 15, 10, 0)
#define SYS_APL_EHID10          sys_reg(3, 0, 15, 10, 1)
#define SYS_APL_HID11           sys_reg(3, 0, 15, 11, 0)
#define SYS_APL_EHID11          sys_reg(3, 0, 15, 11, 1)

/* Uh oh */
#define SYS_APL_HID13           sys_reg(3, 0, 15, 14, 0)
#define SYS_APL_HID14           sys_reg(3, 0, 15, 15, 0)

/* All sanity went out the window here */
#define SYS_APL_HID16           sys_reg(3, 0, 15, 15, 2)
#define SYS_APL_HID17           sys_reg(3, 0, 15, 15, 5)
#define SYS_APL_HID18           sys_reg(3, 0, 15, 11, 2)
#define SYS_APL_EHID20          sys_reg(3, 0, 15, 1, 2)
#define SYS_APL_HID21           sys_reg(3, 0, 15, 1, 3)

#define SYS_APL_PMCR0           sys_reg(3, 1, 15, 0, 0)
#define SYS_APL_PMCR1           sys_reg(3, 1, 15, 1, 0)
#define SYS_APL_PMCR2           sys_reg(3, 1, 15, 2, 0)
#define SYS_APL_PMCR3           sys_reg(3, 1, 15, 3, 0)
#define SYS_APL_PMCR4           sys_reg(3, 1, 15, 4, 0)
#define SYS_APL_PMESR0          sys_reg(3, 1, 15, 5, 0)
#define SYS_APL_PMESR1          sys_reg(3, 1, 15, 6, 0)
#define SYS_APL_PMSR            sys_reg(3, 1, 15, 13, 0)

#define SYS_APL_PMC0            sys_reg(3, 2, 15, 0, 0)
#define SYS_APL_PMC1            sys_reg(3, 2, 15, 1, 0)
#define SYS_APL_PMC2            sys_reg(3, 2, 15, 2, 0)
#define SYS_APL_PMC3            sys_reg(3, 2, 15, 3, 0)
#define SYS_APL_PMC4            sys_reg(3, 2, 15, 4, 0)
#define SYS_APL_PMC5            sys_reg(3, 2, 15, 5, 0)
#define SYS_APL_PMC6            sys_reg(3, 2, 15, 6, 0)
#define SYS_APL_PMC7            sys_reg(3, 2, 15, 7, 0)
#define SYS_APL_PMC8            sys_reg(3, 2, 15, 9, 0)
#define SYS_APL_PMC9            sys_reg(3, 2, 15, 10, 0)

#define SYS_APL_LSU_ERR_STS     sys_reg(3, 3, 15, 0, 0)
#define SYS_APL_E_LSU_ERR_STS   sys_reg(3, 3, 15, 2, 0)
#define SYS_APL_LSU_ERR_CTL     sys_reg(3, 3, 15, 1, 0)

#define SYS_APL_L2C_ERR_STS     sys_reg(3, 3, 15, 8, 0)
#define SYS_APL_L2C_ERR_ADR     sys_reg(3, 3, 15, 9, 0)
#define SYS_APL_L2C_ERR_INF     sys_reg(3, 3, 15, 10, 0)

#define SYS_APL_FED_ERR_STS     sys_reg(3, 4, 15, 0, 0)
#define SYS_APL_E_FED_ERR_STS   sys_reg(3, 4, 15, 0, 2)

#define SYS_APL_APCTL_EL1       sys_reg(3, 4, 15, 0, 4)
#define SYS_APL_KERNELKEYLO_EL1 sys_reg(3, 4, 15, 1, 0)
#define SYS_APL_KERNELKEYHI_EL1 sys_reg(3, 4, 15, 1, 1)

#define SYS_APL_VMSA_LOCK       sys_reg(3, 4, 15, 1, 2)

#define SYS_APL_APRR_EL0        sys_reg(3, 4, 15, 2, 0)
#define SYS_APL_APRR_EL1        sys_reg(3, 4, 15, 2, 1)

#define SYS_APL_CTRR_LOCK_EL1   sys_reg(3, 4, 15, 2, 2)
#define SYS_APL_CTRR_A_LWR_EL1  sys_reg(3, 4, 15, 2, 3)
#define SYS_APL_CTRR_A_UPR_EL1  sys_reg(3, 4, 15, 2, 4)
#define SYS_APL_CTRR_CTL_EL1    sys_reg(3, 4, 15, 2, 5)

#define SYS_APL_APRR_JIT_ENABLE sys_reg(3, 4, 15, 2, 6)
#define SYS_APL_APRR_JIT_MASK   sys_reg(3, 4, 15, 2, 7)

#define SYS_APL_s3_4_c15_c5_0   sys_reg(3, 4, 15, 5, 0)

#define SYS_APL_CTRR_LOCK_EL2   sys_reg(3, 4, 15, 11, 5)
#define SYS_APL_CTRR_A_LWR_EL2  sys_reg(3, 4, 15, 11, 0)
#define SYS_APL_CTRR_A_UPR_EL2  sys_reg(3, 4, 15, 11, 1)
#define SYS_APL_CTRR_CTL_EL2    sys_reg(3, 4, 15, 11, 4)

#define SYS_APL_IPI_RR_LOCAL    sys_reg(3, 5, 15, 0, 0)
#define SYS_APL_IPI_RR_GLOBAL   sys_reg(3, 5, 15, 0, 1)

#define SYS_APL_DPC_ERR_STS     sys_reg(3, 5, 15, 0, 5)

#define SYS_APL_IPI_SR          sys_reg(3, 5, 15, 1, 1)

#define SYS_APL_HV_LR           sys_reg(3, 5, 15, 1, 2)
#define SYS_APL_HV_TMR_MASK     sys_reg(3, 5, 15, 1, 3)

#define SYS_APL_IPI_CR          sys_reg(3, 5, 15, 3, 1)

#define SYS_APL_ACC_CFG         sys_reg(3, 5, 15, 4, 0)
#define SYS_APL_CYC_OVRD        sys_reg(3, 5, 15, 5, 0)
#define SYS_APL_ACC_OVRD        sys_reg(3, 5, 15, 6, 0)
#define SYS_APL_ACC_EBLK_OVRD   sys_reg(3, 5, 15, 6, 1)

#define SYS_APL_MMU_ERR_STS     sys_reg(3, 6, 15, 0, 0)

#define SYS_APL_E_MMU_ERR_STS   sys_reg(3, 6, 15, 2, 0)

#define SYS_APL_APSTS_EL1       sys_reg(3, 6, 15, 12, 4)

#define SYS_APL_UPMCR0          sys_reg(3, 7, 15, 0, 4)
#define SYS_APL_UPMESR0         sys_reg(3, 7, 15, 1, 4)
#define SYS_APL_UPMECM0         sys_reg(3, 7, 15, 3, 4)
#define SYS_APL_UPMECM1         sys_reg(3, 7, 15, 4, 4)
#define SYS_APL_UPMPCM          sys_reg(3, 7, 15, 5, 4)
#define SYS_APL_UPMSR           sys_reg(3, 7, 15, 6, 4)
#define SYS_APL_UPMECM2         sys_reg(3, 7, 15, 8, 5)
#define SYS_APL_UPMECM3         sys_reg(3, 7, 15, 9, 5)
#define SYS_APL_UPMESR1         sys_reg(3, 7, 15, 11, 5)

/* Note: out of order wrt above */
#define SYS_APL_UPMC0           sys_reg(3, 7, 15, 7, 4)
#define SYS_APL_UPMC1           sys_reg(3, 7, 15, 8, 4)
#define SYS_APL_UPMC2           sys_reg(3, 7, 15, 9, 4)
#define SYS_APL_UPMC3           sys_reg(3, 7, 15, 10, 4)
#define SYS_APL_UPMC4           sys_reg(3, 7, 15, 11, 4)
#define SYS_APL_UPMC5           sys_reg(3, 7, 15, 12, 4)
#define SYS_APL_UPMC6           sys_reg(3, 7, 15, 13, 4)
#define SYS_APL_UPMC7           sys_reg(3, 7, 15, 14, 4)
#define SYS_APL_UPMC8           sys_reg(3, 7, 15, 0, 5)
#define SYS_APL_UPMC9           sys_reg(3, 7, 15, 1, 5)
#define SYS_APL_UPMC10          sys_reg(3, 7, 15, 2, 5)
#define SYS_APL_UPMC11          sys_reg(3, 7, 15, 3, 5)
#define SYS_APL_UPMC12          sys_reg(3, 7, 15, 4, 5)
#define SYS_APL_UPMC13          sys_reg(3, 7, 15, 5, 5)
#define SYS_APL_UPMC14          sys_reg(3, 7, 15, 6, 5)
#define SYS_APL_UPMC15          sys_reg(3, 7, 15, 7, 5)
```

### HID registers

This naming convention most likely comes from PowerPC. A lot of chicken bits
seem to be located here.

These are mostly chicken bits to disable CPU features, and likely many only apply only to certain CPU generations. However, their definitions are global.

#### SYS_APL_HID0

* [20] Loop Buffer Disable
* [21] AMX Cache Fusion Disable
* [25] IC Prefetch Limit One "Brn"
* [28] Fetch Width Disable
* [33] PMULL Fuse Disable
* [36] Cache Fusion Disable
* [45] Same Pg (page?) Power Optimization
* [62:60] Instruction Cache Prefetch Depth

#### SYS_APL_EHID0

* [45] nfpRetFwdDisb

#### SYS_APL_HID1

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

#### SYS_APL_EHID1

* [30] Disable MSR Speculation DAIF


#### SYS_APL_HID2

* [13] Disable MMU MTLB Prefetch
* [17] Force Purge MTB

#### SYS_APL_EHID2

* [17] Force Purge MTB

#### SYS_APL_HID3

* [2] Disable Color Optimization
* [25] Disable DC ZVA Command Only
* [44] Disable Arbiter Fix BIF CRD
* [54] Disable Xmon Snp Evict Trigger L2 Starvation Mode
* [63] Dev Pcie Throttle Enable

#### SYS_APL_EHID3

* [2] Disable Color Optimization
* [25] Disable DC ZVA Command Only

#### SYS_APL_HID4

* [1] Disable STNT Widget
* [9] Disable Speculative LS Redirect
* [11] Disable DC MVA Ops
* [33] Disable Speculative Lnch Read
* [39] Force Ns Ord Ld Req No Older Ld (Non-speculative Ordered Load Requires No Older Load?)
* [41:40] Cnf Counter Threshold
* [44] Disable DC SW L2 Ops
* [49] Enable Lfsr Stall Load Pipe 2 Issue
* [53] Enable Lfsr Stall Stq Replay

#### SYS_APL_HID5

* [15:14] Crd Edb Snp Rsvd
* [44] Disable HWP Load
* [45] Disable HWP Store
* [54] Enable Dn FIFO Read Stall
* [57] Disable Full Line Write
* [61] Disable Fill 2C Merge

#### SYS_APL_EHID5

* [35] Disable Fill Bypass

#### SYS_APL_HID6

* [9:5] Up Crd Tkn Init C2
* [55] Disable ClkDiv Gating

#### SYS_APL_HID7

* [7] Disable Cross Pick 2
* [10] Disable Nex Fast FMUL
* [16] Force Non Speculative If Spec Flush Ptr Invalid And MP Valid
* [20] Force Non Speculative If Stepping
* [25:24] Force Non Speculative Target Timer Sel

#### SYS_APL_HID8

* [7:4] DataSetID0
* [11:8] DataSetID1
* [35] Wke Force Strict Order
* [59:56] DataSetID2
* [63:60] DataSetID3

#### SYS_APL_HID9

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

#### SYS_APL_EHID9

* [5] Dev Throttle 2 Enable

#### SYS_APL_HID10

* [0] Disable Hwp Gups

#### SYS_APL_EHID10

* [19] RCC Disable Power Save Prf (performance?) Clock Off
* [32] Force Wait State Drain UC
* [49] Disable ZVA Temporal TSO

#### SYS_APL_HID11

* [1] Disable X64 NT Lnch Optimization
* [7] Disable Fill C1 Bub(ble?) Optimization
* [15] HID Enable Fix UC 55719865
* [23] Disable Fast Drain Optimization
* [59] Disable LDNT (Load Non-Temporal?) Widget

#### SYS_APL_EHID11

* [41:40] SMB Drain Threshold

#### SYS_APL_HID13

* [17:14] PreCyc
* [63:60] Reset Cycle count

#### SYS_APL_HID14

* [?:0] Nex Sleep Timeout Cyclone
* [32] Nex Power Gating Enable

#### SYS_APL_HID16

* [18] LEQ Throttle Aggr
* [56] SpareBit0
* [57] Enable RS4 Sec
* [59] SpareBit3
* [60] Disable xPick RS 45
* [61] Enable MPx Pick 45
* [62] Enable MP Cyclone 7
* [63] SpareBit7

#### SYS_APL_HID17

* [2:0] Crd Edb Snp Rsvd

#### SYS_APL_HID18

* [14] HVC Speculation Disable
* [49] SpareBit17

#### SYS_APL_EHID20

* [8] Trap SMC
* [15] Force Nonspeculation If Oldest Redir Valid And Older
* [16] Force Nonspeculation If Spec Flush Pointer != Blk Rtr Pointer
* [22:21] Force Nonspeculation Targeted Timer

#### SYS_APL_HID21

* [19] Enable LDREX Fill Reply
* [33] LDQ RTR Wait For Old ST Rel Cmpl
* [34] Disable Cdp Reply Purged Trans

### ACC/CYC Registers

These seem to relate to the core complex and power management configuration

#### SYS_APL_ACC_OVRD

* [14:13] OK To Power Down SRM (3=deepsleep)
* [16:15] Disable L2 Flush For ACC Sleep (2=deepsleep)
* [18:17] OK To Train Down Link (3=deepsleep)
* [26:25] OK To Power Down CPM (2=deny 3=deepsleep)
* [28:27] CPM Wakeup (3=force)
* [29] Disable Clock Dtr
* [32] Disable PIO On WFI CPU
* [34] Enable Deep Sleep

#### SYS_APL_ACC_CFG

Branch predictor state retention across ACC sleep

* [3:2] BP Sleep (2=BDP, 3=BTP)

#### SYS_APL_CYC_OVRD

* [0] Disable WFI Return
* [25:24] OK To Power Down (2=force up, 3=force down)
* [21:20] FIQ mode (2=disable)
* [23:22] IRQ mode (2=disable)

### Memory subsystem registers

Mainly error control?

#### SYS_APL_LSU_ERR_STS

* [54] L1 DTLB Multi Hit Enable

#### SYS_APL_LSU_ERR_CTL

* [3] L1 DTLB Multi Hit Enable

#### SYS_APL_L2C_ERR_STS

L2 subsystem fault control and info. This register is cluster-level and shared among all cores within a cluster.

* [1] Recursive fault (fault occurred while another fault was pending)
* [7] Access fault (unmapped physical address, etc)
* [38..34] Enable flags? (all 1 on entry from iBoot)
* [39] Enable SError interrupts (asynchronous errors)
* [43..40] Enable flags? (all 1 on entry from iBoot)
* [56] Enable write-1-to-clear behavior for fault flags
* [60] Some enable? (1 on entry)

#### SYS_APL_L2C_ERR_ADR

Fault address for L2 subsystem fault.

* [?:0] Physical address of the fault
* [57:56] Set to '11'? Perhaps EL mode or other state info?
* [62..61] Core within cluster that caused fault

#### SYS_APL_L2C_ERR_INF

L2 subsystem error information.

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

#### SYS_APL_IPI_RR_LOCAL

* [3:0] Target CPU
* [29:28] RR Type (0=immediate, 1=retract, 2=deferred, 3=nowake)

#### SYS_APL_IPI_RR_GLOBAL

* [3:0] Target CPU
* [20:16] Target cluster
* [29:28] RR Type (0=immediate, 1=retract, 2=deferred, 3=nowake)

#### SYS_APL_IPI_CR

Global register.

* [15:0] Deferred IPI countdown value (in REFCLK ticks)

#### SYS_APL_HV_TMR_LR

(Name unofficial)

Seems to be similar to ICH_LR<n>_EL2 in GIC; state gets set to pending (63:62 == 1) when guest CNTV fires, is not masked in SYS_APL_HV_TMR_MASK, and is masked in HACR_EL2.

#### SYS_APL_HV_TMR_MASK

(Name unofficial)

* [0] CNTV guest timer mask bit (1=enable FIQ, 0=disable FIQ)
* [1] CNTP guest timer mask bit (1=enable FIQ, 0=disable FIQ)

#### SYS_APL_IPI_SR

Status register

* [0] IPI pending (write 1 to clear)

Needs a barrier (ISB SY) after clearing to avoid races with IPI handling.

### Virtual Memory System Architecture Lock

#### SYS_APL_VMSA_LOCK

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

#### SYS_APL_PMC0-9

Performance counter. 48 bits, bit 47 triggers PMI.

#### SYS_APL_PMCR0

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

#### SYS_APL_PMCR1

Controls which ELx modes count events

* [7:0] EL0 A32 enable PMC #0-7 (not implemented on modern chips)
* [15:8] EL0 A64 enable PMC #0-7
* [23:16] EL1 A64 enable PMC #0-7
* [31:24] EL3 A64 enable PMC #0-7 (not implemented except on old chips with EL3)
* [33:32] EL0 A32 enable PMC #9-8 (not implemented on modern chips)
* [41:40] EL0 A64 enable PMC #9-8
* [49:48] EL1 A64 enable PMC #9-8
* [57:56] EL3 A64 enable PMC #9-8 (not implemented on modern chips)

#### SYS_APL_PMCR2

Controls watchpoint registers.

#### SYS_APL_PMCR3

Controls breakpoints and address matching.

#### SYS_APL_PMCR4

Controls opcode matching.

#### SYS_APL_PMSR

[7:0] Overflow detected on PMC #7-0 (XXX: are 8-9 here too?)

#### SYS_APL_PMESR0

Event selection register

#### SYS_APL_PMESR1

Event selection register

#### SYS_APL_UPMCx

Uncore PMCs. 48 bits wide, bit 47 is an overflow bit and triggers a PMI.

#### SYS_APL_UPMCR0

* [15:0] Counter enable for counter #15-0
* [18:16] Interrupt mode (0=off 2=AIC 3=HALT 4=FIQ)
* [35:20] Enable PMI for counter #15-0

#### SYS_APL_UPMSR

* [0] Uncore PMI
* [1] CTI
* [17:2] Overflow on uncore counter #15-0

#### SYS_APL_UPMPCM

* [7:0] PMI core mask for uncore PMIs - which cores have PMIs delivered to them

#### SYS_APL_UPMESR0

Event selection register

#### SYS_APL_UPMESR1

Event selection register

#### SYS_APL_UPMECM[0-3]

Sets core masks for each event in the cluster, i.e. only events from those cores will be counted in uncore PMCs.

### General config registers

#### ACTLR_EL1 (ARM standard-not-standard)

* [1] Enable TSO
* [3] Disable HWP
* [4] Enable APFLG
* [5] Enable AFP
* [6] Enable PRSV
* [12] IC IVAU Enable ASID

#### HACR_EL2 (ARM standard-not-standard)

* [20] Mask guest CNTV timer (1=masked)

This works differently from SYS_APL_GTIMER_MASK; that one masks the timers earlier, this one leaves the FIQ "pending" in SYS_APL_HV_TMR_LR.

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


### Unknown registers

#### s3_6_c15_c1_0 / s3_6_c15_c1_5 / s3_6_c15_c1_6

These look like a newer version of APRR

#### s3_4_c15_c5_0

Thisn gets written with the core ID (within the cluster) during init.

#### AHCR_EL2

Encoding unknown. Related to ACTLR_EL1[12].

