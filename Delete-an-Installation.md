# This is for default vanilla Asahi installs. These steps do not apply for custom partitioning setups.
## Do not use Diskutil GUI

1. Find the 3 partitions that Asahi installer creates.  
Run the installer script and exit after you get to the disk information.  
```
curl https://alx.sh | sh
```
Example disk information:
```
Partitions in system disk (disk0):
  1: APFS [Macintosh HD] (380.00 GB, 6 volumes)
    OS: [B ] [Macintosh HD] macOS v12.3 [disk3s1, D44D4ED9-B162-4542-BF50-9470C7AFDA43]
  2: APFS [Asahi Linux] (2.50 GB, 4 volumes)
    OS: [ *] [Asahi Linux] incomplete install (macOS 12.3 stub) [disk4s2, 53F853CF-4851-4E82-933C-2AAEB247B372]
  3: EFI (500.17 MB)
  4: Linux Filesystem (54.19 GB)
  5: (free space: 57.19 GB)
  6: APFS (System Recovery) (5.37 GB, 2 volumes)
    OS: [  ] recoveryOS v12.3 [Primary recoveryOS]

  [B ] = Booted OS, [R ] = Booted recovery, [? ] = Unknown
  [ *] = Default boot volume
```
The partitions that Asahi installs are `Asahi Linux`, `EFI`, and `Linux Filesystem`.  
Note down the `disk#s#` beside Asahi Linux line.  
  
2. Delete the "Asahi APFS container"
```
diskutil apfs deleteContainer disk<num-here>
```

3. Find the partition numbers of EFI and Linux Filesystem partitions.  
```
diskutil list
```
Example output:
```
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:             Apple_APFS_ISC Container disk1         524.3 MB   disk0s1
   2:                 Apple_APFS Container disk4         362.6 GB   disk0s2
                    (free space)                         2.5 GB     -
   3:                        EFI EFI - FEDOR             524.3 MB   disk0s4
   4:           Linux Filesystem                         1.1 GB     disk0s5
   5:           Linux Filesystem                         127.7 GB   disk0s6
   6:        Apple_APFS_Recovery Container disk3         5.4 GB     disk0s7

/dev/disk4 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +362.6 GB   disk4
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            11.2 GB    disk4s1
   2:              APFS Snapshot com.apple.os.update-... 11.2 GB    disk4s1s1
   3:                APFS Volume Preboot                 6.9 GB     disk4s2
   4:                APFS Volume Recovery                1.0 GB     disk4s3
   5:                APFS Volume Data                    287.6 GB   disk4s5
   6:                APFS Volume VM                      20.5 KB    disk4s6
```

4. Delete the EFI and Linux Filesystem partitions
```
diskutil eraseVolume free free disk<num-here>s<num-here>
diskutil eraseVolume free free disk<num-here>s<-other-num-here>
```

## Resize MacOS to fill disk again
Note: use the disk number corresponding to the MacOS partition (from the disk information in the Asahi installer script output).  
```
diskutil apfs resizeContainer disk<num-here> 0
```

### Errors? Need More Background Information?
[Partitioning cheatsheet](https://github.com/AsahiLinux/docs/wiki/Partitioning-cheatsheet)