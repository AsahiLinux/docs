# WiFi Support
## Under MacOS grab the WiFi firmware as per [Glanzmann's notes](https://tg.st/u/asahi.txt)
 * Clone the installer  
`git clone https://github.com/AsahiLinux/asahi-installer`
 * Go into the src directory 
`cd asahi-installer/src`
 * Grab the firmware into a tar file 
`python3 -m firmware.wifi /usr/share/firmware/wifi /tmp/linux-firmware.tar`
## Install firmware
 * Under Linux booted via [USB drive](https://github.com/AsahiLinux/docs/wiki/SW:Linux:USB-drive) or [nvme](https://github.com/AsahiLinux/docs/wiki/SW:Linux:NVME) rootfs Create the firmware directory:
`sudo mkdir -p /usr/lib/firmware`
 * Install the wifi firmware you extracted earlier
`sudo tar -C /usr/lib/firmware -xf firmware.tar`
 * Install any other networking / WiFi packages you will need. e.g. wpasupplicant 
## Enable WiFi
 * You need to have built a Asahi Linux kernel with the M1 WiFI support such as the [wifi/take5](https://github.com/AsahiLinux/linux/tree/wifi/take5) branch
 * Before you boot that kernel via [m1n1 over USB](https://github.com/AsahiLinux/docs/wiki/SW:Linux#directly) - run this script to enable the WiFi hardware
`python3 ./proxyclient/experiments/pcie_enable_devices.py`
 * There are other ways to do this - this what I did under Debian linux
 * Now after the linux kernel has booted you should be able to see a WiFi device (wlan0) via the usual tools 
`ip a l`
 * You can start networking the usual Linux tools e.g.
  * Edit the configuration file:
```
auto wlan0
iface wlan0 inet dhcp
    wpa-ssid YOUR_SSID
    wpa-psk YOUR_WIFI_PASSPHRASE
```
 * Then start up the interface (wlan0) via (note -v => verbose info)
`sudo ifup -v wlan0`