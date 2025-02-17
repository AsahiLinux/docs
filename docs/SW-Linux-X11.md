# Running X11
 * You can run a non-accelerated X11 if you build the kernel with
`CONFIG_DRM_FBDEV_EMULATION=y`
 * After booting that kernel install the relevant xserver fbdev (under debian)
`sudo apt install xserver-xorg-video-fbdev`
 * Then you can try starting X
`startx`
 * If you have problems look for error messages in the Xserver log 
`less /var/log/Xorg.0.log`
 * Assuming you get X starting up then will need to set up a window manager - as per your distribution e.g. see this Debian [GUI system](https://www.debian.org/doc/manuals/debian-reference/ch07.en.html)
 * I installed the very light keyboard based fluxbox
`apt install fluxbox`
 * To get a simple graphical login screen
`apt install xdm`
 * I install the nice X terminal **konsole**
`apt install konsole`
 * For a web browser install firefox as Chrome requires special kernel paging support (not available at this time)
`sudo apt install firefox-esr`

(![X11 running on Macbook Air 2020](https://raw.githubusercontent.com/amworsley/asahi-wiki/main/images/mba-xorg-fbdev.png))