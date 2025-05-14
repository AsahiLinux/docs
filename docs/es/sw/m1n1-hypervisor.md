---
title: Hipervisor m1n1
---

# Ejecutando macOS bajo el hipervisor m1n1

Puedes ejecutar un kernel de desarrollo obtenido de Apple, en cuyo caso tendrás símbolos de depuración, o usar el kernel estándar que se encuentra en una instalación de macOS.

## Preparación

Puedes usar tu instalación existente de macOS, o alternativamente instalar una segunda copia de macOS.

Para instalar una segunda copia de macOS necesitarás completar un par de pasos:

1. Crea un segundo Volumen en tu partición de macOS:  

        diskutil apfs addVolume disk4 APFS macOSTest -mountpoint /Volumes/macOSTest

    Cambia disk4 y el nombre del volumen (es decir `macOSTest`) para tu sistema/preferencias particulares.  
    _Nota: No lo hagas un rol de sistema o interferirá con tu sistema existente (sin usuarios válidos en 1TR)_.  

2. Descarga e instala macOS. Para descargar una versión específica del instalador de macOS puedes usar el comando:  

        softwareupdate --fetch-full-installer --full-installer-version 12.3

    Sustituye `12.3` por la versión que requieras. El instalador se encontrará en la carpeta Aplicaciones. Cópialo de aquí si quieres guardarlo, de lo contrario se elimina una vez que hayas instalado una vez.

    Desafortunadamente, la CDN de Apple solo mantiene el paquete de instalación completa para un número limitado de versiones, y ya no tiene 12.3.
    _Nota: ahora estamos en la versión de firmware 13.5, que está disponible normalmente. No necesitas instalar 12.3._

### Usando InstallAssistant.pkg archivado

