# Summary

* **disk0**: main SSD
  * **disk0s1 = disk1**: "iBootSystemContainer" - system-wide boot data
    * **disk1s1**: "iSCPreboot" - boot policies, system firmware (NOR) version metadata, SEP firmware (sometimes), AP tickets
    * **disk1s2**: "xARTS" - SEP trusted storage
    * **disk1s3**: "Hardware" - logs, factory data cache, activation-related files
    * **disk1s4**: "Recovery" - empty
  * **disk0s2 = disk3**: "Container" - macOS install
    * **disk3s1**: "System" - OS (root filesystem, sealed)
    * **disk3s2**: "Preboot" - iBoot2 (OS loader), iBoot-loaded firmwares, Darwin kernelcache, firmwares, devicetree, other preboot stuff
    * **disk3s3**: "Recovery" - OS-associated recovery (not 1TR): iBoot2, firmwwares, Darwin kernelcache, ramdisk image
    * **disk3s4**: "Update" - macOS update temp storage and logs
    * **disk3s5**: "Data" - user data (root filesystem, merged). This volume's UUID defines the identity of the OS install.
    * **disk3s6**: "VM" - swap partition (when needed)
  * **disk0s3 = disk2**: "RecoveryOSContainer" - 1TR (One True Recovery)
    * **disk2s1**: "Recovery" - one or more sets of {iBoot2 (OS loader), Darwin kernelcache, firmwares, devicetree, other preboot stuff}
    * **disk2s2**: "Update" - system firmware update temp storage and logs

# Partitioning
<details>
  <summary>gdisk dump</summary>

```
Disk /dev/disk0: 61279344 sectors, 233.8 GiB
Sector size (logical): 4096 bytes
Disk identifier (GUID): 284E6CE4-CABA-4B49-8106-CE39AB7B5CD9
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 5
First usable sector is 6, last usable sector is 61279338
Partitions will be aligned on 2-sector boundaries
Total free space is 0 sectors (0 bytes)

Number  Start (sector)    End (sector)  Size       Code  Name
   1               6          128005   500.0 MiB   FFFF  iBootSystemContainer
   2          128006        59968629   228.3 GiB   AF0A  Container
   3        59968630        61279338   5.0 GiB     FFFF  RecoveryOSContainer
```
</details>

The raw disk contains a GPT partition table with a standard protective MBR and three partitions. These correspond to /dev/disk0s1, /dev/disk0s2, /dev/disk0s3 on macOS.

Each of the 3 partitions is an APFS container, containing several subvolumes. The type GUIDs are as follows:

* 69646961-6700-11AA-AA11-00306543ECAC: iBoot System Container (ASCII: "idiag", diskutil: `Apple_APFS_ISC`)
* 7C3457EF-0000-11AA-AA11-00306543ECAC: APFS (diskutil: `Apple_APFS`)
* 52637672-7900-11AA-AA11-00306543ECAC: Recovery OS (ASCII reads: "Rcvry", diskutil: `Apple_APFS_Recovery`)

Note that most the unique (not type) GUIDs shown on this page will be unique for each user.

## disk0s1 / disk1: iBoot System Container
<details>
  <summary>diskutil info</summary>

```
# diskutil apfs list /dev/disk1
|
+-- Container disk5 E0718E49-1903-4793-B427-FCFEC4A3E72C
    ====================================================
    APFS Container Reference:     disk1
    Size (Capacity Ceiling):      524288000 B (524.3 MB)
    Capacity In Use By Volumes:   18010112 B (18.0 MB) (3.4% used)
    Capacity Not Allocated:       506277888 B (506.3 MB) (96.6% free)
    |
    +-< Physical Store disk1 (No UUID)
    |   ------------------------------
    |   APFS Physical Store Disk:   disk0s1
    |   Size:                       524288000 B (524.3 MB)
    |
    +-> Volume disk5s1 B33E8594-382A-41EA-A9FE-6D2362B31141
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s1 (Preboot)
    |   Name:                      iSCPreboot (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6213632 B (6.2 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s2 CA25E52A-3425-4232-926F-F840D359A9E2
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s2 (xART)
    |   Name:                      xART (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6311936 B (6.3 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s3 0566ABD3-9EA7-46CA-90C7-CDF4DD0E94B4
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk1s3 (Hardware)
    |   Name:                      Hardware (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         507904 B (507.9 KB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s4 F4E0743D-D91F-410B-9569-4196540E4B8D
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk1s4 (Recovery)
        Name:                      Recovery (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```
