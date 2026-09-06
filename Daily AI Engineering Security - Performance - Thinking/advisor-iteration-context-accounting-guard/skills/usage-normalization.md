# Skill: Multi-Iteration Usage Normalization

## Purpose
Convert provider token telemetry into non-overlapping semantic metrics so compaction, cost control, and dashboards consume the right quantity.

## Trigger
Run when integrating Advisor/server-side sub-inference, changing provider SDK versions, debugging premature compaction, or observing sudden occupancy/cost divergence.

## Inputs
Provider response `usage`, model effective context window, compaction threshold or reserved-output budget, provider documentation, and optional transcript samples.

## Preconditions
Use captured telemetry with secrets and user content removed. Know which iteration type represents the executor/main model.

## Required context
Read `rules/token-semantics.md` and `evidence/research.md`.

## Allowed tools
Read-only transcript/telemetry analysis, provider documentation, package script/tests, and controlled replay.

## Constraints
Do not infer hidden reasoning. Do not change compaction thresholds to hide a semantic accounting defect. Preserve correctness-required context.

## Procedure
1. Capture one ordinary turn and one multi-iteration turn.
2. Enumerate every token field and classify it as current-iteration, cumulative, cache-read, cache-write, output, or sub-inference.
3. For Advisor-shaped usage, select the final iteration whose `type` is `message` as the occupancy source.
4. Compute occupancy as that iteration's uncached + cache-read + cache-creation input tokens.
5. Compute cumulative executor processing by summing all `message` iterations; compute advisor processing separately from `advisor_message` iterations.
6. Compare provider top-level fields with those normalized metrics and record the inflation ratio `top_level_input_like / occupancy`.
7. Feed only normalized occupancy into the compaction decision.
8. Replay the same transcript with the normalizer and confirm the decision changes only when occupancy crosses the actual threshold.
9. Have the Verification Agent independently run the regression fixtures.

## Decision points
- Iterations present and recognized: use final executor iteration for exact occupancy.
- Iterations absent: use documented fallback and label the source `fallback`.
- Unknown iteration types: block automatic semantic remapping and require adapter review.
- Inflation >1.25x: emit diagnostic evidence; do not compact solely from cumulative totals.

## Expected output
A normalized record containing `occupancy_tokens`, `occupancy_source`, `cumulative_executor_input_tokens`, `advisor_input_tokens`, `inflation_ratio`, `threshold_tokens`, `should_compact`, and verification status.

## Metrics
False-compaction count, inflation ratio, compactions per 100 turns, median occupancy at compaction, tokens retained before legitimate compaction, and normalization-error rate.

## Verification
For every regression fixture, normalized occupancy must equal the expected final executor iteration input-like total. Advisor tokens must remain disjoint. Automatic compaction must match occupancy-based expectations.

## Failure handling
If the provider shape is unknown or malformed, disable occupancy-driven automation for that record, preserve non-sensitive evidence, fall back to the documented conservative path, and escalate adapter review.

## Stop conditions
Maximum two adapter-fix/retest cycles. Escalate after the second failure rather than loosening semantic checks.
