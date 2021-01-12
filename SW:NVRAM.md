# Types

* `string`: A standard string.
* `bin-string`: A URL-encoded string containing binary data.
* `bool`: A string with value of either `true` or `false`.
* `int`: A decimal integer.
* `bin-int(n)`: A `bin-string`-encoded integer, little-endian, `n` bytes.
* `hex-int`: A hexadecimal integer.
* `plist`: A `bin-string` encoded binary property list.
* `volume`: A string of format `<gpt-partition-type-uuid>:<gpt-partition-uuid>:<volume-group-uuid>`. The GPT partition UUID seems to be a bit weird, with its first three components byteswapped.

# Values

## Boot

* `auto-boot`: `{true,false}`: Whether to automatically boot. Setting this to `false` on at least the Mac M1 mini causes a boot failure;
* `boot-args`: `string`: Boot arguments to pass to the kernel. Possibly filtered by the boot policy.
* `boot-info-payload`: `bin-string`: Some kind of opaque, high-entropy payload.
* `boot-note`: `bin-string`: Unknown. Example: `%00%00%00%00%00%00%00%bb%0ez%e5%00%00%00%00%a0q%d4%07%08%00%00%00`
* `boot-volume`: `volume`: Default boot volume.
* `update-volume`: `volume`
* `upgrade-boot-volume`: `volume`

## Firmware

* `ota-controllerVersion`: `string`: Over-the-air update controller identifier. Examples: `SUMacController-1.10` (Mac Mini M1), `SUS-1.0` (iPhone, iPad).
* `ota-updateType`: `string`: Type of over-the-air updates to apply. Example: `incremental`.
* `usbcfwflasherResult`: `string`: Example: `No errors`.

## Settings

* `backlight-nits`: `hex-int`: Presumably the screen backlight strength. Mac Mini M1 example: `0x008c0000`.
* `current-network`: `bin-string`: Last Wi-Fi networks to have connected to.
* `fmm-computer-name`: `string`: Computer name.
* `good-samaritan-message`: `string`: Message to show on the boot/password screen in case the device is lost and found.
* `preferred-networks`: `bin-string`: List of stored Wi-Fi networks.
* `preferred-count`: `int`: Number of networks in `preferred-networks`, if not 1.
* `prev-lang:kbd`: `string`: Keyboard layout, format: `<lang>:<locale-id>`, [reference](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt). Example: `en-GB:26`.
* `prev-lang-diags:kbd`: `string`: Keyboard layout in diagnostics: Example: `en-GB`.
* `SystemAudioVolume`: `bin-int(8)`: Volume. Example: `%80` (128).
* `SystemAudioVolumeExtension`: `bin-int(16)`: Example: `%ff%7f` (32767).