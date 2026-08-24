# Skill: Context Accounting Analysis

## Purpose
Reconstruct model-visible context occupancy independently from cumulative usage/billing telemetry.

## Trigger
Premature compaction, sudden occupancy jumps, model/provider changes, advisor/submodel iterations, or unexplained token-cost growth.

## Inputs
Raw JSON/JSONL telemetry, context window, compaction threshold, model/runtime/transport version, local token additions.

## Preconditions
Preserve raw telemetry. Know whether values are per iteration, cumulative, cache-specific, or locally estimated.

## Required context
Model reasoning mode, provider, transport, cache semantics, compaction threshold, and any server inclusion flag.

## Allowed tools
Read-only trace parsing, tokenizer if available, `usage_accounting_guard.py`, runtime source/docs, comparison scripts.

## Constraints
Never infer occupancy by blindly summing iterations. Never assume reasoning is excluded merely because an inclusion signal is missing. Do not optimize away task-critical context.

## Procedure
1. Capture raw top-level and per-iteration usage for at least 30 relevant turns when available.
2. Label each field as billing work, final-message input, cache read/write, reasoning, or local addition.
3. For multi-iteration requests, identify the final `message` iteration and compare its input footprint with the top-level sum.
4. For persisted reasoning, reconstruct whether server `input_tokens` already track historical reasoning using adjacent-turn deltas or provider contract evidence.
5. Replay current compaction decisions exactly.
6. Replay an inclusion/iteration-aware calculation.
7. Count decisions that change and quantify context remaining at each changed decision.
8. Implement one accounting rule change; rerun the same trace.
9. Verify no genuine threshold crossing is missed and quality/context-retention tests do not regress.

## Decision points
- Detailed iterations available: occupancy uses final model-message state, not summed message iterations.
- Explicit provider omission signal: local addition may be used and must be labeled.
- Missing/contradictory inclusion evidence: mark occupancy confidence low and block automatic optimization.

## Expected output
Normalized accounting table, decision replay, inflation ratio, root cause, proposed mapping, verification result.

## Metrics
Premature compactions, occupancy error, tokens/task, compactions/task, cache reuse, latency, quality regression.

## Verification
Independent replay must reproduce both old and new decisions from immutable traces.

## Failure handling
Retry schema mapping twice. If telemetry cannot distinguish cumulative from final-state values, escalate as ambiguous.

## Stop conditions
Stop after two mapping retries, any missed genuine overflow, or once corrected accounting passes independent replay and quality checks.