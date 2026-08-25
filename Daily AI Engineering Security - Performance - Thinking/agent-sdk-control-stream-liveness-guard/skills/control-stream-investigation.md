# Skill: Control-Stream Investigation

## Purpose
Find whether agent failures and latency come from transport teardown occurring before dependent work settles.

## Trigger
`Stream closed`, missing permission callbacks, tool failures after an earlier success/result, background-agent failure, or debug-sensitive behavior.

## Inputs
Lifecycle trace, SDK/host version, workload, failure logs, tool side-effect classification.

## Preconditions
Do not retry non-idempotent tools until outcome is reconciled. Capture a baseline before code changes.

## Required context
How input, result, permission, MCP and worker events map onto transport open/close.

## Allowed tools
Trace/log inspection, deterministic analyzer, profiler/timestamps, unit/integration tests.

## Constraints
No unbounded waits. No performance claim without before/after metrics. Debug mode may be diagnostic evidence but not the production fix.

## Procedure
1. Reproduce with a minimal multi-tool workload and capture timestamps.
2. Run `scripts/control_stream_guard.py`.
3. Identify active dependents at every close attempt.
4. Separate transport failures from tool/network/model failures.
5. Form one lifecycle hypothesis at a time.
6. Add or move a settlement barrier.
7. Replay the same workload at least three times if nondeterministic and compare latency/failure metrics.
8. Independently review cancellation and shutdown paths.

## Decision points
Premature close observed → lifecycle defect confirmed. No premature close but `Stream closed` occurs → inspect lower transport/process failure. Debug-only success → retain timing-race hypothesis and use event ordering, not debug mode, as verification.

## Expected output
Baseline metrics, event-order evidence, root-cause hypothesis, proposed barrier, benchmark comparison, verification status.

## Metrics
Failure rate, retries, premature closes, p50/p95 latency, settlement-to-close delay.

## Verification
No close event while any tracked dependent is active; shutdown remains bounded.

## Failure handling
Maximum two implementation retries per hypothesis, then re-diagnose.

## Stop conditions
Verified fix, falsified hypothesis with evidence, or unresolved risk requiring SDK/vendor escalation.
