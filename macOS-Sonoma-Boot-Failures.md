## What happened?

**Update 2023-11-09: Apple have released Ventura 13.6.2 with a claimed fix for this bug. At this point, we believe this is an interim fix to work around the worst case situation affecting single-boot Ventura users (see the last section of this document), and NOT yet a complete fix. Multi-boot and Asahi Linux users are still affected in the same way. We expect a major/complete fix will likely arrive with the Sonoma 14.2 release (currently in beta, not yet fixed in beta 1).**

**Update: We have made changes to the Asahi Installer, to our bootloader m1n1, and to asahi-nvram. At this time, we believe installing or having installed Asahi should not introduce any additional danger over a plain vanilla Sonoma upgrade on a single-boot machine.**

macOS Sonoma and macOS Ventura 13.6 were released with multiple serious bugs in their upgrade and boot process. Combined, these bugs can create conditions where a machine always boots to a black screen, no matter what power button press combination is used. This leaves users stuck, and the only solution is to use DFU recovery.

**This bug can affect users both with and without Asahi Linux installed.**

This situation can happen with certain settings on certain models, when multiple macOS versions are installed side by side (one Sonoma, one earlier). Since Asahi Linux behaves as if it were macOS 12.3/12.4/13.5 (depending on model and installation time), dual-boot installs of macOS Sonoma and Asahi Linux have the same effect. For macOS 13.6, this situation doesn't even require a dual-boot system, and can be triggered stand-alone as the only installed OS.

**We have updated the Asahi Linux installer to automatically perform an integrity check and diagnose your system on startup**. To run it, paste this command into Terminal in macOS:

`curl https://alx.sh | sh`

You can quit the installer once you reach the main menu, without making any changes to your system.

Apple bug reports: FB13319681 and FB13319708 and FB13313702 

## What are the bugs exactly

There are two bugs:

* macOS Sonoma upgrades use the previously installed version as System Recovery. This makes some sense, but does not consider backwards compatibility problems between older RecoveryOS and newer firmware. If this mismatch causes recoveryOS to fail to boot, this will leave System Recovery unusable.

* For 14" and 16" models: Once System Firmware is updated to the macOS Sonoma version, if the display is configured to a refresh rate other than ProMotion, that system will no longer be able to boot into older macOS installs nor Asahi Linux correctly. This includes recovery mode when those systems are set as the default boot OS, **and also System Recovery** at least until the next subsequent OS upgrade. \*

\* Asahi Linux in particular will, somewhat amusingly, still boot to a login screen in this case, but the bootloader output (U-Boot / GRUB) will not be visible. This is because our Linux display driver can fortuitously recover from the misconfigured display scenario, while the macOS driver can't. Nonetheless, you'll still be in trouble, as you won't be able to use the Boot Picker (which is recoveryOS) to switch back to macOS.

## What happens if I get hit by the bug? Will I lose data?

You will need another Mac to recover from the fault using DFU mode. However, you will *not* lose data.

## What machines are affected?

MacBook Pro models with ProMotion displays (14" and 16") are affected by the black screen boot bug.

## What versions are affected?