</details>

This is the first partition on a standard layout. It is hidden from `diskutil` by default, output below is from a dumped image.

### disk1s1 (Preboot)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s1
   Device Identifier:         disk1s1
   Device Node:               /dev/disk1s1
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               iSCPreboot
   Mounted:                   Yes
   Mount Point:               /System/Volumes/iSCPreboot

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               19D7B85B-D5EC-41E9-8441-EEAE52D964F1
   Disk / Partition UUID:     19D7B85B-D5EC-41E9-8441-EEAE52D964F1

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Mountpoint: `/System/Volumes/iSCPreboot`

This contains files used directly by the system firmware iBoot.

Files:

* /(uuid)/ - one each for OS installation, and each version of 1TR
    * LocalPolicy/ - Boot policies
        * (long hash).img4 - Local boot policy for an OS install
        * (long hash).recovery.img4 - Local boot policy for a 1TR
* SFR/current/ - info for the current version of SFR
    * apticket.der - AP ticket (?)
    * RestoreVersion.plist
    * SystemVersion.plist
    * sep-firmware.img4 - SEP firmware, not always present
* SFR/fallback/ - info for the previous version of SFR (same structure as above)

When an OS from external media is booted via 1TR, its boot files (everything under <Preboot>/(uuid)/boot) are copied from the Preboot volume to this partition under the same path. This is how Apple Silicon macs can "boot" from external media, even though iBoot itself cannot.

### disk1s2 (xART)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s2
   Device Identifier:         disk1s2
   Device Node:               /dev/disk1s2
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               xART
   Mounted:                   Yes
   Mount Point:               /System/Volumes/xarts

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               E9FD7E0B-391D-42DD-997A-15B5FE0CE73C
   Disk / Partition UUID:     E9FD7E0B-391D-42DD-997A-15B5FE0CE73C

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Mountpoint: `/System/Volumes/xarts`

This contains a single file (uuid).gl - SEP storage. `xartutil` can be used to manage this.

### disk1s3 (Hardware)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s3
   Device Identifier:         disk1s3
   Device Node:               /dev/disk1s3
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               Hardware
   Mounted:                   Yes
   Mount Point:               /System/Volumes/Hardware

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               6ED3C985-5971-4874-ABCA-841BB76CC6E5
   Disk / Partition UUID:     6ED3C985-5971-4874-ABCA-841BB76CC6E5

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Mountpoint: `/System/Volumes/Hardware`

Hardware related information and logs

* /recoverylogd/ - recovery logs
* FactoryData/ - AP ticket, device personalization information
* srvo/ - sensor related stuff?
* MobileActivation/ - activation related data

### disk1s4 (Recovery)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk1s4
   Device Identifier:         disk1s4
   Device Node:               /dev/disk1s4
   Whole:                     No
   Part of Whole:             disk1

   Volume Name:               Recovery
   Mounted:                   No

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Disabled

   OS Can Be Installed:       No
   Booter Disk:               disk1s1
   Recovery Disk:             disk1s4
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               6A900409-C5A5-47CC-84AA-F0FE24E0D629
   Disk / Partition UUID:     6A900409-C5A5-47CC-84AA-F0FE24E0D629

   Disk Size:                 524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     524.3 MB (524288000 Bytes) (exactly 1024000 512-Byte-Units)
   Container Free Space:      506.3 MB (506347520 Bytes) (exactly 988960 512-Byte-Units)

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          Not applicable (not mounted)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk1
   APFS Physical Store:       disk0s1
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Empty.

## disk0s2 / disk3: macOS Container

(note: this output is after the root volume seal has been broken)

<details>
  <summary>diskutil apfs list</summary>

