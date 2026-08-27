# Skill: Cache Prefix Analysis

## Purpose
Measure where static agent context stops being reused and tie token waste to observable prompt-prefix mutations.

## Trigger
Token/cost regression, new MCP/tool integration, prompt-template change, subagent rollout, cache anomaly, or model-routing change.

## Inputs
Before/after JSONL traces containing task id, input/cache token counts, latency, tool/system fingerprints, static-prefix size and quality outcome.

## Preconditions
Traces come from comparable workloads and contain no secrets.

## Required context
Provider cache semantics, task acceptance criteria, tool/system serialization behavior.

## Allowed tools
Read-only traces, `scripts/cache_prefix_profiler.py`, test runner, prompt serializer inspection.

## Constraints
- MUST establish a baseline before optimization.
- MUST NOT remove correctness-critical context solely to save tokens.
- MUST distinguish cache reads, cache creation and uncached input.
- SHOULD keep tool ordering deterministic where provider semantics are prefix-sensitive.

## Procedure
1. Capture baseline traces for representative tasks.
2. Run profiler and record cache-read/create ratios, static replay and latency.
3. Inspect mutation events for tools/system fingerprints.
4. Form a single measurable hypothesis, such as stable tool ordering or moving dynamic context after a reusable prefix.
5. Apply one change at a time.
6. Capture comparable after traces.
7. Run `--before/--after` comparison with thresholds.
8. Accept only if token metrics improve without quality/latency regression beyond policy.

## Decision points
Optimize only measured hotspots. Revert when quality fails or token improvement is absent. Re-baseline when workload/model changes materially.

## Expected output
Baseline; Mutation evidence; Hypothesis; Before/after metrics; Decision; Risks; Verification status.

## Metrics
Tokens/task, cache-read ratio, cache-creation ratio, static replay/task, p50/p95 latency, quality pass rate.

## Verification
Independent benchmark reviewer checks workload comparability and threshold result.

## Failure handling
If traces are incomplete, return insufficient evidence rather than an optimization claim.

## Stop conditions
Two failed hypotheses, quality regression, non-comparable traces, or no material replay-token hotspot.