* ~~macOS Sonoma 14.0+ (not fixed as of 2023-10-31)~~
* ~~macOS Ventura 13.6+ (uses 14.0 firmware)~~
* ~~macOS Monterey 12.7 (unclear, some reports of 13.6 and some of 14.0 firmware, assume it's affected just in case)~~

**IMPORTANT UPDATE**: We have just learned that the standard software update process will always upgrade to the latest firmware version, even when you request a specific macOS version manually. For this reason, **ALL** macOS upgrades performed after the release of macOS Sonoma are affected, regardless of target version. Installing older versions will silently download Sonoma firmware.

## What should I do?

### I have not upgraded to macOS Sonoma (or macOS Ventura 13.6) yet and I want to

We recommend waiting until these issues are fixed by Apple before upgrading. If you want to risk it and you have a 14" or 16" machine, **make sure the display refresh rate is set to ProMotion** before attempting the upgrade. You might still end up with a corrupted System Recovery, which can only be fixed with DFU mode or a subsequent successful upgrade.

Regardless of whether you plan to install Asahi Linux or not, we recommend running the Asahi Linux installer after a Sonoma upgrade to check the status of your System Recovery partition. It will inform you about any issues prior to the main menu, before any changes are made to your system.

**If you just want to install Asahi Linux**: macOS 13.5 is safe to upgrade to. To download an installer for 13.5 specifically, run `softwareupdate --fetch-full-installer --full-installer-version 13.5`. Don't forget to delete the installer once you're done with the upgrade, to save disk space.

### I have not upgraded to macOS Sonoma (or macOS Ventura 13.6) yet and I'm in no rush

Feel free to stay on macOS version 13.5 or earlier for the time being. You can safely install Asahi Linux if you wish.

### I have already upgraded to macOS Sonoma and I want to install Asahi Linux

The Asahi Linux installer has been updated to check the version of your System Recovery, and will inform you of the risks if there is a mismatch. It will also check the ProMotion refresh rate, and refuse to install if it is set to anything other than ProMotion mode. Therefore, it is safe to install at this time.

Start the installation process normally. Follow the prompts carefully and read all the information printed. If your System Recovery version is mismatched, make sure you understand the risks. If your display refresh rate is incorrect, the installer will ask you to change it.

### I have already upgraded to macOS Sonoma and I have Asahi Linux

If you are currently booted into macOS, ensure the display refresh rate is set to ProMotion (for 14" and 16" machines).

We recommend running the Asahi Linux installer again to verify the integrity of your System RecoveryOS partition and ProMotion status. If there is a problem, you should refrain from making any major changes to your system until the issue is fixed by Apple.

### I am affected to the issue, what do I do?

If your machine boots to a black screen (brief Apple logo, then nothing), first attempt a regular recoveryOS boot by fully powering down the machine, then holding down the power button.

If that does not work, try booting into System RecoveryOS. To do this, fully power down the machine, and then perform a fast "tap-and-hold" power button gesture (press and release once, then press and hold).

**Update: If you are stuck in Asahi Linux (the above steps don't work to get to a boot picker to switch to macOS, but your machine otherwise boots normally into Asahi), you should be able to use [asahi-nvram](https://github.com/WhatAmISupposedToPutHere/asahi-nvram) to switch back to Sonoma directly from Linux and resolve the problem.**. If you need help with this process, feel free to ask on [Ask Asahi](https://discussion.fedoraproject.org/c/neighbors/asahi/asahi-help/94).

If that also does not work, unfortunately you will have to resort to DFU mode. See the following section for details.

If you can successfully reach a boot menu, select your macOS Sonoma install and hold down Option while confirming your selection to make it the default boot OS. **If you have macOS 13.6 ventura instead, follow the special section below.**

### How do I fix my machine with DFU mode?

First, you will need another Mac running a recent version of macOS (an Intel Mac is OK). Install Apple Configurator from the App Store on the other Mac and open it.

Follow [Apple's](https://support.apple.com/en-gu/guide/apple-configurator-mac/apdd5f3c75ad/mac) instructions to connect your two machines together, and put your target machine in DFU mode. The target machine's display should remain off at this point.

You should see a large "DFU" icon in Apple Configurator. If you see anything else, the machine is not in the correct mode. Repeat the procedure and try again.

Once you see the DFU icon, right click it and select Advanced → Revive. This will begin the revive process.

If you get a message saying "A system update is required for this device", you can ignore it and press "Restore Anyway". This process has been tested with another Mac running macOS 13.5.

Follow the prompts and accept any accessory connection requests. Do not leave the machine unattended, as you might miss one of those prompts (and there is a timeout). The process will take a few minutes to complete.

Once the Revive process completes, the machine should boot into macOS Recovery. Follow the prompts and authenticate yourself.

After this, the machine will reboot into the Boot Picker.

**If you have macOS 13.6 ventura instead, follow the special section below.**

Select your macOS Sonoma install, then go into the Display settings page and set the display refresh rate to ProMotion. This will prevent the problem from reoccurring.

Should you wind up with a "black screen boot" again after this point, follow the steps in the previous section to perform the "tap-and-hold" power gesture. This should now work properly, as your System RecoveryOS has been updated. You may then select macOS again and fix the display refresh rate.

### I don't have another Mac to use DFU mode! What do I do?

You can take your Mac to the Apple Store and ask them to do a **DFU Revive**. Make sure they do **not** do a Restore, which would wipe all your data. They should perform this service for free. Do not let them charge you any money for it. This is a problem Apple caused, and purely a software issue. If the technicians claim there is hardware damage, they are wrong.

### What if I have macOS 13.6 Ventura and not Sonoma?

macOS 13.6 Ventura uses the macOS Sonoma System Firmware, but suffers from the problem. Even users with just 13.6 installed single-boot are affected by this issue (no Asahi Linux needed). We do not understand how Apple managed to release an OS update that, when upgraded to normally, leaves machines unbootable if their display refresh rate is not the default. This seems to have been a major QA oversight by Apple.

If your system has 13.6 Ventura and ended up in the black boot situation, unfortunately the only known solution is to upgrade to Sonoma. From the Boot Picker, select Options. This will boot into recoveryOS. From there, select "Install macOS Sonoma". Follow the prompts and select your existing macOS volume. This will upgrade macOS without losing your data.
