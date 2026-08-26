# Workflow: Measure, Optimize, Verify

**Trigger:** cache guard alert or sustained large-context cost/latency increase.  
**Goal:** reduce unexplained cache churn without correctness loss.

## Inputs
Telemetry JSONL, policy, workload fixture, provider cache semantics.

## Baseline
Capture cached/input ratio, input tokens/task, p50/p95 latency, no-op turns and quality outcome before changes.

## Stages
1. **Observe** — collect representative telemetry.
2. **Measure** — run the guard and record baseline metrics.
3. **Diagnose** — correlate cache collapse with prefix changes, truncation, model/tool changes, expiry or polling.
4. **Hypothesize** — choose one root-cause hypothesis with supporting evidence.
5. **Optimize** — stabilize prefix, reduce no-op polling, use safe retention/compaction, or fix reconstruction as appropriate.
6. **Measure again** — replay the representative workload.
7. **Improved?** If no, revert the hypothesis and try one alternative. Maximum two attempts.
8. **Verify** — independent verifier checks metrics and correctness-critical context.

## Responsible agent
Implementer for stages 1–6; Cache Verifier for stage 8.

## Tools
`python scripts/cache_churn_guard.py --telemetry <trace.jsonl> --policy config/policy.json`, provider usage telemetry, unit tests.

## Outputs
Before/after metrics, root-cause evidence, implementation diff, guard result, verification decision.

## Checkpoints
Before optimization; after each attempt; before final acceptance.

## Metrics
Cached-token ratio; tokens/task; cache-write tokens; latency; expensive no-op streak; quality/regression rate.

## Retry policy
Maximum two optimization attempts.

## Stop conditions
Stop on correctness regression, unexplained churn beyond budget after two attempts, unavailable required telemetry, or any proposal that removes required context.

## Failure path
Restore prior context strategy, block unattended continuation, and escalate with telemetry.

## Verification
Independent verifier must reproduce the guard result and compare quality fixtures.

## Definition of Done
Implemented, measured and independently verified; unexplained churn is within policy and no critical context was lost.
