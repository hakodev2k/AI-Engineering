# Workflow: Reconcile Before Retry

## Trigger
A mutating tool was dispatched but its result/turn continuation was lost, timed out, interrupted, or is being retried after recovery.

## Goal
Determine the remote outcome before any duplicate side effect can occur.

## Inputs
Operation id, durable ledger record, tool/risk metadata, available remote/idempotency/business key, target readback capability.

## Baseline
For representative failures record duplicate writes, mutation retries, ambiguous outcomes, readback latency, recovery latency, and unsupported-success incidents.

## Context
Use explicit Facts, Assumptions, Evidence, Outcome, Risks, and Verification status. Do not request hidden chain-of-thought.

## Stages
1. **Observe** — detect lost continuation and freeze automatic mutation retry.
2. **Measure baseline** — snapshot ledger and recovery metrics.
3. **Diagnose** — decide whether dispatch definitely did not begin or outcome is ambiguous.
4. **Form hypothesis** — `committed`, `not committed`, or `unknown`, with required evidence to distinguish them.
5. **Read back** — query remote state using the strongest stable identity; maximum two read attempts.
6. **Decide** — committed: reuse result/state and continue; absent + retry-safe: permit one controlled retry; ambiguous: escalate.
7. **Persist** — store result fingerprint/remote id immediately after any successful retry.
8. **Measure again** — compare retries, duplicates, and recovery time with baseline.
9. **Verify** — Mutation Verifier independently reproduces outcome from ledger/readback.

## Responsible agent
The orchestration layer records and reconciles. `subagents/mutation-verifier.md` independently verifies. High-risk ambiguous retries require a human approver.

## Tools
Read-only connector/API operations, durable ledger, `scripts/mutation_reconcile.py`, target-specific verification.

## Outputs
Outcome record, readback evidence, retry/no-retry decision, before/after metrics, verification result.

## Checkpoints
Before dispatch: operation id and intent persisted. After dispatch: state is never silently reset to `not_dispatched`. Before retry: outcome reconciliation completed. Before completion: target state verified when required.

## Metrics
Duplicate mutation count, retry count, ambiguous-outcome count, readback reconciliation rate, recovery latency, human escalation count.

## Retry policy
Readback: maximum two attempts. Mutation retry: maximum one, and only after verified absence plus documented retry safety or human approval where required.

## Stop conditions
Verified commit, verified absence followed by safe successful retry, two failed readbacks, conflicting remote identity, provider idempotency semantics unavailable for a risky retry, or human escalation.

## Failure path
Keep the ledger outcome `unknown`, preserve evidence, block autonomous mutation retry, and surface the exact missing evidence/approval needed.

## Verification
The independent verifier must reach the same outcome classification using durable ledger + readback. A missing conversation result alone is never verification of non-commit.

## Definition of Done
Evidence documented; stable operation identity exists; baseline captured; ambiguous state is explicitly represented; readback completed or bounded failure recorded; no duplicate mutation occurred in the verification scenario; after metrics captured; required approval obtained; independent verifier returns PASS; no unresolved blocking ambiguity remains.