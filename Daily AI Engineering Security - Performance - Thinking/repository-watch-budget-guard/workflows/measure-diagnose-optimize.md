# Workflow: Measure → Diagnose → Optimize

## Trigger
Watcher startup, ENOSPC, utilization warning, repeated watcher starts, or teardown verification.

## Goal
Lower watcher allocation while preserving change-detection correctness.

## Inputs
PID scope, repository roots, ignore policy, watcher logs, configured thresholds.

## Baseline
Capture total/user and target-process watches, instances, limits, watcher-start count, and ENOSPC events.

## Stages
1. Observe and measure baseline.
2. Diagnose scope expansion, duplicate roots, repeated starts, and unreleased allocations.
3. Form one measurable hypothesis, such as excluding `.venv`/generated/Git-object trees or sharing a repository watcher.
4. Implement the smallest safe change.
5. Measure again under the same workload.
6. If not improved, perform at most one additional cycle with a different supported hypothesis.
7. Independently verify change-detection coverage plus release behavior.

## Responsible agent
Implementation owner changes watcher configuration/code; Watch Performance Investigator verifies.

## Tools
`inotify_budget.py`, watcher logs, repository test workload, file-change smoke tests.

## Outputs
Baseline, hypothesis, before/after metrics, correctness test evidence, final decision.

## Checkpoints
No optimization before baseline. No completion without a representative file-change detection test. No broad watcher start above the blocking threshold.

## Metrics
Watch count and utilization, target-process share, allocation delta, release ratio, startup count, event-detection success, ENOSPC count.

## Retry policy
Maximum two optimization cycles.

## Stop conditions
No measurable reduction after two distinct hypotheses, correctness regression, unknown capacity, or operator-required system tuning.

## Failure path
Use bounded polling or disable nonessential watcher-dependent behavior; record the limitation and escalate instead of consuming global capacity.

## Definition of Done
Before/after metrics show lower or safely bounded utilization, representative changes are detected, teardown releases expected watches, no ENOSPC occurs, and independent verification passes.