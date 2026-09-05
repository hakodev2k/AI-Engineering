# Skill: Context Budget Analysis

## Purpose
Find and correct premature or late context compaction using observable token accounting rather than intuition.

## Trigger
Unexpected compaction; context-limit errors; new model/provider; cost/latency regression; context-window metadata change.

## Inputs
Model capacity; reserved output/safety tokens; measured input tokens; compaction events; task-quality results; provider usage metadata.

## Preconditions
A reproducible trace or workload and authoritative model-capacity evidence.

## Required context
Static instructions, conversation history, tool outputs, retrieved context, summaries, memory, and provider-reported token fields.

## Allowed tools
Tokenizers/usage APIs, logs, benchmark runner, this package's calculator, model documentation.

## Constraints
Do not delete correctness-critical context. Do not infer capacity from a single failed request.

## Procedure
1. Inventory every context component and token source.
2. Establish baseline tokens/task, compactions/task, utilization at compaction, latency, cost, quality.
3. Validate effective context window against authoritative model configuration.
4. Normalize to `usable = context_window - reserved_tokens`.
5. Calculate `utilization = used_tokens / usable`.
6. Reproduce boundary behavior with threshold-1, threshold, threshold+1, and near-capacity values.
7. Diagnose arithmetic, metadata, duplication, or summary-growth root cause.
8. Change one mechanism at a time.
9. Replay the same workload and compare all metrics.
10. Independently review quality and critical-context retention.

## Decision points
Unknown capacity: stop. Compaction below configured tolerance: fix accounting/metadata before compression tuning. Quality regression: revert even if tokens decrease.

## Expected output
Baseline, hypothesis, corrected configuration/code, before/after metrics, verification status.

## Metrics
Tokens/task, cost/task, latency/task, compaction utilization, compactions/task, quality score, regression rate.

## Verification
Boundary tests plus representative trace replay; no critical context loss.

## Failure handling
One retry for metadata resolution; maximum two optimization cycles.

## Stop conditions
Capacity unknown; budget non-positive; critical-context loss; two failed optimization cycles.