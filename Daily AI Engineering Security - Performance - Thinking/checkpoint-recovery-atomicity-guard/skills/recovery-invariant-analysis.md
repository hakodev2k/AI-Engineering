# Skill: Recovery Invariant Analysis

## Purpose
Determine whether an agent may safely resume, replay, or must stop after an abnormal termination.

## Trigger
Checkpoint load after crash/cancellation or before retrying a side-effecting node whose commit status is uncertain.

## Inputs
Checkpoint ID, transition ID, pending-write records, side-effect receipts, idempotency keys, crash timestamp, workflow policy.

## Preconditions
Durable evidence is readable without executing the side effect again.

## Required context
Only observable state and evidence. Do not request hidden chain-of-thought.

## Allowed tools
Read-only checkpoint queries, receipt/status APIs, database reads, deterministic verifier scripts.

## Constraints
Never infer non-commit from missing local state alone. Never replay a non-idempotent side effect while commit status is ambiguous. Never mutate production state during diagnosis.

## Procedure
1. Identify the last durable checkpoint and its transition ID.
2. Enumerate pending writes associated with that transition.
3. Enumerate expected side effects and their correlation/idempotency identifiers.
4. Classify each side effect: `committed`, `not_committed`, `unknown`.
5. Validate that checkpoint version, pending writes, and receipts describe one coherent transition.
6. Decide:
   - all required effects proven committed → resume without replay;
   - all required effects proven not committed and replay-safe → replay;
   - mixed/unknown/mismatched evidence → block for reconciliation.
7. Record evidence references and decision reason.

## Decision points
Any `unknown` for a non-idempotent effect blocks automatic replay. Any checkpoint/write mismatch blocks normal resume.

## Expected output
A structured recovery decision with facts, assumptions, evidence, risks, and verification status.

## Metrics
Unknown-effect rate, mismatches, duplicate-effect incidents, manual reconciliations, recovery time.

## Verification
An independent verifier must reproduce the decision from the same evidence set.

## Failure handling
Retry read-only evidence collection at most twice for transient errors. Persistent uncertainty becomes `block-for-reconciliation`.

## Stop conditions
Stop immediately if evidence sources disagree materially, required receipts are unavailable, or reconciliation would require an irreversible action.