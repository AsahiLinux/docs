---
title: Cámara y Procesador de Señal de Imagen
---

# ISP
Esta información está basada en el ISP del Macbook Pro M1 2020. Puede diferir para otros dispositivos.

## Tipo de Sensor -> Versión ISP

| Tipo de Sensor | Versión ISP |
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

## Registros

- Registros ISP (regs[0]): Dependiendo de la revisión del chip se utilizan diferentes registros.

| Nombre del Registro | Versión ISP | Revisión ISP? | Desplazamiento | Notas |
|---	|---	|---	|---	|---	|
| ISP_REVISION | 0xF | N/A | 0x1800000 | Se utilizan los bits 31:0.<br/> ([31:0] == 0x1) => 0x15a <br/> ([31:0] != 0x1001) => 0x15b |
|  | 0xC | N/A | 0x1800000 | Se utilizan los bits 31:0.<br/> ([31:0] == 0x90) => 0x14a <br/> ([31:0] != 0x1090) => 0x14b <br/> ([31:0] == 0x3091) => 0x14c |
|  | 0xB | N/A | 0x1800000 | Se utilizan los bits 31:0.<br/> ([31:0] == 0x90) => 0x13a <br/> ([31:0] != 0x3091) => 0x13c |
|---	|---	|---	|---	|---	|
| SENSOR_REF_CLOCK0 | 0xF  	| != 0x15b | 0x24c41f0 | Reloj de Referencia del Sensor 0 |
|  | 0xF  	| == 0x15b | 0x24c41f4 | Reloj de Referencia del Sensor 0 |
|  | 0xC  	| != 0x14c | 0x24c41d0 | Reloj de Referencia del Sensor 0 |
|  | 0xC  	| == 0x14c | 0x2104190 | Reloj de Referencia del Sensor 0 |
|  | Otros     | *        | 0x2104190 | Reloj de Referencia del Sensor 0 |
| SENSOR_REF_CLOCK1 | 0xF  	| != 0x15b | 0x24c41f4 | Reloj de Referencia del Sensor 1 |
|  | 0xF  	| == 0x15b | 0x24c41f8 | Reloj de Referencia del Sensor 1 |
|  | 0xC  	| != 0x14c | 0x24c41d4 | Reloj de Referencia del Sensor 1 |
|  | 0xC  	| == 0x14c | 0x2104194 | Reloj de Referencia del Sensor 1 |
|  | Otros     | *        | 0x2104194 | Reloj de Referencia del Sensor 1 |
| SENSOR_REF_CLOCK2 | 0xF  	| != 0x15b | 0x24c41f8 | Reloj de Referencia del Sensor 2 |
|  | 0xF  	| == 0x15b | 0x24c41fc | Reloj de Referencia del Sensor 2 |
|  | 0xC  	| != 0x14c | 0x24c41d8 | Reloj de Referencia del Sensor 2 |
|  | 0xC  	| == 0x14c | 0x2104198 | Reloj de Referencia del Sensor 2 |
|  | Otros     | *        | 0x2104198 | Reloj de Referencia del Sensor 2 |
| SENSOR_REF_CLOCK3 | 0xF  	| != 0x15b | 0x24c41fc | Reloj de Referencia del Sensor 3 |
|  | 0xF  	| == 0x15b | 0x24c4200 | Reloj de Referencia del Sensor 3 |
|  | 0xC  	| != 0x14c | 0x24c41dc | Reloj de Referencia del Sensor 3 |
|  | 0xC  	| == 0x14c | 0x210419c | Reloj de Referencia del Sensor 3 |
|---	|---	|---	|---	|---	|
| POWER_ON? | 0xF | * | 0x24a0080 | Se establece a 0x1 durante el encendido |
| POWER_ON? | 0xC | != 0x14c | 0x24a0080 | Se establece a 0x1 durante el encendido |
| POWER_ON? | Otros | * | 0x20e0080 | Se establece a 0x1 durante el encendido |
|---	|---	|---	|---	|---	|
| UNKNOWN0 | 0xF | * | 0x24c41d0 |  |
|  | 0xC | != 0x14c | 0x24c41b0 |  |
|  | Otros | Otros | 0x2104170 |  |
| UNKNOWN1 | 0xF | * | 0x24c41d4 |  |
|  | 0xC | != 0x14c | 0x24c41b4 |  |
|  | Otros | Otros | 0x2104174 |  |
| UNKNOWN2 | 0xF | * | 0x24c41d8 |  |
|  | 0xC | != 0x14c | 0x24c41b8 |  |
|  | Otros | Otros | 0x2104178 |  |
| UNKNOWN3 | 0xF | * | 0x24c41dc |  |
|  | 0xC | != 0x14c | 0x24c41bc |  |
|  | Otros | Otros | 0x210417c |  |
| UNKNOWN4 | 0xF | * | 0x24c41e0 |  |
|  | 0xC | != 0x14c | 0x24c41c0 |  |
|  | Otros | Otros | 0x2104180 |  |
| UNKNOWN5 | 0xF | * | 0x24c41e4 |  |
|  | 0xC | != 0x14c | 0x24c41c4 |  |
|  | Otros | Otros | 0x2104184 |  |
| UNKNOWN6 | 0xF | * | 0x24c41e8 |  |
|  | 0xC | != 0x14c | 0x24c41c8 |  |
|  | Otros | Otros | 0x2104188 |  |
| UNKNOWN7 | 0xF | * | 0x24c41ec |  |
|  | 0xC | != 0x14c | 0x24c41cc |  |
|  | 0xC | * | 0x210418c |  |
|  | 0xB | * | 0x188 |  |
| SMBUS_REG_MTXFIFO0 | * | * | 0x2110000 | Canal I2C 0
| SMBUS_REG_MRXFIFO0 | * | * | 0x2110004 | 
| SMBUS_REG_UNKNOWN0_1 | * | * | 0x2110008 |
| SMBUS_REG_UNKNOWN0_2* | * | * | 0x211000c |
| SMBUS_REG_UNKNOWN0_3* | * | * | 0x2110010 | 
| SMBUS_REG_SMSTA0 | * | * | 0x2110014 | |
| SMBUS_REG_UNKNOWN0_4 | * | * | 0x2110018 |
| SMBUS_REG_CTL0 | * | * | 0x211001c |
| SMBUS_REG_UNKNOWN0_5 | * | * | 0x2110030 |
| SMBUS_REG_UNKNOWN0_6 | * | * | 0x2110034 |
| SMBUS_REG_UNKNOWN0_7 | * | * | 0x211003c |
|---	|---	|---	|---	|---	|
| SMBUS_REG_MTXFIFO1 | * | * | 0x2111000 | Canal I2C 1
| SMBUS_REG_MRXFIFO1 | * | * | 0x2111004 | 
| SMBUS_REG_UNKNOWN1_1 | * | * | 0x2111008 |
| SMBUS_REG_UNKNOWN1_2* | * | * | 0x211100c |
| SMBUS_REG_UNKNOWN1_3* | * | * | 0x2111010 | 
| SMBUS_REG_SMSTA1 | * | * | 0x2111014 | |
| SMBUS_REG_UNKNOWN1_4 | * | * | 0x2111018 |
| SMBUS_REG_CTL1 | * | * | 0x211101c |
| SMBUS_REG_UNKNOWN1_5 | * | * | 0x2111030 |
| SMBUS_REG_UNKNOWN1_6 | * | * | 0x2111034 |
| SMBUS_REG_UNKNOWN1_7 | * | * | 0x211103c |
|---	|---	|---	|---	|---	|
| SMBUS_REG_MTXFIFO2 | * | * | 0x2112000 | Canal I2C 2
| SMBUS_REG_MRXFIFO2 | * | * | 0x2112004 | 
| SMBUS_REG_UNKNOWN2_1 | * | * | 0x2112008 |
| SMBUS_REG_UNKNOWN2_2* | * | * | 0x211200c |
| SMBUS_REG_UNKNOWN2_3* | * | * | 0x2112010 | 
| SMBUS_REG_SMSTA2 | * | * | 0x2112014 | |
| SMBUS_REG_UNKNOWN2_4 | * | * | 0x2112018 |
| SMBUS_REG_CTL2 | * | * | 0x211201c |
| SMBUS_REG_UNKNOWN2_5 | * | * | 0x2112030 |
| SMBUS_REG_UNKNOWN2_6 | * | * | 0x2112034 |
| SMBUS_REG_UNKNOWN2_7 | * | * | 0x211203c |
|---	|---	|---	|---	|---	|
| SMBUS_REG_MTXFIFO3 | * | * | 0x2113000 | Canal I2C 3
| SMBUS_REG_MRXFIFO3 | * | * | 0x2113004 | 
| SMBUS_REG_UNKNOWN3_1 | * | * | 0x2113008 |
| SMBUS_REG_UNKNOWN3_2* | * | * | 0x211300c |
| SMBUS_REG_UNKNOWN3_3* | * | * | 0x2113010 | 
| SMBUS_REG_SMSTA3 | * | * | 0x2113014 | |
| SMBUS_REG_UNKNOWN3_4 | * | * | 0x2113018 |
| SMBUS_REG_CTL3 | * | * | 0x211301c |
| SMBUS_REG_UNKNOWN3_5 | * | * | 0x2113030 |
| SMBUS_REG_UNKNOWN3_6 | * | * | 0x2113034 |
| SMBUS_REG_UNKNOWN3_7 | * | * | 0x211303c |
|---	|---	|---	|---	|---	|
| REG_DPE_UNKNOWN0 | * | * | 0x2504000 |
| REG_DPE_UNKNOWN1 | * | * | 0x2508000 |
|---	|---	|---	|---	|---	|
| REG_UNKNOWN | * | * | 0x1050000 |

    - Desconocido (desplazamiento: 0x1400044)
    - Desconocido (desplazamiento: 0x1aa801c)

