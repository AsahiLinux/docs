# Partitioning

The raw disk contains a GPT partition table with a standard protective MBR. It looks like this by default (gdisk output):

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

These correspond to /dev/disk0s1, /dev/disk0s2, /dev/disk0s3 on macOS.

Each of the 3 partitions is an APFS container, containing several subvolumes. The type GUIDs are as follows:

* 69646961-6700-11AA-AA11-00306543ECAC: iBoot System Container (ASCII reads: "idiag")
* 7C3457EF-0000-11AA-AA11-00306543ECAC: macOS (standard type for Apple APFS)
* 52637672-7900-11AA-AA11-00306543ECAC: Recovery OS (ASCII reads: "Rcvry")

Note that most the unique (not type) GUIDs shown on this page will be unique for each user.

## disk0s1 / disk1: iBoot System Container

This is the first partition on a standard layout. It is hidden from `diskutil` by default, output below is from a dumped image.

```
# diskutil apfs list /dev/disk5
|
+-- Container disk5 E0718E49-1903-4793-B427-FCFEC4A3E72C
    ====================================================
    APFS Container Reference:     disk5
    Size (Capacity Ceiling):      524288000 B (524.3 MB)
    Capacity In Use By Volumes:   18010112 B (18.0 MB) (3.4% used)
    Capacity Not Allocated:       506277888 B (506.3 MB) (96.6% free)
    |
    +-< Physical Store disk4 (No UUID)
    |   ------------------------------
    |   APFS Physical Store Disk:   disk4
    |   Size:                       524288000 B (524.3 MB)
    |
    +-> Volume disk5s1 B33E8594-382A-41EA-A9FE-6D2362B31141
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk5s1 (Preboot)
    |   Name:                      iSCPreboot (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6213632 B (6.2 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s2 CA25E52A-3425-4232-926F-F840D359A9E2
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk5s2 (xART)
    |   Name:                      xART (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         6311936 B (6.3 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s3 0566ABD3-9EA7-46CA-90C7-CDF4DD0E94B4
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk5s3 (Hardware)
    |   Name:                      Hardware (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         507904 B (507.9 KB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk5s4 F4E0743D-D91F-410B-9569-4196540E4B8D
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk5s4 (Recovery)
        Name:                      Recovery (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```

## disk0s2 / disk3: macOS Container

This is the main macOS container.

(note: this output is after the root volume seal has been broken)

```
# diskutil apfs list /dev/disk3
|
+-- Container disk3 A0E91EC4-5D59-4623-8322-4BB474324AED
    ====================================================
    APFS Container Reference:     disk3
    Size (Capacity Ceiling):      245107195904 B (245.1 GB)
    Capacity In Use By Volumes:   61710045184 B (61.7 GB) (25.2% used)
    Capacity Not Allocated:       183397150720 B (183.4 GB) (74.8% free)
    |
    +-< Physical Store disk0s2 44F20DE4-F8AA-4B15-8BBD-52F20825C8E5
    |   -----------------------------------------------------------
    |   APFS Physical Store Disk:   disk0s2
    |   Size:                       245107195904 B (245.1 GB)
    |
    +-> Volume disk3s1 3DDFF71C-4AD1-4799-B517-F07E8C227216
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s1 (System)
    |   Name:                      Macintosh HD (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         15060824064 B (15.1 GB)
    |   Sealed:                    Broken
    |   FileVault:                 No (Encrypted at rest)
    |   |
    |   Snapshot:                  A520D18F-CE87-4F7F-AB27-8B5EA480ADB8
    |   Snapshot Disk:             disk3s1s1
    |   Snapshot Mount Point:      /
    |   Snapshot Sealed:           Yes
    |
    +-> Volume disk3s2 B2DDCD18-9069-4AB9-967B-E10A4D847700
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s2 (Preboot)
    |   Name:                      Preboot (Case-insensitive)
    |   Mount Point:               /System/Volumes/Preboot
    |   Capacity Consumed:         289689600 B (289.7 MB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s3 A4264E85-A4B2-4814-BC33-13A68CF497CA
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s3 (Recovery)
    |   Name:                      Recovery (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         1022201856 B (1.0 GB)
    |   Sealed:                    No
    |   FileVault:                 No
    |
    +-> Volume disk3s5 613CA2B7-4530-4631-BFAF-C0D3697B4905
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s5 (Data)
    |   Name:                      Data (Case-insensitive)
    |   Mount Point:               /System/Volumes/Data
    |   Capacity Consumed:         45197803520 B (45.2 GB)
    |   Sealed:                    No
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s6 FDA461B8-DDD6-4B75-9D25-AE5C7C6115CE
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk3s6 (VM)
        Name:                      VM (Case-insensitive)
        Mount Point:               /System/Volumes/VM
        Capacity Consumed:         20480 B (20.5 KB)
        Sealed:                    No
        FileVault:                 No
```

### Macintosh HD

This is the main APFS volume containing the OS image. It uses snapshots to allow for atomic updates and sealing (analogous to dm-verity) to guarantee OS integrity. This can be disabled, but currently it is not possible to mount the root filesystem as read-write. Modifications can be made by mounting the main partition, making changes, creating a new snapshot and blessing it.

The snapshot is normally /dev/disk3s1s1, and this is mounted read-only on /. The name looks like `com.apple.os.update-<long string of hex>`.

## disk0s3: Recovery OS

This is the main recovery volume containing 1TF.

```
# diskutil apfs list /dev/disk5
|
+-- Container disk5 160EFEBB-B539-42EE-800D-2FE4723FB25F
    ====================================================
    APFS Container Reference:     disk5
    Size (Capacity Ceiling):      5368664064 B (5.4 GB)
    Capacity In Use By Volumes:   1919692800 B (1.9 GB) (35.8% used)
    Capacity Not Allocated:       3448971264 B (3.4 GB) (64.2% free)
    |
    +-< Physical Store disk4 (No UUID)
    |   ------------------------------
    |   APFS Physical Store Disk:   disk4
    |   Size:                       5368664064 B (5.4 GB)
    |
    +-> Volume disk5s1 DDD6CA1C-2FAC-4990-B20E-89F5323DAABB
        ---------------------------------------------------
        APFS Volume Disk (Role):   disk5s1 (Recovery)
        Name:                      Recovery (Case-insensitive)
        Mount Point:               Not Mounted
        Capacity Consumed:         1899917312 B (1.9 GB)
        Sealed:                    No
        FileVault:                 No
```