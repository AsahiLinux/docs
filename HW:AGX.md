# Lina's AGX notes

Reader beware, here be dragons. Pointer-shaped dragons. Lots of them.

This document focuses on the AGX architecture from the point of view of a kernel driver. It will not discuss aspects that are purely of userspace concern, like shaders, texture sampling, pipeline command encoders, etc.

## Overview

AGX is a *heavily* PowerVR-inspired (but largely bespoke) GPU design. The OS interface is brokered almost exclusively via an ASC (ARM64) coprocessor, which runs Apple firmware. All communication occurs via shared memory and a few mailbox doorbell messages. All memory is coherent as far as we can tell (we haven't used a single cache management instruction yet and everything still works).

The layers involved in getting a triangle on the screen are roughly:

* UAT (MMU)
* Firmware init
* GPU Channels
* GPU Contexts
* Work Queues
* Work Items
* Micro Sequences
* Tiler buffer management
* Event management
* (All the userspace stuff goes here)

### UAT (Unified Address Translator)

The UAT is the AGX's MMU. It is essentially the ARM64 MMU, and uses identical page tables. In fact, the AGX ASC literally configures UAT page table bases as its TTBR0/1 registers. There *may* be some nuance to how the GPU proper interprets page permissions and other attributes compared to how a CPU would; this is still largely unexplored.

GPU VAs are 40 bits, with the top bit sign-extended to 64 bits. As with ARM64, there is a kernel/user address space split. Pages are always 16K.

There is a global, fixed page of memory that contains GPU context page table base addresses. There are up to 16 contexts (TODO: double check this limit is real and not driver-controlled), each with two base registers for the kernel/user page tables. 

macOS always uses context 0 for the kernel only (no user pages for that one) and shares the kernel half of the page tables for all contexts. User VA space is unique per context.

The kernel address space literally maps ASC firmware too, as it *is* the ASC's CPU page table. This is in a VA range that the firmware controls by itself, and sets up during initialization. The host OS is responsible for the rest of the page tables in this half of the address space, which is where all the GPU control structures go.

Note: firmware is loaded by the bootloader and write-protected. While hijacking the page tables to completely take over AGX firmware is plausible with the current design, clearly Apple's intent and direction is for ASC firmwares to be hardened against takeover, so we will not consider using our own firmware at this point. Talking to Apple's firmware to make this GPU work is considered non-negotiable.

TODO: UAT TLB invalidation. There's some shared memory involved and poking the firmware.

### Firmware init

Firmware communication uses the RTKit framework common to other ASCs, which will not be covered here. Only the memory/buffer management is different (other ASCs use either DART IOMMUs, SART address filters, or can only access dedicated SRAM).

To initialize the GPU, a single message is sent containing a pointer to an inititalization data structure. This is a complex nested data structure with more pointers, containing things such as:

* Channel ring buffer control area and ring buffer area pointers
* Power management data including DVFS states
* Shared memory regions containing various (largely unknown) data
* Colorspace conversion coefficients
* MMIO mapping list (OS is responsible for mapping MMIO regions the ASC needs to access)
* UAT layout information
* Various unknown buffers

Data structures: see [initdata.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/initdata.py)

### Channels

Communication with the firmware happens via channel ring buffers. Channels hold small, fixed-size messages delivered in-line in the ring buffers. A control structure has the read/write buffer pointers and size, cacheline-aligned so the GPU/CPU do not bounce things all the time. There are channels in both directions.

Data structures: see [channels.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/channels.py)

#### CPU->GPU channels

* Work Channels: four groups (0-3), each with three channels, one per GPU work type
  * TA (Tile Accelerator; vertex processing)
  * 3D (3D; pixel processing)
  * CP (Compute)
   
  TODO: there is probably some priority scheme for work submitted to different channels.

* DeviceControl channel, for device-wide messages (e.g. GPU init and presumably power management related stuff)

#### GPU->CPU channels

* Event: work-related event notifications
  * Work completion flag events
    * These have a 128-bit array indicating which event indices are firing
  * Fault notifications
    * GPU faults seem to be quite poorly handled as a stop-the-world process; macOS actually goes off dumping GPU MMIO registers directly, and the firmware seems to be quite clueless as to what to do.
* Statistics messages
  * We ignore these. The firmware will complain once if the buffer overflows, but it's harmless.
* Firmware syslogs
  * This one is weird in that there are multiple sub-channels for some reason, with control structures laid out contiguously.
* An unknown channel (tracing?)

### GPU contexts

GPU contexts map to a few small shared structures, some populated by the ASC. This is mostly still TBD.

### Work Queues

A work queue holds work items of a specific type. There are usually multiple work queues per context (e.g. at least 3D and TA for 3D rendering). Work queues are represented by a few structures, mostly a main structure initialized by the CPU and managed by the GPU, with pointers to context structures, a ring buffer, a ring buffer pointer block, and others. The ring buffer is an array of pointers to individual items (not in-line).

To process a work queue, the OS submits a message on a work channel with a pointer to the work queue management structure and the most recent ring buffer write pointer, plus an event index to signal work completion, and a flag indicating whether this is the first submission from a new work queue.

Data structures: see [cmdqueue.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/cmdqueue.py)

### Work items

Work items represent GPU work or related operations. These are fairly large buffers containing embedded sub-structures in a particular layout (pointers to some of these sub-structures exist, but the firmware assumes the embedding in a particular way, so the layout must be respected).

Data structures: see [cmdqueue.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/cmdqueue.py)

### Micro Sequences

The ASC firmware contains a command sequencer that can run fairly complext "scripts" as part of work commands, but it is usually used in a fairly basic manner. These sequences are packed buffers of commands that are executed as part of a work item. The typical sequence is:

* Start (3D/TA/CP)
* Write Timestamp
* Wait For Idle
* Write Timestamp
* Finish (3D/TA/CP)

Data structures: see [microsequence.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/microsequence.py)

### Tiler buffer management

The GPU tiler needs a buffer to store vertex attribute and primitive data. This is done through a few fixed-size buffers provided by the driver, and a heap that the GPU firmware allocates stuff out of at its discretion. The heap is managed via a buffer manager object and a few buffers it points to, where the CPU provides a list of blocks (4 pages) and pages (32K each, aligned in VA space (!)).

The tiler buffer overflow / partial store / reload process is entirely managed by ASC firmware.

Data structures: see BufferManager* in [microsequence.py](https://github.com/AsahiLinux/m1n1/blob/main/proxyclient/m1n1/fw/agx/microsequence.py)

### Event Management

Work completion is signaled by writing values to stamp objects, which are 32-bit words in RAM. Typically initialized at 0 and increment by 0x100 for each work item processed. Each work item is also associated with an event ID (0-127), and an event management structure. The structure is shared between 3D/TA for a single user, and contains the base barrier value and (?) a number of events threshold. When the threshold is reached, the corresponding event ID(s) are asserted in an Event message to the CPU. How this works/counts is still unclear, since the same structure is shared between different queues using different barrier objects which increment in lockstep, but each only increments by one while the threshold needs to be 2 to get both events... TBD

## Drawing a 3D frame

To draw a frame first you need these things:

* A pair of 3D/TA channels to use
* A pair of event indexes for completion notification
* A pair of WorkQueues
* A context ID for the UAT
* A shared context structure
* Tiler static buffers
* Tiler heap manager & associated buffers/lists
* Four stamp objects

### Tiler buffers

* (U) TVB tile array (depends on tile count)
* (U) TVB list array (depends on tile count?)
* (U) TVB heap metadata block (fixed size?)
* (K) TVB heap manager & (U) heap (arbitrary size >= 3 128K blocks, CPU can dynamically adjust in response to overflows for future frames)

macOS allocates these in the kernel. Do we want to do it in the kernel or userspace? Userspace should probably be in control of sizing at least? Could let the kernel decide, or have userspace donate pages to the buffer manager. Kernel needs to handle the heap manager structure at least.

### Stamp objects & event management

There are 128 event indices. A render needs 4 stamp objects, 2 each for TA/3D. Current theory is one stamp indicates completion of the work, the other indicates the completion event was delivered to the CPU (work was reaped?)

### TA work

The TA work usually looks like this:

#### Initialize Heap Manager

Needed the first time or when the heap size changes. Tells the GPU that the CPU re-initialized the management struture.

There is an unknown context-related ID involved. This might be a heap manager ID? The (new) TA stamp value is also passed.

#### Execute TA

Note: this is all summarized and glosses over tons of unknown/fixed/magic numbers

* UAT context ID for this job
* Event management structure pointer
* Heap manager structure pointer
* Pointer to some kind of related buffer descriptor (?)
* Pointer to unknown buffer (empty)
* Timestamp 1 ptr
* Timestamp 2 ptr
* Timestamp 3 ptr
* Unknown buffer 2 (empty)
* Embedded structures:
  * Tiler parameters (tile counts/etc)
  * TA work struct 2
    * TVB tilemap ptr
    * TVB list ptr
    * Three small buffers passed from userspace (alyssa calls these "deflake")
    * Command encoder ptr (i.e. actual gfx pipeline to run, from userspace)
    * Pipeline window base (4GiB window into VAs used for 32-bit shader pointers)
  * TA work struct 3
    * One of the deflake ptrs
    * Encoder ID (unique ID, GPU likely does not care)
    * "Unknown buffer" (the one with incrementing numbers, from userspace)
    * Pointer to TA barrier 1 and 2
    * Stamp value to write on completion
    * Some UUID
* Micro sequence pointers
* Completion stamp value again
* Event number assigned to 3D (for TA/3D coordination on TVB overflows?)
* TVB tile array again & size

### TA Micro Sequence

The micro sequence is pointed to by the TA work and has these commands:

#### Start TA

* Tiling params ptr
* TA work struct 2 ptr
* Heap manager ptr
* Buffer descriptor thing pointer
* Some pointer into an array in the shared GPU initdata (?)
* Pointer back to the work queue control structure involved
* UAT context ID
* That other context-related ID (heap mgr id?)
* TA work struct 3 ptr
* Pointer to one of the unknown buffers in Execute TA
* UUID

#### Timestamp

* Flag=1
* Points to three timestamp pointers in Execute TA: #1, #2, #2
* UUID

#### Wait For Idle
* Args: 1, 0, 0

#### Timestamp

* Flag=0
* Points to three timestamp pointers in Execute TA: #1, #2, #3 (note difference)
* UUID

#### Finish TA
* Pointer to that buffer thing
* Pointer to heap manager
* Same initdata pointer as in Start TA
* Pointer back to work queue
* UAT context ID
* Pointer to TA Struct 3
* UUID
* Pointer to TA stamp 2
* Stamp value to write
* Offset back to Start TA micro command (presumably to restart for partial renders?)

### 3D work

#### Barrier (Wait for Stamp)

This blocks 3D until TA is done. Unclear what black magic makes partial renders work.

* Pointer to TA stamp #2
* Value to wait for
* Value to wait for again (? range?)
* TA event index (presumably this signals the actual poll)
* UUID

#### Execute 3D

* UAT Context ID
* Event management structure pointer
* Tiler heap manager pointer
* Pointer to that buffer descriptor thing
* Unknown empty buffer
* TVB tile array pointer
* More unknown empty buffers
* Timestamp 1 ptr
* Timestamp 2 ptr
* Timestamp 3 ptr
* Embedded structures:
  * 3D work struct 1
    * Some floats?
    * Depth clear value
    * Stencil clear value
    * Depth bias array ptr
    * Scissor array ptr

(unfinished)


# phire's M1x GPU infodump

(Moved here from `phire-gpu-infodump.md`)

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