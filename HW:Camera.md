# ISP 
This information is based on Macbook Pro M1 2020 ISP. It may differ for other devices.

## Sensor Type -> ISP Version 

| Sensor Type | ISP Version |
|---	|---	|
| 0xee | 0xf |
| 0x54 | 0xb |
| 0x55 | 0xb |
| 0x56 | 0xb |
| 0x57 | 0xb |
| 0xe4 | 0xb |
| 0xe5 | 0xb |
| 0xe0 | 0xb |
| 0xe1 | 0xb |
| 0xe2 | 0xb |
| 0xe3 | 0xb |
| 0x1 | 0xb |
| 0x2 | 0xb |
| 0x3 | 0xb |
| 0xe8 | 0xc |
| 0xe7 | 0xc |
| 0xe9 | 0xc |
| 0xea | 0xc |
| 0x1a | 0xc |
| 0x1b | 0xc |
| 0xb | 0xb |
| 0xc | 0xb |
| 0xf5 | 0xb |
| 0xd | 0xc |
| 0xe | 0xc |
| 0x13 | 0xc |
| 0x14 | 0xc |
| 0x15 | 0xc |
| 0x16 | 0xc |
| 0x9a | 0xc |
| 0x5 | 0xc |
| 0x6 | 0xc |
| 0x7 | 0xc |
| 0x18 | 0xb |
| 0x19 | 0xb |
| 0x1c | 0xf |
| 0x1d | 0xf |
## Registers 

- ISP registers (regs[0]): Depending on chip revision different registers are used.

| Register Name | ISP Version | ISP Revision? | Offset | Notes |
|---	|---	|---	|---	|---	|
| ISP_REVISION | 0xF | N/A | 0x1800000 | 31:0 bits are used.<br/> ([31:0] == 0x1) => 0x15a <br/> ([31:0] != 0x1001) => 0x15b |
|  | 0xC | N/A | 0x1800000 | 31:0 bits are used.<br/> ([31:0] == 0x90) => 0x14a <br/> ([31:0] != 0x1090) => 0x14b <br/> ([31:0] == 0x3091) => 0x14c |
|  | 0xB | N/A | 0x1800000 | 31:0 bits are used.<br/> ([31:0] == 0x90) => 0x13a <br/> ([31:0] != 0x3091) => 0x13c |
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
|---	|---	|---	|---	|---	|
| POWER_ON? | 0xF | * | 0x24a0080 | Set to 0x1 during power on |
| POWER_ON? | 0xC | != 0x14c | 0x24a0080 | Set to 0x1 during power on |
| POWER_ON? | Other | * | 0x20e0080 | Set to 0x1 during power on |
|---	|---	|---	|---	|---	|
| UNKNOWN0 | 0xF | * | 0x24c41d0 |  |
|  | 0xC | != 0x14c | 0x24c41b0 |  |
|  | Other | Other | 0x2104170 |  |
| UNKNOWN1 | 0xF | * | 0x24c41d4 |  |
|  | 0xC | != 0x14c | 0x24c41b4 |  |
|  | Other | Other | 0x2104174 |  |
| UNKNOWN2 | 0xF | * | 0x24c41d8 |  |
|  | 0xC | != 0x14c | 0x24c41b8 |  |
|  | Other | Other | 0x2104178 |  |
| UNKNOWN3 | 0xF | * | 0x24c41dc |  |
|  | 0xC | != 0x14c | 0x24c41bc |  |
|  | Other | Other | 0x210417c |  |
| UNKNOWN4 | 0xF | * | 0x24c41e0 |  |
|  | 0xC | != 0x14c | 0x24c41c0 |  |
|  | Other | Other | 0x2104180 |  |
| UNKNOWN5 | 0xF | * | 0x24c41e4 |  |
|  | 0xC | != 0x14c | 0x24c41c4 |  |
|  | Other | Other | 0x2104184 |  |
| UNKNOWN6 | 0xF | * | 0x24c41e8 |  |
|  | 0xC | != 0x14c | 0x24c41c8 |  |
|  | Other | Other | 0x2104188 |  |
| UNKNOWN7 | 0xF | * | 0x24c41ec |  |
|  | 0xC | != 0x14c | 0x24c41cc |  |
|  | 0xC | * | 0x210418c |  |
|  | 0xB | * | 0x188 |  |
| SMBUS_REG_UNKNOWN0 | * | * | 0x2110000 |
| SMBUS_REG_SMCR | * | * | 0x2110014 | SMBus Control Register |
| SMBUS_REG_UNKNOWN2 | * | * | 0x2110018 |
| SMBUS_REG_UNKNOWN3 | * | * | 0x211001c |
| SMBUS_REG_UNKNOWN4 | * | * | 0x2110030 |
| SMBUS_REG_UNKNOWN5 | * | * | 0x2110034 |
| SMBUS_REG_UNKNOWN6 | * | * | 0x211003c |
|---	|---	|---	|---	|---	|

    - Unknown (offset: 0x2110018) (I2C | Initialized to 0)
    - Unknown (offset: 0x211001c) (I2C | Initialized with 0x20 | 0x900)
    - Unknown (offset: 0x2110030) (I2C | Initialized with 0x10a)
    - Unknown (offset: 0x2110034) (I2C | Initialized with 0x50282814)
    - Unknown (offset: 0x211003c) (I2C | Initialized with 0x4e4710)

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
    - Unknown (offset: 0x80a0) (Initialized as 1 << 2^(1..5))
    - Unknown (offset: 0x80a4) (Value here seems to be ORed with one of following values: 0x4000000, 0x8000000, 0x1, 0x2)
    - Unknown (offset: 0x28) (Initialized as 0)
    - Unknown (offset: 0x90) (Initialized as 1)
    - Unknown (offset: 0x40) (Initialized as 0x4000000)

- SOC SPMI0 registers (regs[3])
    - Unknown (offset: 0x80a0) (Initialized as 1 << 2^(1..5))
    - Unknown (offset: 0x80a4) (Value here seems to be ORed with one of following values: 0x4000000, 0x8000000, 0x1, 0x2)
    - Unknown (offset: 0x28) (Initialized as 0)
    - Unknown (offset: 0x90) (Initialized as 1)
    - Unknown (offset: 0x40) (Initialized as 0x4000000)

- SOC SPMI1 registers (regs[4])
    - Unknown (offset: 0x80a0) (Initialized as 1 << 2^(1..5))
    - Unknown (offset: 0x80a4) (Value here seems to be ORed with one of following values: 0x4000000, 0x8000000, 0x1, 0x2)
    - Unknown (offset: 0x28) (Initialized as 0)
    - Unknown (offset: 0x90) (Initialized as 1)
    - Unknown (offset: 0x40) (Initialized as 0x4000000)



