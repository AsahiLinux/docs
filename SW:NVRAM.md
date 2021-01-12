# Types

* `string`: A standard string.
* `bin-string`: A URL-encoded string containing binary data.
* `boolean`: A string with value of either `true` or `false`.
* `int`: A decimal integer.
* `bin-int(n)`: A `bin-string`-encoded integer, little-endian, `n` bytes.
* `hex-int`: A hexadecimal integer.
* `volume`: A string of format `<gpt-partition-type-uuid>:<gpt-partition-uuid>:<volume-group-uuid>`. The GPT partition UUID seems to be a bit weird, with its first three components byteswapped.

# Values

## Boot

* `auto-boot`: `boolean`: Whether to automatically boot. Setting this to `false` on at least the Mac M1 mini causes a boot failure;
* `boot-args`: `string`: Boot arguments to pass to the kernel. Possibly filtered by the boot policy.
* `boot-info-payload`: `bin-string`: Some kind of opaque, high-entropy payload.
* `boot-note`: `bin-string`: Unknown. Example: `%00%00%00%00%00%00%00%bb%0ez%e5%00%00%00%00%a0q%d4%07%08%00%00%00`
* `boot-volume`: `volume`: Default boot volume.
* `upgrade-boot-volume`: `volume`

## Updates

* `IDInstallerDataV1`: `bin-string:lzvn:bin-plist`: Compressed binary plist containing information about the most recent installer action. Seems to be absent starting somewhere between macOS 10.12 and 11.0.
* `IDInstallerDataV2`: `bin-string:lzvn:bin-plist`: Compressed binary plist containing an array of information items in the same format as `IDInstallerDataV1`.
* `ota-controllerVersion`: `string`: Over-the-air update controller identifier. Examples: `SUMacController-1.10` (Mac Mini M1), `SUS-1.0` (iPhone, iPad).
* `ota-updateType`: `string`: Type of over-the-air updates to apply. Example: `incremental`.
* `usbcfwflasherResult`: `string`: Example: `No errors`.
* `update-volume`: `volume`
　　　　　　　　　
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

# Examples

## `IDInstallerDataV2`

<details>
<summary>Example with successful Big Sur 11.2 beta 1 (20D5029f) upgrade</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
	<dict>
		<key>505</key>
		<string>auth not needed</string>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>505</key>
		<string>auth not needed</string>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>0</key>
		<string>20D5029f</string>
		<key>100</key>
		<string>passed</string>
		<key>6</key>
		<string>upgrade</string>
	</dict>
	<dict>
		<key>505</key>
		<string>auth not needed</string>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>505</key>
		<string>auth not needed</string>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>505</key>
		<string>auth not needed</string>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
	<dict>
		<key>6</key>
		<string>key recovery assistant</string>
	</dict>
</array>
</plist>
```

</details>

<details>
  <summary>Example with crashed upgrade</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
	<dict>
		<key>100</key>
		<string>crashed</string>
		<key>102</key>
		<string>initializer</string>
		<key>103</key>
		<string>1</string>
		<key>7</key>
		<string>NO</string>
	</dict>
</array>
</plist>
```

</details>

<details>
  <summary>Example with successful Sierra 10.12.2 (16C67) upgrade</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
	<dict>
		<key>0</key>
		<string>16C67</string>
		<key>100</key>
		<string>passed</string>
		<key>103</key>
		<string>1</string>
		<key>202</key>
		<string>832.499040</string>
		<key>203</key>
		<string>41.700535</string>
		<key>205</key>
		<string>30.318743</string>
		<key>206</key>
		<string>0.003648</string>
		<key>207</key>
		<string>0.156793</string>
		<key>208</key>
		<string>2.215885</string>
		<key>209</key>
		<string>8.130921</string>
		<key>299</key>
		<string>0.212016</string>
		<key>3</key>
		<string>solid state</string>
		<key>4</key>
		<string>unencrypted</string>
		<key>5</key>
		<string>case sensitive</string>
		<key>6</key>
		<string>clean</string>
		<key>7</key>
		<string>NO</string>
	</dict>
	<dict>
		<key>0</key>
		<string>16C67</string>
		<key>100</key>
		<string>passed</string>
		<key>103</key>
		<string>2</string>
		<key>202</key>
		<string>802.017327</string>
		<key>203</key>
		<string>29.902674</string>
		<key>205</key>
		<string>4.379149</string>
		<key>206</key>
		<string>0.003310</string>
		<key>207</key>
		<string>0.156726</string>
		<key>208</key>
		<string>2.214545</string>
		<key>209</key>
		<string>10.050913</string>
		<key>299</key>
		<string>0.184676</string>
		<key>3</key>
		<string>solid state</string>
		<key>4</key>
		<string>unencrypted</string>
		<key>5</key>
		<string>case insensitive</string>
		<key>6</key>
		<string>clean</string>
		<key>7</key>
		<string>NO</string>
	</dict>
	<dict>
		<key>0</key>
		<string>16C67</string>
		<key>100</key>
		<string>passed</string>
		<key>103</key>
		<string>3</string>
		<key>6</key>
		<string>software update</string>
	</dict>
	<dict>
		<key>0</key>
		<string>16C67</string>
		<key>100</key>
		<string>passed</string>
		<key>103</key>
		<string>4</string>
		<key>202</key>
		<string>582.532387</string>
		<key>203</key>
		<string>11.511343</string>
		<key>205</key>
		<string>1.900536</string>
		<key>206</key>
		<string>0.005585</string>
		<key>207</key>
		<string>0.101757</string>
		<key>208</key>
		<string>2.142859</string>
		<key>209</key>
		<string>3.942741</string>
		<key>299</key>
		<string>0.122528</string>
		<key>3</key>
		<string>solid state</string>
		<key>4</key>
		<string>unencrypted</string>
		<key>5</key>
		<string>case insensitive</string>
		<key>6</key>
		<string>clean</string>
		<key>7</key>
		<string>YES</string>
	</dict>
</array>
</plist>
```

</details>