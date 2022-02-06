Normally m1n1 is used in a tethered setup. Where one computer is used to boot another computer. Or it is used in combination with u-boot. For system where u-boot is currently not available (m1 max/pro). You can use m1n1 in a tethered way. So you boot a boot object which contains m1n1, device trees, kernel command linux, a linux kernel and optionally a ram disk. Than you boot to 1tr. and use kmutil to configure this boot object.

# Compiling the kernel with smc support

```
git clone --depth 1 https://github.com/AsahiLinux/linux -b smc/work
cd linux/
curl -s https://tg.st/u/9ce9060dea91951a330feeeda3ad636bc88c642c.patch | git am -
curl -s https://tg.st/u/5nly | git am -
curl -s https://tg.st/u/0wM8 | git am -
curl -s https://tg.st/u/m1-config-smc-2022-02-06 > .config
make olddefconfig
make -j 16 Image.gz dtbs modules
make modules_install

# If you're on Debian
make -j 16 bindeb-pkg
```

Do not forget to install the kernel or at least copy over the modules on the system that you're booting otherwise you will have no network drivers.

# Creating that boot object

```
# Pick the right device tree for your device or include all and m1n1 will pick the right one
cat m1n1.bin <(echo 'boot-args=net.ifnames=0 rw root=/dev/nvme0n1p5 rootwait rootfstype=ext4') Image.gz t8103-j274.dtb > untethered.bin
```

# Installing the boot object

Boot to 1tr. By making sure that the Linux stub partition is configured as default boot. Than turn the machine off. And booting it by
keeping the power button pressed for 15 seconds. Choose Options. From the Utilities Menu choose the terminal, download the boot object which you created in the last step or copy it from a usb stick and run:

```
kmutil configure-boot -c untethered.bin --raw --entry-point 2048 --lowest-virtual-address 0 -v /Volumes/Linux
```