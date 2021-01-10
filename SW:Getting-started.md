Tips for getting started putting macOS and your Mac into a state useful for research.

## Disabling (most) security

Hold down the power button to enter 1TR.

Open the Terminal and run:

```
# bputil -n -k -c -a -s
# csrutil disable
# csrutil authenticated-root disable
```

Note: `bputil` will *re-enable* some SIP features, so you need to run `csrutil` *after* you run `bputil`.

To check the current status run:

```
# bputil -d
# csrutil status
# csrutil authenticated-root status
```

You can also see the current status in the System Information app in Hardware->Controller.

## boot-args

If you break the system with boot-args, you cannot edit them from recovery mode, but you can clear them (`nvram boot-args=`).

```
debug=0x14e
amfi_get_out_of_my_way=1
serial=3
```
