---
title: AGX Driver Notes
---

## General docs
* [Alyssa's Driver Survival Guide](https://rosenzweig.io/AlyssasDriverSurvivalGuide.txt)
* [AGX](../hw/soc/agx.md) (somewhat outdated)

## Git links
* [Upstream Mesa](https://gitlab.freedesktop.org/mesa/mesa) ([merge requests](https://gitlab.freedesktop.org/mesa/mesa/-/merge_requests?label_name%5B%5D=asahi))
* [Asahi Mesa](https://gitlab.freedesktop.org/asahi/mesa) (`mesa-asahi-edge` releases cut from here)
* [Lina's WIP kernel branch](https://github.com/AsahiLinux/linux/tree/gpu/rust-wip) (UAPI may be out of sync with mesa)

## UAPI design

The [UAPI](https://github.com/AsahiLinux/linux/blob/asahi-wip/include/uapi/drm/asahi_drm.h) design is inspired by the upcoming [Intel Xe UAPI](https://cgit.freedesktop.org/drm/drm-xe/tree/include/uapi/drm/xe_drm.h?h=drm-xe-next).

* File: An open file descriptor to the DRM device
* VM: A GPU address space
* Bind: A mapping from a GEM object into a VM
* Queue: A logical execution queue on the GPU (backed by several firmware queues)

### GEM objects and VMs

GEM objects can be created private to a given VM. What this means is that the object can never be exported, and can only be bound to that VM. This allows the driver to optimize object locking (not yet implemented, will be necessary once we have a shrinker, but the driver does enforce the private object requirement already).

* TODO: Does it make sense to offer an ioctl to convert a private object into a shared one? The driver needs this for some GL flows, right now it ends up re-allocating and copying which isn't ideal...

The VM bind ioctl supports binding/unbinding arbitrary ranges of a GEM object into a VM, though the driver does not yet implement this (it requires the whole object to be bound into free VM space, and objects may only be fully unbound by object name, not VMA range). This will change in the future, the UAPI is already prepared for it.

### Queues

Reader beware: This is tricky!!

The UAPI exposes an arbitrary number of user queues. Each user queue has a parent VM. A user queue receives jobs for execution, and each job can be composed of up to 64 GPU commands (to guarantee we don't exceed certain firmware limitations). Jobs are scheduled by the `drm_sched` scheduler and support arbitrary in/out sync object lists, for explicit sync. The job does not start execution until all the in sync objects are signaled, and the out sync objects are all signaled when all commands in the job have fully completed. Jobs are submitted to the firmware as soon as all in sync objects are signaled: a job boundary does NOT imply a CPU round trip if there are no direct dependencies between them (though the GPU will asynchronously signal completion of each job, since the kernel needs to clean up resources). However, jobs *are* always submitted in order: unsatisfied in sync objects for a job will block submission of all subsequent jobs to the firmware (this is implied by `drm_sched` and also a hard requirement of the driver design as it stands today). True arbitrary concurrency/reordering requires using multiple queues.

Within a job, commands are directly queued for execution by the firmware without CPU involvement. Each user queue is logically composed of two logical queues: render and compute. Render commands and compute commands are submitted in sequence, but they can execute concurrently within a single user queue.

The logical render queue is backed by two firmware queues (vertex and fragment). The kernel always submits firmware commands in pairs to those, with a barrier between them. This barrier is permeable (insert handwavy firmware magic here ✨) in that partial renders and preemption can interleave partial vertex and fragment executions. Vertex/fragment barriers between individual draw commands, if necessary, are handled at the VDM level (in the GPU command stream), as are certain cache-related barriers.

Within a user queue, command dependencies can be optionally added. These are specified as the boundary index (think Python slice indexing) of the command to wait on for each logical queue (compute, render), per command. Indices start at 0 (the point before any commands from this submission) and increment by one for every submitted command of a given type. It is illegal to wait on a command boundary in the future. Waiting on index 0 (the beginning of the job) for a given logical queue means waiting for all commands part of *prior* jobs of that type to complete, that is, it is equivalent to waiting on the end boundary of the prior submission. Since logical queues always start and complete commands in sequence, waiting on a given index implies waiting on all prior commands for that logical queue.

Absent explicit barriers, the vertex half of render commands can run concurrently with the fragment half of prior commands. That is, vertex processing can "run ahead" of fragment processing. To prevent this, specify a command barrier of the previous command index. This is a no-op for compute, since there is only a single serialized firmware queue in that case, but has meaning for render commands, and it is recommended for compute commands in case more parallelization becomes available in the future.

Consider the following submission:

```
#0  R1 barrier=[__, C0]
#1  C1 barrier=[__, __]
#2  C2 barrier=[__, __]
#3  R2 barrier=[R1, C2]
#4  R3 barrier=[__, __] # [R1, C2] implied
#5  R4 barrier=[R3, __] # [R3, C2] implied
```

This describes the following dependency graph:

```
[C*]->[R1]----+----\
   [C1]------+|---vv
   [C2]-----+||->[R3]-v
            vvv      [R4]
            [R2]------^
```
Note that there is a C1<-C2 ordering in practice due to queue serialization, but this wasn't explicitly specified with barriers. However, R2 and R3 are ordered after C2 and all prior compute commands, which includes C1, and also ordered after R1. Also note that R2/R3 can run concurrently (which means that vertex processing for R3 can overlap with or precede fragment processing for R2), but R4 will not start its vertex half until R3 is fully complete (which implies that R2 is also complete, due to queue ordering).

`[C*]` is the last submitted compute command (from a prior job). Note that specifying a 0 barrier is legal even if no commands have been submitted yet (it is ignored in that case, as it is equivalent to the case where all prior commands have fully completed at the driver and the associated ordering primitives freed). In this case, R1 could start its vertex processing before a previous submission's fragment processing is complete (no render barrier), but would wait for any prior compute commands to be complete (C0 barrier).

The firmware queue view of the same job is:
```
Compute  Vertex    Fragment
RUN C1   WAIT C0   WAIT R1v
RUN C2   RUN  R1v  RUN  R1f
         WAIT R1f  WAIT R2v
         WAIT C2   RUN  R2f
         RUN R2v   WAIT R3v
         RUN R3v   RUN  R3f
         WAIT R3f  WAIT R4v
         RUN R4v   RUN  R4f
```

In other words: for every render command, the explicit barrier waits go in the vertex queue before the vertex half, then the fragment queue always gets an implicit barrier before the fragment half.

Blit command support will be added in a future driver. These are effectively fragment-only render commands, and so will have their explicit barriers and execution both within the fragment queue.

Right now, the Gallium driver only issues single-command submissions and always uses `[C0, R0]` barriers to fully serialize everything. This might be improved in the future, but the main use case for all this is Vulkan queues.

### Results

Userspace can optionally request feedback from command execution. This is done by specifying a result buffer BO, and then per-command offsets and sizes into that buffer. The kernel will write command result information there, once the command is complete. Currently, this includes basic timing information, tiled vertex buffer statistics and partial render counts (for render commands), and detailed fault information (for faulting commands, very handy when combined with some BO lookup logic in mesa!).

### FAQ

* **What's up with the `struct drm_asahi_cmd_render` mess?**
  The firmware commands directly specify all these low-level render details and we cannot expose those structures directly to userspace, since it is not safe to do so. There is no other way, and macOS does the same thing... (at least it's less of a mess than PowerVR!)

### TODO

Upstreaming blockers (affect current draft UAPI):

* [ ] Figure out the attachment flags and confirm exactly what this does/how it works
* [ ] Sort out the compute preemption kernel stuff and the command fields it uses (or else drop it and leave it for a future rev/feature flag)
* [ ] Figure out one or two remaining unknown buffers and whether they should go in the UAPI (the 02345 thing...)
* [ ] Add the missing abstractions for mmu.rs (memremap stuff)

Other:

* [ ] Implement `DRM_IOCTL_ASAHI_GET_TIME`
* [ ] Implement RTKit runtime-PM (sleep ASC when GPU is idle, macOS does this on laptops)
* [ ] Reverse engineer and implement blit commands
* [ ] Hook up firmware KTrace to Linux tracing
* [ ] Complete the VM management (arbitrary subrange maps/unmaps)
* [ ] Performance counters
* [ ] M2 Pro/Max support
