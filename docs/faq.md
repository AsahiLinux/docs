---
id: faq
title: FAQ
---

## What devices will be supported?
All Apple M1 macs are in scope, as well as future generations as development time permits. The first target will be the M1 Mac Mini.

## Does Apple allow this? Don't you need a jailbreak?
Apple allows booting unsigned/custom kernels on Apple Silicon macs without a jailbreak! This isn't a hack or an omission, but an actual feature that Apple built into these devices. That means that, unlike iOS devices, Apple does not intend to lock down what OS you can use on Macs (though they probably won't help with the development).

## Is this legal?
As long as no code is taken from macOS in order to build the Linux support, the end result is completely legal to distribute and for end users to use, as it would not be a derivative work of macOS. The actual act of reverse engineering varies by jurisdiction, but in general, reverse engineering for interoperability purposes is protected by law in many countries. In any case, I do not anticipate that Apple would try to take legal action against this project, as it would be a massive PR hit for no real benefit to them. If they didn't want people to put Linux on Macs they would've locked down the boot process, no lawyers necessary.

## How will this be released?
All development will be in the open, pushed to GitHub regularly. Contributions will be written with the intent to upstream them into the respective upstream projects (starting with the Linux kernel), and upstreamed as early as is practical. Code will be dual-licensed as the upstream license (e.g. GPL) and a permissive license (e.g. MIT), to ensure that the work can be reused in other OSes where possible.

## Will this make Apple Silicon Macs a fully open platform?
No, Apple still controls the boot process and, for example, the firmware that runs on the Secure Enclave Processor. However, no modern device is "fully open" - no usable computer exists today that has completely open software and hardware (as much as some companies want to market themselves as such). What ends up changing is where you draw the line between closed parts and open parts. The line on Apple Silicon Macs is when the alternate kernel image is booted, while SEP firmware remains closed - which is quite similar to the line on standard PCs, where the UEFI firmware boots the OS loader, while the ME/PSP firmware firmware remains closed. In fact, mainstream x86 platforms are arguably more intrusive, as the proprietary UEFI firmware is allowed to steal the main CPU from the OS at any time via SMM interrupts, which is not the case on Apple Silicon Macs (this has real performance/stability implications, it's not just a philosophical issue).

## Is this a solo project?
Linux development is never a solo project. I will of course be in contact with upstream developers and anyone else who wants to contribute. To get to truly good Linux support will definitely require more than one person, but having one person dedicated to the task makes a huge difference to this kind of project, because it means I can focus on anything that needs doing, while others can contribute on whatever they want whenever they want. For a platform port to succeed there needs to be at least one person pushing things forward, and I aim to be that person.

## What if you end up with a lot of leftover money?
Obviously I will have to buy hardware (Apple devices aren't cheap) and have other costs to run this project. If the campaign really takes off, though, I might be able to afford to hire other developers to work on specific tasks!

## Why should we trust you?
I've been reverse engineering devices for over half of my life, since the early 2000s. I've worked to build unofficial open software support for platforms such as the Nintendo Wii (where I am one of the largest contributors to hardware documentation, open libraries, "jailbreaking" software (The Homebrew Channel), recovery tools (BootMii), etc), the Sony PS3 (where I wrote AsbestOS and a Linux patchset to enable Linux to work on the PS3 Slim as well as up-to-date PS3 units after the original Linux support was removed), the PS4 (which I ported Linux to, to the point of being able to run Steam games with full OpenGL/Vulkan graphics support), and other smaller platforms. I always strive to write clean and robust code that is safe, puts the user first, and is upstreamable. I support open hardware and software development. I've gone through the Linux kernel patch process multiple times and I know what it takes to get stuff upstreamed.
