Moved here from `phire-gpu-infodump.md`

# phire's M1x GPU infodump

All my work was done on my T6000 14" M1 Max with MacOS 12.2

So far, this is mostly an adventure to find how work is submitted to the GPU.


## UAT iommu (aka Unified Address Translator)

There is a reasonably complete implementation of UAT in m1n1/hw/uat.py

It is a 4 level pagetable:

 * L0: 2 entries
 * L1: 8 entries
 * L2: 2048 entries
 * L3: 2048 entries

Pages are fixed-sized at 16KB

The (slightly weird) layout allows for shared VM regions (above `0xf80_00000000`) to be in L0[1] and
all per-context allocations to be in L0[0], making for easy constriction of L0 tables for new contexts 

I have not found a TTBR register, or any registers. It seems gfx-asc is in full control of this iommu.
It does set up it's own pagetables for the private IO region

This has security implications, gfx-asc has access to every single physical page, and some (if not all)
MMIO registers. Panic messages from the MacOS kernel suggest there might be a "microPPL" running on
the gfx-asc coprocessor, similar to the PPL in MacOS, and that's hopefully the only part that can
modify page tables.

The MacOS kernel has a useful kernel option, `iouat_debug=1` that logs out all allocations and 
de-allocations in this address space.

See m1n1.hw.PTE for details on the PTE format





## GPU Virtual Address Space

MacOS (at least on my machine) uses GPU VAs in the following ranges:

`0x015_00000000`: Most userspace allocations  
`0x011_00000000`: Some additional userspace allocations  
`0x06f_ffff8000`: No idea. Only a single page
`0xf80_00000000`: ASC's private VM region, that it allocates itself. Mostly contains the ASC firmware  
This region lines up with `/arm-io/sgx/rtkit-private-vm-region-base`

`0xf80_10000000`: IO region mapped by ASC firmware. Only contains the ASC mailbox registers.  
`0xfa0_00000000`: Region where macos kernel allocates things  
`0xfa0_10000000`: IO region mapped by MacOS.  
Points to ASC regions, PMRG registers, MCC registers (and more?)

Pointers are sometimes sign extended, so you will sometimes see pointers in the range
`0xffffff80_00000000` or `0xffffffa0_00000000`, but there are only actually
40 bits of address space. Logs from the kernel usually report 44 bits, hence `0xfa_00000000` address

UAT is in control of this address space.





## gfx-asc

The ASC interface seems like it would be natural interface for submitting work.

However there is shocking little traffic on this interface, especially when
compared to what I've seen of DCP.

### Endpoints

 0x0: Standard Management, I didn't see anything weird here.  
 0x1: Standard Crashlog endpoint
0x20: I called this Pong. Receives regular "pongs"  
0x21: I called this Kick.  

#### Crashlog Endpoint

The entire traffic is:

    RX 0x0012000000000000
    TX 0x00104fa00c388000

And happens right around initialization

0xfa00c388000 is a GPU VA, and points at a single page allocation. the gfx firmware fills this with
a repeating pattern during initialization (16KB of repeating 0xef byte), and then never
touches it again.


#### Pong Endpoint

*Crashlogs call this endpoint "User01"*

I probably misnamed this, the number of Pong messages don't line up with kicks. Might be more of
a heartbeat, or might be the gfx firmware telling the cpu that it touched the pagetables.

There is also some more initialization that happens on this endpoint after the Init endpoint.

Messages:
`RX 0x0042000000000000`: The pong. Never sets the lower bits to anything other than zero.  
`TX 0x00810fa0000b0000`: Initialization, sent once  

If you send a null pointer as the Initialization data, you get the following crash over Crashlog:

    GFX PANIC - Unable to grab init data from host - agx_background(2)

The painclog shows the following active tasks:

 * rtk_ep_work
 * power
 * agx_background

And the panic happens in agx_background. *Does this mean this endpoint belongs to agx_background?*

Once the initialization data has been supplied, I didn't managed to crash this endpoint by sending
it messages