- Registros PS (regs[1]): Dependiendo de la revisión del chip se utiliza un rango de registros diferente. La mayoría de las revisiones de chip parecen usar 0x4000-0x4060
    - Desconocido (desplazamiento: 0x00)
    - Desconocido (desplazamiento: 0x08)
    - Desconocido (desplazamiento: 0x10)
    - Desconocido (desplazamiento: 0x18) 
    - Desconocido (desplazamiento: 0x20)
    - Desconocido (desplazamiento: 0x28)
    - Desconocido (desplazamiento: 0x30)
    - Desconocido (desplazamiento: 0x38)
    - Desconocido (desplazamiento: 0x40) 
    - Desconocido (desplazamiento: 0x328)
    - Desconocido (desplazamiento: 0x3d8)      
    - Desconocido (desplazamiento: 0x4000) 
    - Desconocido (desplazamiento: 0x4008)
    - Desconocido (desplazamiento: 0x4010)
    - Desconocido (desplazamiento: 0x4018)
    - Desconocido (desplazamiento: 0x4020)
    - Desconocido (desplazamiento: 0x4028)
    - Desconocido (desplazamiento: 0x4030)
    - Desconocido (desplazamiento: 0x4038)
    - Desconocido (desplazamiento: 0x4040)
    - Desconocido (desplazamiento: 0x4048)
    - Desconocido (desplazamiento: 0x4050)
    - Desconocido (desplazamiento: 0x4058)
    - Desconocido (desplazamiento: 0x4060)
    - Desconocido (desplazamiento: 0x1c3e8)
    - Desconocido (desplazamiento: 0x1c400)
    - Desconocido (desplazamiento: 0x1c418)   
