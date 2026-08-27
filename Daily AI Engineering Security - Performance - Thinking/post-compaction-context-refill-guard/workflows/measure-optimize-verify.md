# Workflow: Measure → Optimize → Verify

## Trigger
Compaction thrashing or abnormal post-compaction token growth.

## Goal
Reduce avoidable refill without correctness loss.

## Inputs
Representative trace, active context window, token budget, and task acceptance checks.

## Baseline
Run the workload unchanged through one compaction boundary.

## Stages
1. Observe refill symptoms.
2. Measure source-level baseline.
3. Diagnose the largest avoidable source.
4. Form a falsifiable hypothesis.
5. Implement one bounded optimization.
6. Repeat the identical workload.
7. If not improved, re-evaluate once; maximum 2 optimization attempts.
8. Independent verification.

## Checkpoints
Baseline captured; required sources present; after-change metrics captured; quality checks pass.

## Metrics
Refill fraction, static fraction, cache-read ratio, tokens/task, latency, quality regression rate.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Required context loss, quality regression, or exhausted retries.

## Failure path
Restore baseline configuration and use lazy retrieval or fresh-session state transfer.

## Verification
Token Verifier must independently review the measurement and acceptance checks.

## Definition of Done
Budget passes, measurable reduction exists, acceptance checks pass, verifier signs off.