##### Pong Initialization

 This also contains a GPU VA, pointing at a data structure that is prefilled by the cpu:

    >>> chexdump32(gfx.uat.ioread(0, 0xfa0000b0000, 0x4000))
    00000000  000b8000 ffffffa0 00000000 00000000 0c338000 ffffffa0 00020000 ffffffa0
    00000020  000c0000 ffffffa0 030e4000 240e0e08 40000008 00000001 00000000 ffffc000
    00000040  000003ff 00000000 00000070 190e0e08 40000800 00000001 00000000 ffffc000
    00000060  000003ff fe000000 0000000f 0e0e0e08 40000800 00000001 00000000 ffffc000
    00000080  000003ff 01ffc000 00000000 00000000 00000000 00000000 00000000 00000000
    000000a0  00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
    000000c0  00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000

I called this ControlStruct in my m1n1/trace/agx.py code.

After initialization, the CPU never touches this.

unkptr_18 appears to be a heap or stack used by the asc-firmware?



#### Kick

*Crashlogs call this endpoint "User02"*

**Messages:**  

`0x83000000000000`: Submit TA channel
`0x83000000000001`: Submit 3D channel
`0x83000000000002`: Submit CL channel
`0x83000000000010`: Kick Firmware
`0x83000000000011`: Device Control

These Kicks might be triggering work submission, but with only 5 bits of entropy, the actual
information must be somewhere in shared memory. But at this point I have not found shared memory that
is altered between kicks. It's also possible I mislabeled this, and the kicks are actually TLB invalidation

Sending `0x0083000000000000` messages with out-of-range kicks doesn't cause a crash
message types 0x84 and 0x85 

### Channels

#### Channel 0

Used by `0x83000000000000`: Submit TA channel

00000000 0c000000 ffffffa0 00000002 00000000 00000001
00000000 0c3a8000 ffffffa0 00000002 00000002 00000001
00000000 0c000000 ffffffa0 00000003 00000000 00000000
00000000 0c3a8000 ffffffa0 00000003 00000002 00000000
00000000 0c3a8000 ffffffa0 00000004 00000002 00000000
00000000 0c3a8000 ffffffa0 00000005 00000002 00000000

#### Channel 1

Used by `0x83000000000001`: Submit 3D channel

00000001 0c002cc0 ffffffa0 00000002 00000001 00000001
00000001 0c3aacc0 ffffffa0 00000002 00000003 00000001
00000001 0c002cc0 ffffffa0 00000004 00000001 00000000
00000001 0c3aacc0 ffffffa0 00000004 00000003 00000000
00000001 0c3aacc0 ffffffa0 00000006 00000003 00000000
00000001 0c3aacc0 ffffffa0 00000008 00000003 00000000
00000001 0c002cc0 ffffffa0 00000006 00000001 00000000
00000001 0c3aacc0 ffffffa0 0000000a 00000003 00000000

#### Channel 12

Used by Device Control - `0x83000000000011`

The kernel puts a message in channel 12 before even initializing gfx-asc.

Message Type 0x19

then

Message Type 0x23

Message 0x17:

    Seen when launching my metal test

#### Channel 13

From GPU firmware?

Transfers are actually 0x38 bytes long, instead of the regular 0x30

    # chan[13]->ptrB (0xffffffa000031f00..0xffffffa0000350af)
    ffffffa000031f00 00000001 00000001 00000000 00000000 00000000 4b430000 534b5452 4b434154 | ......................CKRTKSTACK
    ffffffa000031f20 534b5452 4b434154 534b5452 4b434154 534b5452 4b434154 00000001 00000002 | RTKSTACKRTKSTACKRTKSTACK........
    ffffffa000031f40 00000000 00000000 00000000 ffff0000 00000080 00000000 000040e8 00000000 | .........................@......
    ffffffa000031f60 00001180 00021300 000040e0 00000000 00000000 00000000 00000000 00000000 | .........@......................



#### Channel 14

A reply to channel 12?

Message Type 0x4

#### Channel 16

The timestamp channel.

This might show the timestamps of every function or mode the gpu firmware (or gpu itself) was in

Type 0xc - Nothing has happened




### Tasks

According to crashlogs, gfx-asc is running the following tasks:

 * rtk_ep_work
 * power
 * agx_background
 * agx_recovery
 * agx_interrupt
 * agx_power
 * agx_sample



## /arm-io/sgx's various shared memory ranges

Talking about shared memory, these are the obvious ones. Allocated by iboot and listed in ADT

