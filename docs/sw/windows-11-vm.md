---
title: How to create a Windows 11 VM
---

### Introduction
Here's a simple guide to install Windows 11 on Fedora Asahi Remix!
This is going over how to install, configure, and manage your own instance of Windows 11 if you ever need anything from windows besides having to switch hardware or use bare metal windows machines. 
Credits to: aykevl and Davide Calvaca

!!! note
    `dnf install @virtualization` is out of scope for this guide and not supported. It is, as of the writing of this unsupported and broken, as that includes virt-manager, libvirtd, and others. Please refer to https://github.com/AsahiLinux/docs/pull/206#issuecomment-3274648383 for more information. Please proceed with caution if you are experimenting with this. 
### Steps
1. Install QEMU, via the command `dnf install qemu`  
2. Create a new directory on your desktop or wherever, naming it to whatever you want, i.e. let's say, `windows11` using `mkdir windows11` via an appropriate terminal application or right clicking and making a directory on your desktop. 
3. Go into that directory with `cd windows11` 
4. Download a Windows 11 ISO, appropriately the Windows 11 Professional build for ARM64 [here](https://www.microsoft.com/en-us/software-download/windows11arm64). Feel free to rename it to a good name like `windows-11.iso` using `mv` in your appropriate terminal application of choice.
5. Along with that ISO, it would be good to use the virtio-drivers to better improve performance of the machine. Feel free to download it [here](https://github.com/virtio-win/kvm-guest-drivers-windows/wiki/Driver-installation) and renaming it appropriately to `win11-virtio.iso`.
6. Create a virtual disk for your Windows 11 VM by using the command: `qemu-img create -f qcow2 win11.qcow2 25G` and adjusting it to how much disk space you would want, 25GB is a placeholder. 
7. Here we are going to create a startup script for our Windows 11 VM. Create a file named `win11.sh` and make sure it is executable with `chmod +x win11.sh`. The contents should be:
``` {.md .copy}
 #!/bin/sh

performance_cores=$(awk '
  /^processor/ { proc=$3 } 
  /^CPU part/ {
    if ($4 == "0x023" || $4 == "0x025" || $4 == "0x029" || $4 == "0x033" || $4 == "0x035" || $4 == "0x039")
      procs=procs ? procs","proc : proc
  } END { print procs }
' /proc/cpuinfo)

taskset -c "$performance_cores" \
  qemu-system-aarch64 \
    -display sdl,gl=on \
    -cpu host \
    -M virt \
    -enable-kvm \
    -m 2G \
    -smp 2 \
    -bios /usr/share/edk2/aarch64/QEMU_EFI.fd \
    -hda win11.qcow2 \
    -device qemu-xhci \
    -device ramfb \
    -device usb-storage,drive=install \
    -drive if=none,id=install,format=raw,media=cdrom,file=windows-11-iot.iso \
    -device usb-storage,drive=virtio-drivers \
    -drive if=none,id=virtio-drivers,format=raw,media=cdrom,file=virtio-win.iso \
    -object rng-random,filename=/dev/urandom,id=rng0 \
    -device virtio-rng-pci,rng=rng0 \
    -audio driver=pipewire,model=virtio \
    -device usb-kbd \
    -device usb-tablet \
    -nic user,model=virtio-net-pci
```
!!! note
    You may have to adjust the file arguments if you have named it something different than windows-11.iso and virtio-win.iso 

8. Now run `./win11.sh`. A QEMU window pops up. After going through some boot screens, it should show “Press any key to boot from CD or DVD…”. Press any key to boot Windows (quickly, because otherwise you’ll end up in a UEFI console).
9. Windows should now be booting, and you should end up in the Windows 11 setup. Most of this is straightforward, but there is one thing to be aware of:
In the “Select location to install Windows 11”, no drives are shown. Fix this by clicking “Load Driver”, “Browse”, expand the virtio-win drive, and select viostor → w11 → ARM64. Click OK. Select the “Red Hat VirtIO SCSI controller” that appears, and click install.
10. During the installation, the VM will reboot a few times. Don’t do anything, just let it happen.
11. After installation you’ll end up in the first boot wizard (to configure location, keyboard, etc).
In the “Let’s connect you to a network”, click “Install driver”, open the virtio-win drive, navigate to NetKVM → w11 → ARM64, and click “Select folder”. Wait a few seconds, and the network adapter should appear. You can now continue.
12. After completing the installation, you should have a working Windows 11 install!

# Post Installation
Shut down the VM as usual to not make Windows scared (don’t just exit the win11.sh script). To boot it again, simply run the ./win11.sh script again.

After installation, you can remove the two ISOs and remove the following 4 lines from the win11.sh script:
``` md
-device usb-storage,drive=install \
    -drive if=none,id=install,format=raw,media=cdrom,file=windows-11-iot.iso \
    -device usb-storage,drive=virtio-drivers \
    -drive if=none,id=virtio-drivers,format=raw,media=cdrom,file=virtio-win.iso \
```

# SSH Steps
1. Modify the QEMU command line, replace `-nic user,model=virtio-net-pci` with `-device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::5555-:22` to forward port 5555 to port 22 in the VM (you can pick another port if you like).
2. Start “Optional Features”, click “View features”, search for OpenSSH Server, and install it. (This takes a while).
3. Allow port 22 through the Windows firewall, see [this StackOverflow post](https://stackoverflow.com/questions/68594235/allow-ssh-protocol-through-win-10-firewall).
4. Start “Services”, look for “OpenSSH SSH Server”, and start it (right click → start). Also, right click on it, go to properties, and set the startup type to automatic so it always starts at boot.
5. Now you can SSH into your Windows system using ssh yourusername@localhost -p 5555!
6. If you want to log into the system using public-key authentication, you can put the public key in C:\ProgramData\ssh\administrators_authorized_keys (assuming your account is an administrator account).