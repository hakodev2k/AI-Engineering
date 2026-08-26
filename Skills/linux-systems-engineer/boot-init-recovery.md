# Boot, Init, and Recovery

## Purpose
Diagnose boot failures and recover Linux systems while minimizing data loss and preserving evidence.

## When to use
Use for failed boots, emergency mode, initramfs problems, bad kernel updates, mount failures, or broken systemd targets.

## Inputs
Console access, boot logs, kernel/initramfs versions, filesystem layout, bootloader configuration, recent changes, and recovery objectives.

## Context to inspect
Inspect firmware/bootloader, kernel command line, initramfs, root-device discovery, crypt/LVM/RAID dependencies, fstab, systemd failed units, and prior boot journal.

## Core knowledge
Understand firmware-to-bootloader-to-kernel-to-initramfs-to-rootfs-to-systemd sequence and recovery implications at each layer.

## Procedure
1. Identify the last successful boot and recent changes.
2. Capture visible error and boot logs.
3. Determine the failing boot stage.
4. Try known-good kernel or recovery target when safe.
5. Validate root device, initramfs dependencies, and filesystem availability.
6. Inspect fstab and critical unit failures.
7. Correct the smallest proven fault.
8. Rebuild boot artifacts only when evidence requires it.
9. Reboot and verify all critical services and mounts.

## Decision points
Use rescue/emergency mode for userspace repair; external recovery media when root cannot be reached; filesystem repair only with appropriate unmounted state and backup posture.

## Common failure patterns
Reinstalling bootloader unnecessarily, editing multiple layers at once, losing logs through repeated reboots, incorrect fstab UUIDs, and repairing filesystems while mounted.

## Verification
System boots unattended to intended target, expected kernel is active, mounts and services are healthy, and boot logs contain no unresolved critical errors.

## Expected output
Identified failing stage, minimal repair, recovery evidence, and prevention recommendation.

## Stop conditions
Stop before destructive filesystem/bootloader operations without recovery media, backups, console access, or required approval.