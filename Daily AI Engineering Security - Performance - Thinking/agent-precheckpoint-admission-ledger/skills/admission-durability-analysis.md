# Admission Durability Analysis Skill

## Purpose
Detect and close the gap between "caller accepted the run" and "workflow runtime has durable resumable state."

## Trigger
Use for background, queued, fire-and-forget, scheduled, webhook-driven, or parent-agent-dispatched work whenever acknowledgement can occur before the first workflow checkpoint.

## Inputs
Invocation path, acknowledgement point, queue/job semantics, workflow checkpoint behavior, run IDs, idempotency keys, external side-effect inventory, persistence backend, and crash/recovery observations.

## Preconditions
The investigator MUST be able to identify the exact instruction or API boundary that tells an upstream caller the run was accepted. The workflow's first durable checkpoint event MUST be observable or instrumentable.

## Required context
Document the states `accepted`, `checkpointed`, `completed`, `failed`, and `lost`; who owns each transition; whether a retry can repeat external effects; and which identifier remains stable across recovery.

## Allowed tools
Repository/runtime inspection, database read-only queries, controlled process-kill tests in non-production environments, `../scripts/admission_ledger.py`, queue/job logs, checkpoint stores, and test harnesses.

## Constraints
- MUST NOT claim that an accepted run is recoverable until a resumable checkpoint or equivalent durable runtime state exists.
- MUST persist the admission record before acknowledging fire-and-forget work.
- MUST use a stable unique run ID and idempotency key.
- MUST store hashes/identifiers rather than raw prompts or secrets when possible.
- MUST NOT automatically retry a lost run when external side effects may have occurred.
- MUST bound reconciliation and retry loops.

## Procedure
1. Trace request ingress to the exact acknowledgement statement/response.
2. Trace the workflow runtime to the first durable checkpoint write.
3. Measure admission-to-first-checkpoint latency for representative runs.
4. Inject a controlled crash before the first checkpoint and observe whether the caller-visible run has a durable record.
5. Classify the result: safely rejected, durably accepted, silently lost, or ambiguous.
6. If silent/ambiguous loss exists, write an admission ledger record before acknowledgement.
7. Persist only run ID, idempotency key, input hash, side-effect classification, timestamps, and lifecycle state.
8. Mark the first checkpoint explicitly when the runtime proves resumable state exists.
9. Reconcile stale `accepted` rows after a bounded timeout and mark them `lost` rather than deleting them.
10. For each lost run, choose safe restart only when side-effect-free/idempotent behavior is proven; otherwise require human review.
11. Repeat the crash test and verify that the run is now observable as `lost` or recoverable rather than disappearing.
12. Hand evidence to an independent recovery verifier.

## Decision points
- If acknowledgement already happens after durable workflow state, an extra admission ledger may be unnecessary; document evidence.
- If the persistence backend cannot guarantee the acceptance write, do not acknowledge the run.
- If external effects can precede checkpoint creation, require effect-level idempotency or human recovery.
- If the first checkpoint regularly exceeds the loss timeout, tune the timeout from measured distributions rather than disabling reconciliation.

## Expected output
An admission/checkpoint boundary diagram, baseline latency and crash evidence, ledger integration plan, lifecycle state contract, recovery classification, and independent verification result.

## Metrics
Admission-to-first-checkpoint p50/p95/p99, accepted-without-checkpoint count, lost-run rate, reconciliation latency, duplicate-side-effect rate, recovery success rate, and percentage of runs with stable idempotency keys.

## Verification
Pass when every acknowledged asynchronous run has a durable admission row; a controlled pre-checkpoint crash leaves a visible `lost` record; checkpointed runs transition correctly; terminal states cannot regress; and side-effecting lost runs do not auto-retry.

## Failure handling
Detection: missing ledger row, missing idempotency key, stale accepted row, inconsistent lifecycle transition, or recovery ambiguity. Retry instrumentation/configuration at most twice. Fallback is synchronous acknowledgement-after-checkpoint or disabling fire-and-forget admission. Escalate ambiguous side effects to a human owner.

## Stop conditions
Stop and block asynchronous acknowledgement when the ledger cannot be durably written, when run identity is ambiguous, or when recovery could duplicate an irreversible side effect without approval.
