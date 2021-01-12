This seems to be a built-in debugging USB interface.

Commands via EP 0x01, replies via 0x81, 0x82 unknown

RE notes trying to send it random stuff:

```
First 3 bytes are ignored? Fourth byte matters.
First 5 bytes are echoed at the beginning of replies
Replies seem to follow a uniform format

> 00000000 000c8000 00000000 00000000
             OOLLLL

Reads LL bytes (rounded to dword) starting from dword register OO.

Returns:
00000000 00000000 <u32:payload len> <data words>* <u32:data size> <u32:status=4?>

> 00000000 02000000 00000000 00000000 00000000 00

Returns:
    00000000 02000000 08458400

And then keeps flooding [a0030000] repeated forever

Seems to be an insane length. Bug?
```