# Investigate Idempotency-Key Concurrency

## Purpose
Find duplicate side-effect risks when clients retry or concurrently submit the same logical command.

## Inputs
Endpoint/handler, side effects, persistence model, retry behavior, existing tests and logs.

## Preconditions
Work from a clean or understood Git diff. Production writes are not required.

## Procedure
1. Locate mutating entry points and trace every durable/external side effect.
2. Identify how the idempotency key is accepted, normalized, scoped and validated.
3. Determine whether the key is atomically claimed before side effects. Collect concrete file/line or database-constraint evidence.
4. Determine whether a request fingerprint is bound to the key. A reused key with different semantics must be rejected.
5. Determine whether terminal status and response are persisted and replayable.
6. Trace crash windows: before claim, after claim/before side effect, after side effect/before outcome persistence.
7. Inspect expiry/retention and whether premature expiry permits duplicate effects.
8. Run `scripts/scan-idempotency.py` as a signal collector; manually validate every finding.
9. Where a non-production test endpoint exists, run `scripts/concurrency-probe.py` with the same key and payload.
10. Record facts separately from hypotheses and produce evidence matching `schemas/evidence.schema.json`.

## Constraints
Never send concurrency probes to production or a stateful shared environment without explicit approval. Static scanner matches are evidence leads, not proof.

## Expected output
Atomicity model, crash-window analysis, findings with evidence/risk, and verification status.

## Stop conditions
Stop for missing access, unclear destructive side effects, required schema changes, or two failed attempts to reproduce a transient test failure.
