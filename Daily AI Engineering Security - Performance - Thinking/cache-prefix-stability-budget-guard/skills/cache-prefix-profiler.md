# Skill: Cache Prefix Profiler

## Purpose
Measure which prompt/tool segments are stable enough to benefit from provider prompt caching and identify avoidable prefix churn.

## Trigger
Run after model/provider migration, tool-catalog change, context-builder change, cache-hit regression, token-cost increase, or before enabling explicit cache controls.

## Inputs
Representative per-step traces containing ordered prompt segments, tool schemas, input tokens, cached tokens, cache-write tokens when available, latency/TTFT, task outcome, and optional price data.

## Preconditions
Use sanitized traces. Preserve correctness-required context. Establish a representative baseline task set before optimization.

## Required context
Provider/model cache semantics, required tool set per task, context assembly order, quality acceptance criteria, and expected reuse count.

## Allowed tools
Trace parsing, deterministic hashing, token/byte accounting, benchmark runners, provider usage telemetry.

## Constraints
- Never remove security instructions or required evidence solely to improve cache ratio.
- Never claim savings from theoretical token counts without measured post-change telemetry.
- Compare equivalent task distributions.

## Procedure
1. Capture at least two consecutive agent steps for each representative task.
2. Normalize each segment into a typed record: `system`, `policy`, `tools`, `reference`, `history`, `runtime`, `tool_output`, `user`.
3. Hash segment content in actual serialization order using `scripts/cache_prefix_analyzer.py`.
4. Find the longest unchanged prefix across adjacent steps.
5. Attribute the first mutation to a segment and field where possible.
6. Measure stable-prefix ratio and provider cache-read/write ratios.
7. Identify volatile fields appearing before the first mutation boundary.
8. Check tool schema ordering and whether irrelevant tools dominate repeated prefix size.
9. Estimate whether expected reuse justifies cache writes; treat provider pricing as configuration, not a universal constant.
10. Propose minimal changes: deterministic ordering, move volatile fields to suffix, explicit breakpoints, scoped/deferred tool discovery, or stable serialization.
11. Re-run identical benchmark tasks and compare tokens, latency, cache metrics, and task success.

## Decision points
- Stable prefix below policy: diagnose serialization/order before shortening context.
- High cache writes with low reuse: use explicit caching/breakpoints or avoid cache writes where supported.
- Tool schemas dominate: reduce exposed tools only when routing can preserve required capability.
- Quality drops: reject optimization even if token metrics improve.

## Expected output
Baseline and optimized prefix fingerprints, mutation causes, cache ratios, token/cost/latency comparison, and regression status.

## Metrics
Stable-prefix ratio, cached/input ratio, write/input ratio, mutations/step, input tokens/task, cost/task, TTFT, task success.

## Verification
Independent benchmark agent runs the same task set and confirms metrics plus quality acceptance.

## Failure handling
If telemetry omits cache-read/write counters, mark those metrics unavailable rather than inferring them. Continue with prefix fingerprints and raw input-token comparisons.

## Stop conditions
Stop after two optimization cycles, on any correctness/security regression, or when provider cache behavior cannot be measured reliably.