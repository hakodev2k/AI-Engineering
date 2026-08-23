# Watchdogs and Fault Recovery

## Purpose
Recover devices from hangs and transient faults without masking persistent defects or creating unsafe loops.

## When to use
Use for unattended devices, reliability design, reset loops, and fault-containment reviews.

## Inputs
Failure modes, watchdog hardware, boot flow, persistent storage, safety requirements.

## Context to inspect
Main loops/tasks, blocking operations, reset reasons, boot counters, safe mode, brownout handling, and recovery paths.

## Core knowledge
A watchdog proves only that selected progress occurred. Feeding it from an independent health decision is stronger than unconditional kicks. Persistent reset loops need bounded recovery and diagnostic preservation.

## Procedure
1. Identify hangs and recoverable fault classes.
2. Configure hardware watchdog independently of application failure where possible.
3. Define meaningful health/progress checks.
4. Persist reset reason and minimal diagnostics.
5. Bound automatic retries.
6. Enter degraded/safe mode after repeated failures.
7. Preserve OTA/recovery capability.
8. Test deadlocks, blocked I/O, memory exhaustion, brownouts, and boot loops.

## Decision points
Restart a subsystem when isolation is reliable; reset the device when global state may be corrupted. Prefer safe shutdown for hazardous actuators.

## Common failure patterns
Unconditional watchdog feeding, infinite reboot loops, lost reset evidence, and recovery that repeats destructive actions.

## Verification
Inject representative faults and confirm detection, safe recovery, diagnostic retention, and bounded retries.

## Expected output
A tested fault-detection and recovery policy.

## Stop conditions
Escalate when automated recovery can create unsafe physical behavior.