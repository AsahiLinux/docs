The SoC has several onboard accelerator units, this is a useful list of the names and what they refer to. Most of the accelerators run firmware that can be found in the pre-boot partition `/System/Volumes/Preboot/[UUID]/restore/Firmware`, packaged as im4p files which may be extracted with https://github.com/19h/ftab-dump/blob/master/rkos.py and some dd.

## Names

Names can be formatted the following ways depending on their official-ness:
* Names in quotes with a question mark like: "<name>?" are inventions/uncertain in origin.
* Names in **bold** like: **<name>** are found in Apple official documentation.
* Names in *italics* like: *<name>* are either common unofficial names or have uncertain but safe sources.

### A
* **AGX**: "Apple Graphics?" (via `gfx`) The internal name for Apple's GPU series.
* **AMX**: *Apple Matrix eXtensions*. A matrix coprocessor partially integrated into the ISA.
* **ANE**: **Apple Neural Engine** Neural network execution acceleration
* **AOP**: **Always On Processor**. "hey siri" activation and "other sensor stuff"
* **AVE**: **AVE Video Encoder**. Handles video encoding. Ostensibly the A is for Apple [citation needed], but I see a recursive acronym.
* **AVD**: **AVD Video Decoder**. Handles video decoding. ^

### D
* **DCP**: "Display Compression Processor?"/"Display Control Processor?". Displayport/Display control of some sort.

### P
* **PMP**: "Power Management Processor?". Handles power functionality

### S
* **SEP**: **Secure Enclave Processor**. The M1's built-in HSM/TPM/etc device. Handles Touch ID and most crypto, as well as boot policy decisions. Harmless to Linux, but we can use its features if we want to. Contrast to AP.