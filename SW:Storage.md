# Partitioning

The raw disk contains a GPT partition table with a standard protective MBR. It looks like this by default (gdisk output):

```
Disk /dev/disk0: 61279344 sectors, 233.8 GiB
Sector size (logical): 4096 bytes
Disk identifier (GUID): E0B3A4FD-EA74-4166-8F97-5B745BF6C44E
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 5
First usable sector is 6, last usable sector is 61279338
Partitions will be aligned on 2-sector boundaries
Total free space is 312 sectors (1.2 MiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1               6          128005   500.0 MiB   FFFF  iBootSystemContainer
   2          128006        59968511   228.2 GiB   AF0A  Container  
   3        59968630        61279338   5.0 GiB     FFFF  RecoveryOSContainer
```

These correspond to /dev/disk0s1, /dev/disk0s2, /dev/disk0s3 on macOS.

Each of the 3 partitions is an APFS container, containing several subvolumes. The type GUIDs are as follows:

* 69646961-6700-11AA-AA11-00306543ECAC: iBoot System Container (ASCII reads: "idiag")
* 7C3457EF-0000-11AA-AA11-00306543ECAC: macOS (standard type for Apple APFS)
* 52637672-7900-11AA-AA11-00306543ECAC: Recovery OS (ASCII reads: "Rcvry")

Note that most the unique (not type) GUIDs shown on this page will be unique for each user.

## disk0s1: iBoot System Container

This is the first partition on a standard layout.



## disk0s2 / disk3: macOS Container

This is the main macOS container.

(note: this output is after a resize, on a 256GB SSD Mac Mini the capacity will be about double; the root volume seal has also been broken)

```
# diskutil apfs list /dev/disk3
+-- Container disk3 CEF76C65-8EAE-4346-A09E-AB98301B36AA
    ====================================================
    APFS Container Reference:     disk3
    Size (Capacity Ceiling):      122553597952 B (122.6 GB)
    Capacity In Use By Volumes:   32258478080 B (32.3 GB) (26.3% used)
    Capacity Not Allocated:       90295119872 B (90.3 GB) (73.7% free)
    |
    +-< Physical Store disk0s2 BDB006E1-54AA-43CD-B7FE-FF021547D51E
    |   -----------------------------------------------------------
    |   APFS Physical Store Disk:   disk0s2
    |   Size:                       122553597952 B (122.6 GB)
    |
    +-> Volume disk3s1 424FEA98-2296-48FD-8DFF-0866835572E9
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s1 (System)
    |   Name:                      Macintosh HD (Case-insensitive)
    |   Mount Point:               Not Mounted
    |   Capacity Consumed:         15053312000 B (15.1 GB)
    |   Sealed:                    Broken
    |   FileVault:                 No (Encrypted at rest)
    |   |
    |   Snapshot:                  998F9CE3-466E-4785-A7B8-08E6FF0E3CCF
    |   Snapshot Disk:             disk3s1s1
    |   Snapshot Mount Point:      /
    |   Snapshot Sealed:           Yes
    |
    +-> Volume disk3s2 B065CC7B-CC03-44F1-8A58-CD9AB099D57C
    |   ---------------------------------------------------
    |   APFS Volume Disk (Role):   disk3s2 (Preboot)
    |   Name:                      Preboot (Case-insensitive)
    |   Mount Point:               /System/Volumes/Preboot
    |   Capacity Consumed:         361046016 B (361.0 MB)
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
    |   Mount Point:               /System/Volumes/Data
    |   Capacity Consumed:         15776518144 B (15.8 GB)
    |   Sealed:                    No
    |   FileVault:                 No (Encrypted at rest)
    |
    +-> Volume disk3s6 D2247B63-54E9-411F-94C0-FF3FAB2A17A0
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

## Recovery OS