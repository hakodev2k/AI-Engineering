# Workflow — Measure, Diagnose, Optimize

## Trigger
System-wide Windows responsiveness is suspected to regress with an AI desktop runtime.

## Goal
Localize and reduce the measured regression without speculative optimization.

## Inputs
App/process name, baseline/current scenarios, environment metadata, policy.

## Baseline
At least the configured minimum samples on the same machine.

## Context
Record Windows/app build, GPU/driver, feature state, task state, sample interval, and duration.

## Stages
1. Observe symptom and note current public signals.
2. Measure baseline.
3. Measure affected scenario.
4. Analyze and rank abnormal dimensions.
5. Form at most three hypotheses.
6. Run a reversible discriminating A/B experiment.
7. Implement only in the evidence-backed layer.
8. Measure again with identical collection settings.
9. Run regression gate plus correctness/security checks.
10. Independent verifier reviews.

## Responsible agent
Performance investigator through localization; implementation agent for fixes; independent verifier for final acceptance.

## Tools
PowerShell collector, Python analyzer, optional WPR/WPA after localization.

## Outputs
CSV evidence, JSON report, hypothesis table, before/after comparison.

## Checkpoints
No optimization before baseline. No `fixed` claim without after-measurement. No root-cause claim from correlation alone.

## Metrics
p95 input stalls, CPU, I/O, working set, handles, threads, process count; recovery ratio; UI-lag incidence.

## Retry policy
One bad-data recollection, three hypothesis experiments, two implementation attempts.

## Stop conditions
No reproducible regression, safety risk, incomparable environment, or retry limits reached.

## Failure path
Retain last known-good build/config where available, preserve evidence, and escalate with narrowed time/process window.

## Verification
Independent verifier must reproduce analyzer results and confirm no correctness/security regression.

## Definition of Done
Public evidence documented; baseline/current captured; dominant dimension measured; fix targets supported layer; after-run passes policy; tests pass; verifier accepts.
