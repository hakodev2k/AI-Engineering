# Workflow — Measure, Compact, Recover

## Trigger
Long-running session enters warning zone or is about to ingest a large tool/model payload.

## Goal
Avoid context deadlock by preserving compaction/recovery reserve and verifying continuity after compaction.

## Inputs
Current usage, primary/compactor capacities, expected growth, reserve policy, durable handoff path.

## Baseline
Capture current compaction trigger point, compaction failure rate, emergency clear/new-thread count, and quality regressions after compaction.

## Context
The compaction operation needs capacity too. Budget against the effective compaction boundary, not only the primary model limit.

## Stages
1. **Observe:** collect current usage and recent growth.
2. **Measure:** calculate effective capacity and available headroom.
3. **Diagnose:** identify dominant context sources and projected next growth.
4. **Hypothesize:** choose a reserve/trigger policy expected to prevent compaction failure.
5. **Checkpoint:** write task-critical handoff state before entering `compact-now`.
6. **Compact:** perform one controlled compaction.
7. **Measure again:** record post-compaction usage/cost/latency.
8. **Verify:** ensure constraints, facts, open work, risks, and verification status remain available.
9. **Recover if needed:** if compaction fails or continuity verification fails, use the durable handoff in a fresh bounded recovery session.

## Responsible agent
Context/Token Optimizer implements policy; Headroom Verifier independently verifies thresholds and continuity.

## Tools
Provider usage metadata, token counter, `scripts/compaction_headroom.py`, durable task-state artifact.

## Outputs
Budget decision, before/after metrics, compact/recovery result, verification verdict.

## Checkpoints
Measurement complete; handoff saved; reserve available; post-compaction state verified.

## Metrics
Compaction success rate, token reduction, trigger headroom, recovery rate, quality regression, latency/cost per task.

## Retry policy
At most one compaction retry, and only with materially changed input or evidence of transient failure.

## Stop conditions
Stop new context growth on `block-growth`; stop compaction retry after bounded policy; escalate when critical state cannot be verified.

## Failure path
Use external handoff to start a clean session and rehydrate only critical context plus targeted retrieval.

## Verification
Replay threshold boundary cases and a failed-compaction scenario; confirm the workflow never requires the oversized conversation as its only recovery source.

## Definition of Done
Baseline captured, reserves configured, thresholds tested, compaction/recovery bounded, critical state verified, and before/after metrics recorded.
