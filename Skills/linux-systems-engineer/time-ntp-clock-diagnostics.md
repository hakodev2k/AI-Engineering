# Time, NTP, and Clock Diagnostics

## Purpose
Maintain trustworthy system time and diagnose clock-related failures across Linux hosts.

## When to use
Use for TLS/authentication failures, inconsistent logs, distributed-system anomalies, drift, NTP alarms, or VM clock issues.

## Inputs
Time source configuration, observed offset, host/VM topology, logs, timezone requirements, and application sensitivity.

## Context to inspect
Inspect chrony/systemd-timesyncd/NTP ownership, upstream sources, reachability, leap state, RTC, virtualization time source, timezone, and boot behavior.

## Core knowledge
Distinguish monotonic and wall clocks, offset and frequency error, stepping vs slewing, stratum, source selection, leap handling, and virtualization effects.

## Procedure
1. Quantify offset and identify authoritative reference.
2. Determine which daemon owns synchronization.
3. Inspect selected sources, reachability, jitter, and frequency correction.
4. Check network/firewall path to time sources.
5. Inspect VM/hypervisor and RTC interactions.
6. Correct duplicate or conflicting time services.
7. Decide whether stepping is safe for the workload.
8. Verify convergence and application behavior.

## Decision points
Step large offsets only when application semantics permit; slew for continuity-sensitive workloads. Prefer multiple trustworthy sources with appropriate independence.

## Common failure patterns
Running multiple time daemons, confusing timezone with clock offset, manual date changes in production, relying on one unstable source, and ignoring monotonic-time semantics.

## Verification
Offset stabilizes within requirement, source selection is healthy, logs correlate correctly, and time-sensitive applications recover.

## Expected output
Clock root cause, corrected synchronization design, and measured offset evidence.

## Stop conditions
Stop before large clock steps on databases/distributed systems without owner approval or when upstream time authority is untrusted.