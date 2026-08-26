# Skill: Durable Resume Analysis
## Purpose
Determine whether a checkpointed agent can resume without duplicating external effects or corrupting pending work.
## Trigger
Crash recovery, redeploy, checkpoint restore, hosted rehydration, HITL resume, or retry after executor/tool failure.
## Inputs
Checkpoint parentage, operation ledger, tool acknowledgements, pending request IDs, external evidence, workflow identity.
## Preconditions
Stable workflow identity and classified consequential operations.
## Required context
Last durable checkpoint, effects since it, current pending request. No hidden chain-of-thought.
## Allowed tools
Read-only checkpoint/ledger/status inspection, logs, deterministic guard, tests.
## Constraints
MUST NOT infer an operation failed merely because the executor failed. MUST NOT replay ambiguous non-idempotent effects. MUST NOT alter external state during diagnosis.
## Procedure
1. Record Facts, Evidence, Assumptions, Hypotheses, Decision, Risks, Verification status.
2. Identify last trusted checkpoint/parent.
3. Enumerate consequential operations with stable IDs.
4. Classify ledger status and gather external evidence.
5. Verify pending request identity.
6. Run guard.
7. Reconcile one root-cause hypothesis; maximum 2 revisions.
8. Permit execution only when demonstrably safe.
## Decision points
Broken lineage/request mismatch → block. Confirmed complete → no replay. Ambiguous non-idempotent → block. Idempotent in-flight → require reconciliation evidence.
## Expected output
Machine-readable decision and evidence record.
## Metrics
Stable-ID coverage, ambiguity rate, duplicate-effect incidents, recovery success, verification coverage.
## Verification
Independent verifier checks classification.
## Failure handling
Fail closed and preserve evidence.
## Stop conditions
Maximum 2 revisions, irreversible ambiguity, or unavailable required evidence.