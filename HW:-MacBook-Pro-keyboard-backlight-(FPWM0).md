On the MacBook Pro, the keyboard backlight shows up in the ADT as:

```
fpwm {
  [...]
  AAPL.phandle = 59
  clock-gates = 37
  device_type = fpwm
  reg = [889470976, 16384]

  kbd-backlight {
    [...]
  }
}
```

That suggests that there's a PWM at 0x235044000, enabled by the clock gate at 0x23b7001e0, which controls the keyboard backlight. That does appear to be the case :-)

Registers, as far as I've figured them out:

+0x00: write 0x4239 to enable or after counter values changed
+0x04: unknown, no effect
+0x08: status bits: bit 0x01 is set when the light comes on, 0x02 is set when the light comes off. Write-to-clear.
+0x0c: unknown, no effect
+0x18: off period, in 24 MHz ticks
+0x1c: on period, in 24 MHz ticks

So a complete m1n1 sequence to make the keyboard backlight flash in an annoying and possibly seizure-inducing way is:

>>> write32(0x23b7001e0, 0xf)
>>> write32(0x23504401c, 1200000)
>>> write32(0x235044018, 1200000)
>>> write32(0x235044000, 0x4239)

changing the frequency while keeping a 50% duty cycle:

>>> write32(0x235044018, 4000)
>>> write32(0x23504401c, 4000)
>>> write32(0x235044000, 0x4239)