Some notes on the SEP based on past community research and digging into the SEP, along with some TODOs for anyone wanting to trace the SEP on Asahi Linux

fair warning: this page is messy and will likely remain so, until enough understanding is built up to build a clean page.

Notes for anyone tracing for Asahi:

Since you don't control the SEP firmware that gets loaded, the parts that matter for Linux itself is really just the communication protocol between AP and SEP, similarly to other ASCs. For understanding the xART/Gigalocker creation and provisioning flow, creating a new user should provision new encryption keys for them which very likely would involve adding entries to the Gigalockers. Also goes without saying but the tracing should be done on the same macOS version as will be the firmware for Asahi Linux installs. (13.5 as of 11/13/2024) - Not fully true, SEP firmware is determined by the highest version macos to be ever installed on the device, but the protocol is backwards compatible.

TODOs for tracing:
- Massively reduce the message spam from the tracer over the Python console, it *greatly* slows down the system, and has led to panics on occasion as the message spam leads to things timing out.
- currently the tracer seems to assume Monterey or Big Sur SEP firmware, update it for Ventura and newer.
- Perhaps only trace SEP messages from individual SEP applets based on endpoint indices, and use separate Python scripts to trace the SKS flow or the SSE flow?
- build a table of message types and data sent in for all endpoints (in XNU logs, a lot of the messages seem to have parts of the true SEP message masked out)

Miscellaneous questions:

- when the debug endpoint is notifying the AP that an endpoint has come to life, the "DATA" field has a value of 0x2020202, 0x1010101, 0x0, or 0x2020404 - this is ool buffer sizes in pages, input and output. Not sure why they are doubled though.
- one part of the SEP shared mem buffer at the very beginning during endpoint setup changes the lower byte of the first 32-bit word from 02 to 1f. why would that be? is that a configuration bit? is that done by macOS or the SEP OS?

Coprocessor information:

As with other ASC coprocessors like DCP, this is an ASC coprocessor and thus communicates with the main AP through a similar mailbox interface and occasional shared buffers (in AppleSEPManager, they call these "OOL" buffers, supposedly out of line buffers). Unlike the other processors which run RTKit or a derivative of, SEP seems to run a custom OS Apple internally calls SEPOS. Additionally SEPOS itself seems to be broken up into many different applications that all run on the SEP itself.

SEP seems to authenticate its own firmware (evidenced by kernel strings saying that SEP has "accepted" the IMG4), and seemingly will panic upon failure to authenticate the firmware. SEP firmware is encrypted by a separate GID from the normal AP GID, so a bootchain vuln in iBoot won't give you any ability to decrypt SEP firmware or load arbitrary SEP firmware unless you also manage to compromise SEP itself.

Compared to the other ASC coprocessors, SEP is the only one that seems to have dedicated storage (at minimum for any sensitive information like wrapped keys and such) that no other processor on the device can talk to.

T8112 ASC SEP mailbox base: 0x25E400000 (actual mailbox at +0x8000, like other ASC IOPs)

Endpoint information:

| Endpoint index | Endpoint name | Purpose |
| -------------- | ------------- | ------- |
| 0x00 | Control/CNTL | seems to control some endpoint properties |
| 0x08 | Secure Biometrics (SBIO) | biometric authentication |
| 0x0a | SCRD | likely "Secure/SEP credential manager" used for user credential auth? |
| 0x0c | sse  | Somehow related to NFC, may be related to Apple Pay. |
| 0x0e | HDCP | likely HDCP content protection |
| 0x10 | xars (according to tracer) | xART setup? involved in startup/shutdown |
| 0x12 | Secure/SEP Key Store | SEP encrypt/decrypt operations and key management |
| 0x13 | xART manager | manages xARTs, gigalockers and keybags (needed for SKS to start) |
| 0x14 | hibe (according to tracer) | hibernation related | 
| 0x15 | pnon (tracer name) | Boot policy related. We will eventually need it for Machine owner credentials handoff, but can be ignored for now |
| 0x17 | skdl | CoreKDL. KDL stands for kext deny list, relevant for FairPlay, maybe relevant for HDCP and Apple Pay. |
| 0x18 | stac | linked to the AppleTrustedAccessory extension, probably "Secure/SEP Trusted Accessory Connection" | 
| 0xFD | Debug(?) | More of a discovery endpoint, returns the endpoint list and OOL buffer sizes |
| 0xFE | Boot254 | Signals SEP to boot into SEPOS with an IMG4 that will be set up in its protected memory region. |
| 0xFF | Boot255 | Signals to SEP that the protected region of memory set up for it is ready for its own use |



