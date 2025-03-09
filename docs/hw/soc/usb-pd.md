---
title: USB-PD
---

## Introduction

Apple uses custom USB-PD messages to control pin muxing on their Type-C ports for debug and other purposes. USB-PD communication takes place over the CCx line of the port (CC1 or CC2 depending on port orientation)

Thanks to the t8012dev folks for providing info. See https://web.archive.org/web/20211023034503/https://blog.t8012.dev/ace-part-1/ for reference. The controller on Apple M1 Macs (2020) is the CD3217 "Ace2".

You should reference the [USB-PD spec](https://www.usb.org/document-library/usb-power-delivery) for background information.

Apple uses vendor-specific structured VDM(Vendor Define Message) messages with their USB ID (0x5AC), but they require messages to use the SOP'DEBUG (if originating from the UFP) or SOP''DEBUG (if originating from the DFP) packet start tokens (which are unused in the standard, and some controllers may not be able to send them). The VDM header is of the form 0x5ac8000 | (command).

It is recommended to run this protocol acting as a DFP (i.e. a power source), because the Macs will only act as a DFP themselves after the OS has been booted.

The following commands are in hex-encoded comma-separated format for easy pasting into [vdmtool](https://github.com/AsahiLinux/vdmtool)'s serial console. The protocol makes heavy use of 16-bit data units, packed high to low in the 32-bit VDM words, and zero terminated.

Command replies use the request command ID | 0x40. The reply to command 0x10 is command 0x50, etc.

## Chips

* CD3215C00 "ACE1" - this seems to be a TPS65983 with different ROM/OTP code.
* CD3217B12 "ACE2" - this is probably actual new silicon with some differences, though this is uncertain. Might be equivalent to another TI part. The initial M1 devices all use this part. Firmware organization is somewhat different.

## Ports

Each port on a Mac may have different VDM support. Debug stuff is usually only supported on one port

### 2020 MacBook Air (M1)

The port closest to the edge has all debug stuff.

### 2020 Mac Mini (M1)

The leftmost port (closest to the power input) has all the debug stuff.

### 2019 16" MacBook Pro (MacBookPro16,1 - Titan Ridge)

The front and rear left ports each report 7 actions.  The rear right port reports 4 actions.  The front right port reports 3 actions.

### 2019 13" MacBook Pro (MacBookPro15,2 - Titan Ridge)

The front left port reports 8 actions.  The rear left port reports 5 actions.  The rear right port reports 4 actions.  The front right port reports 3 actions.

### 2017 13" MacBook Pro (MacBookPro14,2 - Alpine Ridge)

The rear left port reports 4 actions.  The front left and front right ports each report 3 actions.  The rear right port reports 2 actions.

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

This indicates support for actions 0x4606, 0x606, 0x206, 0x301, 0x306, 0x106, 0x105, 0x303, 0x803, 0x809, 0x103.

The MacBookPro16,1 supports actions 0x602, 0x606, 0x601, 0x403, 0x302, 0x501 and 0x301 on the front left port, actions 0x205, 0x206, 0x103, 0x602, 0x302, 0x501 and 0x301 on the rear left port, actions 0xE04, 0x501, 0x301 and 0x302 on the rear right port and actions 0x302, 0x501 and 0x301 on the front right port.

The MacBookPro15,2 supports actions 0x207, 0x205, 0x602, 0x606, 0x501, 0x601, 0x301 and 0x302 on the front left port, actions 0x403, 0x602, 0x302, 0x501 and 0x301 on the rear left port, actions 0x501, 0x103, 0x301 and 0x302 on the rear right port and actions 0x302, 0x501 and 0x301 on the front right port.

The MacBookPro14,2 supports actions 0x403, 0x602, 0x301 and 0x302 on the rear left port, actions 0x302, 0x205 and 0x301 on the front left port, actions 0x302, 0x802 and 0x301 on the front right port and actions 0x301 and 0x302 on the rear right port.

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

```5ac8012,<actionid>[,args]```

Performs or maps a given action to a set of pins.

`actionid` contains the action ID in the lower 16 bits, and fields as follows:

```
Bits  Description
25    If 1 exits the mode, instead of entering it
24    Persist through soft reset. Seems to do something in DFP mode.
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

* Connection/line state: A 16-bit header short (`(ConnectionState << 14) | (LineState[i] << (2 * i))` for i between 0 and 7, exclusive) followed by 7 shorts indicating which action is muxed out of each pin set. ConnectionState can be 0 for disconnected, 1 or 2 for a standard connected device depending on the orientation and 3 for audio and debug connections. LineState is a 2 bit value, which significance is not well known at the moment.
* Pin states: one action ID per pin pair, in 16-bit shorts.

In this case action 306 is mapped to pin set 2 (the third pin set).

## Pin sets

From 2020 Mac Mini (M1):

* 0: Secondary D+,D- (USB2 data pair on VCONN side of connector)
* 1: Primary D+,D- (USB2 data pair on CC side of connector). These are not bridged host-side and can bring out different signals, which is a feature unique to debug ports. Cables only have one pair on the CC side!
* 2: SBU1,SBU2
* 3-6: unknown (SSTX/SSRX pairs?)

The pins are automatically adjusted for connector orientation at the Mac side, so the pins will always be the same from the cable side. The device on the other end is responsible for adjusting for orientation on that end.

## Actions

### 103: PD reset

This needs a 0x8000 argument (taken from the get action info reply).

```
5AC8012,0103,80000000
>VDM(D) 5AC8012 103 80000000
Disconnect: cc1=0 cc2=0
VBUS OFF
Disconnected
(PD renegotiation occurs)
```

### 105: Reboot

This needs a 0x8000 argument (taken from the get action info reply).

```
5AC8012,0105,80000000
>VDM(D) 5AC8012 105 80000000
<VDM RX SOP"DEBUG (5) [524F] 5AC8052 44740000 306 0 0
Disconnect: cc1=0 cc2=0
VBUS OFF
Disconnected
S: DISCONNECTED
IRQ: VBUSOK (VBUS=OFF)
(device reboots and PD renegotiates)
```
#### about reboot command
the command "5AC8012,0105,80000000" is sent through the Serial Monitor of Arduino IDE. if you want to reboot Mac more conveniently,
you can try the following commands:
```
Option 1:
echo "5AC8012,0105,80000000" | picocom -c -b 500000 --imap lfcrlf -qrx 1000 /dev/<your Arduino Serial device>

Option 2:
stty 500000 </dev/<your Arduino Serial device> 
echo > /dev/<your Arduino Serial device> 
echo 5AC8012,0105,80000000 > /dev/<your Arduino Serial device> 
```
However due to the [default Arduino operations on Serial port](https://forum.arduino.cc/t/solved-problem-with-serial-communication-on-leonardo/139614), the above cmds probably will fail, and succeed randomly.
It turns out that the following python code works fine by manually reseting Arduino before sending cmd data:
```
import serial
import time
ser = serial.Serial("/dev/<your Arduino Serial device>", 500000, dsrdtr=True)
ser.dtr = True
ser.dtr = False
time.sleep(0.5)
ser.dtr = True
time.sleep(2)
ser.write(b'5AC8012,0105,80000000\n')
ser.close() 
```

### 106: DFU / hold mode

This needs a 0x8001 argument (taken from the get action info reply). It only works properly in DFP mode (Mac acting as UFP).

```
5AC8012,0106,80010000
>VDM(D) 5AC8012 106 80010000
<VDM RX SOP"DEBUG (5) [544F] 5AC8052 44740000 306 0 0
(device reboots in DFU mode, no PD renegotiation occurs)
```

This mode is special. On the Mac Mini, a hard shutdown normally disables PD communications and UFP mode (Rd open). However, a hard shutdown from this mode (e.g. holding down the power button) will power down the machine while PD communications remain active. The machine can also be rebooted via 105 into normal mode, and again PD is not reset and existing modes remain active. This can be used to maintain debug connectivity through a machine reset.

FIXME: or maybe it's just the persist bit in the header. Needs more tests.

### 306: Debug UART

Pin order: TX, RX

This can be mapped to pin sets 0-2 (D+/D- B, D+/D- A, or SBU1/2). The UART uses 1.2V voltage levels.

```
5AC8012,840306
>VDM 5AC8012 840306
<VDM RX SOP'DEBUG (5) [584F] 5AC8052 44740000 306 0 0
(UART is now mapped to SBU1/2)
```

pin 1 is TX and pin 2 is RX, orientation-aware (for CC=CC2 they are flipped). In other words, the SBU pin on the same side of the connector (A or B) as your CC pin is TX.

### 606: DFU USB

Pin order: D+, D- (of course)

This is automatically mapped to pin set 1 (D+/D- primary) in DFU mode, but can be moved.

To move DFU to the other D+/D- set:
```
5AC8012,2020606
>VDM(D) 5AC8012 2020606
<VDM RX SOP"DEBUG (5) [5E4F] 5AC8052 44400000 0 0 0
5AC8012,810606
>VDM(D) 5AC8012 810606
<VDM RX SOP"DEBUG (5) [504F] 5AC8052 44430606 0 0 0
(DFU is now on secondary D+/D- pair (pin set 0))
```

### 4606: Debug USB

Interesting. This is not main-CPU-driven, it enumerates even when the system is off (in persistent mode). It re-enumerates on power transitions.

```
[277048.498917] usb 1-4.4.3: New USB device found, idVendor=05ac, idProduct=1881, bcdDevice= 1.20
[277048.498920] usb 1-4.4.3: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[277048.498921] usb 1-4.4.3: Product: Debug USB
[277048.498921] usb 1-4.4.3: Manufacturer: Apple Inc.
```

<details>
<summary>lsusb</summary>

```
Bus 001 Device 097: ID 05ac:1881 Apple, Inc. Debug USB
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass          255 Vendor Specific Class
  bDeviceSubClass       255 Vendor Specific Subclass
  bDeviceProtocol       255 Vendor Specific Protocol
  bMaxPacketSize0        64
  idVendor           0x05ac Apple, Inc.
  idProduct          0x1881 
  bcdDevice            1.20
  iManufacturer           1 Apple Inc.
  iProduct                2 Debug USB
  iSerial                 0 
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength       0x0027
    bNumInterfaces          1
    bConfigurationValue     1
    iConfiguration          0 
    bmAttributes         0xc0
      Self Powered
    MaxPower              100mA
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           3
      bInterfaceClass       255 Vendor Specific Class
      bInterfaceSubClass    255 Vendor Specific Subclass
      bInterfaceProtocol    255 Vendor Specific Protocol
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x01  EP 1 OUT
        bmAttributes            2
          Transfer Type            Bulk
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0200  1x 512 bytes
        bInterval               4
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes            2
          Transfer Type            Bulk
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0200  1x 512 bytes
        bInterval               4
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x82  EP 2 IN
        bmAttributes            2
          Transfer Type            Bulk
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0200  1x 512 bytes
        bInterval               4
Device Qualifier (for other device speed):
  bLength                10
  bDescriptorType         6
  bcdUSB               2.00
  bDeviceClass          255 Vendor Specific Class
  bDeviceSubClass       255 Vendor Specific Subclass
  bDeviceProtocol       255 Vendor Specific Protocol
  bMaxPacketSize0        64
  bNumConfigurations      1
can't get debug descriptor: Resource temporarily unavailable
Device Status:     0x0001
  Self Powered
```
</details>

### 0803: An I²C bus (3.3V)

Pin order: SCL, SDA

Device addresses seen (unshifted): 0x38, 0x3f

It doesn't do anything interesting during normal boot, but does in macOS.

Also, sometimes it just sends START 00 STOP (no ACK cycle) at slower speed (?)

### 0809: Another I²C bus (3.3V)

Pin order: SCL, SDA

Device addresses seen (unshifted): 0x6b, 0x38, 0x3f, 

### TBD

* 0206    weak (30kΩ) pull to 1.2V, no reaction to gnd, no transitions. Good chance this is SWD.
* 0301    1.2V, one pin drives high, the other no drive. Another UART? high-z in DFU mode, no activity except high pin tracking power/boots.
* 0303    Only maps to pinsets 1-2? Seems to be GND? No transitions seen. Unused UART mode?
