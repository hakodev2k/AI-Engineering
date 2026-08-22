# Workflow: Measure → Deduplicate → Verify

## Trigger
A workload shows repeated parallel tool calls or duplicate side effects.

## Goal
Reduce redundant execution while keeping intended concurrency and correctness.

## Inputs
Captured tool-call workload, `config/policy.json`, tool side-effect declarations.

## Baseline
Record call count, unique fingerprints, external requests, wall-clock duration, p50/p95 tool latency, and side-effect count.

## Stages
1. **Observe** — collect a representative workload without changing dispatch.
2. **Measure** — calculate duplicate ratio and current latency/cost.
3. **Diagnose** — separate exact duplicates, ID collisions, and legitimate repeated calls.
4. **Hypothesize** — predict which duplicates can be suppressed safely.
5. **Implement** — run calls through `scripts/dedup_gate.py` and integrate decisions before dispatch.
6. **Measure again** — repeat the identical workload.
7. **Verify** — Performance Verifier checks effects and regression fixtures.

## Responsible agent
Implementation owner for stages 1–6; `subagents/performance-verifier.md` for stage 7.

## Tools
`hooks/pre-dispatch.md`, `scripts/dedup_gate.py`, metrics/log collector, workload replay harness.

## Outputs
Before/after report, suppression decisions, regression result, blocking findings.

## Checkpoints
After baseline, after classification, after optimized measurement, and final independent verification.

## Metrics
External calls/task, duplicate execution rate, wall-clock time, p95 latency, false-collapse count, duplicate side effects.

## Retry policy
At most 2 hypothesis revisions. Each retry must change fingerprint scope or side-effect policy based on evidence.

## Stop conditions
Stop immediately on a false collapse, unexpected write suppression, or policy ambiguity. Stop after 2 failed revisions and escalate.

## Failure path
Restore previous dispatch behavior for affected tool, preserve evidence, and require human review for non-idempotent write semantics.

## Verification
Improvement requires fewer redundant external executions with equal intended outputs/effects and zero regression-fixture failures.

## Definition of Done
Evidence documented; baseline captured; gate implemented; before/after metrics collected; tests pass; verifier marks Implemented, Measured, and Verified; no blocking finding remains.