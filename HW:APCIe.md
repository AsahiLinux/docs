## DT bindings

|      Property     |      Value       |      Meaning      |
|-------------------|------------------|-------------------|
| compatible        | apcie,t8103      | compatible string |
| #address-cells    | 3                | normal PCI DT: `<BAR type><addr>len>` |
| #size-cells       | 2                | normal PCI DT     |
| interrupt-parent  | -                | phandle of AIC    |
| interrupts        | (0x2b7, 0x2ba, 0x2bd) | Administrative interrupts. Maybe AER? |
| msi-parent-controller | -            | phandle of AIC    |
| #msi-vectors      | 32               | number of IRQs in AIC for MSI |
| msi-address       | 0xfffff000       | program this into the MSI-X address BAR |
| msi-vector-offset | 0x2c0            | (this + msi_id) go to the MSI-X value field in the MSI-X device BAR |
| #ports            | 3                | number of DART bindings |
| apcie-common-tunables | 0x2c, 0x4, 0xff, 0x0, 0x1, 0x0, 0x54, 0x4, 0xffffffff, 0x0, 0x140, 0x0 | ?
| apcie-axi2af-tunables | todo | ? |
| apcie-phy-tunables | todo | ? |
| apcie-phy-ip-pll-tunables | todo | ? |
| apcie-phy-ip-auspma-tunables | todo | ? |

### reg

|   Address   | Length      | Meaning                    |
|-------------|-------------|----------------------------|
| 0x690000000 | 0x10000000  | ECAM space
| 0x680000000 | 0x40000     | Ctrl
| 0x680080000 | 0x90000     | Phy config
| 0x6800c0000 | 0x20000     | ?
| 0x68c000000 | 0x4000      | ?
| 0x3d2bc000  | 0x1000      | ?
| 0x681000000 | 0x8000      | port0 link / control registers
| 0x681010000 | 0x1000      | port0
| 0x680084000 | 0x4000      | port0 phy
| 0x6800c8000 | 0x16610     | port0
| 0x682000000 | 0x8000      | port1 link / control registers
| 0x682010000 | 0x1000      | port1
| 0x680088000 | 0x4000      | port1 phy
| 0x6800d0000 | 0x6000      | port1
| 0x683000000 | 0x8000      | port2 link / control registers
| 0x683010000 | 0x1000      | port2
| 0x68008c000 | 0x4000      | port2 phy
| 0x6800d8000 | 0x6000      | port2

## Known register meanings

|    Space    |    Offset    |      name      | Meaning / Values       |
|-------------|--------------|----------------|------------------------|
| Ctrl        | 0x28         | Refclk         | 1 << 4 is good
| Ctrl        | 0x50         | ?              | Write 1 to enable PCIe
| Ctrl        | 0x58         | ?              | Reads 1 after 0x50 write
| Phy config  | 0x0          | ?              | Writing bits 0x1 and 0x2 toggle 0x4 and 0x8 respectively
| portX link  | 0x100        | pcielint
| portX link  | 0x208        | linksts        | Bit 0x1 means link is enabled. Requires write to 0x804
| portX link  | 0x210        | linkcdmsts
| portX link  | 0x800        | ?              | Read in initializeRootComplex()
| portX link  | 0x804        | ?              | Read in enablePortHardware()
| portX phy   | 0x0          | PhyGlueLaneReg / RefClockBuffer | Writing bits 0x1 and 0x2 toggle bits 0x4 and 0x2 respectively

## Tunables

### pcie-rc-tunables
On the 2020 M1 mini, this set of register writes modifies some bits on standardized capability structures as well as some other registers.
| register | capability | effect |
|----------|------------|--------|
| 0x194    | L1 PM Substates | clear Port Common_Mode_Restore_Time |
|          |                 | clear Port T_POWER_ON Scale |
|          |                 | clear Port T_POWER_ON Value |
| 0x2a4    | Data Link Feature | ? |
| 0xb80    |             | not part of an (extended) capability structure |
| 0xb84    |             | not part of an (extended) capability structure |
| 0x78     | PCI Express | clear Max_Read_Request_Size |

### pcie-rc-gen3-shadow-tunables
| register | capability | effect |
|----------|------------|--------|
| 0x154    | Secundary PCI Express | set Downstream Port 8.0 GT/s Transmitter Preset |
|          |                       | set Upstream Port 8.0 GT/s Transmitter Preset |
| 0x890    |            | not part of an (extended) capability structure |
| 0x8a8    |            | not part of an (extended) capability structure |

### pcie-rc-gen4-shadow-tunables
| register | capability | effect |
|----------|------------|--------|
| 0x178    | Physical Layer 16.0 GT/s | set Downstream Port 16.0 GT/s Transmitter Preset |
|          |                          | set Upstream Port 16.0 GT/s Transmitter Preset |
| 0x890    |            | not part of an (extended) capability structure |
| 0x8a8    |            | not part of an (extended) capability structure |
