---
title: Instrucciones Propietarias de Apple
summary:
  Extensiones propietarias de Apple al Conjunto de Instrucciones A64
---

Las instrucciones propietarias de Apple parecen estar en el rango 0x0020xxxx.

```
00200000 - 002007ff            MUL53, ver https://gist.github.com/TrungNguyen1909/5b323edda9a21550a1621af506e8ce5f

00200800 | rD << 5 | rS        wkdmc, comprimir página de memoria
   - rS es la dirección de la página fuente (alineada a página, bits inferiores ignorados)
   - rD es la dirección de datos comprimidos destino (alineada a 64b, bits inferiores ignorados)
   - El estado/información se devuelve en rS.

00200c00 | rD << 5 | rS        wkdmd, descomprimir página de memoria
   - rS es la dirección de datos comprimidos fuente (alineada a 64b, bits inferiores ignorados)
   - rD es la dirección de datos comprimidos destino (alineada a página, bits inferiores ignorados)
   - El estado/información se devuelve en rS.

00201000 - 002012df            AMX, ver https://gist.github.com/dougallj/7a75a3be1ec69ca550e7c36dc75e0d6f
   Si AMX no está habilitado (predeterminado), estas fallan con ESR_EL2 = 0xfe000003

   ..222~23f "hueco" de instrucciones desconocidas
    
002012e0 - 0020143f            Fallan con instrucción desconocida

*00201400                      gexit, Salir del modo protegido. Usado por macOS; debe necesitar alguna habilitación (falla por defecto).
*00201420 | imm5               genter, Entrar en modo protegido. Usado por macOS; debe necesitar alguna habilitación (falla por defecto).
   imm5 almacenado en ESR_GLx[5:0] 

00201440 | rA                  at_as1elx, Traducir dirección. Devuelve en el mismo registro:
   [63:56] Atributos MAIR para la traducción (¡no índice!)
   [??:12] Dirección física
   [11:00] Banderas/estado/etc.  0x80x = no mapeado, x varía dependiendo del nivel PT que falló?

Esto parece ser lo mismo que el registro del sistema PAR_EL1, usado como salida para las instrucciones *oficiales* de traducción de dirección de ARM.

00201460                       sdsb osh
00201461                       sdsb nsh
00201462                       sdsb ish - usado por el trampolín de iBoot
00201463                       sdsb sy

00201464 ~                     Fallan con instrucción desconocida
``` 