El InstallAssistant.pkg de Monterey 12.3 ha sido archivado [aquí](https://archive.org/details/12.3-21-e-230-release), pero intentar instalar haciendo doble clic instala una versión en línea de la `Install macOS Monterey.app`, con un tamaño de archivo de aproximadamente 40MB. Cuando se ejecuta ese archivo, instalará la última versión de macOS. Sin embargo, instalarlo a través de la línea de comandos parece hacer lo correcto:

        sudo installer -pkg 12.3\ 21E230\ \(Release\).pkg -target /


Verifica que `Install macOS Monterey.app` en la carpeta `applications` sea de ~12GB.


## Obteniendo el kernel de desarrollo de macOS y creando el kernelcache

1. Crea una cuenta de desarrollador de macOS (requiere una cuenta de iCloud).
2. Descarga el Mac OS Kernel Debug Kit (KDK) de Apple [aquí](https://developer.apple.com/download/more/). Debe coincidir con tu versión de Mac OS.
3. Instala el KDK en Mac OS. El KDK se instalará en `/Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk`
4. Cambia al directorio de kernels:  

        cd /Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk/System/Library/Kernels

5. Cambia a la carpeta KDK y ejecuta el siguiente comando:

        kmutil create -z -n boot -a arm64e -B ~/dev.kc.macho -V development \
          -k kernel.development.t8101 \
          -r /System/Library/Extensions/ \
          -r /System/Library/DriverExtensions \
          -x $(kmutil inspect -V release --no-header | grep -v "SEPHiber" | awk '{print " -b "$1; }')

    `-B` designa el archivo de salida, nuestro kernel cache se escribe en `dev.kc.macho` en el directorio home

    `-k` debe coincidir con un kernel en el directorio de kernels

## Preparando el Volumen de macOS deshabilitando características de seguridad

0. Establece el Volumen de macOS como objetivo de arranque predeterminado.
1. Inicia en 1tr e inicia una terminal.
2. Deshabilita la mayoría de las características de seguridad en la política de arranque: `bputil -nkcas`; usa `diskutil info [nombre del disco]` para obtener el UUID.
3. Deshabilita SIP (bputil lo restablece): `csrutil disable`.
4. Instala [m1n1](m1n1-user-guide.md) como objeto de arranque personalizado:  

        kmutil configure-boot \
          -c build/m1n1.bin \
          --raw \
          --entry-point 2048 \
          --lowest-virtual-address 0 \
          -v /Volumes/macOSTest

## Iniciando el kernel de desarrollo bajo el hipervisor m1n1

1. Copia el kernelcache a tu máquina de desarrollo.
2. Copia el DWARF de depuración de `/Library/Developer/KDKs/KDK_<MACOS_VERSION>_<KDK_VERSION>.kdk/System/Library/Kernels/kernel.development.t8101.dSYM/Contents/Resources/DWARF/kernel.development.t8101`
3. Para iniciar macOS con el hipervisor m1n1, ejecuta: 

        python3 proxyclient/tools/run_guest.py \
          -s <RUTA_A_DWARF_DE_DEPURACION> \
          <RUTA_A_KERNEL_CACHE_DE_DESARROLLO> \
          -- "debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1 clpc=0"

Nota: los archivos t8101 (tanto el kernel como los símbolos dwarf) están disponibles a partir del KDK para macOS 11.3. Las transmisiones de Marcan sobre el arranque de macOs con hipervisor se hicieron con 11.3.
Estas notas también han sido validadas con macOS 11.5.2 y pueden llegar a la pantalla de inicio de sesión con red WiFi en un MacBook Air:

- Versión del kernel:
```
$ uname -a 
> Darwin MacBook-Air.home 20.6.0 Darwin Kernel Version 20.6.0: Wed Jun 23 00:26:27 PDT 2021; root:xnu-7195.141.2~5/RELEASE_ARM64_T8101 arm64
```
- Versión de macOS:
```
$ sw_vers
> ProductName:	macOS / ProductVersion:	11.5.2 / BuildVersion:	20G95
```

Si ves el logo de Apple (versión arcoíris) y no la barra de progreso, esto significa que probablemente tuviste un pánico de macOS temprano en el proceso de arranque. Esto puede venir de una discrepancia de versión de macOS entre el kernel cache (kernel + extensiones) y el sistema de archivos raíz de macOS.
Para averiguar dónde está atascado el proceso de arranque, puedes iniciar una utilidad serie como minicom/picocom y similares, con velocidad de baudios 115200 (algo como `picocom -b 115200 /dev/ttyACM1`).
Ten paciencia cuando estés arrancando con una CPU y el hipervisor. Dependiendo de lo que estés rastreando, es más lento de lo normal y es esperado.

Aquí hay algunos números de algunos experimentos con macOS `11.5.2` y versión de m1n1 commit `bd5211909e36944cb376d66c909544ad23c203bc`:
- Desde que se lanzó el comando run_guest (`t0`) hasta comenzar a cargar el kernel: 9s.
- Desde `t0` hasta la pantalla de inicio de sesión (sin teclado ni cursor del mouse moviéndose primero): alrededor de 2min.
- Con teclado y cursor del mouse moviéndose: alrededor de 2min35s.
- Desde que se ingresa la contraseña hasta el escritorio y la barra de menú: alrededor de +2min.

## Ejecutando el kernel estándar de macOS desde una instalación de macOS

1. Arranca en macOS.
2. Encuentra el `kernelcache`, está en `/System/Volumes/Preboot/(UUID)/boot/(hash largo)/System/Library/Caches/com.apple.kernelcaches/kernelcache`
3. Haz una copia de este archivo en algún lugar.
4. Obtén (o compila) una copia de img4tool (https://github.com/tihmstar/img4tool).
5. Extrae la imagen im4p:

        img4tool -e -p out.im4p kernelcache

6. Extrae el machO del im4p:

        img4tool -e -o kernel.macho out.im4p

7. Ahora puedes ejecutar macOS de manera similar a como se mostró arriba (solo que sin DWARF de depuración):

        python3 proxyclient/tools/run_guest.py \
          <RUTA_A_MACHO_EXTRAIDO> \
          -- "debug=0x14e serial=3 apcie=0xfffffffe -enable-kprintf-spam wdt=-1 clpc=0"

## Actualizando tu árbol de hipervisor m1n1

El ABI del hipervisor/m1n1 *no* es estable. Si has instalado una compilación nueva de m1n1 como se mostró arriba, puedes usar `run_guest.py` directamente para ahorrar algo de tiempo. Sin embargo, tan pronto como actualices tu árbol git de m1n1, *debes* compilar el m1n1 actualizado y ejecutar
```
python tools/chainload.py -r ../build/m1n1.bin
```
antes de `run_guest.py`, para asegurarte de que el ABI esté sincronizado. No hacer esto llevará a errores/fallos aleatorios debido a discrepancias de ABI.

## Usando GDB/LLDB

El comando `gdbserver` inicia la implementación del servidor que puede conectarse a GDB o LLDB. LLDB es más recomendado porque soporta autenticación de punteros y dyld del kernel de Darwin.

Necesitas cargar extensiones del kernel para obtener símbolos en LLDB. El siguiente script de shell genera `target.lldb`, un script LLDB conveniente que establece el objetivo y carga extensiones del kernel:

```sh
echo target create -s kernel.development.t8101.dSYM kernel.development.t8101 > target.lldb
for k in $(find Extensions); do [ "$(file -b --mime-type $k)" != application/x-mach-binary ] || printf 'image add %q\n' $k; done >> target.lldb
```

Los siguientes comandos para LLDB cargan el script generado y se conectan a m1n1:
```
command source -e false target.lldb
process connect unix-connect:///tmp/.m1n1-unix
```

No ejecutes comandos de consola del hipervisor que interfieran con GDB/LLDB, o estarán fuera de sincronización. Por ejemplo, no edites puntos de interrupción desde la consola del hipervisor y GDB/LLDB al mismo tiempo.

# Fuentes
Fuente para la creación del kernelcache: [https://kernelshaman.blogspot.com/2021/02/building-xnu-for-macos-112-intel-apple.html](https://kernelshaman.blogspot.com/2021/02/building-xnu-for-macos-112-intel-apple.html) 