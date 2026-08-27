# Workflow: Measure, Diagnose, Optimize Long Sessions

## Trigger
Projected context is high, compaction repeats, cache reuse drops, or long-idle continuation is planned.

## Goal
Reduce token/cost/latency while preserving correctness and task continuity.

## Inputs
Session telemetry, pending inputs, context limit, task requirements, policy.

## Baseline
Capture tokens/request, latency, cache-read ratio, cache-creation tokens, compaction frequency, and quality-test result.

## Stages
1. **Observe:** collect current and pending token sources.
2. **Measure baseline:** persist the metrics above.
3. **Diagnose:** identify whether risk comes from tool output, retrieval, history, cache loss, or insufficient post-compaction runway.
4. **Form hypothesis:** one explicit, testable cause.
5. **Run budget guard:** obtain `continue`, `checkpoint_or_compact`, or `new_session_with_checkpoint`.
6. **Implement:** checkpoint/compact only context classes identified as redundant or safely summarizable.
7. **Measure again:** repeat token/cache/latency metrics.
8. **Improved?** If no, revise the hypothesis once; maximum two optimization attempts total.
9. **Verify:** independent Context Budget Verifier checks quality and critical-context retention.

## Checkpoints
Before compaction; immediately after; before resuming privileged or irreversible work.

## Metrics
Projected utilization, runway, cache-read ratio, tokens/task, latency, quality regression.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Quality regression, missing critical state, inconsistent telemetry, or exhausted retries.

## Failure path
Restore/checkpoint known-good task state and continue in a new session if safe.

## Verification
Run task-specific tests and independent verification.

## Definition of Done
Before/after metrics exist, context risk is measurably reduced, quality passes, and independent verification passes.
