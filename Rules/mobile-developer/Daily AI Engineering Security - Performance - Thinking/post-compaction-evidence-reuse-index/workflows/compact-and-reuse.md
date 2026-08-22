# Workflow — Compact, Recover Evidence, Reuse Safely

## Trigger
A context-compaction/session-resume event occurs and the next step may re-read or re-run previously observed evidence.

## Goal
Reduce redundant context/tool work while preserving evidence freshness.

## Inputs
Evidence index, current task, candidate file/command, current source state, baseline telemetry.

## Baseline
Measure duplicate reads/runs, compactions/hour, tool-result bytes, input/cached tokens when available, and task latency on a representative workload.

## Stages
1. **Observe** — identify candidate repeated read/run.
2. **Measure baseline** — capture current duplicate cost.
3. **Diagnose** — determine whether a durable entry exists and what freshness proof is required.
4. **Form hypothesis** — unchanged source/result can be reused by reference.
5. **Check** — run index lookup and source hash/state fingerprint comparison.
6. **Reuse or refresh** — use compact reference on exact match; otherwise fetch/run source of truth and update entry.
7. **Measure again** — record hit/miss/stale, bytes/tokens, latency, and compaction cadence.
8. **Verify** — independent verifier samples freshness and runs correctness checks.

## Responsible agent
Implementing agent owns indexing/refresh; `subagents/reuse-verifier.md` owns independent verification.

## Tools
`scripts/evidence_index.py`, hashing, Git/state-fingerprint command, product token telemetry, tests.

## Outputs
Freshness decision, optional artifact reference, updated index, before/after metrics, verification status.

## Checkpoints
- Before reuse: deterministic freshness proof exists.
- Before skipping a command: state fingerprint is sufficient for that command's inputs.
- Before completion: measured savings and correctness evidence exist.

## Retry policy
At most two optimization/measurement cycles. A stale-hit bug immediately disables reuse for that evidence class until the fingerprint design is corrected.

## Stop conditions
Verified improvement; freshness cannot be proven; correctness regression; or two cycles fail to improve the baseline.

## Failure path
Ignore the index entry and refresh from the authoritative source. Never preserve token savings by accepting uncertain evidence.

## Definition of Done
Baseline captured; index populated; freshness checks enforced; post-compaction duplicate work reduced; token/latency comparison collected; correctness unchanged or better; independent verification complete.
