# Workflow: Measure → Diagnose → Enforce → Verify

## Trigger
A background AI feature is introduced, changed, suspected of invisible spend, or shows abnormal quota/token use.

## Goal
Reduce unproductive background model activity while preserving useful outputs.

## Inputs
JSONL trace, budget thresholds, representative workload, baseline results.

## Baseline
Run the workload without new controls and record total/background requests, input/output/cached tokens, wall time, useful artifacts, and task success.

## Stages
1. **Observe:** collect trace without changing behavior.
2. **Measure:** run `background_budget_guard.py --report-only` and capture attribution/usage totals.
3. **Diagnose:** classify violations as missing attribution, repeated state, excessive retries, absent progress, or oversized budget.
4. **Hypothesize:** choose one mechanism expected to reduce the violation.
5. **Implement:** add identity propagation, progress gating, retry bounds, or a job budget.
6. **Measure again:** replay the same workload and collect identical metrics.
7. **Verify:** compare success/utility plus spend; have a reviewer independent from the implementation confirm evidence.

## Responsible agent
Performance/Token investigator implements instrumentation; independent verifier evaluates results.

## Tools
Runtime logs, normalized JSONL exporter, package script, deterministic tests.

## Outputs
Baseline report, diagnosis, changed policy, post-change report, verification decision.

## Checkpoints
- CP1: ≥99.9% requests attributed, otherwise stop.
- CP2: baseline captured before optimization.
- CP3: no-progress semantics documented.
- CP4: post-change workload is comparable to baseline.

## Metrics
Background tokens/task, requests/task, idle requests/hour, repeated-state turns, useful artifacts/request, quality regression rate.

## Retry policy
At most 3 optimization iterations. Each iteration must change the hypothesis or evidence; repeating the same failed change is prohibited.

## Stop conditions
Stop on missing attribution, budget breach, quality regression beyond tolerance, or after 3 unsuccessful optimization iterations.

## Failure path
Pause the affected background feature/job, retain trace evidence, revert the latest optimization if it caused regression, and escalate with the smallest reproducible trace.

## Verification
Implemented = controls exist. Measured = before/after metrics exist. Verified = spend/loop metric improves, quality is within tolerance, all requests are attributable, and tests pass.

## Definition of Done
Evidence documented; baseline captured; limitations and root cause recorded; controls implemented; tests pass; before/after metrics collected; no hard-budget/no-progress violation remains; independent verification complete.