**gpu-region-base:**

Single page containing the L0 tables for UAT. Controlled by CPU.

The L0 for a given context can be found at `gpu-region-base + context * 0x10`

**gfx-shared-region-base:**

Contains all the private pagetables that gfx-asc allocates itself during initialization.

Mostly controlled by gfx-asc, though the cpu controls the PPE `L0[1][2]` and points it to an L2 table
in it's own memory.

There seems to be a convention that the `L0[1]` PTE will point to the start of this region. 

**gfx-handoff-base:**

`0x10ffffb4000` : u64 - microPPL magic value of `0x4b1d000000000002`  
`0x10ffffb4008` : u64 - microPPL magic value of `0x4b1d000000000002`  

Corrupting this value results in the following panic:

    panic(cpu 4 caller 0xfffffe0013c5d848): UAT PPL 0xfffffdf030af4160 (IOUAT): 
    Invalid microPPL magic value found in the handoff region. 
    Expected: 0x4b1d000000000002, Actual: 0x0

`0x10ffffb4018` : u32 - Commonly read as u8 - initialized to 0xffffffff  
`0x10ffffb4038` : u32 - Flush state (commonly set to 0 or 2)  

The CPU has a pattern of setting this to 2, changing some of the following values, and then
setting it back to 0. I suspect this might be a mutex?

Changing this to 2 when the cpu doesn't expect it will cause it to panic with:

    panic(cpu 0 caller 0xfffffe0013b6d8c4): UAT PPL 0xfffffdf0429d0160 (IOUAT): 
        Attempted to call prepareFWUnmap() before completing previous cache flush. 
        flush_state: 2 | start_addr: 0x150e540000 | size: 0x730000 | context_id: 1

`0x10ffffb4040` : u64 - CPU sometimes writes GPU VAs here  
`0x10ffffb4048` : u64 - Size? set to nice round numbers like 0x28000 and 0x8000  
`0x10ffffb4050` : u64 - CPU sometimes writes GPU VAs here  
`0x10ffffb4058` : u64 - another size  

`0x10ffffb4098` : u64 - Treated the same way as 4038, but when touching 40a0  
`0x10ffffb40a0` : u64 - CPU sometimes writes GPU VAs here, I've only seen this when running a metal app  
`0x10ffffb40a8` : u64 - size?  

`0x10ffffb4620` : u32 - ?  
`0x10ffffb4638` : u8 - Always checked before 0x4038 is changed.  


The CPU writes interesting GPU VA pointers to this range. I spent a long time thinking this must be
how work is submitted to the GPU. But it doesn't seem to be related to the Kicks or Pongs. Sometimes
the kernel will overwrite pointers multiple times with zero Kicks or Pongs in-between.
Other times it will do hundreds of kicks without ever changing anything in this region.

My current theory is that this region is exclusive used to track the status of page table updates,
and is accessible to both MacOS and gfx-asc so they can syncronise access for pagetable updates

The following panic message `GFX PANIC - Host-mapped FW allocations are disabled, but FW only supports enabled`
(seen when setting byte 0xa0 of initdata to 0) suggests that this "firmware control of pagetable" 
functionally isn't actually enabled in this version of the firmware.   
With any luck We might be able to get away with not writing anything to this handoff region at all.



## sgx registers

the CPU never writes to these registers, only reads. 

These registers are read once, during initialization:

    0x4000 : u32 - version number? 0x4042000
    0x4010 : u32 - version number? 0x30808
    0x4014 : u32 - version number? 0x40404
    0x4018 : u32 - unknown 0x1320200
    0x401c : u32 - 0x204311
    0x4008 : u32 - 0x40a06
    0x1500 : u32 - 0xffffffff
    0x1514 : u32 - 0x0
    0x8024 : u32 = 0x43ffffe - (this matches sgx/ttbat-phys-addr-base from the ADT)

These status registers are continually checked by *something* on the CPU

    0x11008 : u32 - Always counts up whenever work is done
    0x1100c : u32 - Useally 0
    0x11010 : u32 - Another work counter? counts up slower
    0x11014 : u32 - Useally 0

There doesn't seem to be a good relationship of when these status registers are read, relative to
the ASC Pong and Kicks. 