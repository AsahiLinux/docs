# WiFi Support
## Under MacOS grab the WiFi firmware as per [Glanzmann's notes](https://tg.st/u/asahi.txt)
 * Clone the installer  
`git clone https://github.com/AsahiLinux/asahi-installer`
 * Go into the src directory 
`cd asahi-installer/src`
 * Grab the firmware into a tar file 
`python3 -m firmware.wifi /usr/share/firmware/wifi /tmp/linux-firmware.tar`