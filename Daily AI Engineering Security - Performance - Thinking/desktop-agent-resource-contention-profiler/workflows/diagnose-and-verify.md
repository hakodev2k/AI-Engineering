# Workflow: Diagnose and Verify Resource Contention

## Trigger
Repeatable system/UI lag associated with an AI desktop/CLI agent.

## Goal
Identify a measurable bottleneck and prove or falsify a bounded remediation.

## Inputs
Trace CSV, thresholds, fixed workload, environment metadata.

## Baseline
Capture idle plus active samples before any change.

## Context
Use `../skills/measure-host-contention.md` and `../rules/performance-rules.md`.

## Stages
1. Observe — record symptom and environment.
2. Measure baseline — collect raw trace and run the profiler.
3. Diagnose — rank at most three hypotheses from observed metrics.
4. Form hypothesis — define the metric expected to change.
5. Implement one reversible improvement with security unchanged.
6. Measure again — same workload and sampling.
7. Improved? If no, revert and try the next hypothesis; maximum 3 attempts. If yes, continue.
8. Verify — independent reviewer checks raw traces and regression thresholds.

## Responsible agent
Performance Investigator; independent verifier for stage 8.

## Tools
`python scripts/profile_contention.py TRACE --thresholds config/thresholds.json`

## Outputs
Baseline report, changed-state report, comparison notes, verification decision.

## Checkpoints
Baseline captured; intervention isolated; post-change trace comparable; threshold gate passed.

## Metrics
p95/p99 input latency, CPU/read/write/RSS/event-loop lag, active/idle ratio.

## Retry policy
Maximum three hypotheses. No automatic retry after a breach without changing the hypothesis.

## Stop conditions
Stop if symptom is not reproducible, measurements are invalid, or three hypotheses fail.

## Failure path
Preserve traces, revert experimental changes, document unresolved evidence, escalate.

## Verification
The verifier checks three comparable runs and confirms no security boundary was weakened.

## Definition of Done
Implemented: profiler/workflow available. Measured: before/after metrics captured. Verified: independent review confirms threshold improvement and no regression.
