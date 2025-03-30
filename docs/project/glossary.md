---
title: Glossary
---

Useful terms to know.

Add terms specific to the hardware, reverse engineering, and Apple ecosystems that are relevant. Don't add things that everyone is expected to know (CPU, GPU, HDD, SSD, OSX, USB, HDMI, RAM, etc.) or which are not likely to be relevant to the project. Think of the target audience as "random Linux developer".

If you want to collect a large set of terms specific to a sub-field (such as GPUs), feel free to create a separate page.

### 1
* **1TR**: One True RecoveryOS. This is what RecoveryOS is called when you boot it by holding down the power button. This means you have asserted physical presence and you are running a fully Apple-trusted recovery environment, which gives you special powers, like the ability to install a custom OS. You get root access, but you can only run software signed by Apple, and if FileVault is enabled you first need to authenticate.

### A
* **AGX**: The internal name for Apple's GPU series.
* **AIC**: Apple Interrupt Controller. Apple's custom ARM interrupt controller, because the standard GIC was too standard for Apple.
* **AMX**: Apple Matrix eXtensions. A matrix coprocessor partially integrated into the ISA.
* **ANE**: Apple Neural Engine. FP16 multiply-add unit.
* **ANS**: NVME / storage coprocessor?
* **AOP**: Always On Processor. Apple SoC co-processor/DSP that that enables “Hey Siri,” feature on macOS among other things. 
* **AP**: Application Processor. The main CPU running most of the OS. Contrast to SEP.
* **APFS**: Apple File System. Apple's new container and volume oriented "modern" filesystem, think ZFS and btrfs.
* **APFS Container**: a physical partition on a disk that can itself contain multiple filesystems (volumes), all dynamically sharing space.
* **APFS Snapshot**: a read-only copy-on-write snapshot of an APFS volume.
* **APFS Volume**: a logical filesystem within an APFS container, that can be mounted on a directory.
* **APR**: APR ProRes. Handles ProRes video encoding + decoding.
* **APSC**: Automatic Power State Controller.
* **ASC**: Possible generic name for Coprocessors? e.g. gfx-asc. Possibly Apple Silicon Coprocessor.
* **AVD**: Apple Video Decoder.
* **AVE**: Apple Video Encoder. Supports AVC and HEVC.

### B
* **BootROM**: A read-only memory embedded in a chip such as the M1, which is the first code executed upon boot. See SecureROM.

### C
* **Chicken Bits**: Otherwise known as "kill bits", configuration bits used for disabling/enabling specific features.

### D
* **DART**: Device Address Resolution Table. Apple's custom IOMMU.
* **DCP**: Display Control Processor (probably). It enables support for displaying new frames without tearing, hardware sprites e.g. mouse cursor, switching resolutions, configuring multiple outputs, and more.
* **DFR**: Dynamic Function Row. Apple's internal name for the Touch Bar.
* **DFU**: Device Firmware Update. A USB mode that allows flashing a device's firmware over USB. Apple devices support this in the SecureROM, to allow the user to restore devices which have otherwise been bricked.
* **DPE**: Digital Power Estimator.
* **DVFM**: Dynamic Voltage and Frequency Management.

### E
* **EEPROM**: Electrically Erasable Programmable Read Only Memory. A type of re-writable memory, commonly available in sizes of a few kilobytes at most, more robust than NOR Flash. Often used for settings and very early boot code.

### F
* **Fallback Recovery OS**: 2nd copy of recovery OS accessed by double clicking and holding power button to boot. Unlike 1TR is unable to change security state(settings). Can be distinguished from Recovery OS 1TR by Utilities missing "Start Security Utility" option under Utilities
* **fuOS**: Custom OS, speculated to mean "fully untrusted OS".

