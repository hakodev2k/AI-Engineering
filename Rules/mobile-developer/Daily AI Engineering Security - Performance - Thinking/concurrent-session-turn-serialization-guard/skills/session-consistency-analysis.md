# Skill — Session Consistency Analysis

## Purpose
Detect whether a side-effecting agent action is operating on stale session state and decide whether execution may proceed, must reconcile, or must stop.

## Trigger
Run before a write-capable tool call, background-agent spawn, fallback replay, or retry whose first attempt may have committed.

## Inputs
- Session ID and expected revision.
- Current durable session revision.
- Logical operation ID.
- Proposed action and canonical arguments.
- Durable execution receipts for the session.
- Retry/fallback/cancellation lineage.

## Preconditions
- Session revisions are monotonically increasing or otherwise comparable.
- Side-effecting capabilities are classified by policy.
- Durable receipts can be queried independently of model-visible transcript history.

## Required context
Only the current user goal, the proposed action, revision metadata, relevant receipts, and lineage metadata. Do not load unrelated full-session history merely to make the gate work.

## Allowed tools
Read session metadata, read durable receipts, canonicalize action data, and emit an authorization decision. No external mutation is allowed inside this analysis skill.

## Constraints
- MUST NOT infer that an action failed solely from cancellation or missing response text.
- MUST NOT authorize a write when the expected revision is stale until reconciliation finishes.
- MUST distinguish identical intent from byte-identical arguments when a durable logical operation ID exists.
- SHOULD keep read-only parallel tasks unblocked.

## Procedure
1. Classify the proposed capability as read-only or side-effecting.
2. If read-only, record the observed revision and allow unless another policy blocks it.
3. For side-effecting work, require a non-empty logical operation ID and expected session revision.
4. Compare expected and current revisions.
5. Query receipts for the same logical operation ID and action fingerprint.
6. If a committed receipt exists, return `already_committed` and the receipt; never execute again.
7. If the revision changed and no conclusive receipt exists, return `reconcile`.
8. If an earlier attempt is `started` or `unknown`, reconcile the target system or child-agent registry before retrying.
9. Only return `allow` when the revision is current and no committed/equivalent action conflicts.
10. Record decision evidence without secrets.

## Decision points
- **Current revision + no receipt:** allow.
- **Committed receipt:** already_committed.
- **Revision conflict:** reconcile.
- **Unknown commit state:** reconcile.
- **Conflicting committed action:** block and escalate.

## Expected output
Structured decision with session ID, expected/current revision, logical operation ID, action fingerprint, matching receipt ID if any, decision, and reasons.

## Metrics
Revision-conflict rate, prevented duplicate executions, reconciliation latency, false-block rate, and percentage of side-effecting calls carrying logical operation IDs.

## Verification
Replay concurrency fixtures where two turns start from the same revision; exactly one equivalent write may commit. Replay cancellation/fallback fixtures; subsequent attempts must discover the original receipt or reconcile before execution.

## Failure handling
If receipt storage or session-revision lookup is unavailable, fail closed for side-effecting operations and allow only read-only work. Retry metadata reads at most twice with bounded backoff.

## Stop conditions
Stop after an allow/already_committed/block decision, or after two inconclusive reconciliation attempts. Escalate unresolved unknown commit state rather than guessing.
