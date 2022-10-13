For now, just some random data gathered from initial tracing of the SEP, should be updated as i start digging deeper

Endpoint numbers:
0x12 - SKS (SEP Key Store/Secure Key Store)
0xFF - Boot255 - seems to be used to signal to SEP of some shared memory region?
0xFE - Boot254 - related to IMG4 auth

unknown:
endpoint for biometric auth/SBIO

Notes:

SKS is *very* spammy as mailbox messages to/from sep are constantly being sent