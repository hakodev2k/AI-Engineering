# Message Replay

## Purpose
Replay retained or failed messages safely for recovery, reprocessing and new consumer state construction.

## When to use
Use after defect fixes, consumer rebuilds, backfills or DLQ remediation.

## Inputs
Replay range, source messages, consumer version, side effects, idempotency and rate limits.

## Context to inspect
Retention, offsets, schema versions, downstream calls, duplicate protections and current production traffic.

## Core knowledge
Replay changes temporal assumptions and can repeat external effects. Historical schemas and business state may differ from today.

## Procedure
1. Define exact replay objective and boundaries.
2. Validate historical schema compatibility.
3. Identify repeatable versus irreversible effects.
4. Use isolated consumer group or controlled source where appropriate.
5. Rate-limit against downstream capacity.
6. Track replay progress separately.
7. Reconcile results before completion.

## Decision points
Prefer rebuilding derived state from immutable events; use targeted repair when full replay would cause unsafe side effects.

## Common failure patterns
Resetting offsets blindly, mixing replay telemetry with live lag and overwhelming dependencies.

## Verification
Dry-run/sample first, then reconcile expected message count and business state.

## Expected output
A controlled, auditable replay with validated outcomes.

## Stop conditions
Stop when idempotency or historical compatibility cannot be proven.