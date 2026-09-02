# Timer, Clock, and Timekeeping

## Purpose
Design reliable time measurement and timer behavior for scheduling, synchronization, timeout logic, and latency analysis.

## When to use
Use for periodic execution, distributed timestamps, timeout bugs, clock drift, time synchronization, or deadline instrumentation.

## Inputs
Clock sources, timer hardware, required resolution, drift tolerance, synchronization protocol, scheduler/timer APIs.

## Context to inspect
Monotonic and wall clocks, timer frequency, rollover, tick configuration, NTP/PTP or hardware sync, timestamp locations, power states, and clock-domain crossings.

## Core knowledge
Wall-clock time can jump and is unsafe for elapsed-time measurement. Monotonic clocks may still drift. Resolution, precision, accuracy, stability, and synchronization are distinct properties. Hardware clocks and distributed systems introduce offset and skew.

## Procedure
1. Define each timing use case: elapsed time, deadline, coordination, or human timestamp.
2. Select the correct monotonic or synchronized clock.
3. Determine required resolution and maximum error.
4. Handle wraparound and counter width explicitly.
5. Define timer overrun and missed-period semantics.
6. Measure clock drift across temperature/load where relevant.
7. Configure synchronization and holdover behavior.
8. Timestamp as close as practical to the event boundary.
9. Validate suspend, frequency-change, reboot, and synchronization-loss cases.

## Decision points
Use local monotonic time for durations; use synchronized clocks only when cross-node ordering or correlation is required. Prefer hardware timestamping when software latency exceeds the error budget.

## Common failure patterns
Using wall time for deadlines, comparing unsynchronized clocks, timer drift from relative sleeping, rollover bugs, and assuming nominal timer frequency equals actual accuracy.

## Verification
Measure offset, drift, jitter, timer accuracy, rollover behavior, and synchronization recovery under target operating conditions.

## Expected output
A clock/timer policy with error bounds, synchronization assumptions, and validated timer semantics.

## Stop conditions
Stop when the available clock source cannot meet the required error or drift bound.