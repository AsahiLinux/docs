---
title: Árbol de Dispositivos de Apple (ADT)
summary:
  Árbol de Dispositivos de Apple, el sistema de descubrimiento e inicialización
  de hardware utilizado en dispositivos Apple Silicon.
---

Cuando el firmware de Apple arranca un kernel, pasa un árbol de dispositivos en formato binario. Este formato es muy similar, pero diferente, al estándar Open Firmware esperado por Linux.

Como los árboles de dispositivos de Linux, el árbol de dispositivos de Apple (ADT) codifica varios arrays de bytes sin tipo (propiedades) en una jerarquía de nodos. Estos describen el hardware disponible, o proporcionan otra información que Apple cree que el firmware podría necesitar decirle al kernel. Esto incluye información de identificación y secreta como números de serie y claves WiFi.

La principal diferencia entre ADTs y DTs de Linux es el orden de bytes; dado que las propiedades no tienen tipo, no podemos corregir automáticamente eso.

## Obteniendo tu ADT

Dado el hardware, puedes acceder a tu ADT de varias maneras.

### Opción 1: vía consola de depuración m1n1.
La forma más fácil es probablemente usar m1n1 vía adt.py

```
cd m1n1/proxyclient ; python -m m1n1.adt --retrieve dt.bin
```

Esto escribirá un archivo llamado "dt.bin" que contiene el ADT crudo (binario) e imprimirá el ADT decodificado.

### Opción 2: vía archivos im4p de macOS (Nota: estos carecen de detalles que iBoot completa durante el arranque)
### img4lib
Obtén una copia de img4lib de xerub

```
git clone https://github.com/xerub/img4lib
cd img4lib
make -C lzfse
make
make install
```

### img4tool
Obtén una copia de img4tool de tihmstar (también necesitarás su libgeneral así como autoconf, automake, libtool, pkg-config, openssl y libplist-2.0).

```
git clone https://github.com/tihmstar/libgeneral.git
git clone https://github.com/tihmstar/img4tool.git
```
luego para cada uno
```
./autogen.sh
make
make install
```
### Obteniendo archivos del árbol de dispositivos
copia el archivo im4p del directorio de abajo. Ver [Dispositivos](../hw/devices/device-list.md) para detalles del modelo 'j'.

`/System/Volumes/Preboot/[UUID]/restore/Firmware/all_flash/DeviceTree.{model}.im4p`

Si el directorio no existe intenta deshabilitar csrutil en modo recuperación, ir a configuración y habilitar terminal para acceder a todos los archivos, o comenzar desde `Volumes/Macintosh HD/` porque puede estar enlazado simbólicamente. Si aún no es accesible, intenta el buen `sudo find . -type f -name '*.im4p'`.

luego usa img4tool para extraer el archivo im4p a un archivo .bin ej.
```
img4tool -e DeviceTree.j274ap.im4p -o j274.bin
```
Para hacer lo mismo con img4lib, haz
```
img4 -i DeviceTree.j274ap.im4p -o j274.bin
```

### Opción 3: Desde macOS

Puedes obtener una representación textual del ADT directamente desde macOS ejecutando:
```
ioreg -p IODeviceTree -l | cat
```
Si bien esto no requiere decodificación, produce mucha menos información que usar m1n1 (ver abajo).

## Decodificando un ADT

después de la instalación de m1n1 (ver [página del repositorio](https://github.com/AsahiLinux/m1n1))

`cd m1n1/proxyclient`

obtén la biblioteca construct de python (no un archivo construct.py, es una biblioteca)

`pip install construct`

copia el archivo j{*}.bin obtenido al directorio proxyclient && extrae con:

`python -m m1n1.adt j{*}.bin`

También puedes obtener un mapa de memoria con la opción -a:

`python -m m1n1.adt -a j{*}.bin` 

¿Otras formas? 