Normally m1n1 is used in a tethered setup. Where one computer is used to boot another computer. Or it is used in combination with u-boot. For system where u-boot is currently not available (m1 max/pro). You can use m1n1 in a tethered way. So you boot a boot object which contains m1n1, device trees, kernel command linux, a linux kernel and optionally a ram disk. Than you boot to 1tr. and use kmutil to configure this boot object.

# No PCI at the moment
With this method, PCI will not be turned on as a result you won't have internal wifi or USB-A ports on the mini. Marcan has pushed the smc plumbing, so now someone needs to implement enabling pci devices, poweroff on halt -p and the ability to read out temperatures and battery status. With SMC plumbing being there, this will hopefully not take more than a week or two.

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