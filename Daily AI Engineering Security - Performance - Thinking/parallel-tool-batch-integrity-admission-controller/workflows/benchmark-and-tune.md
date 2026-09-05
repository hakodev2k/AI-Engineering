# Workflow: Benchmark and Tune Parallel Admission

## Trigger
Performance tuning or runtime/provider/toolchain change.

## Goal
Choose the highest verified concurrency that improves performance without result loss.

## Inputs
Representative workload/traces, SLO config, tool safety metadata.

## Baseline
Concurrency 1 on the same workload distribution.

## Stages
1. Observe current behavior and incidents.
2. Measure baseline completeness and latency.
3. Test concurrency levels 2..N.
4. Diagnose first integrity/latency failure boundary.
5. Form hypothesis.
6. Implement hard cap or targeted result-delivery fix.
7. Measure again.
8. If improved, verify; if not, re-evaluate once.
9. Independent Benchmark Verifier reviews.

## Responsible agent
Performance investigator; verifier is independent.

## Tools
Benchmark harness, trace analyzer, runtime telemetry.

## Outputs
Baseline, per-level results, selected cap, before/after comparison, verification decision.

## Checkpoints
Do not advance a concurrency level after an integrity failure without diagnosis.

## Metrics
Completeness, p95 latency, throughput, retries, wasted calls.

## Retry policy
Maximum 2 optimization cycles.

## Stop conditions
Second failed cycle; no verified level; unsafe state conflict; missing baseline.

## Failure path
Return to concurrency 1 or last verified level and escalate.

## Verification
Independent replay and analyzer run.

## Definition of Done
Selected cap satisfies integrity and latency SLO with reproducible evidence.