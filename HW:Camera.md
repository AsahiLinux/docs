# ISP 
This information is based on Macbook Pro M1 2020 ISP. It may differ for other devices.

## Registers 

- ISP registers (regs[0]): Depending on chip revision different registers are used.

| Register Name | ISP Version | ISP Revision? | Offset | Notes |
|---	|---	|---	|---	|---	|
| SENSOR_REF_CLOCK0 | 0xF  	| != 0x15b | 0x24c41f0 | Sensor Ref Clock 0 |
|  | 0xF  	| == 0x15b | 0x24c41f4 | Sensor Ref Clock 0 |
|  | 0xC  	| != 0x14c | 0x24c41d0 | Sensor Ref Clock 0 |
|  | 0xC  	| == 0x14c | 0x2104190 | Sensor Ref Clock 0 |
|  | Other     | *        | 0x2104190 | Sensor Ref Clock 0 |
| SENSOR_REF_CLOCK1 | 0xF  	| != 0x15b | 0x24c41f4 | Sensor Ref Clock 1 |
|  | 0xF  	| == 0x15b | 0x24c41f8 | Sensor Ref Clock 1 |
|  | 0xC  	| != 0x14c | 0x24c41d4 | Sensor Ref Clock 1 |
|  | 0xC  	| == 0x14c | 0x2104194 | Sensor Ref Clock 1 |
|  | Other     | *        | 0x2104194 | Sensor Ref Clock 1 |
| SENSOR_REF_CLOCK2 | 0xF  	| != 0x15b | 0x24c41f8 | Sensor Ref Clock 2 |
|  | 0xF  	| == 0x15b | 0x24c41fc | Sensor Ref Clock 2 |
|  | 0xC  	| != 0x14c | 0x24c41d8 | Sensor Ref Clock 2 |
|  | 0xC  	| == 0x14c | 0x2104198 | Sensor Ref Clock 2 |
|  | Other     | *        | 0x2104198 | Sensor Ref Clock 2 |
| SENSOR_REF_CLOCK3 | 0xF  	| != 0x15b | 0x24c41fc | Sensor Ref Clock 3 |
|  | 0xF  	| == 0x15b | 0x24c4200 | Sensor Ref Clock 3 |
|  | 0xC  	| != 0x14c | 0x24c41dc | Sensor Ref Clock 3 |
|  | 0xC  	| == 0x14c | 0x210419c | Sensor Ref Clock 3 |
| ISP_REVISION | 0xF | N/A | 0x1800000 | Used to fetch revision. ([31:0] == 0x1) => 0x15a, ([31:0] != 0x1001) => 0x15b |
| ISP_REVISION | 0xC | N/A | 0x1800000 | Used to fetch revision. ([31:0] == 0x90) => 0x14a, ([31:0] == 0x1090) => 0x14b, ([31:0] == 0x3091) => 0x14c |


    - Unknown (offset: 0x24a0080)
    - Unknown (offset: 0x24e0080)
    - Unknown (offset: 0x1400044)
    - Unknown (offset: 0x1aa801c)

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



