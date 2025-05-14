---
title: Disposición de Particiones SSD de Fábrica
---

# Resumen

* **disk0**: SSD principal
  * **disk0s1 = disk1**: "iBootSystemContainer" - datos de arranque a nivel de sistema
    * **disk1s1**: "iSCPreboot" - políticas de arranque, metadatos de versión del firmware del sistema (NOR), firmware SEP (a veces), tickets AP
    * **disk1s2**: "xARTS" - almacenamiento confiable SEP
    * **disk1s3**: "Hardware" - registros, caché de datos de fábrica, archivos relacionados con la activación
    * **disk1s4**: "Recovery" - vacío
  * **disk0s2 = disk3**: "Container" - instalación de macOS
    * **disk3s1**: "System" - SO (sistema de archivos raíz, sellado)
    * **disk3s2**: "Preboot" - iBoot2 (cargador del SO), firmwares cargados por iBoot, kernelcache de Darwin, firmwares, devicetree, otros archivos de prearranque
    * **disk3s3**: "Recovery" - RecoveryOS emparejado con el SO: iBoot2, firmwares, kernelcache de Darwin, imagen ramdisk
    * **disk3s4**: "Update" - almacenamiento temporal y registros de actualización de macOS
    * **disk3s5**: "Data" - datos de usuario (sistema de archivos raíz, fusionado). El UUID de este volumen define la identidad de la instalación del SO.
    * **disk3s6**: "VM" - partición de swap (cuando es necesario)
  * **disk0s3 = disk2**: "RecoveryOSContainer" - RecoveryOS del sistema
    * **disk2s1**: "Recovery" - uno o más conjuntos de {iBoot2 (cargador del SO), kernelcache de Darwin, firmwares, devicetree, otros archivos de prearranque}
    * **disk2s2**: "Update" - almacenamiento temporal y registros de actualización de firmware del sistema

# Particionado
<details>
  <summary>volcado de gdisk</summary>

```
Disco /dev/disk0: 61279344 sectores, 233.8 GiB
Tamaño de sector (lógico): 4096 bytes
Identificador de disco (GUID): 284E6CE4-CABA-4B49-8106-CE39AB7B5CD9
La tabla de particiones admite hasta 128 entradas
La tabla principal de particiones comienza en el sector 2 y termina en el sector 5
El primer sector utilizable es el 6, el último utilizable es el 61279338
Las particiones se alinearán en límites de 2 sectores
Espacio libre total: 0 sectores (0 bytes)

Número  Inicio (sector)    Fin (sector)  Tamaño      Código  Nombre
   1               6          128005   500.0 MiB   FFFF  iBootSystemContainer
   2          128006        59968629   228.3 GiB   AF0A  Container
   3        59968630        61279338   5.0 GiB     FFFF  RecoveryOSContainer
```
</details>

El disco en bruto contiene una tabla de particiones GUID con un MBR protector estándar y tres particiones. Estas corresponden a /dev/disk0s1, /dev/disk0s2, /dev/disk0s3 en macOS.

Cada una de las 3 particiones es un contenedor APFS, que contiene varios subvolúmenes. Los GUID de tipo son los siguientes:

* 69646961-6700-11AA-AA11-00306543ECAC: iBoot System Container (ASCII: "idiag", diskutil: `Apple_APFS_ISC`)
* 7C3457EF-0000-11AA-AA11-00306543ECAC: APFS (diskutil: `Apple_APFS`)
* 52637672-7900-11AA-AA11-00306543ECAC: Recovery OS (ASCII: "Rcvry", diskutil: `Apple_APFS_Recovery`)

Nota: la mayoría de los GUID únicos (no de tipo) mostrados en esta página serán únicos para cada usuario.

## disk0s1 / disk1: iBoot System Container
<details>
  <summary>diskutil info</summary>

```
# diskutil apfs list /dev/disk1
|
+-- Container disk5 E0718E49-1903-4793-B427-FCFEC4A3E72C
    ====================================================
    APFS Container Reference:     disk1
    Size (Capacity Ceiling):      524288000 B (524.3 MB)
    Capacity In Use By Volumes:   18010112 B (18.0 MB) (3.4% used)
    Capacity Not Allocated:       506277888 B (506.3 MB) (96.6% free)
    |
    +-< Physical Store disk1 (No UUID)
    |   ------------------------------
    |   APFS Physical Store Disk:   disk0s1
    |   Size:                       524288000 B (524.3 MB)
    |
    +-> Volume disk5s1 B33E8594-382A-41EA-A9FE-6D2362B31141
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s1 (Preboot)
    |   Name:                      iSCPreboot (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6213632 B (6.2 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s2 CA25E52A-3425-4232-926F-F840D359A9E2
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s2 (xART)
    |   Name:                      xART (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6311936 B (6.3 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s3 0566ABD3-9EA7-46CA-90C7-CDF4DD0E94B4
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s3 (Hardware)
    |   Name:                      Hardware (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         507904 B (507.9 KB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s4 F4E0743D-D91F-410B-9569-4196540E4B8D
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk1s4 (Recovery)
        Name:                      Recovery (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```
</details>

Esta es la primera partición en una disposición estándar. Está oculta por defecto en `diskutil`, la salida de abajo es de una imagen volcada.

