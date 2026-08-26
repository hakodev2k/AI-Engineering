# Skill: Cache Regression Analysis
## Purpose
Measure prompt-cache health and isolate sustained regressions before changing context strategy.
## Trigger
Unexpected token-cost increase, latency increase, large cache writes, client upgrade, compaction/reconnect changes, or tool/schema changes.
## Inputs
Request telemetry: input tokens, cache read/write tokens, latency, client version, model, TTL and event markers when available.
## Preconditions
At least one comparable baseline session and non-secret telemetry.
## Required context
Task quality outcome and cache metrics; never remove correctness-critical context solely for cost.
## Allowed tools
Read-only telemetry inspection, profiler script, statistical comparison.
## Constraints
MUST establish baseline first. MUST distinguish observation from root-cause hypothesis. MUST NOT claim provider cause without evidence.
## Procedure
1. Capture baseline sessions.
2. Normalize cache-read and write ratios by input tokens.
3. Run the profiler and identify sustained episodes.
4. Correlate episodes with TTL, version, compaction, reconnect, tool/schema or prefix changes.
5. Form one root-cause hypothesis and change one variable.
6. Measure again on comparable tasks.
7. Repeat at most once if evidence rejects the hypothesis.
8. Verify task quality and regression rate.
## Decision points
Optimize only on sustained measured collapse; preserve context when quality risk is unknown.
## Expected output
Facts, Evidence, Hypothesis, Before/After Metrics, Decision, Risks, Verification status.
## Metrics
Tokens/task, cache-read ratio, cache-write ratio, redundant writes, latency p50/p95, quality/regression rate.
## Verification
Improvement requires lower redundant writes/cost or latency with similar or better quality.
## Failure handling
Malformed telemetry blocks analysis. Ambiguous provider/client cause is reported as unresolved.
## Stop conditions
Maximum 2 optimization iterations or any detected quality regression.
