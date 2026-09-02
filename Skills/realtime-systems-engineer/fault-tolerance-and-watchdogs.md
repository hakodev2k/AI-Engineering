# Fault Tolerance and Watchdogs

## Purpose
Design bounded detection and recovery for hangs, overruns, corrupted state, and subsystem failure without converting recovery into another timing hazard.

## When to use
Use for watchdog architecture, degraded modes, failover, health monitoring, restart strategy, or safety-related fault containment.

## Inputs
Failure modes, recovery time objectives, task deadlines, watchdog hardware/software, persistent state, dependency graph.

## Context to inspect
Watchdog feeds, health checks, reset domains, task supervision, boot/recovery sequence, fault logs, redundancy, and external supervisors.

## Core knowledge
A watchdog must prove useful work occurred, not merely that a thread ran. Fault containment, detection latency, recovery latency, state reinitialization, and repeated-fault policy are part of the timing contract.

## Procedure
1. Enumerate credible hangs, overruns, deadlocks, and dependency failures.
2. Define detection mechanism and maximum detection latency.
3. Place watchdog responsibility outside the component being supervised where possible.
4. Feed only after validated progress milestones.
5. Define local restart, subsystem reset, or full reset escalation.
6. Preserve minimal diagnostic evidence safely.
7. Make recovery paths bounded and idempotent.
8. Test repeated faults and boot loops.
9. Validate degraded mode keeps critical functions within bounds.

## Decision points
Prefer local recovery when fault containment is strong and state can be safely reconstructed; use broader reset when hidden shared state makes partial recovery unsafe.

## Common failure patterns
Feeding watchdogs from timer callbacks, watchdog timeouts longer than safety limits, recovery that allocates or blocks unpredictably, and endless restart loops.

## Verification
Inject hangs, deadlocks, missed heartbeats, corrupt state, and dependency failure; measure detection/recovery time and confirm safe-state behavior.

## Expected output
A supervision tree, watchdog policy, recovery ladder, bounded timings, and fault-injection evidence.

## Stop conditions
Stop when safe recovery requires undocumented device state or destructive action without required approval.