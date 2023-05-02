Long story short, Mac keyboard layouts on Linux are a complete mess. We want to fix it. Please help us figure out what is wrong for *your* layout!

Note: This is only for MacBook internal keyboards and also possibly external Apple keyboards. Please do not report issues with third-party keyboards.

# How to help

Before getting started, [identify](https://support.apple.com/en-us/HT201794) your keyboard layout according to Apple's official documentation. We need to know two things:

* The keyboard type (ANSI, ISO, or Japanese)
* The specific country layout

Next, make sure you have your keyboard model correctly selected. In your keyboard settings (KDE: System Settings → Input Devices → Keyboard → Hardware), you should select the correct keyboard model:

* For ANSI layouts: **Apple | Apple Aluminium (ANSI)**
* For ISO layouts: **Apple | Apple Aluminium (ISO)**
* For Japanese (JIS) layouts: **Apple | Apple Aluminium (JIS)**

Finally, choose the layout that looks right for your language. This *should* be just the plain language type, since Mac-specific customizations should be applied based on the keyboard model. However, please do try multiple options (e.g. some languages may have a *Macintosh* variant, though this may make things worse).

Then add a report using the template below (edit the wiki page and copy the template section). If your layout is already listed but you have a different experience (e.g. on another machine), add a new *System configuration* subsection and note any differences you see in it.

Please add as much detail as you can about what works, what is different from what's printed on the keycaps, any language- or region-specific quirks or issues we need to be aware of, anything special that macOS does, hidden combinations that are *not* printed on the keycaps that should work, how this might differ from your experience on Windows and generic Linux desktops on non-Apple keyboards, etc. We need as much information as possible in order to do the right thing in the future.

Note that this is *not* about the differences between macOS and Linux regarding shortcut keys (e.g. Option vs. Ctrl). That is expected: we can't (correctly) make the Linux desktop emulate macOS via keyboard layout changes. We're interested in regional keyboard layout issues, not general differences between macOS and Linux.

Known issue: on M2 MacBook Air machines, currently the default behavior of the `iso_layout` quirk of the `hid_apple` driver may be different from what it is on other machines, which can swap the keys right of shift and left of "1". However, neither of the options is appropriate for all layouts, so this may be a good thing or a bad thing for your particular layout (this is one thing we want to fix). Just be aware of the existing machine-dependent inconsistency. This will be fixed in the next stable kernel release to at least be consistent across machines.

# Reports

## (ANSI|ISO|JIS) - (layout) - (machine)
* Best XKB keyboard layout/variant: (Your layout)

(Your notes here)

### System configuration
```
Output of running: (cd /sys/module/hid_apple/parameters/; grep . *; pacman -Q xkeyboard-config-asahi; uname -r; cat /proc/device-tree/model; echo; find /sys/devices -name country | xargs cat; dmesg | grep "Keyboard type")
```

## JIS - Japanese
* Best XKB keyboard layout/variant: `Japanese/Japanese`

The correct layout type is simply *Japanese* (default variant). Do **not** choose *Japanese (Macintosh)*: this is a useless kana layout that will make typing in your password impossible.

All keys are mapped correctly as printed on the keycaps.

If you use an IME (fcitx5 + mozc recommended), the IME key mappings will probably not be what you expect by default. You'll probably want to go into your IME settings and map 「英数」(*Eisu toggle*) to *Deactivate Input Method* and 「かな」(*Hiragana Katakana*) to *Activate Input Method*.

Japanese Mac keyboards have no *\\* (backslash) key. You have two options under *Advanced* → *Configure keyboard options* → *Compatibility options*:

* *Japanese Apple Keyboards emulate OADG109A backslash*: Puts the backslash on the unshifted "_" key, like common PC OADG109A layouts.
* *Japanese Apple Keyboards emulate PC106 backslash*: Turns the '¥' key into backslash. \*

\* In theory, but this option seems like it might be broken right now. That's the intended behavior anyway...

### System configuration
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-6-1-edge-ARCH
Apple MacBook Pro (14-inch, M1 Pro, 2021)
0f
00
```

## ANSI - Korean - M2 MBA
* Best XKB keyboard layout/variant: `Korean`

### System configuration
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-11-1-edge-ARCH
Apple MacBook Air (13-inch, M2, 2022)
21
00
00
```
## ISO - Swiss - M1 Pro MBP
* Best XKB keyboard layout/variant: "German (Switzerland)"

There's also "German (Switzerland, Macintosh)", but it fails to preview. Since I didn't find any issues with the above, I don't know the benefits of the Macintosh variant.

Note that in Switzerland, there are four national languages: German, French, Italian and Rumantsch. German and French have their own XKB keyboard layout variants ("French (Switzerland)") but identical physical layouts. The above applies to the German variant, I don't know much about the French variant.

### System configuration
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-rc3-asahi-7-1-edge-ARCH
Apple MacBook Pro (14-inch, M1 Pro, 2021)
00
00
0d
00
```

## ISO - Italian - MBP 16-inch M1 Pro
* Best XKB keyboard layout/variant: **Italian**

I'm on Gnome, an Italian (Machinintosh) is present, but is completely wrong, use a strange qzerty layout.
With Italian layout I don't have alt gr function, it seems that the right command is acting as left alt, so I can't type @, #, €, ecc 

```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-11-1-edge-ARCH
Apple MacBook Pro (16-inch, M1 Pro, 2021)
0d
00
```

## ISO - French - M1 Pro MBP
* Best XKB keyboard layout/variant: **Apple | Apple Aluminium (ISO)** with no variant

Selecting a variant will give a wrong mapping.

This test was done using KDE, Wayland, xkeyboard-config-asahi, on Apple MacBook Pro (14-inch, M1 Pro, 2021)

## ISO - Greek - M1 Max MBP
* Best XKB keyboard layout/variant: **US** and **Greek**

The §± key functions as `~ (in both layouts)

The `~ key functions as «» (in both layouts)

```
fmode:3
iso_layout:-1
swap_fn_leftctrl:0
xkeyboard-config-asahi 2.35.1_3-1
6.1.0-asahi-2-2-edge-ARCH
Apple Macbook Pro (14-inch, M1 Max, 2021)
0d
00
```

## ISO - Turkish Q - M2 MBP
* Best XKB keyboard layout/variant: Turkish or tr

The keyboard mostly works like it should on a non-Mac keyboard. Combinations that require Alt Gr (right Alt) only work with right Option, which is not how it works on macOS but it's the way it works normally. One caveat is that `Alt Gr + A` outputs â, when it normally should output æ.

### System configuration
```
fnmode:3  
iso_layout:-1  
swap_ctrl_cmd:0  
swap_fn_leftctrl:0  
swap_opt_cmd:0  
xkeyboard-config-asahi 2.35.1_3-1  
6.2.0-asahi-11-1-edge-ARCH  
Apple MacBook Pro (13-inch, M2, 2022)  
00  
00  
0d
```
## ANSI US - Polish - M1 Max MBP 2021

* Best XKB keyboard layout/variant: pl

Keyboard model on startup defaulted to Generic.

Letters with diacritics (ąćęłóćżź) work with the right option key: correct  
Special characters (digits + shift): correct  
Special characters right to letters: correct  
backtick / tilde left to digits: correct  

### System configuration
```
fnmode:3
iso_layout:-1
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.1.0-rc6-asahi-4-1-ARCH
Apple MacBook Pro (16-inch, M1 Max, 2021)
21
00
```

## ANSI US - with mainland Chinese punctuations - physically remapped to dvorak - M1 Pro MBP 2021

* Best XKB keyboard layout/variant: zh-tw(Zhuyin/Chewing), en-us, ee, fi, dvorak variant for languages that using latin alphabets.

System layout as English(Macintosh), when trying to select layout to English(Dvorak, Macinstoh), it automatically fallbacks to English(Macintosh), fcitx5

English(US) - Englsh(Dvorak, Macintosh): behaves normally.

Chewing(Chinese Taiwan): Select layout as dvorak, no problem, punctuation are also mapped to corresponding dvorak positions.

Estonian(Dvorak): äõöü with right opt + aoeu, normal ANSI dvorak punctuation.

Finnish(Dvorak): öÖ = ;: on ANSI, å = opt + o, can't type ä without using dead key. opt + ; = ¨ super weird.

### System configuration
```
fnmode:3
iso_layout:-1
swap_ctrl_cmd:0
swap_fn_leftctrl:0
swap_opt_cmd:0
xkeyboard-config-asahi 2.35.1_3-1
6.2.0-asahi-11-1-edge-ARCH
Apple MacBook Pro (14-inch, M1 Pro, 2021)
00
21
00
```
