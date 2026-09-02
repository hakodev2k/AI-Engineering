# Production Debugging

## Purpose
Investigate real-time production failures without destroying the timing evidence, destabilizing the target, or relying on unbounded trial-and-error.

## When to use
Use for deadline misses, hangs, watchdog resets, dropped I/O, rare races, timing-sensitive crashes, or field-only failures.

## Inputs
Incident timeline, crash dumps, flight-recorder data, scheduler traces, hardware state, firmware/software version, workload and environment.

## Context to inspect
Recent changes, reset reason, task states, interrupt rates, queue occupancy, lock ownership, clocks, power/thermal events, device errors, and persistent diagnostics.

## Core knowledge
Attaching a debugger, adding logs, or changing scheduling can make a Heisenbug disappear. Senior diagnosis prioritizes minimally invasive evidence, timeline reconstruction, bounded hypotheses, and preservation of target state.

## Procedure
1. Define the observable failure and its timing threshold.
2. Preserve version, configuration, reset reason, and existing evidence.
3. Reconstruct the event timeline from monotonic timestamps.
4. Check deadline, watchdog, interrupt, queue, and resource anomalies.
5. Compare healthy and failed traces.
6. Form the smallest falsifiable hypothesis.
7. Reproduce in a safe environment with low-overhead instrumentation.
8. Separate causal events from downstream symptoms.
9. Implement the narrowest corrective change.
10. Re-run worst-case timing and fault tests.
11. Add durable regression evidence or flight-recorder coverage.

## Decision points
Use live debugging only when timing perturbation is acceptable; prefer trace buffers, dumps, hardware probes, or replay when real-time behavior is fragile.

## Common failure patterns
Adding verbose logs to critical paths, rebooting before preserving state, changing multiple variables, blaming the last task in a trace, and accepting a non-reproducing workaround as root cause.

## Verification
Reproduce the failure before the fix when possible, demonstrate elimination under equivalent stress, and verify no timing regression in adjacent critical paths.

## Expected output
A causal incident analysis, evidence, corrective change, and regression guard.

## Stop conditions
Stop when further diagnosis requires unsafe production access, destructive state changes, or hardware intervention without authorization.