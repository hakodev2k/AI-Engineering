# Device Twin and State Synchronization

## Purpose
Model desired, reported, and observed device state without creating ambiguous ownership or update loops.

## When to use
Use for remote configuration, fleet state, command reconciliation, and cloud-device synchronization.

## Inputs
State fields, authorities, connectivity behavior, update frequency, conflict requirements.

## Context to inspect
Cloud twin implementation, firmware state machine, commands, persistence, version metadata, and audit needs.

## Core knowledge
Desired state expresses intent; reported state describes device-applied reality. Versioning and acknowledgements are required to distinguish accepted, pending, rejected, and stale changes.

## Procedure
1. Classify each property by authority.
2. Define desired and reported representations.
3. Add versions or monotonic revisions.
4. Validate configuration before applying it.
5. Report application result and effective state.
6. Define offline reconciliation and stale update rejection.
7. Preserve audit history for consequential changes.
8. Test concurrent cloud/device changes.

## Decision points
Use declarative desired state for convergent configuration; use explicit commands for transient actions that should not be continuously reconciled.

## Common failure patterns
Treating commands as desired state, update loops, no rejection reason, stale writes, and assuming cloud state equals physical reality.

## Verification
Test offline changes, duplicate updates, invalid values, concurrent revisions, reboot persistence, and eventual convergence.

## Expected output
A deterministic state ownership and reconciliation contract.

## Stop conditions
Escalate when multiple systems claim authority over the same consequential state without a conflict policy.