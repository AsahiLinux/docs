For now, just some random notes gathered from initial tracing of the SEP and prior knowledge from other community members, should be updated as i start digging deeper

Endpoint information:

| Endpoint index | Endpoint name | Purpose |
| -------------- | ------------- | ------- |
| 0x00 | Control/CNTL | unknown, possibly allows for some very minor control over SEP? |
| 0x12 | Secure/SEP Key Store | SEP encrypt/decrypt operations and key management |
| 0xFE | Boot254 | Used in sending the IMG4 SEP OS image into SEP memory |
| 0xFF | Boot255 | Signals to SEP via the BootTZ0 message to proceed booting |
| ???? (haven't noted the number yet) | Secure biometrics/SBIO | An endpoint for biometric authentication |
| ???? | xarm (according to tracer) | unknown |

Gigalocker/xART format (thanks sven for this info!)

0x00-0x01 - Always 0 (perhaps some kind of version identifier?)
0x01-0x12 - UUID/key (identifies SEP request, possibly handled by SKS?)
0x12-0x16 - length
0x16-0x1a - CRC of data (CRC32, ISO-HDLC)
0x1a-0x22 - unknown
0x22-end of payload - payload data (max of 0x8000)

Basically a key/value store updated by SEP (where keybag data is stored)

Miscellaneous notes:

SKS is *very* spammy as mailbox messages to/from sep with it as the endpoint are constantly being sent (this is likely because of how Data Protection works according to the Apple security guide, a lot of these likely are retrieving/updating keys from/to gigalocker)