If you're after the support status of a specific feature, [[Feature Support]] has a list of all major hardware included in the Apple Silicon Macs, as well as its level of support.

## Why you shouldn't ask this question on IRC

If you ask on any of our IRC channels when Asahi Linux will be done, you will likely get one of these responses, or a variant thereof:
* "Soon"
* "It already works"
* "Never"

All of these are actually correct, and the confusion sewn by having all of these correct answers thrown at you will likely just give you a headache.

## Why they're all correct
The problem with asking about "doneness" in such a broad community is that everyone's idea of "done" is different. We have a large community of developers, testers, and eager users from a variety of backgrounds, all of whom have different expectations of the project.


### "Soon"
For an end user who uses Just Works<sup>TM</sup> distro, Asahi Linux might not be "done" until they are able to boot their favourite distro's installer off a USB stick and run its install procedure like they would on an amd64 machine. They likely also expect features like 3D acceleration, modesetting, WiFi, Bluetooth, Thunderbolt etc. to all work out of the box. For this to all be the case, all the relevant kernel patches have to be accepted upstream and then pulled into the distro's generic kernel and the user's particular machine must have support in U-Boot. Considering that at the time of writing, many of these drivers haven't even been committed to `linux-asahi`, and work hasn't even begun on reverse engineering the GPU-kernel interface, this point is probably quite far away. For people who expect such things, Asahi Linux likely won't be "done" for another year, maybe two.


### "It already works"
Next, we consider the case of someone who is actively testing bleeding edge drivers in `linux-asahi`. Someone like this may be eagerly awaiting a single feature or set of features to test out what these machines can do. For example, someone might be waiting for proper 3D acceleration to see how good the GPU is at certain workloads without the bottleneck of translating to Metal first. Another person might want to test using the Mac Mini as a networked build machine, for which they would probably only want networking, pstates, and a `cpufreq` driver. For people like this, "done" could very well mean whenever the specific feature they require lands in the `linux-asahi` kernel branch. That may be today, tomorrow, soon, or it may not even be on the list of things to look at.


### "Never"
Finally, we consider the perspective of the developer. Development for an undocumented platform is a treadmill of work. Every new feature requires reverse engineering the relevant hardware, writing drivers, testing those drivers, then getting them upstreamed. Even after a driver is upstreamed, maintenance and optimisation is sometimes required, for example if Apple introduce a breaking change to any firmware we are required to interface with. For developers the work is never really done, however a sort of colloquial "doneness" we use around here to decide what work gets priority is when a driver is completed to a quality level where it is accepted for merging upstream.

## What this means for you
No one can really decide when Asahi Linux is "done" except for you. Your use case, technical skill, ambition and risk tolerance are your own. As development work is ongoing, we will likely never have an official "done" date for you to live by, so your best bet is to use your own judgement and the list of features at [[Feature Support]] to decide if the time is right for you to try out Linux on Apple Silicon.


## A note on new hardware
The time it takes us to bring new hardware online is entirely dependent on the changes Apple makes to that particular subsystem in new silicon revisions. Core SoC building blocks will likely Just Work<sup>TM</sup> for a long while yet on many new machines with no changes, and other things may require totally new drivers and further work on reverse engineering. 

Apple make things somewhat easier for us by only introducing changes to hardware when it is absolutely necessary to do so. The original iteration of the AIC was unchanged from the early iPhones all the way to the M1. We expect AIC2, first found in the M1 Pro and Max, to have a similar, if not longer lifespan. Generally, changes to any piece of hardware will be supported in less time than it took to bring up the hardware initially. 

Large architectural changes to things like the GPU and Neural Engine may take slightly longer to figure out. As such, we cannot guarantee dates or turnaround times for any new silicon Apple release. The answer to the question "When will [_feature_] on [_machine_] be supported?" is always "When it is listed as supported on the Wiki."