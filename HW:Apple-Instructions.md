Apple proprietary instructions seem to be in the 0x0020xxxx range.

```
00200000 - 002007ff            MUL53, see https://gist.github.com/TrungNguyen1909/5b323edda9a21550a1621af506e8ce5f

00200800 | rD << 5 | rS        wkdmc, compress memory page
   - rS is the source page address (page-aligned, bottom bits ignored)
   - rD is the destination compressed data address (64b aligned, bottom bits ignored)
   - Status/info gets returned in rS.

00200c00 | rD << 5 | rS        wkdmd, uncompress memory page
   - rS is the source compressed data address (64b aligned, bottom bits ignored)
   - rD is the destination compressed data address (page-aligned, bottom bits ignored)
   - Status/info gets returned in rS.

00201000 - 002012df            AMX, see https://gist.github.com/dougallj/7a75a3be1ec69ca550e7c36dc75e0d6f
   If AMX is not enabled (default), these fault with ESR_EL2 = 0xfe000003

   ..222~23f "hole" of unknown instructions
    
002012e0 - 0020143f            Faults with unknown instruction

*00201400                      gexit, Exit guarded mode. Used by macOS; must need some enable (faults by default).
*00201420                      genter, Enter guarded mode. Used by macOS; must need some enable (faults by default). 

00201440 | rA                  at_as1elx, Translate address. Returns in the same register:
   [63:56] MAIR attributes for translation (not index!)
   [??:12] Physical address
   [11:00] Flags/status/etc.  0x80x = unmapped, x varies depending on PT level that faulted?

This seems to be the same as the PAR_EL1 system register, used as the output for the *official* ARM translate address instructions.

00201460                       sdsb osh
00201461                       sdsb nsh
00201462                       sdsb ish - used by iBoot trampoline
00201463                       sdsb sy

00201464 ~                     Faults with unknown instruction


```