```
# diskutil apfs list /dev/disk3
|
+-- Container disk3 CEF76C65-8EAE-4346-A09E-AB98301B36AA
    ====================================================
    APFS Container Reference:     disk3
    Size (Capacity Ceiling):      245107195904 B (245.1 GB)
    Capacity In Use By Volumes:   61710045184 B (61.7 GB) (25.2% used)
    Capacity Not Allocated:       183397150720 B (183.4 GB) (74.8% free)
    |
    +-< Physical Store disk0s2 BDB006E1-54AA-43CD-B7FE-FF021547D51E
    |   -----------------------------------------------------------
    |   APFS Physical Store Disk:   disk0s2
    |   Size:                       245107195904 B (245.1 GB)
    |
    +-> Volume disk3s1 424FEA98-2296-48FD-8DFF-0866835572E9
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s1 (System)
    |   Name:                      Macintosh HD (Case-insensitive)
    |   Mount Point:               /Volumes/Macintosh HD
    |   Capacity Consumed:         15053312000 B (15.1 GB)
    |   Sealed:                    Broken
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s2 B065CC7B-CC03-44F1-8A58-CD9AB099D57C
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s2 (Preboot)
    |   Name:                      Preboot (Case-insensitive)
    |   Mount Point:               /Volumes/Preboot
    |   Capacity Consumed:         361050112 B (361.1 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s3 FDC764F5-0EF0-44F4-AA34-D011195207CA
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s3 (Recovery)
    |   Name:                      Recovery (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         939421696 B (939.4 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s5 DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s5 (Data)
    |   Name:                      Data (Case-insensitive)
    |   Mount Point:               /Volumes/Data
    |   Capacity Consumed:         15799300096 B (15.8 GB)
    |   Sealed:                    No
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s6 D2247B63-54E9-411F-94C0-FF3FAB2A17A0
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk3s6 (VM)
        Name:                      VM (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```
</details>

This is the main macOS container for an OS install. 

There is a hidden *Update* volume (disk3s4)

### disk3s1 (Macintosh HD)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk3s1
   Device Identifier:         disk3s1
   Device Node:               /dev/disk3s1
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               Macintosh HD
   Mounted:                   Yes
   Mount Point:               /Volumes/Macintosh HD

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               424FEA98-2296-48FD-8DFF-0866835572E9
   Disk / Partition UUID:     424FEA98-2296-48FD-8DFF-0866835572E9

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          Yes (read-only mount flag set)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   APFS Volume Group:         DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
   EFI Driver In macOS:       1677080005000000
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    Broken
   Locked:                    No
```
</details>



This is the main APFS volume containing the OS root. It uses snapshots to allow for atomic updates and sealing (analogous to dm-verity) to guarantee OS integrity. This can be disabled, but currently it is not possible to mount the root filesystem as read-write. Modifications can be made by mounting the main partition, making changes, creating a new snapshot and blessing it.

The snapshot is normally /dev/disk3s1s1, and this is mounted read-only on /. The name looks like `com.apple.os.update-<long string of hex>`.

This is part of an APFS volume group with the Data volume. At runtime, they are merged together.

<details>
  <summary>apfs listVolumeGroups</summary>

```
+-- Container disk3 CEF76C65-8EAE-4346-A09E-AB98301B36AA
|   |
|   +-> Volume Group DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
|       =================================================
|       APFS Volume Disk (Role):   disk3s1 (System)
|       Name:                      Macintosh HD
|       Volume UUID:               424FEA98-2296-48FD-8DFF-0866835572E9
|       Capacity Consumed:         15053312000 B (15.1 GB)
|       -------------------------------------------------
|       APFS Volume Disk (Role):   disk3s5 (Data)
|       Name:                      Data
|       Volume UUID:               DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
|       Capacity Consumed:         15799300096 B (15.8 GB)
````
</details>

### disk3s2 (Preboot)

<details>
  <summary>diskutil info</summary>
  
```
# diskutil info /dev/disk3s2
   Device Identifier:         disk3s2
   Device Node:               /dev/disk3s2
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               Preboot
   Mounted:                   Yes
   Mount Point:               /Volumes/Preboot

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               B065CC7B-CC03-44F1-8A58-CD9AB099D57C
   Disk / Partition UUID:     B065CC7B-CC03-44F1-8A58-CD9AB099D57C

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No

```
</details>

Mountpoint: /System/Volumes/Preboot

This partition contains boot-related data, including the kernel. The only directory at the root is named after the APFS `Data` volume UUID / volume group UUID.