### G
* **GPT**: GUID Partition Table: A partition table format created for EFI/UEFI and now used on most modern systems.
* **GXF**: probably Guarded Execution Function. Lateral exception levels used to create a low-overhead hypervisor to protect pagetables and equally important structures from XNU itself. See e.g. [Sven's write-up](https://blog.svenpeter.dev/posts/m1_sprr_gxf/) or [SPRR and GXF](../hw/cpu/sprr-gxf.md)

### H
* **HFS+**: Hierarchical Filesystem+: Apple's previous filesystem, used for external storage. Not used for internal storage on M1 Macs.

### I
* **I²C**: Inter-Integrated Circuit. A 2-wire standard for communicating at low speed between chips on a board.
* **iBEC**: iBoot Epoch Change. Replacement for the second-stage iBoot, loaded in the DFU boot flow.
* **iBoot**: Apple's bootloader. Can refer to iBoot1, iBoot1, or any of iBSS, iBEC, or even the SecureROM itself (which are all different builds of iBoot with different capabilities).
* **iBoot1**: The first-stage iBoot located in NOR, loaded by the SecureROM. It chainloads the second-stage iBoot (iBoot2) on the OS Preboot partition, after doing early initialization and loading OS-independent firmwares. LLB is an older name for iBoot1.
* **iBoot2**: The second-stage iBoot located in the OS Preboot partition. This version of iBoot is specific to each installed OS, and is packaged with the bundle of runtime firmwares the OS needs to run.
* **iBSS**: iBoot Single Stage. Replacement for the first-stage iBoot (iBoot1/LLB), loaded in the DFU boot flow when the NOR is corrupted.
* **IOKit**: I/O Kit is Apple's device driver framework for XNU (Apple's operating system kernel).
* **IOMMU**: I/O Memory Management Unit, a more general term for Apple's DART.
* **IPI**: Inter-processor interupt. An interrupt used by one processor to interrupt another.
* **iSC**: iBoot System Container. A disk partition (usually first on the internal SSD) containing the system wide boot data. (See [Stock Partition Layout](../platform/stock-partition-layout.md))
* **ISP**: Image Signal Processor. Webcam on M-series laptops. Denotes the entire camera unit, from sensors to strobe to the coprocessor.

### J
* **JTAG**: Joint Test Action Group. Actually refers to a debugging interface released by that group, a 4/5-wire interface to debug chips and CPUs at the hardware level.

### K
* **kASLR**: kernel Address Space Location Randomization: Linux kernel feature randomizes where the kernel code is placed in memory at boot time. Disabled by specifying `nokaslr` boot flag.
* **kcOS**: OS with a custom kernel cache.
* **Kernel cache**: A bundle of the kernel and its extensions, optionally encrypted.
* **kmutil** macOS Kernel Management utility for managing kernel extensions (kexts). Used to boot alternative kernels i.e. m1n1

### L
* **LLB**: Low Level Bootloader, an older name for iBoot1 inherited from iOS platforms.

### M
* **Mini** - Custom bootloader for internal investigation. May or may not support booting from SSD. This project uses a fork that's referred to as M1N1.
* **Mux**: Multiplexer, a device that can connect one of several things to a single connection, such as switching one set of pins between USB, UART, and SWD modes.

### N
* **NAND**: Not-AND. A type of logic gate, but normally refers to a type of Flash memory, which is the one used on all modern high-capacity Flash-based storage such as SD cards and SSDs, but also comes in bare chips.
* **NOR**: Not-OR. A type of logic gate, but normally refers to a type of Flash memory, which is only used for low-capacity applications (up to a few megabytes at most). More robust than NAND. Usually comes in bare 8-pin chips these days.
* **NVRAM**: Non-Volatile RAM. The name is obsolete, it just means a list of key=value parameters stored in a Mac for boot configuration. Akin to UEFI variables.

### P
* **PMGR**: Power manager.
* **PMP**: Power Management Processor.

