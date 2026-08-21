# Workflow: Measure → Diagnose → Optimize

## Trigger
Latency, retries, queue age, call count, or token cost exceeds an agreed threshold.

## Goal
Reduce load amplification while maintaining or improving successful throughput.

## Inputs
Capacity policy, workload fixture, trace/metric export, acceptance thresholds.

## Baseline
Run the same workload before changes and record p50/p95/p99 latency, throughput, retries/task, calls/task, tokens/task, queue age, and errors.

## Stages
1. **Observe** — collect workload and dependency facts.
2. **Measure** — run baseline and save metrics.
3. **Diagnose** — Performance Investigator identifies one dominant bottleneck.
4. **Hypothesize** — choose one bounded policy change.
5. **Implement** — update dispatch guard/config only.
6. **Measure again** — repeat equivalent workload.
7. **Compare** — accept only if target metrics improve without correctness/security regression.
8. **Verify** — independent reviewer checks config, evidence, and stop behavior.

## Checkpoints
Baseline exists; error classes known; policy valid; retry loop bounded; post-change evidence captured.

## Retry policy
At most two policy-tuning attempts for one hypothesis. Each attempt must change one principal variable.

## Stop conditions
Stop on exhausted attempts, worse error rate, expired task deadline, safety regression, or verified target achievement.

## Failure path
Restore previous policy, retain benchmark evidence, classify hypothesis as falsified/inconclusive, escalate to dependency investigation.

## Verification
A separate reviewer confirms the benchmark uses equivalent load and that no hidden capacity increase explains the result.

## Definition of Done
Implemented: guard/config active. Measured: before/after metrics captured. Verified: target improvement reproduced and bounds/safety checks pass.
