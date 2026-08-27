# Watchdogs and Fault Recovery

## Purpose
Detect stalled firmware and recover predictably while preserving diagnostic evidence.

## When to use
Use for reliability design, unexplained resets, deadlocks or production recovery strategy.

## Inputs
Failure modes, watchdog capabilities, reset causes, health signals and recovery requirements.

## Context to inspect
Watchdog servicing, task health, reset logging, persistent diagnostics and startup recovery.

## Core knowledge
A watchdog proves progress only when servicing is tied to meaningful system health. Reset without diagnosis can hide recurring faults.

## Procedure
1. Identify hangs and liveness invariants.
2. Choose health signals that represent useful progress.
3. Centralize watchdog servicing policy.
4. Bound expected operation durations.
5. Capture reset reason and compact diagnostics.
6. Define repeated-failure behavior.
7. Test intentional stalls in controlled environments.
8. Verify recovery and evidence preservation.

## Decision points
Use independent hardware watchdogs for strong recovery guarantees; supplement with task-level health monitoring for diagnosis.

## Common failure patterns
Servicing from a timer regardless of health, disabling watchdog around long operations, reset loops and losing fault context.

## Verification
Inject controlled stalls, confirm reset timing, reboot behavior and diagnostic attribution.

## Expected output
A liveness strategy with bounded recovery and actionable reset evidence.

## Stop conditions
Stop if recovery actions could violate safety or persistent-data requirements without approved behavior.