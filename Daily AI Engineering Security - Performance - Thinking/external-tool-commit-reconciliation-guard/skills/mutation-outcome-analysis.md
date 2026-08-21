# Skill: Mutation Outcome Analysis

## Purpose
Classify an ambiguous external tool mutation using explicit evidence and choose a safe next action without hidden reasoning or blind retry.

## Trigger
A mutating tool loses its result/continuation, times out after dispatch, resumes after process failure, or receives a duplicate retry request.

## Inputs
Operation id, tool name, argument hash, risk class, dispatch state, idempotency/business key, remote identifier/result if recorded, timestamps, and readback evidence.

## Preconditions
A stable operation id exists or can be reconstructed from durable metadata. Readback must be non-mutating.

## Required context
Facts only: what was intended, what was dispatched, what evidence returned, what the target currently contains, and what retry guarantees the provider offers.

## Allowed tools
Read-only connector/API calls, durable ledger access, hashing, `scripts/mutation_reconcile.py`, task-specific verification tests.

## Constraints
Do not infer `not executed` from a missing result. Do not retry an ambiguous dangerous mutation without evidence or explicit human approval. Do not expose secrets in ledger records.

## Procedure
1. Record Facts, Assumptions, Evidence, and Risks separately.
2. Verify whether dispatch began. If not, classify `not_dispatched`.
3. If a tool result or remote id was durably stored, verify by readback and classify `committed` when consistent.
4. If dispatch began but no outcome was recorded, classify `unknown` and perform bounded readback using remote id, idempotency key, or business key.
5. If readback proves the intended state exists and matches, classify `committed`; do not re-mutate.
6. If readback proves absence and retry safety is established, classify `failed/not_committed` and permit one controlled retry.
7. If evidence remains ambiguous, keep `unknown`. For irreversible/high-risk actions, escalate for human decision rather than retry.
8. After any retry, persist the returned result before further model/tool work and verify by readback.

## Decision points
- `unknown` + no safe readback key: escalate.
- `unknown` + provider idempotency key: retry only within documented semantics and policy.
- Readback shows conflicting object: BLOCK and investigate identity/key collision.
- High-risk irreversible action: require explicit human approval before any retry.

## Expected output
Structured record with Facts, Assumptions, Evidence, Outcome, Confidence (`verified`/`unverified`), Safe next action, Risks, and Verification status.

## Metrics
Duplicate writes, ambiguous outcomes, readback reconciliation rate, mean recovery latency, retries avoided, escalations, unsupported conclusions.

## Verification
A verifier must reproduce the classification from the durable ledger and readback evidence. `committed` is not verified until target state is independently observed or equivalent provider evidence exists.

## Failure handling
Readback retries are limited to two attempts. A transient read failure may be retried once. A persistent ambiguity does not authorize mutation retry.

## Stop conditions
Verified commit, verified non-commit with safe retry completed, two failed readback attempts, identity conflict, or required human escalation.