### disk1s1 (Preboot)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s1
   Device Identifier:         disk1s1
   Device Node:               /dev/disk1s1
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               iSCPreboot
   Mounted:                   Yes
   Mount Point:               /System/Volumes/iSCPreboot

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               19D7B85B-D5EC-41E9-8441-EEAE52D964F1
   Disk / Partition UUID:     19D7B85B-D5EC-41E9-8441-EEAE52D964F1

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Punto de montaje: `/System/Volumes/iSCPreboot`

Esto contiene archivos usados directamente por el firmware del sistema iBoot.

Archivos:

* /(uuid)/ - uno por instalación de SO, y cada versión de 1TR
    * LocalPolicy/ - Políticas de arranque
        * (hash largo).img4 - Política de arranque local para una instalación de SO
        * (hash largo).recovery.img4 - Política de arranque local para un 1TR
* SFR/current/ - información para la versión actual de SFR
    * apticket.der - ¿ticket AP?
    * RestoreVersion.plist
    * SystemVersion.plist
    * sep-firmware.img4 - firmware SEP, no siempre presente
* SFR/fallback/ - información para la versión anterior de SFR (misma estructura que arriba)

Cuando un SO desde un medio externo se arranca vía 1TR, sus archivos de arranque (todo bajo <Preboot>/(uuid)/boot) se copian desde el volumen Preboot a esta partición bajo la misma ruta. Así es como los Macs Apple Silicon pueden "arrancar" desde medios externos, aunque iBoot en sí no pueda. 

### disk1s2 (xART)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s2
   Device Identifier:         disk1s2
   Device Node:               /dev/disk1s2
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               xART
   Mounted:                   Yes
   Mount Point:               /System/Volumes/xarts

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               E9FD7E0B-391D-42DD-997A-15B5FE0CE73C
   Disk / Partition UUID:     E9FD7E0B-391D-42DD-997A-15B5FE0CE73C

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Punto de montaje: `/System/Volumes/xarts`

Esto contiene un solo archivo (uuid).gl - almacenamiento SEP. Se puede usar `xartutil` para gestionarlo.

### disk1s3 (Hardware)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s3
   Device Identifier:         disk1s3
   Device Node:               /dev/disk1s3
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               Hardware
   Mounted:                   Yes
   Mount Point:               /System/Volumes/Hardware

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               6ED3C985-5971-4874-ABCA-841BB76CC6E5
   Disk / Partition UUID:     6ED3C985-5971-4874-ABCA-841BB76CC6E5

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Punto de montaje: `/System/Volumes/Hardware`

Información y registros relacionados con el hardware

* /recoverylogd/ - registros de recuperación
* FactoryData/ - ticket AP, información de personalización del dispositivo
* srvo/ - ¿datos relacionados con sensores?
* MobileActivation/ - datos relacionados con la activación

### disk1s4 (Recovery)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s4
   Device Identifier:         disk1s4
   Device Node:               /dev/disk1s4
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               Recovery
   Mounted:                   No

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Disabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               6A900409-C5A5-47CC-84AA-F0FE24E0D629
   Disk / Partition UUID:     6A900409-C5A5-47CC-84AA-F0FE24E0D629

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          Not applicable (not mounted)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Vacío.

## disk0s2 / disk3: Contenedor de macOS

(nota: esta salida es después de que el sello del volumen raíz se haya roto)

<details>
  <summary>diskutil apfs list</summary>

```
# diskutil apfs list /dev/disk3
|
+-- Container disk3 CEF76C65-8EAE-4346-A09E-AB98301B36AA
    ====================================================
    APFS Container Reference:     disk3
    Size (Capacity Ceiling):      245107195904 B (245.1 GB)
    Capacity In Use By Volumes:   61710045184 B (61.7 GB) (25.2% used)
    Capacity Not Allocated:       183397150720 B (183.4 GB) (74.8% free)
    |
    +-< Physical Store disk0s2 BDB006E1-54AA-43CD-B7FE-FF021547D51E
    |   -----------------------------------------------------------
    |   APFS Physical Store Disk:   disk0s2
    |   Size:                       245107195904 B (245.1 GB)
    |
    +-> Volume disk3s1 424FEA98-2296-48FD-8DFF-0866835572E9
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s1 (System)
    |   Name:                      Macintosh HD (Case-insensitive)
    |   Mount Point:               /Volumes/Macintosh HD
    |   Capacity Consumed:         15053312000 B (15.1 GB)
    |   Sealed:                    Broken
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s2 B065CC7B-CC03-44F1-8A58-CD9AB099D57C
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s2 (Preboot)
    |   Name:                      Preboot (Case-insensitive)
    |   Mount Point:               /Volumes/Preboot
    |   Capacity Consumed:         361050112 B (361.1 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s3 FDC764F5-0EF0-44F4-AA34-D011195207CA
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s3 (Recovery)
    |   Name:                      Recovery (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         939421696 B (939.4 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s5 DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s5 (Data)
    |   Name:                      Data (Case-insensitive)
    |   Mount Point:               /Volumes/Data
    |   Capacity Consumed:         15799300096 B (15.8 GB)
    |   Sealed:                    No
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s6 D2247B63-54E9-411F-94C0-FF3FAB2A17A0
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk3s6 (VM)
        Name:                      VM (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```
</details>

Este es el contenedor principal de macOS para una instalación del SO.

Hay un volumen oculto *Update* (disk3s4) 