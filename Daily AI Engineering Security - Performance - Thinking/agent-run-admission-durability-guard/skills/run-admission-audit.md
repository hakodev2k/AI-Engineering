# Skill: Run Admission Durability Audit

## Purpose
Determine whether an asynchronous/background agent runtime can lose acknowledged work before the first durable execution checkpoint, and produce evidence for closing that gap.

## Trigger
A new background-run API, task queue migration, restart-loss incident, checkpoint-engine change, scheduler rollout, or reliability review.

## Inputs
Run-creation API semantics, database/queue transaction boundaries, checkpoint timing, restart behavior, sanitized run ledger, idempotency strategy, crash-test results.

## Preconditions
The operator can identify the exact point at which the caller receives an acceptance acknowledgement and the first point at which the runtime has durable evidence of the run.

## Required context
Host runtime lifecycle, durability settings, queue/database guarantees, side-effect policy, restart/recovery entry points.

## Allowed tools
Read-only log/trace inspection, local database queries, controlled crash tests in non-production, `scripts/admission_guard.py`, unit/integration tests.

## Constraints
MUST NOT run destructive crash testing in production. MUST NOT treat an in-memory queue entry as durable. MUST NOT use generic replay for irreversible effects without idempotency/human approval. MUST NOT request hidden chain-of-thought.

## Procedure
1. Map request -> admission persistence -> acknowledgement -> execution start -> first checkpoint -> terminal state.
2. Measure whether acknowledgement can precede durable admission.
3. Assign stable `run_id` and `idempotency_key` before accepting the run.
4. Verify admission persistence is committed before acknowledgement.
5. Enumerate restart states: admitted/not-started, started/non-terminal, terminal, recovery-enqueued.
6. Run the ledger validator and record violations.
7. Exercise controlled crashes immediately before and after acknowledgement and before first execution checkpoint.
8. Reconcile after restart and prove each accepted run becomes started, terminal, or recovery-enqueued.
9. Independently verify recovery and duplicate-prevention evidence.

## Decision points
If acknowledgement precedes durable admission, block fire-and-forget semantics. If duplicate identity is possible, fix idempotency before recovery automation. If recovery would repeat an irreversible effect, require a safe idempotent boundary or human decision.

## Expected output
Admission timeline, baseline violation set, remediation, restart evidence, reconciliation result, final verification status.

## Metrics
Ack-before-admission violations; accepted orphan count; duplicate IDs/keys; restart reconciliation coverage; recovery attempts; accepted-to-start latency.

## Verification
Run positive/negative ledger fixtures and at least one controlled restart test against the host runtime.

## Failure handling
Retry recovery at most twice. Preserve the ledger state and escalate after the bound is reached.

## Stop conditions
Stop if persistence semantics cannot be proven, if a crash test risks production data, or if recovery could execute an irreversible action without safeguards.