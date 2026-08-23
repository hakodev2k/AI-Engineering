# Workflow: Baseline → Diagnose → Verify

## Trigger
New desktop build, host-lag incident or suspected idle resource regression.

## Goal
Produce measurable evidence and block rollout when sustained host impact exceeds policy.

## Inputs
Known-good/candidate build, target process and threshold file.

## Baseline
Run the probe on the known-good build with the candidate's duration/interval.

## Context
Record OS/app versions, integrations and idle/active state.

## Stages
1. Observe.
2. Measure baseline.
3. Measure candidate.
4. Diagnose dominant dimension and descendant churn.
5. Form one hypothesis.
6. Implement one reversible improvement.
7. Measure again.
8. Independent verification.

## Responsible agent
Windows Performance Investigator; independent verifier at final checkpoint.

## Tools
Package probe, logs and OS resource tools.

## Outputs
Baseline, candidate and after JSON plus decision record.

## Checkpoints
Do not change configuration before baseline. Exit 2/3/4 blocks rollout.

## Metrics
Mean/peak CPU, sustained CPU breaches, read/write throughput, memory, process count and PID churn.

## Retry policy
At most three loops; each retry requires a changed evidence-backed hypothesis.

## Stop conditions
Verified pass, three unsuccessful hypotheses, or a proposal requiring weakened security.

## Failure path
Preserve reports and escalate with version, reproduction and dominant metrics.

## Verification
Repeat candidate measurement after remediation and require deterministic pass.

## Definition of Done
Baseline/candidate measured, cause narrowed, before/after compared, tests pass and independent verification recorded.
