---
title: Eliminando una instalación
---

# Esto es para instalaciones predeterminadas de Asahi. Estos pasos no aplican para configuraciones de particionado personalizadas.
## No uses la interfaz gráfica de Diskutil

1. Encuentra las 3 particiones que crea el instalador de Asahi.  
Ejecuta el script del instalador y sal después de llegar a la información del disco.  
```
curl https://alx.sh | sh
```
Ejemplo de información de disco:
```
Particiones en el disco del sistema (disk0):
  1: APFS [Macintosh HD] (380.00 GB, 6 volúmenes)
    OS: [B ] [Macintosh HD] macOS v12.3 [disk3s1, D44D4ED9-B162-4542-BF50-9470C7AFDA43]
  2: APFS [Asahi Linux] (2.50 GB, 4 volúmenes)
    OS: [ *] [Asahi Linux] instalación incompleta (macOS 12.3 stub) [disk4s2, 53F853CF-4851-4E82-933C-2AAEB247B372]
  3: EFI (500.17 MB)
  4: Sistema de archivos Linux (54.19 GB)
  5: (espacio libre: 57.19 GB)
  6: APFS (Recuperación del sistema) (5.37 GB, 2 volúmenes)
    OS: [  ] recoveryOS v12.3 [Recuperación principal]

  [B ] = SO arrancado, [R ] = Recuperación arrancada, [? ] = Desconocido
  [ *] = Volumen de arranque predeterminado
```
Las particiones que instala Asahi son `Asahi Linux`, `EFI` y `Sistema de archivos Linux`.  
Anota el `disk#s#` al lado de la línea de Asahi Linux.  
  
2. Elimina el "contenedor APFS de Asahi"
```
diskutil apfs deleteContainer disk<num-aquí>
```

3. Encuentra los números de partición de las particiones EFI y Sistema de archivos Linux.  
```
diskutil list
```
Ejemplo de salida:
```
/dev/disk0 (interno, físico):
   #:                       TIPO NOMBRE                    TAMAÑO       IDENTIFICADOR
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:             Apple_APFS_ISC Contenedor disk1         524.3 MB   disk0s1
   2:                 Apple_APFS Contenedor disk4         362.6 GB   disk0s2
                    (espacio libre)                         2.5 GB     -
   3:                        EFI EFI - FEDOR             524.3 MB   disk0s4
   4:           Sistema de archivos Linux                1.1 GB     disk0s5
   5:           Sistema de archivos Linux                127.7 GB   disk0s6
   6:        Apple_APFS_Recovery Contenedor disk3        5.4 GB     disk0s7

/dev/disk4 (sintetizado):
   #:                       TIPO NOMBRE                    TAMAÑO       IDENTIFICADOR
   0:      APFS Container Scheme -                      +362.6 GB   disk4
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            11.2 GB    disk4s1
   2:              APFS Snapshot com.apple.os.update-... 11.2 GB    disk4s1s1
   3:                APFS Volume Preboot                 6.9 GB     disk4s2
   4:                APFS Volume Recovery                1.0 GB     disk4s3
   5:                APFS Volume Data                    287.6 GB   disk4s5
   6:                APFS Volume VM                      20.5 KB    disk4s6
```

4. Elimina las particiones EFI y Sistema de archivos Linux
```
diskutil eraseVolume free free disk<num-aquí>s<num-aquí>
diskutil eraseVolume free free disk<num-aquí>s<-otro-num-aquí>
```

## Redimensiona MacOS para llenar el disco nuevamente
1. Obtén el número de disco lógico correspondiente a la instalación de MacOS
```
diskutil list
```
Ejemplo de salida:
```
/dev/disk0 (interno, físico):
   #:                       TIPO NOMBRE                    TAMAÑO       IDENTIFICADOR
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:             Apple_APFS_ISC Contenedor disk1         524.3 MB   disk0s1
   2:                 Apple_APFS Contenedor disk4         362.6 GB   disk0s2
                    (espacio libre)                         2.5 GB     -
   3:                        EFI EFI - FEDOR             524.3 MB   disk0s4
   4:           Sistema de archivos Linux                1.1 GB     disk0s5
   5:           Sistema de archivos Linux                127.7 GB   disk0s6
   6:        Apple_APFS_Recovery Contenedor disk3        5.4 GB     disk0s7

/dev/disk4 (sintetizado):
   #:                       TIPO NOMBRE                    TAMAÑO       IDENTIFICADOR
   0:      APFS Container Scheme -                      +362.6 GB   disk4
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            11.2 GB    disk4s1
   2:              APFS Snapshot com.apple.os.update-... 11.2 GB    disk4s1s1
   3:                APFS Volume Preboot                 6.9 GB     disk4s2
   4:                APFS Volume Recovery                1.0 GB     disk4s3
   5:                APFS Volume Data                    287.6 GB   disk4s5
   6:                APFS Volume VM                      20.5 KB    disk4s6
```
En el ejemplo anterior, la línea `/dev/disk# (sintetizado)` que tiene Macintosh HD listada debajo  
es el disco a anotar. En este ejemplo expandirías el disco lógico disk4

2. Redimensiona - expande el volumen lógico para llenar el espacio libre.
```
diskutil apfs resizeContainer disk<num-aquí> 0
```

### ¿Errores? ¿Necesitas más información de fondo?
[Hoja de referencia de particionado](partitioning-cheatsheet.md) 