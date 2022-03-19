# Install Fedora using the Debian installer

[Video Recording](https://tg.st/u/m1-fedora.mp4)

* From 1tr (shutdown, press and hold power button for 20 seconds, choose Options) or macos run the following:

```
curl -sL tg.sh/d | sh
```

* Follow the installer flow and read and follow the instructions.

* In Fedora complete the setup wizard

* Open a shell and run the following commands

```
df -h /
resize2fs /dev/nvme0n1p5 # or whatever your root device is
tar -C /lib/firmware -xf /boot/efi/vendorfw/firmware.tar
reboot
```

* Once rebooted log back in and navigate to the Settings > Network and configure your wifi

# How this image was built
I downloaded Fedora-Workstation-35-1.2.aarch64.raw.xz, extracted it and loopback mounted all partitions. Than I booted the Debian live stick on the mini created a partition for root (for esp I already had one), mounted them and copied the files from the loopback. The original raw image used btrfs. I don't like it because it is slow, so I used ext4. Than I copied the kernel, modules, config, system.map over and used dracut to build a initrd. Than I modified the /etc/fstab and modified grub to pick up the grub.cfg from the right path. Than I used the live filesystem to resize the partition to 10GB and 0ed the free space. Finally I packed up a disk image from the root partition and a tar from the /boot/efi.