Files look like:

* /(Data UUID)/
    * usr/standalone/i386/EfiLoginUI/ - "EFI" (?) resources for the pre-boot UI
    * PreLoginData/ - uuidtext (translations?) and logs and other junk
    * boot/
        * active - file containing the long hash below
        * (long hash)/
            * usr/standalone/firmware
                * iBoot.img4 - iBoot2 (OS loader)
                * base_system_root_hash.img4, root_hash.img4 - related to sealing
                * FUD/ - firmwares loaded by iBoot
                * devicetree.img4 - devicetree
            * System/Library/Caches/com.apple.kernelcaches/
                * kernelcache - Darwin kernelcache
    * var/db/ - user list and authentication related information, for preboot UI
    * Library/Preferences/ - network interface info, other misc preferences for preboot UI
    * System/Library/
        * CoreServices/
            * boot.efi - this would be the booter on EFI macs. A whole 0 bytes here.
        * Caches/com.apple.corestorage/ - FileVault stuff?
    * restore/ - system firmware update bundle?

### disk3s3 (Recovery)

<details>
  <summary>diskutil info</summary>
  
```
# diskutil info /dev/disk3s3
   Device Identifier:         disk3s3
   Device Node:               /dev/disk3s3
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               Recovery
   Mounted:                   No

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Disabled

   OS Can Be Installed:       No
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               FDC764F5-0EF0-44F4-AA34-D011195207CA
   Disk / Partition UUID:     FDC764F5-0EF0-44F4-AA34-D011195207CA

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          Not applicable (not mounted)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

OS recovery partition. Roughly the same layout/contents as 1TR below.


### disk3s4 (Update)

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk3s4
   Device Identifier:         disk3s4
   Device Node:               /dev/disk3s4
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               Update
   Mounted:                   Yes
   Mount Point:               /System/Volumes/Data/private/tmp/tmp-mount-spRxyx

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               C983230F-1974-4283-A0A8-E1F892C7C835
   Disk / Partition UUID:     C983230F-1974-4283-A0A8-E1F892C7C835

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No

```
</details>

This contains temporary files for the OS updater, and logs.


### disk3s5 (Data)

<details>
  <summary>diskutil info</summary>
  
```
# diskutil info /dev/disk3s5
   Device Identifier:         disk3s5
   Device Node:               /dev/disk3s5
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               Data
   Mounted:                   Yes
   Mount Point:               /Volumes/Data

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       Yes
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
   Disk / Partition UUID:     DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   APFS Volume Group:         DCBCA6BD-BFF1-4F8F-AE1A-6E937D2D4BDC
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Mountpoint: /System/Volumes/Data

The main user data partition, which is overlaid on top of the OS root with firmlinks.


### disk3s6 (VM)

<details>
  <summary>diskutil info</summary>
  
```
# diskutil info /dev/disk3s6
   Device Identifier:         disk3s6
   Device Node:               /dev/disk3s6
   Whole:                     No
   Part of Whole:             disk3

   Volume Name:               VM
   Mounted:                   No

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Disabled

   OS Can Be Installed:       No
   Booter Disk:               disk3s2
   Recovery Disk:             disk3s3
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               D2247B63-54E9-411F-94C0-FF3FAB2A17A0
   Disk / Partition UUID:     D2247B63-54E9-411F-94C0-FF3FAB2A17A0

   Disk Size:                 245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     245.1 GB (245107195904 Bytes) (exactly 478724992 512-Byte-Units)
   Container Free Space:      183.4 GB (183397150720 Bytes) (exactly 358197560 512-Byte-Units)

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          Not applicable (not mounted)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk3
   APFS Physical Store:       disk0s2
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

Swap partition. Seems to be empty if not necessary.

## disk0s3: Recovery OS

<details>
  <summary>diskutil apfs list</summary>

