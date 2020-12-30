## Introduction

Apple uses custom USB-PD messages to control pin muxing on their Type-C ports for debug and other purposes. USB-PD communication takes place over the CCx line of the port (CC1 or CC2 depending on port orientation)

Thanks to the t8012dev folks for providing info. See https://blog.t8012.dev/ace-part-1/ for reference. The controller on Apple M1 Macs (2020) is the CD3217 "Ace2".

You should reference the [USB-PD spec](https://www.usb.org/document-library/usb-power-delivery) for background information.

Apple uses unstructured VDM messages with their USB ID (0x5AC), but they require messages to use the SOP'DEBUG packet start token (which is unused in the standard, and some controllers may not be able to do). The VDM header is of the form 0x5ac8000 | (command).

The following commands are in hex-encoded comma-separated format for easy pasting into [vdmtool](https://github.com/AsahiLinux/vdmtool)'s serial console. The protocol makes heavy use of 16-bit data units, packed high to low in the 32-bit VDM words, and zero terminated.

Command replies use the request command ID | 0x40. The reply to command 0x10 is command 0x50, etc.

## Ports

Each port on a Mac may have different VDM support. Debug stuff is usually only supported on one port

### 2020 Mac Mini (M1)

The leftmost port (closest to the power input) has all the debug stuff.

## Commands

### 0x10 Get Action List

```5ac8010```

Each "action" is either a thing to do or a signal to mux.

Sample response from M1 Mac Mini (2020) left side port:

```
5ac8010
>VDM 5AC8010
<VDM RX SOP'DEBUG (7) [704F] 5AC8050 46060606 2060301 3060106 1050303 8030809 1030000
                             ^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                             vdm hdr action list
```

This indicates support for actions 0x4606, 0x301, 0x306, 0x106, 0x105, 0x303, 0x803, 0x809, 0x103.

### 0x11 Get action Info

```5ac8011,<actionid>```

This returns information on a specific action, in 16-bit short units (zero terminated).

For the M1 Mac Mini the following information is returned for each action:

```
Action  Info reply
4606    0183
0606    0183
0206    0187 020C 0318 8001
0301    0187 020C 0303
0306    0187 020C 800C
0106    8001
0105    8000
0303    0187 0221 0303 809E 0030 6030 000C
0803    0187 0221 8001
0809    0187 0221 8001
0103    8000
```

### 0x12: Perform Action

```5ac8011,<actionid>[,args]```

Performs or maps a given action to a set of pins.

`actionid` contains the action ID in the lower 16 bits, and fields as follows:

```
Bits  Description
25    If 1 exits the mode, instead of entering it
24    Persist through soft reset. This doesn't seem to work on M1 Macs (the PD controller reboots when the system reboots).
23    If 1 attempts to exit conflicting modes before entering this one
22-16 Bit mask of lines to map to this action
15-0  Action ID
```

Sample response:

```
5ac8012,40306
>VDM 5AC8012 40306
<VDM RX SOP'DEBUG (5) [504F] 5AC8052 44740000 306 0 0
                             ^^^^^^^ ^^^^\------------ pin states
                             vdm hdr connection/line state 
```

* Conection/line state: A 16-bit header short (`(ConnectionState << 14) | (LineState[i] << (2 * i))` for i between 0 and 7, exclusive) followed by 7 shorts indicating which action is muxed out of each pin set. ConnectionState can be 0 for disconnected, 1 or 2 for a standard connected device depending on the orientation and 3 for audio and debug connections. LineState is a 2 bit value, which significance is not well known at the moment.
* Pin states: one action ID per pin pair, in 16-bit shorts.

In this case action 306 is mapped to pin set 2 (the third pin set).

## Pin sets

From 2020 Mac Mini (M1):

* 0: Top-side D+/D- (USB2 data pair)
* 1: Bottom-side D+/D- (USB2 data pair). These are not bridged host-side and can bring out different signals, which is a feature unique to debug ports. Cables only have one pair!
* 2: SBU1/SBU2
* 3-6: unknown (SSTX/SSRX pairs?)

## Actions

### 105: Reboot

This needs a 0x8000 argument (taken from the get action info reply).

```
5AC8012,0105,80000000
>VDM 5AC8012 105 80000000
<VDM RX SOP'DEBUG (5) [524F] 5AC8052 44740000 306 0 0
IRQ: VBUSOK (VBUS=OFF)
State: DISCONNECTED
(device reboots)
```

### 306: Debug UART

This can be mapped to pin sets 0-2 (D+/D- top, bottom, or SBU1/2). The UART uses 1.2V voltage levels.

```
5AC8012,840306
>VDM 5AC8012 840306
<VDM RX SOP'DEBUG (5) [584F] 5AC8052 44740000 306 0 0
(UART is now mapped to SBU1/2)
```

SBU1 is TX and SBU2 is RX, orientation-aware (for CC=CC2 they are flipped). In other words, the SBU pin on the same side of the connector (A or B) as your CC pin is TX.
