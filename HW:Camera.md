# ISP 
This information is based on Macbook Pro M1 2020 ISP. It may differ for other devices.

## Registers 

- ISP registers (regs[0]): Depending on chip revision different registers are used.

| Register Name | ISP Version | ISP Revision? | Offset | Notes |
|---	|---	|---	|---	|---	|
| Unknown  	| 0xF  	| != 0x15b | 0x24c41f0 | Related to Ref Clock |
| Unknown  	| 0xF  	| != 0x15b | 0x24c41f4 | Related to Ref Clock |
| Unknown  	| 0xF  	| != 0x15b | 0x24c41f8 | Related to Ref Clock |
| Unknown  	| 0xF  	| != 0x15b | 0x24c41fc | Related to Ref Clock |
| Unknown  	| 0xF  	| == 0x15b | 0x24c41f4 | Related to Ref Clock |
| Unknown  	| 0xF  	| == 0x15b | 0x24c41f8 | Related to Ref Clock |
| Unknown  	| 0xF  	| == 0x15b | 0x24c41fc | Related to Ref Clock |
| Unknown  	| 0xF  	| == 0x15b | 0x24c4200 | Related to Ref Clock |
-
| Unknown  	| 0xC  	| != 0x14c | 0x24c41d0 | Related to Ref Clock |
| Unknown  	| 0xC  	| != 0x14c | 0x24c41d4 | Related to Ref Clock |
| Unknown  	| 0xC  	| != 0x14c | 0x24c41d8 | Related to Ref Clock |
| Unknown  	| 0xC  	| != 0x14c | 0x24c41dc | Related to Ref Clock |
| Unknown  	| 0xC  	| == 0x14c | 0x2104190 | Related to Ref Clock |
| Unknown  	| 0xC  	| == 0x14c | 0x2104194 | Related to Ref Clock |
| Unknown  	| 0xC  	| == 0x14c | 0x2104198 | Related to Ref Clock |
| Unknown  	| 0xC  	| == 0x14c | 0x210419c | Related to Ref Clock |


    - Unknown (offset: 0x24a0080)
    - Unknown (offset: 0x24e0080)
    - Unknown (offset: 0x1400044)
    - Unknown (offset: 0x1aa801c)
    - Unknown (offset: 0x24c41d0) (Note: Related to clock)
    - Unknown (offset: 0x24c41d4) (Note: Related to clock)
    - Unknown (offset: 0x24c41d8) (Note: Related to clock)
    - Unknown (offset: 0x24c41dc) (Note: Related to clock)
    - Unknown (offset: 0x24c41f0) (Note: Related to clock)
    - Unknown (offset: 0x24c41f4) (Note: Related to clock)
    - Unknown (offset: 0x24c41f8) (Note: Related to clock)
    - Unknown (offset: 0x24c41fc) (Note: Related to clock)
    - Unknown (offset: 0x24c4200) (Note: Related to clock)
    - Unknown (offset: 0x2104190) (Note: Related to clock)
    - Unknown (offset: 0x2104194) (Note: Related to clock)
    - Unknown (offset: 0x2104190) (Note: Related to clock)
    - Unknown (offset: 0x2104190) (Note: Related to clock)
    - Unknown (offset: 0x2104198) (Note: Related to clock)
    - Unknown (offset: 0x210419c) (Note: Related to clock)

- PS registers (regs[1]): Depending on chip revision different register range is used. Most chip revisions seems to use 0x4000-0x4060
    - Unknown (offset: 0x00)
    - Unknown (offset: 0x08)
    - Unknown (offset: 0x10)
    - Unknown (offset: 0x18) 
    - Unknown (offset: 0x20)
    - Unknown (offset: 0x28)
    - Unknown (offset: 0x30)
    - Unknown (offset: 0x38)
    - Unknown (offset: 0x40) 
    - Unknown (offset: 0x328)
    - Unknown (offset: 0x3d8)      
    - Unknown (offset: 0x4000) 
    - Unknown (offset: 0x4008)
    - Unknown (offset: 0x4010)
    - Unknown (offset: 0x4018)
    - Unknown (offset: 0x4020)
    - Unknown (offset: 0x4028)
    - Unknown (offset: 0x4030)
    - Unknown (offset: 0x4038)
    - Unknown (offset: 0x4040)
    - Unknown (offset: 0x4048)
    - Unknown (offset: 0x4050)
    - Unknown (offset: 0x4058)
    - Unknown (offset: 0x4060)
    - Unknown (offset: 0x1c3e8)
    - Unknown (offset: 0x1c400)
    - Unknown (offset: 0x1c418)   
- SOC SPMI CSR registers (regs[2])
- SOC SPMI0 registers (regs[3])
- SOC SPMI1 registers (regs[4])



