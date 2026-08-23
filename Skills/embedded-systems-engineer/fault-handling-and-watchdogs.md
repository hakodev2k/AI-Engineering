# Fault Handling and Watchdogs

## Purpose
Detect, contain, diagnose, and recover from firmware/hardware faults without turning resets into hidden failure loops.

## When to use
Use for watchdog design, hard faults, hangs, brownouts, peripheral lockups, reliability requirements, or field diagnostics.

## Inputs
Fault handlers, watchdog configuration, reset-cause registers, crash logs, safety requirements, persistent storage, and incident evidence.

## Context to inspect
Inspect exception handlers, watchdog feeding, reset reasons, assertions, task health, clock/power faults, persistent crash records, and reboot policy.

## Core knowledge
A watchdog proves progress only if fed by evidence of healthy critical work. Reset is recovery, not root-cause analysis. Preserve enough crash context to distinguish software defects, power events, and external hardware failures.

## Procedure
1. Enumerate detectable fault classes and required response.
2. Capture reset cause early at boot.
3. Make fault handlers collect bounded diagnostic context.
4. Design watchdog supervision around health/progress signals.
5. Avoid unconditional feeding from a timer/idle loop.
6. Define safe-state, retry, and reboot limits.
7. Persist compact crash counters/context safely.
8. Test task hangs, deadlocks, faults, and repeated reboot scenarios.

## Decision points
Use independent watchdogs for stronger recovery guarantees. Reboot automatically only when restart is safe; enter degraded/safe mode after repeated failures when reboot loops would be harmful.

## Common failure patterns
Feeding watchdog regardless of health, allocating/logging unsafely in fault context, losing reset reason, infinite reboot loops, treating every reset as watchdog, and swallowing assertions in production.

## Verification
Inject hangs/faults, confirm bounded detection and recovery, validate retained diagnostics, and verify repeated-failure behavior.

## Expected output
A fault-response model with health supervision, diagnostic capture, recovery limits, and verified failure injection.

## Stop conditions
Stop when safe-state requirements or reset consequences for actuators/data are unknown.