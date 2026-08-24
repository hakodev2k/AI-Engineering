# Workflow: Measure, Optimize, Verify

## Trigger
A multimodal session is slow, memory-heavy, disk-heavy, or expensive to resume/fork.

## Goal
Reduce materialization amplification with measurable evidence.

## Inputs
Transcript, budgets, workload command, correctness checks.

## Baseline
Run `scripts/transcript_profile.py` and capture peak RSS plus elapsed time for the real operation.

## Stages
1. Observe symptoms.
2. Measure baseline.
3. Diagnose dominant amplification source.
4. Form one hypothesis.
5. Implement one bounded improvement.
6. Measure the same workload again.
7. If not improved, re-evaluate once.
8. Independently verify.

## Responsible agent
Performance investigator implements; verifier verifies.

## Tools
Profiler, OS memory/time measurement, runtime diagnostics.

## Outputs
Before/after profiles, resource metrics, verification decision.

## Checkpoints
Baseline, first re-measure, optional second re-measure.

## Metrics
Transcript size, base64 ratio, duplicate ratio, projected materialization, peak RSS, elapsed time, failures.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Verified improvement, no safe optimization, or retry exhaustion.

## Failure path
Preserve baseline and block risky automatic fan-out/resume under the violated budget.

## Verification
Independent verifier compares like-for-like workloads.

## Definition of Done
Measured improvement plus correctness and regression verification.