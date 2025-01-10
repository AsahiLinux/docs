# This is for default vanilla Asahi installs. These steps do not apply for custom partitioning setups.
## Do not use Diskutil (terminal or GUI version)

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
  
2. Delete the "Asahi APFS container"
```
diskutil apfs deleteContainer disk<num-here>
```
3. Delete the EFI and Linux Filesystem partitions
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