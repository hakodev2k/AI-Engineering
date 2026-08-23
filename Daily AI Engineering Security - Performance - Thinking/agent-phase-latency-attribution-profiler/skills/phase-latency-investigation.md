# Skill: Phase Latency Investigation

## Purpose
Find the real latency bottleneck in an agent run without confusing waiting time with execution time.

## Trigger
Latency SLO breach, “slow tool” claim, multi-minute turn, retry storm suspicion, approval-gated delay, or planned performance change.

## Inputs
Phase JSONL trace, workload identifier, model/version, approval mode, cache state if available, run timestamps.

## Preconditions
Phase boundaries must be sourced from host/runtime events or independently measurable timestamps. Do not let model narrative define timings.

## Allowed tools
Trace/log readers, `scripts/profile_latency.py`, statistics tooling, deterministic workload runner.

## Constraints
Never optimize by bypassing security/approval/correctness requirements. Do not claim a phase is slow from end-to-end time alone.

## Procedure
1. Capture at least three baseline runs when feasible.
2. Validate traces for malformed or overlapping intervals.
3. Measure wall time, per-phase duration/share, and unattributed gaps.
4. Identify the dominant measured phase and variance.
5. Form one falsifiable hypothesis for that phase.
6. Change one relevant mechanism only.
7. Repeat equivalent runs under comparable conditions.
8. Compare the targeted phase and end-to-end metrics.
9. Run independent verification before claiming improvement.

## Decision points
- Overlap/invalid trace: instrumentation failure, not performance evidence.
- Large gaps: improve instrumentation before diagnosis.
- Approval/queue dominant: do not optimize the tool implementation.
- Tool dominant: investigate the named tool itself.
- Retry dominant: inspect failure/retry policy.

## Expected output
Phase breakdown, dominant phase, hypothesis, before/after evidence, verification status.

## Metrics
p50/p95 wall time and targeted phase; gap ratio; retry share; tool duration; approval wait.

## Verification
Equivalent workload, same security policy, sufficient repeated runs, no overlap, bounded gap budget.

## Failure handling
Retry instrumentation collection at most twice. Mark comparison inconclusive when environment/provider conditions differ materially.

## Stop conditions
No valid baseline, unresolved overlapping spans, or optimization would require weakening required safety/correctness.