---
title: NVRAM
summary:
  Variables NVRAM utilizadas por Macs con Apple Silicon
---

# Tipos

* `string`: Una cadena estándar.
* `binary`: Una cadena codificada en URL que contiene datos binarios.
* `boolean`: Una cadena con valor `true` o `false`.
* `int`: Un entero decimal.
* `bin-int(n)`: Un entero codificado como `binary`, little-endian, de `n` bytes.
* `hex-int`: Un entero hexadecimal.
* `volume`: Una cadena con el formato `<gpt-partition-type-uuid>:<gpt-partition-uuid>:<volume-group-uuid>`. El UUID de la partición GPT parece tener sus primeros tres componentes con el orden de bytes invertido.

# Valores

## Arranque

* `auto-boot`: `boolean`: Si se debe arrancar automáticamente. Poner esto en `false` al menos en el Mac M1 mini causa un fallo de arranque.
* `boot-args`: `string`: Argumentos de arranque para pasar al kernel. Posiblemente filtrados por la política de arranque.
* `boot-command`: `string`: Ejemplo: `fsboot`.
* `boot-info-payload`: `binary`: Algún tipo de payload opaco y de alta entropía.
* `boot-note`: `binary`: Desconocido. Ejemplo: `%00%00%00%00%00%00%00%bb%0ez%e5%00%00%00%00%a0q%d4%07%08%00%00%00`.
* `boot-volume`: `volume`: Volumen de arranque predeterminado.
* `failboot-breadcrumbs`: `string`: Códigos separados por espacios generados por varias partes del proceso de arranque. Ejemplo: `3000c(706d7066) 3000d 30010 f0200 f0007(706d7066) 3000c(0) 3000d 40038(958000) 40039(1530000) 4003a(0) 3000f(64747265) 3000c(64747265) 40029 3000d 30010 3000f(69626474) 3000c(69626474) 40029 3000d 30010 3000f(69737973) 3000c(69737973) 3000d 30010 3000f(63737973) 3000c(63737973) 3000d 30010 3000f(62737463) 3000c(62737463) 3000d 30010 3000f(74727374) 3000c(74727374) 3000d 30010 3000f(66756f73) 40060004 30011 30007 <COMMIT> 401d000c <COMMIT> <BOOT> 1c002b(2006300) 3000f(0) 3000c(0) 3000d 30010 3000f(69626f74) 3000c(69626f74) 40040204 40040023 4003000e 30011 30007 401d000f(ffffffff) <COMMIT> `.
* `nonce-seeds`: `binary`
* `panicmedic-timestamps`: `hex-int`: Marca de tiempo UNIX en nanosegundos, presumiblemente cuando ocurrió el último pánico.
* `policy-nonce-digests`: `binary`
* `upgrade-boot-volume`: `volume`

## Actualizaciones

* `IDInstallerDataV1`: `binary:lzvn:bin-plist`: Plist binario comprimido que contiene información sobre la acción del instalador más reciente. Parece estar ausente a partir de macOS 10.12 a 11.0.
* `IDInstallerDataV2`: `binary:lzvn:bin-plist`: Plist binario comprimido que contiene un array de elementos de información en el mismo formato que `IDInstallerDataV1`.
* `ota-updateType`: `string`: Tipo de actualizaciones OTA a aplicar. Ejemplo: `incremental`.
* `update-volume`: `volume`

## Hardware

* `bluetoothActiveControllerInfo`: `binary`
* `bluetoothInternalControllerInfo`: `binary`
* `ota-controllerVersion`: `string`: Identificador del controlador de actualizaciones OTA. Ejemplos: `SUMacController-1.10` (Mac Mini M1), `SUS-1.0` (iPhone, iPad).
* `usbcfwflasherResult`: `string`: Ejemplo: `No errors`.

## Configuración

* `backlight-nits`: `hex-int`: Presumiblemente la intensidad de la retroiluminación de la pantalla. Ejemplo Mac Mini M1: `0x008c0000`.
* `current-network`: `binary`: Últimas redes Wi-Fi a las que se ha conectado.
* `fmm-computer-name`: `string`: Nombre del ordenador.
* `good-samaritan-message`: `string`: Mensaje para mostrar en la pantalla de arranque/contraseña si el dispositivo se pierde y es encontrado.
* `preferred-networks`: `binary`: Lista de redes Wi-Fi almacenadas.
* `preferred-count`: `int`: Número de redes en `preferred-networks`, si no es 1.
* `prev-lang:kbd`: `string`: Distribución de teclado, formato: `<lang>:<locale-id>`, [referencia](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt). Ejemplo: `en-GB:26`.
* `prev-lang-diags:kbd`: `string`: Distribución de teclado en diagnósticos: Ejemplo: `en-GB`.
* `SystemAudioVolume`: `bin-int(8)`: Volumen. Ejemplo: `%80` (128).
* `SystemAudioVolumeExtension`: `bin-int(16)`: Ejemplo: `%ff%7f` (32767).

## Misceláneo

* `_kdp_ipstr`: `string`: IPv4 asignada actualmente.
* `lts-persistance`: `binary`

# Ejemplos

## `IDInstallerDataV2`

<details>
<summary>Ejemplo con actualización exitosa a Big Sur 11.2 beta 1 (20D5029f)</summary>

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
  <summary>Ejemplo con actualización fallida</summary>

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
  <summary>Ejemplo con actualización exitosa a Sierra 10.12.2 (16C67)</summary>

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