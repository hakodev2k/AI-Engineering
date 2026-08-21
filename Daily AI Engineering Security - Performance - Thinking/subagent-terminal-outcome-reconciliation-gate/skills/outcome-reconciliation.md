# Skill — Outcome Reconciliation

## Purpose
Determine the real terminal state of a delegated agent task from observable lifecycle and acceptance evidence rather than parent narration or a single status flag.

## Trigger
Run before reporting success, after interruption/cancellation, after a child result channel fails, or before retrying delegated work.

## Inputs
Parent status, expected required/optional child set, child registry records, terminal receipts, acceptance results, committed-effect evidence, cancellation lineage, and reconciliation-attempt count.

## Preconditions
- Required delegated operations can be named before terminal evaluation.
- Child lifecycle state can be queried independently of parent final text.
- Acceptance evidence is defined for required child work.

## Required context
Facts about the task objective, expected children, observable child state, durable effects, and acceptance checks. Hidden chain-of-thought is neither requested nor used.

## Allowed tools
Read child registry, read artifacts/logs/test results, query durable side-effect receipts, and run deterministic acceptance checks.

## Constraints
- MUST NOT infer success from model narration, low error count, or parent exit status alone.
- MUST NOT classify an interrupted child as not-executed without checking durable work.
- MUST NOT retry work with unknown commit state.
- MUST bound reconciliation to configured attempts.
- SHOULD preserve usable completed artifacts even when result delivery failed.

## Procedure
1. Build the expected child set and mark which children are required.
2. Match each expected child to registry/lifecycle records.
3. Record observable states: not-started, running, terminal-success, terminal-failure, interrupted, or missing.
4. Require start evidence for every required child when policy enables it.
5. Require a terminal receipt for every required child before considering verified success.
6. Evaluate acceptance evidence independently of child self-report.
7. For interrupted/cancelled children, inspect committed effects and acceptance evidence before deciding whether work must be resumed, reconciled, or preserved.
8. If all required children have terminal receipts and acceptance passes, return `verified_success`.
9. If any required child has explicit terminal failure, return `failed` unless policy defines a successful fallback child that independently satisfies the same acceptance criteria.
10. If useful work exists but acceptance is incomplete, return `partial`.
11. If required state is missing, running, or commit state is unknown, return `reconcile` and identify missing evidence.
12. Stop after the configured reconciliation limit; unresolved high-impact work becomes `blocked` rather than guessed.

## Decision points
- Required child never started => reconcile/block success.
- Required child running => reconcile, not success.
- Required child failed => failed unless an explicitly equivalent verified fallback exists.
- Interrupted + committed effect + no acceptance => partial/reconcile; do not rerun blindly.
- All required children terminal + acceptance passes => verified_success.

## Expected output
Structured outcome containing Facts, Evidence, Expected children, Per-child lifecycle status, Acceptance status, Committed-effect status, Decision, Risks, Missing evidence, and Verification status.

## Metrics
Terminal-evidence coverage, unsupported-success prevention count, already-completed work preserved after interruption, duplicate retries prevented, reconciliation latency, false-success rate, and false-failure rate.

## Verification
Run lifecycle fixtures containing never-started children, interrupted-but-committed children, all-successful verified children, and explicit failures. Compare reconciled outcomes with expected decisions.

## Failure handling
When the child registry or evidence store is unavailable, terminal success is blocked. Retry read/reconciliation at most twice. Preserve known artifacts/receipts and report unresolved evidence rather than weakening acceptance requirements.

## Stop conditions
Stop on verified success, conclusive failure, or after two inconclusive reconciliation attempts. Escalate unresolved durable-effect state before any destructive retry.
