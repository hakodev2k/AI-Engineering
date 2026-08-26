# Streaming Production Incident Response

## Purpose
Diagnose and stabilize streaming incidents while preserving data integrity and recoverability.

## When to use
Use for lag explosions, broker failures, data loss/duplication concerns, poison records, checkpoint failures, or sink outages.

## Inputs
Incident symptoms, timeline, topology, metrics, logs, recent changes, recovery procedures.

## Context to inspect
Broker health, partition leaders, consumer lag/event age, retries, DLQ, checkpoints, sink status, deployments.

## Core knowledge
Stabilization precedes optimization. Pausing consumers, scaling, rollback, or traffic reduction can each worsen correctness depending on delivery and state semantics.

## Procedure
1. Establish impact and incident timeline.
2. Freeze risky changes.
3. Determine whether data is delayed, duplicated, corrupted, or lost.
4. Localize failing stage from rates and lag.
5. Check recent deployments/config/schema changes.
6. Stabilize with the least destructive reversible action.
7. Preserve offsets, logs, and evidence.
8. Recover backlog within downstream capacity.
9. Validate data correctness after recovery.
10. Record root cause and preventive actions.

## Decision points
Rollback when change correlation and compatibility permit; pause processing when continued execution risks corruption; keep consuming when delay is safer than stoppage.

## Common failure patterns
Resetting offsets prematurely; deleting topics/DLQs; scaling consumers into a saturated sink; declaring recovery when lag is zero but outputs are wrong.

## Verification
SLOs recover, backlog drains, correctness reconciliation passes, and no unexplained gaps remain.

## Expected output
Incident timeline, stabilization actions, recovery evidence, RCA inputs.

## Stop conditions
Escalate before destructive offset resets, retention changes, or irreversible data repair.