```
# diskutil apfs list /dev/disk2
|
+-- Container disk5 160EFEBB-B539-42EE-800D-2FE4723FB25F
    ====================================================
    APFS Container Reference:     disk5
    Size (Capacity Ceiling):      5368664064 B (5.4 GB)
    Capacity In Use By Volumes:   1919692800 B (1.9 GB) (35.8% used)
    Capacity Not Allocated:       3448971264 B (3.4 GB) (64.2% free)
    |
    +-< Physical Store disk2 (No UUID)
    |   ------------------------------
    |   APFS Physical Store Disk:   disk0s3
    |   Size:                       5368664064 B (5.4 GB)
    |
    +-> Volume disk2s1 DDD6CA1C-2FAC-4990-B20E-89F5323DAABB
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk2s1 (Recovery)
        Name:                      Recovery (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         1899917312 B (1.9 GB)
        Sealed:                    No
        FileVault:                 No
```
</details>

This is the main One True Recovery partition, containing one or more versions of 1TR.

There is a hidden *Update* volume (disk2s2).

## disk2s1: Recovery

<details>
  <summary>diskutil info</summary>

```
# diskutil info /dev/disk2s1
   Device Identifier:         disk2s1
   Device Node:               /dev/disk2s1
   Whole:                     No
   Part of Whole:             disk2

   Volume Name:               Recovery
   Mounted:                   Yes
   Mount Point:               /System/Volumes/Data/private/tmp/SystemRecovery

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Recovery Disk:             disk2s1
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               67B148BE-39ED-493A-99AE-1C1D28247C54
   Disk / Partition UUID:     67B148BE-39ED-493A-99AE-1C1D28247C54

   Disk Size:                 5.4 GB (5368664064 Bytes) (exactly 10485672 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     5.4 GB (5368664064 Bytes) (exactly 10485672 512-Byte-Units)
   Container Free Space:      2.5 GB (2500202496 Bytes) (exactly 4883208 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          Yes (read-only mount flag set)

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk2
   APFS Physical Store:       disk0s4
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

This contains one or more versions of One True Recovery.

Files look like:

* /(unknown UUID)/boot/(long hash)/
    * usr/standalone/firmware
        * arm64eBaseSystem.dmg - rootfs ramdisk image (GPT disk image with a single APFS container with a single volume)
        * iBoot.img4 - iBoot2 (OS loader)
        * base_system_root_hash.img4, root_hash.img4 - related to sealing
        * sep-firmware.img4 - SEP firmware
        * FUD/ - firmwares loaded by iBoot
        * devicetree.img4 - devicetree
    * System/Library/Caches/com.apple.kernelcaches/
        * kernelcache - Darwin kernelcache

When 1TR is loaded, this partition apparently gets copied wholesale to a tmpfs, and then the arm64eBaseSystem.dmg is attached
        
## disk2s2: Update

<details>
  <summary>diskutil info</summary>

```
   Device Identifier:         disk2s2
   Device Node:               /dev/disk2s2
   Whole:                     No
   Part of Whole:             disk2

   Volume Name:               Update
   Mounted:                   Yes
   Mount Point:               /Volumes/Update

   Partition Type:            41504653-0000-11AA-AA11-00306543ECAC
   File System Personality:   APFS
   Type (Bundle):             apfs
   Name (User Visible):       APFS
   Owners:                    Enabled

   OS Can Be Installed:       No
   Recovery Disk:             disk2s1
   Media Type:                Generic
   Protocol:                  Apple Fabric
   SMART Status:              Verified
   Volume UUID:               812D7035-B392-4B1C-AC3E-131A4DFA2726
   Disk / Partition UUID:     812D7035-B392-4B1C-AC3E-131A4DFA2726

   Disk Size:                 5.4 GB (5368664064 Bytes) (exactly 10485672 512-Byte-Units)
   Device Block Size:         4096 Bytes

   Container Total Space:     5.4 GB (5368664064 Bytes) (exactly 10485672 512-Byte-Units)
   Container Free Space:      2.5 GB (2500202496 Bytes) (exactly 4883208 512-Byte-Units)
   Allocation Block Size:     4096 Bytes

   Media OS Use Only:         Yes
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           Internal
   Removable Media:           Fixed

   Solid State:               Yes
   Hardware AES Support:      Yes

   This disk is an APFS Volume.  APFS Information:
   APFS Container:            disk2
   APFS Physical Store:       disk0s4
   Fusion Drive:              No
   Encrypted:                 No
   FileVault:                 No
   Sealed:                    No
   Locked:                    No
```
</details>

This contains temporary system firmware update data and logs.
