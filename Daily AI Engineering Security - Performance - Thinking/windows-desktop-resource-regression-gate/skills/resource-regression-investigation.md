# Skill: Resource Regression Investigation

## Purpose
Turn a Windows AI-desktop slowdown into reproducible, attributable performance evidence.

## Trigger
After an upgrade, host-wide lag report, unexplained idle CPU/I/O, or recurring integration-process churn.

## Inputs
Target process, known-good/candidate versions, threshold policy and reproduction notes.

## Preconditions
Comparable hardware/background workload; security controls remain enabled.

## Required context
OS/app versions, active integrations, intended idle/active state.

## Allowed tools
Package probe, Task Manager/Resource Monitor for corroboration, logs, Event Viewer, version metadata.

## Constraints
Measure before changing configuration. Change one hypothesis variable at a time. Never infer causality from one sample or weaken security to pass.

## Procedure
1. Record environment and integrations.
2. Capture a known-good baseline when available.
3. Capture the suspect state with the same duration/interval.
4. Compare sustained CPU, I/O, memory and descendant churn.
5. Classify CPU spin, I/O storm, memory growth, process churn or mixed.
6. Form one testable root-cause hypothesis.
7. Apply one reversible change.
8. Re-measure under the same contract.
9. Repeat at most three hypotheses; then escalate with evidence.

## Decision points
Single spikes do not fail unless policy explicitly says so. Process exit is inconclusive. Preserve lineage before changing a dominant child process.

## Expected output
Baseline, suspect and after reports; hypothesis; change; verification status.

## Metrics
Relative CPU/I/O/memory deltas, sustained breach count, process count and PID churn.

## Verification
Require like-for-like before/after comparison and passing package tests.

## Failure handling
Missing counters => error; target exit => inconclusive; inconsistent conditions => repeat once then escalate.

## Stop conditions
Three failed hypotheses, no reproducible signal, or remediation requiring security weakening.
