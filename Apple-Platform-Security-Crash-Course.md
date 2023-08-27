## Introduction
The Apple Silicon platform has been designed from the ground up to offer properly configured systems
an extremely secure operating environment that is resilient to multiple forms of attack. The security
model is based on the Swiss Cheese Model - no single security mechanism can guarantee an acceptable
level of security on its own, so mechanisms are layered to cover each others' holes.

Platform security features are orchestrated by the Secure Enclave Processor (SEP). An overview of the SEP's
features, the different boot policies, and the boot picker itself is available at [[Introduction to Apple Silicon]].
This page instead attempts to extrapolate upon and clarify the concepts which may be of interest to
users and system maintainers.

At a high level, the Apple Silicon security model in Full Security mode is comprised of six key concepts:

1. The integrity of system and boot-critical data is guaranteed at all times
2. Security policies are configurable on a per-container basis
3. The hardware and user together form the trust root for all security operations
4. The security and boot policy of one container shall not affect any other containers
5. All data is transparently encrypted at rest
6. Decryption of user data can be gated behind authentication

This document covers the implementation of the security model on a standard macOS container in Full Security
mode, and how the system has been engineered to allow a user to execute arbitrary code (i.e. third party operating
systems) without compromising on the guarantees Apple makes of macOS in Full Security mode. This is a unique
selling point of the platform, as it departs from the all-or-nothing approach of the PC's Secure Boot in
some very clever ways. It is the perfect way to illustrate why one must exercise caution when attempting
to make equivalencies between the PC and Apple Silicon.

