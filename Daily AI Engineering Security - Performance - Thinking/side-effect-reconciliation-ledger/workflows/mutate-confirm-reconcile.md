# Workflow — Mutate, Confirm, Reconcile

## Trigger
Any side-effecting tool call such as create, send, approve, delete, deploy, publish, archive, or external update.

## Goal
Ensure retries are based on durable evidence and cannot blindly duplicate an operation after an ambiguous outcome.

## Inputs
Normalized mutation intent, stable operation key, downstream idempotency/readback capabilities, retry policy.

## Baseline
Record current duplicate rate, ambiguous failure count, and percentage of mutations with durable operation keys.

## Stages
1. **Prepare** — normalize intent, compute intent hash, create ledger record.
2. **Dispatch** — mark `dispatched` immediately before the tool request.
3. **Classify result**:
   - confirmed success -> `confirmed-applied`;
   - authoritative pre-dispatch rejection -> `confirmed-not-applied`;
   - otherwise -> `unknown-after-dispatch`.
4. **Reconcile unknown** — perform read-only downstream lookup using idempotency/correlation/natural key.
5. **Decision**:
   - one match -> mark applied and stop;
   - zero authoritative match -> mark not applied and allow one bounded retry;
   - multiple matches -> duplicate incident, stop;
   - inconclusive -> remain unknown, stop autonomous retry.
6. **Retry if eligible** — preserve logical operation key and documented idempotency semantics.
7. **Verify** — read back final durable state and close the ledger record.

## Responsible agent
Orchestrator prepares/dispatches. Reconciliation Verifier owns ambiguous-outcome review.

## Tools
Ledger script, target mutation tool, read-only downstream APIs/logs.

## Outputs
Final ledger state, durable identifier/evidence, retry decision, duplicate incident if any.

## Checkpoints
- operation key exists before dispatch;
- dispatched state recorded;
- no unknown mutation is retried without reconciliation;
- final state is evidence-backed.

## Metrics
Duplicate mutations, ambiguous outcomes, reconciled-before-retry percentage, prevented retries, unresolved backlog, reconciliation latency.

## Retry policy
At most one automatic mutation retry, and only after `confirmed-not-applied` or a documented downstream idempotency guarantee. Reconciliation readback may run twice to cover a known consistency delay.

## Stop conditions
Confirmed applied, confirmed not applied with no retry desired, duplicate detected, or unknown after bounded reconciliation.

## Failure path
Persist UNKNOWN, block mutation retry, surface operation key and evidence to a human/operator.

## Verification
Use an integration test that commits a mutation but injects a caller-visible error; the workflow must discover the mutation and suppress retry.

## Definition of Done
Every mutation has durable identity, ambiguous failures are reconciled, retries are bounded/evidence-based, final durable state is read back, and duplicates are explicitly surfaced.