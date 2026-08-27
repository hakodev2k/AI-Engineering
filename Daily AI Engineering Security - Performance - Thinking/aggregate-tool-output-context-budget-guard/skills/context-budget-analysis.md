# Skill: Aggregate Context Budget Analysis

## Purpose
Measure whether cumulative tool output can fit safely into the next model request without losing correctness-critical context.

## Trigger
Tool-heavy turn, compaction thrash, input-too-long failure, large file/web/exec output, or retry after overflow.

## Inputs
Model context limit, reserved output tokens, current input tokens, tool result sizes/priorities, retry count.

## Preconditions
Capture a baseline before optimization; preserve external references to raw outputs.

## Required context
Current transcript token estimate, model limits, tool-result metadata, quality-critical evidence requirements.

## Allowed tools
Tokenizer/provider usage data when available, deterministic guard script, read-only trace analysis.

## Constraints
MUST NOT discard context required for correctness solely to save tokens. MUST reserve output headroom. MUST measure before and after.

## Procedure
1. Measure existing context and each tool result.
2. Compute cumulative per-turn tool tokens and projected next-request tokens.
3. Compare with context minus output reserve and safety margin.
4. Identify over-budget individual and aggregate contributions.
5. Externalize raw data when possible; preserve stable references and a bounded evidence excerpt.
6. Prefer semantic/priority filtering over blind tail truncation.
7. Re-measure and compare result quality.

## Decision points
Admit only when both individual and aggregate budgets pass. Otherwise externalize/summarize/select before insertion.

## Expected output
Baseline, budget table, selected retained evidence, projected tokens, decision, quality risks, verification status.

## Metrics
Tokens/task, tool-output tokens/turn, context utilization, compaction count, overflow retries, latency, quality regression rate.

## Verification
Replay representative traces and compare task-result quality before/after.

## Failure handling
One identical overflow retry maximum; otherwise stop and change context composition.

## Stop conditions
Required evidence cannot fit safely, quality regression detected, token estimate unavailable beyond configured safety margin, or retry cap reached.
