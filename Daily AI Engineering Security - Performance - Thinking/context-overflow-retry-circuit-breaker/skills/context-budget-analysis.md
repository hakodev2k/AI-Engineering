# Skill: Context Budget Analysis

## Purpose
Prevent unrecoverable context-overflow retries by separating immutable and evictable context, normalizing overflow evidence, and requiring measurable compaction progress.

## Trigger
Before large model calls, after any context-limit/provider-capacity error, or when an agent begins repeated compaction/retry cycles.

## Inputs
Model context limit, reserved output, system/tool-schema tokens, history/tool-output tokens, provider error, retry count, prior prompt size, quality requirements.

## Preconditions
A tokenizer or provider token estimate is available and critical task requirements are identified.

## Required context
Only the content needed to preserve task correctness; do not discard required constraints to hit a token target.

## Allowed tools
Token counters, context profiler, circuit-breaker script, read-only traces, regression tests.

## Constraints
MUST classify deterministic capacity failures before generic retry logic. MUST NOT retry the same oversized signature indefinitely. MUST NOT compress away security policy or correctness-critical requirements.

## Procedure
1. Measure total input, reserved output, immutable context, evictable history, retrieved/tool output, and model limit.
2. Run preflight: `input + reserve + safety margin <= limit`.
3. Normalize provider error evidence, including unknown/zero-output near-limit signals.
4. If overflow is recoverable, compact only evictable context.
5. Re-measure and require configured minimum token reduction.
6. Re-run preflight; maximum two compaction attempts.
7. If immutable context cannot fit or progress stalls, fail fast with an actionable reason/model-routing option.
8. Compare result quality against a representative baseline before rollout.

## Decision points
Proceed; compact then recheck; fail fast; or route to a model with sufficient capacity when policy permits.

## Expected output
Token budget table, normalized failure class, decision, compaction delta, quality/regression status.

## Metrics
Input tokens/task, retry count, compaction attempts, overflow recovery rate, cost/task, latency, result-quality regression rate.

## Verification
Circuit-breaker tests pass and quality fixtures show no critical context loss.

## Failure handling
Preserve the original task state, emit a deterministic reason, and stop repeated requests. Escalate when required immutable context exceeds capacity.

## Stop conditions
Maximum two compaction attempts and one repeated-signature retry; stop earlier if required context would be removed.
