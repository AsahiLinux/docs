---
title: Arranque Tethered: máquina anfitriona macOS
---

# Configuración de arranque tethered con anfitrión macOS

Esta guía proporciona más detalles sobre la configuración de los prerrequisitos para el arranque tethered usando una máquina anfitriona con macOS.

## Anfitrión macOS

Requisitos del anfitrión:

* Cualquier computadora Apple ejecutando una versión de macOS relativamente reciente
  * Suficiente espacio en disco en el anfitrión para instalar y compilar software
  * Un puerto USB libre en el anfitrión
  * Un cable USB-A/USB-C o USB-C/USB-C
  * [prerrequisitos instalados](#instalando-software-prerrequisito)

Probado con:

* iMac 27' finales de 2015 ejecutando macOS Big Sur 11.7 (20G817)

## Configuración del puerto serie

En macOS, los nombres de los dispositivos UART de m1n1 son diferentes a los de un anfitrión Linux (`/dev/m1n1` y `/dev/m1n1-sec` en Linux). Típicamente, los nombres de los dispositivos se ven así:

* `/dev/cu.usbmodemP_01` para el dispositivo UART primario usado por el cliente proxy de m1n1
* `/dev/cu.usbmodemP_03` para el dispositivo UART secundario usado para engancharse al hipervisor m1n1 temprano cuando la máquina tethered arranca

Ten en cuenta que los nombres de los dispositivos pueden cambiar según tu máquina o configuración particular. Si tienes dudas, revisa cómo puedes [encontrar los nombres reales de los dispositivos](#encontrar-nombres-reales-de-dispositivos).

## Activar la puerta trasera de m1n1

Apaga (estado apagado) y conecta el cable USB a la máquina objetivo y luego ejecuta el siguiente comando en el anfitrión:

```shell
~/asahi/m1n1/proxyclient/tools/picocom-sec.sh
```

Ahora enciende la máquina tethered. El script `picocom-sec.sh` espera el dispositivo y se conecta a él una vez que aparece, lo que activará la puerta trasera del hipervisor m1n1 y deberías ver alguna salida en la terminal:

```console
picocom v3.1

port is        : /dev/cu.usbmodemP_03
flowcontrol    : none
baudrate is    : 500000
:
:
```

A partir de aquí, el hipervisor m1n1 está listo para aceptar comandos a través de las herramientas del cliente proxy de m1n1:

```shell
$ python3 ~/asahi/m1n1/proxyclient/tools/shell.py
:
:
TTY> Waiting for proxy connection... . Connected!
Fetching ADT (0x00058000 bytes)...
m1n1 base: 0x802848000
¡Diviértete!
>>>
```

### Encontrar nombres reales de dispositivos

Instala `pyserial` y ejecuta el siguiente comando (asegúrate de que la máquina objetivo esté conectada al anfitrión):

```shell
while : ; do pyserial-ports ; sleep 1 ; done
```

Enciende en frío (desde estado apagado) la máquina tethered y espera a que aparezcan nuevos dispositivos: anota los nombres de los dispositivos (el de número más bajo debería ser el dispositivo UART principal de m1n1 y el otro el secundario).

## Instalando software prerrequisito

### Instalando Homebrew

La forma preferida de instalar software en tu anfitrión macOS es usando el gestor de paquetes `homebrew`, lo cual se hace ejecutando un simple comando de shell.

Abre una ventana de terminal (presiona `[Cmd]`+`[Espacio]`, luego escribe `iterm`, luego presiona `[enter]`) y escribe el siguiente comando (consulta el [sitio web de Homebrew](https://brew.sh) si tienes dudas):

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Instalando Python >= 3.9

macOS incluye Python 3.8 pero se requiere Python 3.9 o posterior para la parte de scripts de m1n1 que se ejecuta en el anfitrión y controla el hipervisor m1n1 en la máquina tethered:

```shell
brew install python3
```

Verifica que puedes acceder al ejecutable de python deseado y que tienes la versión mínima requerida:

```shell
$ type python3
python3 is /usr/local/bin/python3
$ python3 --version
Python 3.10.8
```

### Instalando LLVM

Necesitarás un compilador C para construir m1n1 y sus dependencias, y para compilar el kernel también. LLVM es el compilador recomendado para Asahi (¿creo?):

```shell
brew install llvm
```

### Instalando pyserial

Pyserial es necesario para m1n1 y puede ayudar a identificar el nombre del dispositivo de puerto serie expuesto por macOS cuando arranca m1n1:

```shell
pip3 install pyserial construct serial.tool
```

Verifica que `pyserial-ports` esté instalado:

```shell
$ type pyserial-ports
pyserial-ports is /usr/local/bin/pyserial-ports
```

### Instalando picocom

Se requiere un software de comunicación por puerto serie para establecer comunicación con el proxy de m1n1. Recomendamos instalar `picocom` para usarlo como terminal serie, disponible con homebrew:

```shell
brew install picocom
```

### Instalando img4tool (opcional)

Puedes usar Homebrew Tap o instalarlo manualmente

#### Usar Homebrew tap

He creado un tap para facilitar la instalación a través de Homebrew, solo añade el tap e instala:

```shell
brew tap aderuelle/homebrew-tap
brew install img4tool
```

#### Instalar manualmente

Si planeas arrancar un kernel de macOS original, necesitarás estas herramientas para extraer el archivo real del kernel desde el kernelcache de una instalación de macOS en la máquina objetivo. Si no hay una versión precompilada para macOS, tendrás que compilarla.

Para este paso, crea una carpeta `asahi` en tu directorio home y clona todo allí, además instala todo en una carpeta `~/asahi/deps` para no interferir con el resto del sistema.

Primero clona, compila e instala `libgeneral`

```shell
cd ~/asahi
git clone https://github.com/tihmstar/libgeneral.git
cd libgeneral
./autogen.sh
./configure --prefix=/Users/alexis/asahi/deps
make && make install
```

Luego clona, compila e instala `img4tool`

```shell
cd ~/asahi
git clone https://github.com/tihmstar/img4tool.git
cd img4tool
./autogen.sh
PKG_CONFIG_PATH=~/asahi/deps/lib/pkgconfig ./configure --prefix=~/asahi/deps
make && make install
```

Actualiza tu variable `PATH` para poder acceder al binario de `img4tool`

```shell
export PATH=~/asahi/deps/bin:$PATH
``` 