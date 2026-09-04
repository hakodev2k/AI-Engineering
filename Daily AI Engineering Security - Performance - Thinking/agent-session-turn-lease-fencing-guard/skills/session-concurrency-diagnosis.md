# Skill: Session Concurrency Diagnosis

## Purpose
Diagnose whether an agent session can admit overlapping mutation-capable turns or stale-owner writes.

## Trigger
Use after duplicated work, interleaved transcript entries, ownership handoff, timeout/retry ambiguity, async wake delivery, or before enabling multi-client/session resume.

## Inputs
Session event log containing session ID, event type, actor/worker, lease epoch, operation ID, mutation flag, and timestamp.

## Preconditions
Events must be ordered or carry timestamps. Mutation events must be distinguishable from read-only observation.

## Required context
Runtime ownership model, cancellation semantics, retry behavior, persistence boundary, and background-delivery paths.

## Allowed tools
Read-only log inspection, the package guard script, test runner, and repository source inspection.

## Constraints
Do not infer cancellation from a client timeout. Do not mark a session safe from UI state alone. Do not mutate production state during diagnosis.

## Procedure
1. Record the expected invariant: at most one active mutation lease per session.
2. Identify every lease grant/revoke and construct the epoch sequence.
3. Map every mutation to actor, epoch, and operation ID.
4. Flag mutation without an active lease, stale epoch, duplicate operation ID, epoch regression, or overlapping active grants.
5. For each timeout, locate explicit server completion/cancellation/reconciliation evidence.
6. Separate observed facts from hypotheses about why the race occurred.
7. Reproduce with deterministic fixtures where possible.
8. Run `python scripts/turn_lease_guard.py check --policy config/lease-policy.json --events <events.jsonl>`.

## Decision points
- If a stale worker can still mutate, require fencing before rollout.
- If cancellation is ambiguous, require reconciliation before retry.
- If duplicate operation IDs are accepted, add durable deduplication.
- If only read-only followers overlap, do not classify that alone as a violation.

## Expected output
A violation report listing evidence, affected session/actor/epoch/operation, root-cause hypothesis, and required control.

## Metrics
Violation count, stale writes blocked, duplicate operations blocked, ambiguous timeout count, and reproduction rate.

## Verification
A diagnosis is verified only when the event sequence is reproducible or independently corroborated and the checker classifies known-bad and known-good fixtures correctly.

## Failure handling
If fields are missing, stop and classify the evidence as insufficient rather than guessing. Preserve raw logs.

## Stop conditions
Stop after the first confirmed unsafe mutation path is found for remediation, or after all mutation events are checked with no invariant violation.