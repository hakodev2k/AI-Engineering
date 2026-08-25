# Workflow — Measure, Diagnose, Materialize

## Trigger
Large catalog, slow startup, high request volume, or materialization regression.

## Goal
Reduce unnecessary requests/bytes/latency while preserving required skill coverage.

## Inputs
Catalog, task set, cache state, server metrics, budgets.

## Baseline
Run cold-cache and warm-cache workloads before code/config changes.

## Context
Distinguish discovery from materialization and client-local latency from server-side saturation.

## Stages
1. **Observe** — collect request traces and catalog statistics.
2. **Measure baseline** — requests, bytes, p50/p95, cache hits, errors, task-required skill coverage.
3. **Diagnose** — classify eager fetch, duplicate URI, unchanged digest refresh, excessive concurrency, or irrelevant prefetch.
4. **Hypothesize** — select one dominant cause and predicted metric change.
5. **Optimize** — apply bounded planner and capped concurrency.
6. **Measure again** — same workload, same server policy.
7. **Improved?** — if no, one re-diagnosis/retry; if yes, continue.
8. **Verify** — independent verifier checks performance and correctness.
9. **Complete** — record Implemented/Measured/Verified.

## Responsible agent
Performance investigator diagnoses; implementation agent changes client; independent verifier signs off.

## Tools
`scripts/skill_materialization_planner.py`, traces, benchmark runner, server metrics.

## Outputs
Baseline, diagnosis, hypothesis, fetch plan, after metrics, verifier decision.

## Checkpoints
Baseline frozen before optimization; budgets reviewed before rollout; regression results captured after rollout.

## Metrics
Requests, bytes, latency, cache hit ratio, concurrency, server errors, required-skill recall, task regression rate.

## Retry policy
Maximum 2 optimization attempts total.

## Stop conditions
Stop on correctness/security regression, inability to include required skills, or two failed hypotheses.

## Failure path
Revert optimization or disable speculative prefetch. Preserve required skills and security checks.

## Verification
No performance claim without before/after evidence; required-skill recall must remain complete for declared required skills.

## Definition of Done
Baseline captured; limitation identified; optimization implemented; benchmark improves; required skill coverage preserved; tests pass; risks documented; independent verification passes.
