---
title: macOS Kernelcache
---

# READ THIS BEFORE PROCEEDING FURTHER

**Asahi Linux has a very strict [reverse engineering policy](https://asahilinux.org/copyright/). Do not start disassembling macOS code, including the Darwin kernel, unless you have fully read and understood the policy.**

We expect any contributors who wish to use binary reverse engineering as part of their contribution to their project to discuss the specifics with us in advance. This will usually mean arranging a clean-room environment, where their only job will be to write specifications, not any source code, on any related subsystems.

You may be banned from ever contributing code directly to our project if you do not do this. You have been warned.

**Distributing macOS binaries, in whole or in part, is a copyright violation.** Do not upload or share any such files. You have to extract the files from your own installation of macOS, on an Apple computer.

Again, **only proceed if you have talked to us first about this**.

## Extracting the Darwin kernelcache

* Find your kernelcache in the Preboot partition of your OS install
* Grab [img4tool](https://github.com/tihmstar/img4tool)
* `img4tool -a kernelcache -e -p kernelcache.im4p -m kernelcache.im4m`
* `img4tool kernelcache.im4p -e -o kernelcache.macho`
* The result is a standard Mach-O file. You can look at the headers with [machodump.py](https://gist.github.com/marcan/e1808a2f4a5e1fc562357550a770afb1) if you do not have a Mach-O toolchain handy.

## Alternate using the kernel.release.* file

* From suggestion by **davidrysk** there are some MacOS kernel images already available at **/System/Library/Kernels/kernel.release.t8020**
* Below shows dumping the macho header with Marcan's script [machodump.py](https://gist.github.com/marcan/e1808a2f4a5e1fc562357550a770afb1) in order to get the offsets to disassemble the code:
  * Note: This requires the **construct** python package but the debian buster packages didn't work (python 3 or 2) or even a github version
  * I had to use the pypi install via pip3:
```
 apt install python3-pip
 pip3 install construct
```

 * Then dump out the headers to extract the offsets to the code:
```
python3 machodump.py kernel.release.t8020
...
            cmd = (enum) SEGMENT_64 25
            args = Container: 
                segname = u'__TEXT' (total 6)
                vmaddr = 0xFFFFFE0007004000
                vmsize = 0x00000000000C4000
                fileoff = 0x0000000000000000
                filesize = 0x00000000000C4000
...
        Container: 
            cmd = (enum) UNIXTHREAD 5
            args = ListContainer: 
                Container: 
                    flavor = (enum) THREAD64 6
                    data = Container: 
                        x = ListContainer: 
                            0x0000000000000000
...
                            0x0000000000000000
                        fp = 0x0000000000000000
                        lr = 0x0000000000000000
                        sp = 0x0000000000000000
                        pc = 0xFFFFFE00071F4580
                        cpsr = 0x00000000
                        flags = 0x00000000
....
```
* Calculate the offset from the starting instruction pc=0xFFFFFE00071F4580 to the start of the VM (vmaddr=0xFFFFFE0007004000)
```
calc "base(16); 0xFFFFFE00071F4580 - 0xFFFFFE0007004000"
        0x1f0580
```
* Skip over the first 0x1f0000 = 0x1f0 x 0x1000 (4k) blocks and split off 64K from the here:
```
dd if=/home/amw/doc/share/kernel.release.t8020 of=init.bin bs=4k skip=$((0x1f0)) count=16
```
* Disassemble the raw binary blob
```
aarch64-linux-gnu-objdump -D -b binary -m aarch64 init.bin

init.bin:     file format binary

Disassembly of section .data:

0000000000000000 <.data>:
       0:       14000100        b       0x400
       4:       d503201f        nop
       8:       d503201f        nop
       c:       d503201f        nop
      10:       d503201f        nop
      14:       d503201f        nop
      18:       d503201f        nop
      1c:       d503201f        nop
      20:       d503201f        nop
...
     3f4:       d503201f        nop
     3f8:       d503201f        nop
     3fc:       d503201f        nop
     400:       d510109f        msr     oslar_el1, xzr
     404:       d5034fdf        msr     daifset, #0xf
     408:       f2e88aa0        movk    x0, #0x4455, lsl #48
     40c:       f2c80a80        movk    x0, #0x4054, lsl #32
     410:       f2ac8cc0        movk    x0, #0x6466, lsl #16
     414:       f28c8ee0        movk    x0, #0x6477
     418:       90003fe4        adrp    x4, 0x7fc000
     41c:       3944c085        ldrb    w5, [x4, #304]
     420:       710000bf        cmp     w5, #0x0
...
```
* On the actual Mac with XCode installed as pointed out by **davidrysk** you can do the much simpler:
```
otool -xv /System/Library/Kernels/kernel.release.t8020

...
/System/Library/Kernels/kernel.release.t8020:
(__TEXT_EXEC,__text) section
fffffe00071ec000        sub     x13, sp, #0x60
fffffe00071ec004        sub     sp, sp, #0x60
fffffe00071ec008        st1.4s  { v0, v1, v2 }, [x13], #48 ; Latency: 4
...
fffffe00071f43f8        nop
fffffe00071f43fc        nop
fffffe00071f4400        msr     OSLAR_EL1, xzr
fffffe00071f4404        msr     DAIFSet, #0xf
fffffe00071f4408        movk    x0, #0x4455, lsl #48
fffffe00071f440c        movk    x0, #0x4054, lsl #32
fffffe00071f4410        movk    x0, #0x6466, lsl #16
fffffe00071f4414        movk    x0, #0x6477
fffffe00071f4418        adrp    x4, 2044 ; 0xfffffe00079f0000
fffffe00071f441c        ldrb    w5, [x4, #0x130]        ; Latency: 4
fffffe00071f4420        cmp     w5, #0x0
fffffe00071f4424        b.ne    0xfffffe00071f4438
....
```
