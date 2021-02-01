Tips for getting started putting macOS and your Mac into a state useful for research.

## Disabling (most) security

Hold down the power button to enter 1TR.

Open the Terminal and run:

```
# bputil -n -k -c -a -s
# csrutil disable
# csrutil authenticated-root disable
```

Note: `bputil` will *re-enable* some SIP features, so you need to run `csrutil` *after* you run `bputil`.

To check the current status run:

```
# bputil -d
# csrutil status
# csrutil authenticated-root status
```

You can also see the current status in the System Information app in Hardware->Controller.

## boot-args

If you break the system with boot-args, you cannot edit them from recovery mode, but you can clear them (`nvram boot-args=`).

```
debug=0x14e
amfi_get_out_of_my_way=1
serial=3
```
# Creating bootable Volume
* With Apple silicon hardware Macs the security relaxations can be limited to particular bootable Volumes
* Hopefully Asahi linux can be in bootable in a seperate Volume
* Create new Linux APFS Volume on synthesised disk (here it is disk3) use `diskutil list` to see Volumes 
```
sudo diskutil apfs addVolume /dev/disk3 apfs Linux
diskutil list
....
/dev/disk3 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +994.7 GB   disk3
                                 Physical Store disk0s2
   1:                APFS Volume ⁨Macintosh HD⁩            15.0 GB    disk3s1
   2:              APFS Snapshot ⁨com.apple.os.update-...⁩ 15.0 GB    disk3s1s1
   3:                APFS Volume ⁨Preboot⁩                 338.0 MB   disk3s2
   4:                APFS Volume ⁨Recovery⁩                1.1 GB     disk3s3
   5:                APFS Volume ⁨Data⁩                    111.0 GB   disk3s5
   6:                APFS Volume ⁨VM⁩                      20.5 KB    disk3s6
   7:                APFS Volume ⁨Linux⁩                   1.0 MB     disk3s7

....
```
 * Boot to Recovery mode to re-install MacOS into it as per [https://support.apple.com/en-us/HT204904](https://support.apple.com/en-us/HT204904)
 * Note: It took 1.5 hours to re-install MacOS to the new partition not including syncing data from an old account.
 * By default it boots the last Volume it booted from so I had to go through recovery and manually select the primary boot Volume again. The nvram command or some settings can probably do this more easily
* Now we just have to establish how to install a blessed M1 linux kernel and filesystem ...