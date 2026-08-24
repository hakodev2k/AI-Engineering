# Skill — Tool Result Carry-Cost Analysis

## Purpose
Find which tool results create the largest cumulative token burden across a complete agent task and choose the smallest correctness-preserving intervention.

## Trigger
Input tokens/task, latency or context occupancy rises; sessions compact frequently; tools return large JSON/logs/documents; or cost regressions appear after adding integrations.

## Inputs
Trace JSONL, budget config, representative task set, quality/verification metric, optional provider cache metrics.

## Preconditions
Each tool result has a stable ID and estimated/provider-reported token count. Model turns and eviction events can be ordered.

## Required context
Only trace metadata is required for attribution; raw tool content should be omitted unless needed to judge relevance.

## Allowed tools
Profiler script, provider usage telemetry, tracing/observability systems, application benchmarks, deterministic quality tests.

## Constraints
Never remove safety, authorization, user constraints or evidence required for correctness. Do not equate cache hits with context removal.

## Procedure
1. Capture a representative unoptimized trace before changes.
2. Run `scripts/carry_cost_profiler.py` and record direct tokens, carry tokens, amplification ratio and top contributors.
3. Inspect the top contributors and classify each as: required verbatim, required partially, recomputable, stale, or suitable for out-of-band storage.
4. Form one measurable hypothesis, such as 'field-select result X before insertion' or 'evict result Y after checkpoint Z.'
5. Apply the smallest intervention using one of: field projection, slicing, structured summary, artifact/reference storage, programmatic tool chaining, or earlier relevance-based eviction.
6. Re-run the same task set and profiler.
7. Compare tokens/task, carry tokens, latency and task-quality results.
8. If savings are absent or quality regresses, revert or revise once. Maximum two optimization attempts.
9. Require independent verification for the final before/after evidence.

## Decision points
- If a payload remains needed verbatim, keep it and optimize another contributor.
- If only a subset is needed, project fields at the tool boundary rather than asking the model to ignore surplus fields.
- If data can be fetched later, prefer an artifact ID/path plus targeted reads.
- If intermediate results are only needed by another tool, consider programmatic tool calling so they never enter model history.

## Expected output
Baseline report, ranked contributors, intervention rationale, post-change report, quality comparison and verifier result.

## Metrics
Direct tool tokens, cumulative carry tokens, amplification ratio, tokens/task, latency/task, quality/regression rate.

## Verification
Savings count only when the same representative tasks complete with equal-or-better required quality and no critical context loss.

## Failure handling
Maximum two attempts. Revert any change that causes correctness/security regression. Escalate traces that exceed budget but contain irreducible required context.

## Stop conditions
Stop after verified improvement, or after two failed hypotheses with the unresolved cost documented.