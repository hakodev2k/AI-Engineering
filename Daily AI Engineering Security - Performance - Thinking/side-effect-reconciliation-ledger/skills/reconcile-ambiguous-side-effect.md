# Skill — Reconcile Ambiguous Side Effect

## Purpose
Prevent duplicate external mutations when a mutating tool returns an error or loses continuation after dispatch.

## Trigger
Any timeout, disconnect, missing-handler error, malformed response, tool crash, or lost continuation after a mutation may have been dispatched.

## Inputs
- stable operation key;
- operation kind and normalized intent;
- dispatch timestamp/request metadata;
- caller-visible result;
- downstream readback capability or idempotency contract;
- ledger state.

## Preconditions
Classify the tool as read-only or side-effecting before execution. Mutating calls must obtain a stable operation key before dispatch.

## Allowed tools
Ledger script, read-only downstream lookup/list/get APIs, logs, deterministic ID/uniqueness queries.

## Constraints
- Never retry an `unknown-after-dispatch` mutation merely because the caller saw an error.
- Reconciliation reads must not mutate state.
- Use at most two readback attempts unless the integration has a documented eventual-consistency window.
- No hidden chain-of-thought is required; record facts, evidence, assumptions, and decision.

## Procedure
1. Before dispatch, record `prepared` with stable key and intent hash.
2. Immediately before/at dispatch, transition to `dispatched`.
3. On positive success plus durable identifier, mark `confirmed-applied`.
4. On a provable pre-dispatch rejection, mark `confirmed-not-applied`.
5. On any ambiguous post-dispatch error, mark `unknown-after-dispatch`.
6. Query downstream state using the stable key, deterministic natural key, correlation metadata, or narrowly scoped list/readback.
7. If exactly one matching durable object exists, record its identifier and mark `confirmed-applied`; do not retry.
8. If authoritative evidence proves no mutation occurred, mark `confirmed-not-applied`; retry may be considered.
9. If evidence remains ambiguous, stop automatic retry and escalate.
10. After retry, preserve the same logical operation key when the downstream supports idempotency; otherwise create no retry until non-application is proven.

## Decision points
- Applied found -> finish without retry.
- Non-application proven -> bounded retry allowed.
- Multiple matching mutations -> duplicate incident; stop and reconcile manually.
- Unknown -> no autonomous retry.

## Expected output
Ledger record containing operation key, state, evidence, downstream ID if known, retry eligibility, and final decision.

## Metrics
Duplicate rate, reconciliation-before-retry coverage, unknown backlog, prevented retries, reconciliation latency.

## Verification
Inject simulated false failures in tests: commit a record, return an error, then ensure readback moves the ledger to `confirmed-applied` and retry eligibility remains false.

## Failure handling
One immediate readback plus one bounded delayed readback. If still unknown, escalate instead of looping.

## Stop conditions
Stop on confirmed applied, confirmed not applied, duplicate detected, or unresolved ambiguity after the retry bound.