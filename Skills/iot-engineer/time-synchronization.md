# Time Synchronization

## Purpose
Design trustworthy device time for telemetry ordering, security, scheduling, and distributed correlation.

## When to use
Use when timestamps, certificates, schedules, or event ordering matter across devices.

## Inputs
Clock hardware, connectivity, accuracy requirements, sleep behavior, time sources.

## Context to inspect
RTC, NTP/PTP/GNSS sources, monotonic clocks, timezone handling, boot state, drift measurements.

## Core knowledge
Wall-clock time can jump; monotonic time is safer for durations. Devices may boot without valid UTC. Clock quality and uncertainty should be explicit when timestamps affect decisions.

## Procedure
1. Define required accuracy and maximum drift.
2. Separate monotonic duration timing from wall-clock timestamps.
3. Select trusted time sources and fallback hierarchy.
4. Define startup behavior before synchronization.
5. Handle forward/backward corrections safely.
6. Persist time only when hardware permits trustworthy retention.
7. Expose synchronization status or uncertainty.
8. Test outages, drift, leap/clock adjustments, and reboot.

## Decision points
Use PTP/GNSS for tight synchronization when hardware and network justify it; NTP is sufficient for many telemetry systems.

## Common failure patterns
Using local timezone internally, assuming RTC validity, timers based on wall clock, and silently accepting large jumps.

## Verification
Measure drift and resynchronization under expected temperature, sleep and network conditions.

## Expected output
A documented clock model with bounded uncertainty.

## Stop conditions
Escalate when required timing precision exceeds hardware/network capability.