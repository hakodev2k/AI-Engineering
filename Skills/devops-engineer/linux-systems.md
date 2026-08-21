# Linux Systems Operations

## Purpose
Diagnose and operate Linux hosts used for application and platform workloads.

## When to use
Use for CPU, memory, disk, process, service, networking, filesystem, or OS-level incidents.

## Inputs
Host access, symptoms, metrics, service definitions, logs, recent changes.

## Context to inspect
Processes, systemd units, journal logs, memory/swap, filesystem usage/inodes, sockets, limits, kernel messages, package updates.

## Core knowledge
Understand process lifecycle, permissions, filesystems, signals, cgroups, systemd, TCP sockets, memory pressure, load average, disk IO, and resource limits.

## Procedure
1. Confirm scope and host identity.
2. Check uptime/load and recent reboot.
3. Inspect CPU/memory/swap pressure.
4. Check disk space/inodes/IO.
5. Inspect service and journal status.
6. Check listening/established sockets.
7. Review limits and cgroup constraints.
8. Correlate kernel/system messages.
9. Apply smallest reversible remediation.
10. Verify service health afterward.

## Decision points
Restart only when cause and impact are understood; increase limits only after confirming saturation; patch through managed process rather than ad hoc production edits.

## Common failure patterns
Deleting logs blindly, chmod 777, reboot as first action, ignoring inode exhaustion, changing sysctl without evidence.

## Verification
System resource signals normalize, service health recovers, and remediation is captured in managed configuration.

## Expected output
Evidence-backed diagnosis and reproducible remediation.

## Stop conditions
Stop for filesystem corruption, kernel panic patterns, or destructive repair without backup.