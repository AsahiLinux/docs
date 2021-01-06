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

