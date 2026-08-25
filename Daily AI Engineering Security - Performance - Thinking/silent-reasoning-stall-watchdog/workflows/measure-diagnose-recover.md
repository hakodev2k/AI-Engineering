# Workflow: Measure, Diagnose, Recover

## Trigger
A long progress-silent turn or elevated stalled-turn rate.

## Goal
Reduce stall latency/token waste without increasing false cancellation or weakening safety.

## Inputs
Trace, workload, adapter/model version, baseline thresholds.

## Baseline
Capture at least three known-good traces from the same workload class; record p95 visible-progress gap and normal token delta between progress events.

## Stages
1. **Observe** — preserve raw normalized events.
2. **Measure baseline** — establish comparison thresholds.
3. **Diagnose** — run `stall_watchdog.py`; validate classification from event timestamps.
4. **Form hypothesis** — select model budget, stream/reconnect, host event projection, or orchestration state.
5. **Implement improvement** — make one reversible change.
6. **Measure again** — repeat the same workload.
7. **Improved?** — require better gap/stall/token metrics with false-cancel budget preserved.
8. **Verify** — independent reviewer reruns test and comparison.

## Responsible agent
Performance Investigator for stages 1-6; independent verifier for stage 8.

## Tools
Read-only telemetry, watchdog script, tests, adapter-specific benchmark harness.

## Outputs
Before/after metrics, classification, hypothesis, intervention, risks, verification decision.

## Checkpoints
Evidence valid before diagnosis; side effects reconciled before cancellation/retry; same workload before comparison.

## Metrics
p95 progress gap, silent token delta, stall rate, recovery time, false-cancel rate.

## Retry policy
Maximum two automated recovery attempts. Each retry must change a diagnosed mechanism or stop.

## Stop conditions
Verified improvement; two failed attempts; invalid evidence; unreconciled mutation; safety regression.

## Failure path
Preserve trace/configuration, revert optimization if safe, escalate to adapter/provider owner.

## Definition of Done
Implemented, Measured, and Verified recorded; tests pass; no safety boundary changed; no blocking stall remains for the reproduction.
