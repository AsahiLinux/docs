Useful terms to know.

Add terms specific to the hardware, reverse engineering, and Apple ecosystems that are relevant. Don't add things that everyone is expected to know (CPU, GPU, HDD, SSD, OSX, USB, HDMI, RAM, etc.) or which are not likely to be relevant to the project. Think of the target audience as "random Linux developer".

If you want to collect a large set of terms specific to a sub-field (such as GPUs), feel free to create a separate page.

### 1
* **1TR**: One True Recovery. The recovery partition in M1 Macs, running with full codesigning. Boot with the power button held down. You get root access, but you can only run software signed by Apple. From here you can change the Mac's security settings.

### A
* **AGX**: The internal name for Apple's GPU series.
* **APFS**: Apple File System. Apple's new container and volume oriented "modern" filesystem, think ZFS and btrfs.
* **APFS Container**: a physical partition on a disk that can itself contain multiple filesystems (volumes), all dynamically sharing space.
* **APFS Snapshot**: a read-only copy-on-write snapshot of an APFS volume.
* **APFS Volume**: a logical filesystem within an APFS container, that can be mounted on a directory.

### B
* **BootROM**: A read-only memory embedded in a chip such as the M1, which is the first code executed upon boot.

### E
* **EEPROM**: Electrically Erasable Programmable Read Only Memory. A type of re-writable memory, commonly available in sizes of a few kilobytes at most, more robust than NOR Flash. Often used for settings and very early boot code.

### G
* **GPT**: GUID Partition Table.

### H
* **HFS+**: Hierarchical Filesystem+: Apple's previous filesystem, used for external storage. Not used for internal storage on M1 Macs.

### I
* **I²C**: Inter-Integrated Circuit. A 2-wire standard for communicating at low speed between chips on a board.

### J
* **JTAG**: Joint Test Action Group. Actually refers to a debugging interface released by that group, a 4/5-wire interface to debug chips and CPUs at the hardware level.

### M
* **Mux**: Multiplexer, a device that can connect one of several things to a single connection, such a switching one set of pins between USB, UART, and SWD modes.

### N
* **NAND**: Not-AND. A type of logic gate, but normally refers to a type of Flash memory, which is the one used on all modern high-capacity Flash-based storage such as SD cards and SSDs, but also comes in bare chips.
* **NOR**: Not-OR. A type of logic gate, but normally refers to a type of Flash memory, which is only used for low-capacity applications (up to a few megabytes at most). More robust than NAND. Usually comes in bare 8-pin chips these days.
* **NVRAM**: Non-Volatile RAM. The name is obsolete, it just means a list of key=value parameters stored in a Mac for boot configuration. Akin to UEFI variables.

### S
* **SBU**: Sideband Use. Two pins on Type C connectors free to be used for random stuff, not defined by the Type C standard itself.
* **SEP**: Secure Enclave Processor. The M1's built-in HSM/TPM/etc device. Handles Touch ID and most crypto, as well as boot policy decisions. Harmless to Linux, but we can use its features if we want to.
* **SIP**: System Integrity Protection. Also called "rootless", where the macOS kernel stops even root from doing some things.
* **SOP**: Start Of Packet. Used to differentiate packet types in USB-PD. SOP for normal comms, SOP' and SOP" to talk to built-in chips in a cable, SOP'DEBUG and SOP"DEBUG for custom vendor specific things like Apple VDMs.
* **SPI**: Serial Peripheral Interface. A 4-wire standard for communicating at low speed between chips on a board.
* **SWD**: Serial Wire Debug. A 2-pin interface used for debugging ARM cores, like JTAG over fewer pins. Used on Apple devices, but inaccessible (for the main CPU/SoC) in production devices due to security restrictions.

### T

* **TBT**: Thunderbolt Technology

### U
* **UART**: Universal Asynchronous Receiver Transmitter. The hardware behind a serial port.
* **USB-PD**: USB Power Delivery. A standard for side-band communications over USB Type C (we won't talk about the older standard for our own sanity). This is used for things like detecting what kind of cable is used, connector orientation, configuring the supply voltage, and switching to non-USB modes.

### V
* **VBUS**: USB pin delivering power. Defaults to 5V, can go as high as 20V with USB-PD.
* **VDM**: Vendor Defined Message. Used for both USB Alternate Mode (not actually proprietary) and vendor-proprietary commands over USB-PD. Apple uses these to configure special modes on their Type C ports.
