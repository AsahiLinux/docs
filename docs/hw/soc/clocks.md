---
title: Clocks
---

There are (at least) two different kinds of clocks defined in the ADT:

* `clock-gates` or `power-gates` which index into the `devices` array of the `pmgr` ADT node
* `clock-ids` which represent clocks with a frequency and index into the `clock-frequencies` array of the `arm-io` node

## clock-gates / power-gates

Gated clocks are used to remove the clock signal to certain peripherals when they are not used. The ids for a specific ADT node usually need to be turned on before the MMIO region of that device can be accessed.

There is probably also some topology involved in these clocks since e.g. `SIO`, `UART_P` and `UART0` seem to be required to access the UART MMIO region even though the UART node only requests `UART0`.

## clock-ids

These clocks are likely preconfigured by iBoot and never touched by XNU itself. Their frequencies are passed as nodes in the ADT. Low indexes (<0x100, but probably only 6 or so) are clocks given in the `cpu0` node (e.g. `bus-frequency`) and for now all seem to be set to 24 MHz.
Indexes above 0x100 map to the `clock-frequencies` array of the `arm-io` node. These are usually used as reference clocks for e.g. the UART or the I2C bus. 

There is also the `clock-frequencies-regs` property but it's unknown how exactly the registers in there map to the above mentioned clocks. That property also seems to be completely unused by XNU. 
