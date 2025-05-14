# Firmware update

These steps allow you to upgrade the firmware in the macOS stub partition. These are manual steps, and the risk of messing up is high.

```
    Please ensure you have a restorable backup of your Fedora installation.
    Please attempt this only if you’re comfortable with the steps mentioned here and be prepared to do a fresh install.
```

- boot into Linux
- edit /etc/fstab and comment out the line with /boot/efi
- reboot into macOS
- mount the EFI partition of your linux install with `diskutil mount 'EFI - LINUX'` or similar (check the correct name with `diskutil list`)
- copy the contents of this partition (using finder or cp) somewhere in macOS
- unmount the partition again with `diskutil umount 'EFI - LINUX'`
- wipe the APFS container (2.5 GB) using `diskutil apfs deleteContainer disk0s3` !! double and triple check the device id !!
- wipe the EFI partition (500MB) using `diskutil eraseVolume free free disk0s4`
- you should now have 3 GB free between the macOS APFS container and the 'Linux Filesystem' with your rootfs
- start the asahi installer and choose the option 'UEFI environment only'
- the installer will ask to shutdown and reboot into the recovery of the stub partition
- follow the steps inside recovery until the point it asks to reboot, **don't reboot**, but press Ctrl-C to exit the script
- go to the Apple logo in the top left corner and choose 'Startup Disk'
- set your macOS disk as startup disk and reboot into macOS
- mount the EFI partition again using `diskutil mount` (note that the name may be different from above if you chose a different name for the UEFI install)
- copy the `EFI` and `m1n1` folders from your backup over the new EFI partition
- reboot into Linux by setting the Startup Disk back to Linux or by holding the power button at boot
- check the UUID of the EFI partition with `lsblk -f`. Look for the one which is short (XXXX-XXXX)
- edit `/etc/fstab`, uncomment the /boot/efi line and replace the UUID with the new one
- reboot again and you should now be on latest firmware and back where you were
