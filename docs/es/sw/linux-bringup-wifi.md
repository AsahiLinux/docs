---
title: Puesta en Marcha de Linux: WiFi
---

# Soporte de WiFi
## En MacOS obtén el firmware de WiFi según [las notas de Glanzmann](https://tg.st/u/asahi.txt)
 * Clona el instalador  
`git clone https://github.com/AsahiLinux/asahi-installer`
 * Entra en el directorio src 
`cd asahi-installer/src`
 * Obtén el firmware en un archivo tar 
`python3 -m firmware.wifi /usr/share/firmware/wifi /tmp/linux-firmware.tar`
## Instalar firmware
 * En Linux iniciado vía [unidad USB](linux-bringup-usb.md) o rootfs en [NVMe](linux-bringup-nvme.md) crea el directorio de firmware:
`sudo mkdir -p /usr/lib/firmware`
 * Instala el firmware de wifi que extrajiste antes
`sudo tar -C /usr/lib/firmware -xf firmware.tar`
 * Instala cualquier otro paquete de red / WiFi que necesites, por ejemplo wpasupplicant
## Habilitar WiFi
 * Debes haber compilado un kernel de Asahi Linux con soporte para WiFi en M1, como la rama [wifi/take5](https://github.com/AsahiLinux/linux/tree/wifi/take5)
 * Antes de arrancar ese kernel vía [m1n1 por USB](linux-bringup.md#directly) - ejecuta este script para habilitar el hardware de WiFi
`python3 ./proxyclient/experiments/pcie_enable_devices.py`
 * Hay otras formas de hacerlo, esto es lo que hice bajo Debian Linux
 * Ahora, después de arrancar el kernel de Linux, deberías poder ver un dispositivo WiFi (wlan0) con las herramientas habituales
`ip a l`
 * Puedes iniciar la red con las herramientas habituales de Linux, por ejemplo:
  * Edita el archivo de configuración:
```
auto wlan0
iface wlan0 inet dhcp
    wpa-ssid TU_SSID
    wpa-psk TU_CONTRASEÑA_WIFI
```
 * Luego inicia la interfaz (wlan0) con (nota -v => información detallada)
`sudo ifup -v wlan0` 