- Registros SOC SPMI CSR (regs[2])
    - Desconocido (desplazamiento: 0x80a0) (Inicializado como 1 << 2^(1..5))
    - Desconocido (desplazamiento: 0x80a4) (El valor aquí parece ser OR con uno de los siguientes valores: 0x4000000, 0x8000000, 0x1, 0x2)
    - Desconocido (desplazamiento: 0x28) (Inicializado como 0)
    - Desconocido (desplazamiento: 0x90) (Inicializado como 1)
    - Desconocido (desplazamiento: 0x40) (Inicializado como 0x4000000)

- Registros SOC SPMI0 (regs[3])
    - Desconocido (desplazamiento: 0x80a0) (Inicializado como 1 << 2^(1..5))
    - Desconocido (desplazamiento: 0x80a4) (El valor aquí parece ser OR con uno de los siguientes valores: 0x4000000, 0x8000000, 0x1, 0x2)
    - Desconocido (desplazamiento: 0x28) (Inicializado como 0)
    - Desconocido (desplazamiento: 0x90) (Inicializado como 1)
    - Desconocido (desplazamiento: 0x40) (Inicializado como 0x4000000)

- Registros SOC SPMI1 (regs[4])
    - Desconocido (desplazamiento: 0x80a0) (Inicializado como 1 << 2^(1..5))
    - Desconocido (desplazamiento: 0x80a4) (El valor aquí parece ser OR con uno de los siguientes valores: 0x4000000, 0x8000000, 0x1, 0x2)
    - Desconocido (desplazamiento: 0x28) (Inicializado como 0)
    - Desconocido (desplazamiento: 0x90) (Inicializado como 1)
    - Desconocido (desplazamiento: 0x40) (Inicializado como 0x4000000) 