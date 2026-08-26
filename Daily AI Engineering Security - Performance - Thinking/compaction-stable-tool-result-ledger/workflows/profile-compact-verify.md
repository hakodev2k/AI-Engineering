# Workflow: Profile, Compact, Verify

## Trigger
Long-running session exhibits repeated tool-output projection, cache misses, or compaction-driven re-reading.

## Goal
Reduce tokens and latency while preserving correctness and provenance.

## Inputs
Representative traces, provider usage, tool results, task-quality tests.

## Baseline
Input/output/cache tokens, duplicate raw bytes, compaction count, re-read count, latency, quality score.

## Stages
1. Observe full prompt/tool projection.
2. Measure baseline.
3. Diagnose duplicate and compaction boundaries.
4. Form one hypothesis about lost state or unstable replay.
5. Integrate durable ledger and bounded projection.
6. Measure again on identical tasks.
7. If not improved, tune at most twice.
8. Verify critical evidence and quality independently.

## Responsible agent
Context implementer plus independent Token Verifier.

## Tools
Ledger script, provider usage, unit tests, task benchmark.

## Outputs
Ledger metrics, before/after token data, quality report.

## Checkpoints
Before compaction change, after first projection, before release.

## Metrics
Tokens/task, duplicate projection, cache behavior, latency, task quality, regression rate.

## Retry policy
Maximum two budget/relevance tuning iterations.

## Stop conditions
Critical-context loss, secret persistence, or exhausted retries.

## Failure path
Disable projection optimization and return to source-grounded context.

## Verification
Token Verifier confirms critical evidence can still be retrieved and benchmark quality remains within baseline tolerance.

## Definition of Done
Lower token/context usage with equivalent or better quality and no critical context loss.