Gigalocker/xART format (thanks sven for this info!):
| Section start-section end | Description |
| ------------------------- | ----------- |
| 0x00-0x01 | Always 0 (perhaps some kind of version identifier?) |
| 0x01-0x12 | UUID/key (a key identifier for SKS?) |
| 0x12-0x16 | length of key |
| 0x16-0x1a | CRC of wrapped key |
| 0x1a-0x22 | unknown purpose |
| 0x22-end of payload | payload/wrapped keybag data |



SEP Message format:

bits 0-7 - Endpoint number

bits 8-15 - a "tag" value (for the control endpoint, an inbound and outbound message may sometimes share tags, not used much in the SEP bootrom)

bits 16-24 - message "type" (what you want the receiving end to act on, this field is how you communicate your desired action to the SEP)

bits 25-31 - message parameters (debug endpoint, this is always the endpoint the debug endpoint is responding/receiving info about, SEP bootrom doesn't use this much)

bits 32-63 - some kind of data (can be either a pointer, or a configuration value, but this is almost always required to be set for actions that change system state)

the mailbox is capable of sending stuff in bits 127-63 but currently those bits go unused, SEP bootrom totally ignores them, and AppleSEPManager doesn't do it either.


SEP boot flow:
- iBoot preloads SEP firmware into a memory region that's recorded in ADT.
- XNU sends a boottz0 message, bringing SEP into second stage boot (a portion of RAM is reserved for this)
- XNU sends img4, SEP verifies integrity, if accepted, boots into SEP/OS (sending a malformed or invalid IMG4 is a panic on SEP side, making it unusuable for the rest of that boot until the device resets)
- Endpoint setup (including xART/Gigalocker configuration, SKS setup including FileVault keys, etc.)


xART init flow (incomplete atm, may be wrong):


(message type 0 is some sort of fetch request, message type 0x5 is a fetch response it seems for individual lockers)
(tags seem to be increasing in the order of the lockers within the gigalocker)

```c:
//Gigalocker initialization (TODO: verify if later OS versions use the same format)


[cpu1] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000010000000213 (EP=0x13, TAG=0x2, TYPE=0x0, PARAM=0x0, DATA=0x100)


[cpu14] [SEPTracer@/arm-io/sep] [xarm] <0x13(None) 0000000000130113 (EP=0x13, TAG=0x1, TYPE=0x13, PARAM=0x0, DATA=0x0)


//SEP xART fetch from gigalocker (this xART itself seems to have many sublockers?)


[cpu0] [SEPTracer@/arm-io/sep] [xarm] >0x0(None) 0000000000000113 (EP=0x13, TAG=0x1, TYPE=0x0, PARAM=0x0, DATA=0x0)


[cpu10] [SEPTracer@/arm-io/sep] [xarm] <0x0(None) 0000010000000313 (EP=0x13, TAG=0x3, TYPE=0x0, PARAM=0x0, DATA=0x100)
```



SEP Trusted Accessory notes:

```c:

//ping
[cpu0] [SEPTracer@/arm-io/sep] [stac] >0xf(None) 00000000000ffc18 (EP=0x18, TAG=0xfc, TYPE=0xf, PARAM=0x0, DATA=0x0)

//pong
[cpu0] [SEPTracer@/arm-io/sep] [stac] <0xf(None) 00000000000ffc18 (EP=0x18, TAG=0xfc, TYPE=0xf, PARAM=0x0, DATA=0x0)
```

AppleTrustedAccessory talks to this endpoint, likely for the Touch ID sensor on external keyboards.


SEP backwards compatibility notes:

SKS IPC is negotiated on both the kernel side and SEP side, lowest compatible version between both will be the IPC used for communication between main processor and SEP.

This should ensure that SEP and OS can continue to be compatible with each other even if SEP gets upgraded (since it'll just use the older IPC version). (potential question: in the Linux driver how should this be accounted for?)


Miscellaneous notes:

The control endpoint seems to reply to incoming requests with a message type of 0x1 and input parameters if something was successful (likely an ack/okay from SEP side if all is good) (at least for messages that set input/output length or pointers)

SKS is *very* spammy in normal mode as mailbox messages to/from sep with it as the endpoint are constantly being sent (this is likely because of how Data Protection works according to the Apple security guide, a lot of these likely are retrieving/updating keys from/to gigalocker)

Single-user mode is helpful when doing tracing, as SKS will not be nearly as spammy and we can capture the initialization sequence.


xART fetch notes:

during the locker fetch sequence, a large number of the messages have 0x100 as the "data" part. responses from the SEP with respect to a locker fetch/unwrap request will always have parameter 0x10. A response with type 0x5 is success, 0x7 is an error (at minimum it's the error signaling that a user xART locker couldn't be found)
