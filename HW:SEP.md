For now, just some random notes gathered from initial tracing of the SEP and prior knowledge from other community members, should be updated as i start digging deeper

fair warning: these are very messy at the moment, but it's to help me get some preliminary notes down on SEP stuff - a proper page will come later

Endpoint information:

| Endpoint index | Endpoint name | Purpose |
| -------------- | ------------- | ------- |
| 0x00 | Control/CNTL | seems to control some endpoint properties |
| 0x08 | Secure Biometrics (SBIO) | biometric authentication |
| 0x0a | SCRD | likely "Secure/SEP credential manager" used for user credential auth? |
| 0x0c | sse  | unknown |
| 0x0e | HDCP | likely HDCP content protection |
| 0x10 | xars (according to tracer) | xART setup? |
| 0x12 | Secure/SEP Key Store | SEP encrypt/decrypt operations and key management |
| 0x13 | xART manager | manages xARTs, gigalockers and keybags (needed for SKS to start) |
| 0x14 | hibe (according to tracer) | hibernation related? | 
| 0x15 | pnon (tracer name) | unknown purpose |
| 0x17 | skdl | unknown |
| 0x18 | stac | seems to be linked to the AppleTrustedAccessory extension, perhaps "Secure/SEP Trusted Accessory Connection"? | 
| 0xFD | Debug | debug endpoint, signals some events to XNU? |
| 0xFE | Boot254 | Used in sending the IMG4 SEP OS image into SEP memory |
| 0xFF | Boot255 | Signals to SEP via the BootTZ0 message to proceed booting |

Gigalocker/xART format (thanks sven for this info!)

0x00-0x01 - Always 0 (perhaps some kind of version identifier?)
0x01-0x12 - UUID/key (identifies SEP request, possibly handled by SKS?)
0x12-0x16 - length
0x16-0x1a - CRC of data (CRC32, ISO-HDLC)
0x1a-0x22 - unknown
0x22-end of payload - payload data (max of 0x8000)

Basically a key/value store updated by SEP (where keybag data is stored)

SEP Message format:

bits 0-7 - Endpoint number
bits 8-15 - a "tag" value (for the control endpoint, an inbound and outbound message may sometimes share tags)
bits 16-24 - a message "type" (for the debug endpoint always 0x1)
bits 25-31 - message parameters (debug endpoint, this is always the endpoint the debug endpoint is responding/receiving info about)
bits 32-63 - some kind of data (can be either a pointer, or a configuration value)

SEP boot flow:
- iBoot preloads SEP firmware
- XNU sends a boottz0 message, bringing SEP into second stage boot
- XNU sends img4, SEP verifies integrity, if accepted, boots into SEP/OS
- Endpoint setup (haven't finished gathering data on this part yet, but longest/most complex part by far)


xART init flow (incomplete atm, may be wrong):

(message type 0 is some sort of fetch request, message type 0x5 is a fetch response it seems for individual lockers)
(tags seem to be increasing in the order of the lockers within the gigalocker)

//???? (possibly initialization? there is a "gigalocker initialization completed" message in XNU bootlog)
[cpu1] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000010000000213 (EP=0x13, TAG=0x2, TYPE=0x0, PARAM=0x0, DATA=0x100)
[cpu14] [SEPTracer@/arm-io/sep] [xarm] <0x13(None) 0000000000130113 (EP=0x13, TAG=0x1, TYPE=0x13, PARAM=0x0, DATA=0x0)

//SEP xART fetch from gigalocker (this xART itself seems to have many sublockers?)
[cpu0] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000000000000113 (EP=0x13, TAG=0x1, TYPE=0x0, PARAM=0x0, DATA=0x0)
[cpu10] [SEPTracer@/arm-io/sep] [xarm] <0x0(None) 0000010000000313 (EP=0x13, TAG=0x3, TYPE=0x0, PARAM=0x0, DATA=0x100)


SEP backwards compatibility notes:

SKS IPC is negotiated on both the kernel side and SEP side, lowest compatible version between both will be the IPC used for communication between main processor and SEP.

This should ensure that SEP and OS can continue to be compatible with each other even if SEP gets upgraded (since it'll just use the older IPC version). (potential question: in the Linux driver how should this be accounted for?)


Miscellaneous notes:

The control endpoint seems to reply to incoming requests with a message type of 0x1 and input parameters if something was successful (likely an ack/okay from SEP side if all is good) (at least for messages that set input/output length or pointers)

SKS is *very* spammy in normal mode as mailbox messages to/from sep with it as the endpoint are constantly being sent (this is likely because of how Data Protection works according to the Apple security guide, a lot of these likely are retrieving/updating keys from/to gigalocker)

Single-user mode is helpful when tracing sep, as SKS will not be nearly as spammy and we can capture the early initialization sequence.