## Table of Contents
* [Introduction](#introduction)
* [System data integrity](#system-data-integrity)
* [Per-container security policies](#per-container-security-policies)
* [The user trust root](#the-user-trust-root)
* [Paired recovery](#paired-recovery)
* [Disk encryption](#disk-encryption)
* [Apple's unspoken agreement](#apples-unspoken-agreement)
  - [How we uphold this agreement](#how-we-uphold-this-agreement)

## System data integrity
The platform goes to great lengths to verify and maintain the integrity of system data. All system files are,
at minimum, signed and hashed by Apple. Critical firmware components, such as sepOS and iBoot, are also encrypted.
The system verifies the integrity of all of these components before they are allowed to execute. If any of these
components fail verification for any reason, the system will fail to boot and direct the user to restore
their machine.

This model extends from the firmware and bootloader up into macOS itself. The SEP maintains a Boot Policy
for each APFS container, which enrolls a macOS kernelcache and system data volume allowed to be booted.
The kernelcache is signed by Apple, and its hash is recorded in the SEP's Boot Policy. If the hash of the provided
kernelcache is mismatched with the one in the SEP's Boot Policy or it has not been signed by Apple, the system will
refuse to boot that APFS container.

The OS snapshot itself is a hashed disk image. Every file inside it is also hashed, and the Merkle tree of these hashes
is used to compute a final hash known as the Volume Seal which is used to sign the volume. If the hash
of the image itself or the seal does not match the SEP's Boot Policy, then the system will not boot.
Mutable user data is stored on an entirely different volume on the container, and is unioned with the snapshot to
be presented as a single filesystem to the user only after the snapshot has been verified. No file may intersect the
OS snapshot and the user data volume, and it is impossible to mutate the snapshot at all in Full Security mode. This
feature is known as Sealed System Volume (SSV).

An enrolled kernelcache can also not be used to pivot to an untrusted root. A kernelcache can only be used
to mount and boot the OS snapshot that it is enrolled for in the Boot Policy. The SEP will halt booting
if a kernelcache is attempting to mount an OS snapshot it is not authorised to mount. This prevents the
capturing of the entire system from one compromised container.

## Per-container security policies
Apple knows that this level of lockdown is not suitable in all cases for all users. What if someone wants
to develop and test a kernel extension, for example? On Intel Macs, tampering with the system files could
be achieved by disabling System Integrity Protection. On Apple Silicon, Apple have taken a more granular approach,
with the SEP able to track security policies on a per-container level. This allows users to maintain a
fully secure macOS installation while also experimenting with a more permissive environment.

Apple have stated publicly that the intention for this feature is to allow third-party OS installation without
Apple having to compromise on their security guarantees for macOS, and have even stated that they would
welcome Microsoft porting Windows to the platform.

An APFS container recognised as a valid macOS system (certain filesystem structures must be present) can
be placed into Permissive Security mode. This is often billed as allowing users to "run" arbitrary code,
however there is some nuance here. What is _actually_ being allowed is the enrollment of macOS kernelcaches
that are not signed by Apple into a Boot Policy for the container, and the disabling of SSV. The user
provides a kernelcache to the SEP which hashes it, signs it, and creates a Boot Policy for the container.

Other system integrity guarantees still apply to Permissive Mode containers. The system will still refuse
to boot if the firmware or bootloader has been compromised, likewise if the user-provided kernelcache is
tampered with after being enrolled in the SEP. The paired recoveryOS snapshot must also still be signed by Apple
for reasons we will get into soon. If the user wishes to change the kernelcache again after enrolling it, they must
enroll another. This ensures the platform that you trust the binary.

But what if a bad actor gets into your Permissive Security container? Wouldn't they be able to enroll a
new kernelcache and silently capture the container from under your nose? Unsurprisingly, Apple thought of this
and have a very simple way to mitigate this attack vector.

## The user trust root
While the SEP is the hardware trust root for cryptographic operations, there is in fact another component
which forms a trust root for operations that alter a container's security or boot settings. You.

The user's interaction with the SEP forms the ultimate trust root for the platform's security model. 
Upon initial setup of an Apple Silicon machine, the SEP enrolls a set of "Machine Owner" credentials, 
which are the credentials of the first macOS account set up on the machine in a Full Security container.
This set of Machine Owner credentials is used to authenticate and sign any operations that alter the state
of a container's security or boot policy. This alone does not create a "true" hardware trust root out of
the user, since someone _may_ capture the Machine Owner credentials, but the SEP is smart enough to
do one more check to make sure the Machine Owner is who they say they are.

Apple Silicon machines can be booted in various states, which are controlled by the SEP and iBoot. One of these
states, 1TR, can only ever be entered from a cold boot by holding the physical power button, and authenticating
with Machine Owner credentials. If the SEP is not satisfied that _both_ these conditions have been intentionally
met (e.g. the power button is released prematurely), then it will not register a 1TR boot. Security operations
such as demoting a container to Permissive Security can **only** be done from 1TR. The SEP will simply refuse
to complete the transaction if it is not satisfied that the request originated from a valid 1TR environment.
Some operations, such as installing a custom boot object, require the Machine Owner credentials to be entered
a second time.

This allows the SEP to form a hardware trust root out of the user themself with which to sign security policy
transactions, guaranteeing to itself that the owner of the machine explicitly trusts the operation being requested.
This is sufficient to mitigate most classes of attack that could compromise the boot process on any container, 
whether locally or remotely executed.

## Paired recovery
This one is very simple. Starting with macOS 12, booting into 1TR takes you to the paired
recovery snapshot of the blessed APFS container. The SEP will only let you make changes to the blessed container,
which helps to limit the spread of damage if a container is somehow compromised to the point where a malicious
actor has somehow managed to bypass both the physical presence and Machine Owner checks.

## Disk encryption
Since the introduction of the T2, Macs have had quite robust and transparent per-volume encryption. It is for this reason
that Apple cannot replace faulty SSDs in post-T2 Macs without total data loss. The default state for this system
is data encrypted at rest - the machine will transparently decrypt the data in flight with its own keys, while it
remains encrypted on the disk. There is almost no performance penalty for this. On Apple Silicon machines, the SEP
generates a Volume Encryption Key (VEK) and eXtended Anti-Replay Token (xART) for each APFS volume. The xART prevents
replay attacks from capturing the VEK, which is stored in the SEP's own airgapped memory and can never be read by
the application cores to further harden it against capture.

Data on the volume is encrypted/decrypted in flight. sepOS passes the keys directly to the NVMe controller,
bypassing the application cores to harden against key capture. It is important to be aware that once the machine
has powered on and the SEP is satisfied with the state of iBoot and the system firmware, the keys are unwrapped and
**all data is accessible** in the clear across all partitions. This is where FileVault comes in for macOS.

When FileVault is enabled for an APFS volume, the VEK and xART are wrapped with a Key Encryption Key (KEK), which is backed
by user credentials from the macOS container in question. The machine will be unable to read the user data volume of the
protected container until these credentials are provided at startup. Enabling this is instantaneous on Apple Silicon machines, since
the only required operation is generating the KEK and and a recovery key. The system snapshot, Preboot, and
recovery volumes are not protected by FileVault. These partitions are immutable, backed by the SEP, and contain no user data
and therefore do not particularly benefit from FileVault. All encryption keys are destroyed by the SEP
when the Machine Owner requests the machine to be wiped, guaranteeing that any residual data is indecipherable even to data recovery
programs.

We can very emulate this with LUKS on top of LVM and achieve effective full disk encryption. We have the luxury of disregarding the
APFS stub since the only things we care about there are m1n1 and recoveryOS, both of which are verified, signed and tamper-proof.
An existing weakness is that `/boot` must be stored in the clear, and there is currently no
Secure Boot or Measured Boot analogue with which we can guarantee the integrity of the kernel or initramfs. Users may choose
to point their bootloader to removeable media once this is better supported to mitigate this. Beyond that, any bootloader which supports LUKS
and LVM will work with a standard `cryptsetup` workflow once the user has set up their partitions to their liking.

## Apple's unspoken agreement
When documenting the security model, Apple use the example of an XNU kernel developer wishing to test
their changes on a second macOS installation. It is apparent however that the platform security model
was engineered to allow third party operating systems to coexist with macOS in a way that
does not compromise any of Apple's security guarantees for macOS itself. Rumours circulating that Apple
are actively hostile towards efforts such as Asahi, or that their security must be bypassed or jailbroken to run
untrusted code are unfounded and false. In fact, Apple have expended effort and time on _improving_ their
security tooling in ways that _only_ improve the execution of non-macOS binaries. An example of this is
giving their Boot Policy configuration tool the ability to wrap raw AArch64 code in a proper Mach-O format
starting with macOS 12.1. This is only ever required for enrolling a boot object that is not already
a macOS kernelcache. 

That said, an agreement necessarily cuts two ways. Given that Apple Silicon Macs are essentially scaled up
iDevices, Apple went out of their way to alter that security model to be more flexible and it is not hard to
infer why. At some level in the company, someone would have been well aware that a project like Asahi would
be inevitable, whether that be with their consent or not. Rather than risk the jailbreaking community
embarrassing their privacy and security marketing guarantees trying to get arbitrary code to run,
they have given us the tools to easily do it without needing to touch their sandbox. Thus, we take this
functionality as coming with one simple condition - do not, under any circumstances, attempt to poison the
macOS container.

### How we uphold this agreement
Asahi Linux creates a small APFS container and volume set with the correct file structure to be recognised as a valid OS,
then uses Apple's tooling to set its security to Permissive and enroll m1n1 as its signed boot object. We do
not - and never will - alter the security settings of _any other_ OS volume, nor will Apple's security
policies for those containers affect the Asahi volume. More details can be found at [[Open OS Ecosystem on Apple Silicon Macs]].