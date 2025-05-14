---
title: SPRR y GXF
summary:
  SPRR y GXF son características de seguridad en silicio utilizadas para reforzar macOS/Darwin
---


# Ejecución protegida

El modo de ejecución protegida es un nivel de excepción lateral junto a EL1 y EL2 que utiliza las mismas tablas de páginas pero con diferentes permisos (ver SPRR). Estos niveles se llaman GL1 y GL2. Se habilita con el bit 1 en S3_6_C15_1_2.

La instrucción `0x00201420` es genter y cambia de EL a GL y establece el PC a `S3_6_C15_C8_1`.
`0x00201420` es gexit que regresa a EL.

```
#define SYS_GXF_ENTER_EL1 sys_reg(3, 6, 15, 8, 1)
```

El modo protegido tiene un conjunto separado de registros ELR, FAR, ESR, SPSR, VBAR y TPIDR al igual que EL1/2.
Además, el registro ASPSR indica si gexit debe regresar a GL o EL.

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

SPRR toma los bits de permiso de las entradas de la tabla de páginas y los convierte en un índice de atributo similar a cómo funciona MAIR:

```
   3      2      1     0
 AP[1]  AP[0]   UXN   PXN
```

¡Tenga en cuenta que UXN y PXN están invertidos en comparación con APRR!

Esto se usa luego para indexar en un registro del sistema donde cada entrada tiene cuatro bits:


```
    3     2     1     0
  GL[1] GL[0] EL[1] EL[0]
```

GL/EL pueden tratarse mayormente por separado pero hay dos excepciones donde un permiso GL específico
modifica lo que los dos bits EL suelen significar.


| valor del registro | permisos de página EL | permisos de página GL |
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


Estos cuatro bits indican los permisos reales cuando se ejecuta en modo EL o GL.
EL0 y EL1 tienen registros separados de modo que los permisos están desacoplados.

El bit 1 en S3_6_C15_C1_0 / SPRR_CONFIG_EL1 habilita SPRR y el acceso a nuevos registros del sistema.

S3_6_C15_1_5 es el registro de permisos para EL0 y S3_6_C15_1_6 es para EL1/GL1.

```
#define SYS_SPRR_CONFIG_EL1       sys_reg(3, 6, 15, 1, 0)
#define SPRR_CONFIG_EN            BIT(0)
#define SPRR_CONFIG_LOCK_CONFIG   BIT(1)
#define SPRR_CONFIG_LOCK_PERM_EL0 BIT(4)
#define SPRR_CONFIG_LOCK_PERM_EL1 BIT(5)

#define SYS_SPRR_PERM_EL0 sys_reg(3, 6, 15, 1, 5)
#define SYS_SPRR_PERM_EL1 sys_reg(3, 6, 15, 1, 6)
``` 