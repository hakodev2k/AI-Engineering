# Workflow — Reconcile Before Write

## Trigger
A side-effecting operation is about to run, or a retry/fallback resumes after cancellation, timeout, model refusal, concurrent inbound message, or parent-turn interruption.

## Goal
Guarantee that execution decisions use current session state and durable side-effect evidence.

## Inputs
Session ID, expected revision, logical operation ID, proposed action fingerprint, capability class, receipts, and lineage metadata.

## Baseline
Measure duplicate-action rate, revision-conflict rate, unknown-commit retries, and write latency without the guard using controlled concurrency fixtures.

## Context
Current user goal plus action/revision/receipt evidence only.

## Stages
1. **Observe** — capture expected revision and proposed action.
2. **Measure baseline state** — read current revision and durable receipts.
3. **Diagnose** — classify current/stale revision and committed/started/unknown/no receipt.
4. **Form hypothesis** — determine whether executing now could duplicate or conflict with prior work.
5. **Reconcile** — if stale or unknown, inspect target/child registry and refresh session state.
6. **Decision checkpoint** — `already_committed`, `allow`, or `block`.
7. **Implement improvement** — execute only after successful compare-and-swap/single-writer admission.
8. **Measure again** — persist receipt and new revision; verify external postcondition.
9. **Independent verification** — Reconciliation Reviewer confirms receipt/postcondition for high-impact actions.

## Responsible agent
Execution coordinator owns stages 1–8. `subagents/reconciliation-reviewer.md` owns independent verification.

## Tools
Session store, durable receipt store, target-system read API, and `scripts/session_revision_gate.py`.

## Outputs
Decision record, receipt, updated revision, verification record, and conflict evidence when blocked.

## Checkpoints
- Before any write: expected revision equals current revision.
- Before retry: prior logical operation reconciled.
- After execution: durable receipt exists before success is exposed.

## Metrics
Duplicate side effects, conflict prevention count, p95 gate latency, reconciliation success rate, false blocks, read-only concurrency throughput.

## Retry policy
Metadata/receipt reconciliation may retry at most twice with bounded backoff. The external side effect itself is not retried until commit state is known.

## Stop conditions
Stop immediately on committed receipt, conflicting action, missing consistency infrastructure, or after two inconclusive reconciliation attempts.

## Failure path
Fail closed for writes; preserve read-only access. Record unresolved state and require an operator/higher-level workflow to resolve it. Never discard receipts to make a retry possible.

## Verification
Run `tests/concurrency-fixtures.json` through the gate and confirm exactly one equivalent write is admitted for competing turns.

## Definition of Done
Evidence documented; baseline captured; all side-effect paths carry logical operation IDs/revisions; concurrency fixtures produce zero duplicate admissions; cancellation/fallback fixtures reconcile; reviewer verifies high-impact cases; no blocking inconsistency remains.
