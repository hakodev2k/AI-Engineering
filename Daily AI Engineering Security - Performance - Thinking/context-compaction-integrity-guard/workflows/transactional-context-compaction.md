# Workflow — Transactional Context Compaction

## Trigger
Context utilization crosses policy threshold or an operator explicitly requests compaction.

## Goal
Reduce context cost/latency without losing admitted messages, active task state, approvals, or persistence continuity.

## Inputs
Ordered event/message stream, token usage, active-goal/fact/approval ledgers, persistence state, compaction policy.

## Baseline
Record current token count, context utilization, message-ID range, active/completed goals, blockers, approvals, and durable-state fingerprint.

## Stages
1. **Observe** — capture utilization and compaction trigger reason.
2. **Measure baseline** — emit pre-compaction manifest and token metrics.
3. **Freeze boundary** — establish `snapshot_end_id`; new arrivals go to a separate tail queue.
4. **Diagnose** — identify protected state and removable/reducible context.
5. **Form hypothesis** — select compaction strategy and predicted reclaimed tokens.
6. **Compact** — summarize only the closed snapshot; keep structured state outside summary prose.
7. **Reattach tail** — append every event with ID greater than `snapshot_end_id` in order.
8. **Measure again** — calculate post tokens and reclamation ratio.
9. **Verify** — run `scripts/verify_compaction.py`; persist candidate; reload and verify again.
10. **Commit or rollback** — discard original only after independent verification.

## Checkpoints
Message coverage; protected-state continuity; summary reference-only marker; token reclamation; persistence readback; stale-goal regression.

## Metrics
Pre/post tokens, reclaimed %, coverage %, protected-state retention %, compaction latency, retries, stale-goal resurrection count.

## Retry policy
Maximum 2 attempts. Attempt 2 MUST use a changed payload/strategy and MUST NOT blindly replay the same failed summarization request.

## Stop conditions
Successful verified commit; missing admitted message; lost approval/goal; persistence mismatch; or second failed attempt.

## Failure path
Retain original context, preserve evidence, and escalate. Never weaken correctness or authorization invariants to reclaim tokens.

## Verification
`subagents/compaction-verification-agent.md` independently verifies after durable readback.

## Definition of Done
Implemented: boundary, manifest, checker, rollback path wired. Measured: before/after tokens captured. Verified: coverage=100%, protected state retained, reclamation threshold met, readback matches, regression fixtures pass.