### R
* **RecoveryOS:** The recovery environment, which can either be a recovery image paired to an OS install (located inside an APFS subvolume) or the global recovery image installed in the last APFS container on disk. macOS 11.x uses the global image by default, while macOS 12.0 and newer uses a paired recoveryOS.
* **RestoreOS:** The restore environment, loaded onto the device when "reviving" it through DFU mode by Apple Configurator. [more info](https://www.theiphonewiki.com/wiki/Restore_Ramdisk)
* **ROM** is an acronym for Read-Only Memory. It refers to computer memory chips containing permanent or semi-permanent data.
* **RTKit:** Apple's proprietary real-time operating system. Most of the accelerators (AGX, ANE, AOP, DCP, AVE, PMP) run RTKit on an internal processor. The string "RTKSTACKRTKSTACK" is characteristic of a firmware containing RTKit.
* **RTOS:** Real-time operating system.

### S
* **SBU**: Sideband Use. Two pins on Type C connectors free to be used for random stuff, not defined by the Type C standard itself.
* **SecureROM**: The BootROM of the M1. This is in charge of reading iBoot1 from NOR and passing control to it, or falling back to DFU mode.
* **SEP**: Secure Enclave Processor. The M1's built-in HSM/TPM/etc device. Handles Touch ID and most crypto, as well as boot policy decisions. Harmless to Linux, but we can use its features if we want to. Contrast to AP.
* **SFR**: System Firmware and Recovery, the collection of firmware and the recovery image shared by all OSes installed on the system, including components in NOR (like iBoot1), the iBoot System Container, the System Recovery partition, and external Flash memories and other miscellaneous locations. SFR always goes forward in version, never backwards (other than via a full wipe).
* **SIP**: System Integrity Protection. Also called "rootless", where the macOS kernel stops even root from doing some things.
* **SMC**: System Management Controller: a piece of hardware handling access to such things as temperature sensors, voltage/power meters, battery status, fan status, and the LCD backlight and lid switch. See [SMC](../hw/soc/smc.md)
* **SOP**: Start Of Packet. Used to differentiate packet types in USB-PD. SOP for normal comms, SOP' and SOP" to talk to built-in chips in a cable, SOP'DEBUG and SOP"DEBUG for custom vendor specific things like Apple VDMs.
* **SPI**: Serial Peripheral Interface. A 4-wire standard for communicating at low speed between chips on a board.
* **SPMI**: System Power Management Interface from MIPI Alliance: 2-wire bi-directional interface, Multi master(up to 4), Multi slave(up to 16), 32KHz to 26MHz. See [System Power Management Interface](https://en.wikipedia.org/wiki/System_Power_Management_Interface)
* **SPRR**: probably Shadow Permission Remap Registers. Turns the normal page permission attributes (AP,PXN,UXN) into an index to a separate table. This new table then determines the real page permissions. Also disallows pages that writeable and executable at the same time. See e.g. [Sven's write-up](https://blog.svenpeter.dev/posts/m1_sprr_gxf/) or [SPRR and GXF](../hw/cpu/sprr-gxf.md)
* **SWD**: Serial Wire Debug. A 2-pin interface used for debugging ARM cores, like JTAG over fewer pins. Used on Apple devices, but inaccessible (for the main CPU/SoC) in production devices due to security restrictions.

### T
* **TBT**: Thunderbolt Technology

### U
* **UART**: Universal Asynchronous Receiver Transmitter. The hardware behind a serial port.
* **USB-PD**: USB Power Delivery. A standard for side-band communications over USB Type C (we won't talk about the older standard for our own sanity). This is used for things like detecting what kind of cable is used, connector orientation, configuring the supply voltage, and switching to non-USB modes.
* **USC**: Unified shader core. A shader core supporting all shader types (vertex, fragment, compute). AGX is a unified architecture, so this just refers to a shader core.

### V
* **VBUS**: USB pin delivering power. Defaults to 5V, can go as high as 20V with USB-PD.
* **VDM**: Vendor Defined Message. Used for both USB Alternate Mode (not actually proprietary) and vendor-proprietary commands over USB-PD. Apple uses these to configure special modes on their Type C ports.
* **VHE**: Virtual Host Extensions. Extra Registers to allow more efficient switching between OS/VMs/User-space. See [ARM VHE explanation](https://developer.arm.com/documentation/102142/0100/Virtualization-Host-Extensions)

### X
* **XNU**: Apple's operating system kernel for macOS, iOS, iPadOS, watchOS, tvOS and so on. "XNU" is an abbreviation for "X is not Unix"
