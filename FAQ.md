### When will Asahi Linux be "done"?

--> [["When will Asahi Linux be done?"]]

### How do I install it?

See the alpha release blog post: https://asahilinux.org/2022/03/asahi-linux-alpha-release/

### How come HDMI works on Mac Mini but not MacBook?

HDMI on the MacBook is internally connected to a Thunderbolt port.
HDMI on the Mac Mini is internally connected to a DisplayPort port.

### Do I need to reinstall to get new features / updates?

No! Just upgrade your system using `pacman -Syu`. Kernel updates will require a reboot. Consider a tool like `needrestart` to determine if there are any outdated services or kernels running.  