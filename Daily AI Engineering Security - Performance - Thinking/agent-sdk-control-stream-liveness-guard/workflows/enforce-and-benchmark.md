# Workflow: Enforce and Benchmark

## Trigger
Diagnosis confirms teardown can occur with active dependents.

## Goal
Add a bounded lifecycle barrier and prove fewer failures/retries with acceptable latency.

## Inputs
Baseline, active-dependent model, shutdown deadline, regression workloads.

## Baseline
Reuse the exact workload and metrics from `measure-diagnose.md`.

## Stages
1. Instrument counters/sets for active turns, control requests and workers.
2. Gate normal transport close on all sets being empty.
3. Add bounded cancellation for shutdown/abort.
4. Reconcile side effects before retry paths.
5. Run unit tests.
6. Run representative workload at least three times.
7. Compare before/after latency, success rate and retries.
8. Independent reviewer validates close and cancellation paths.

## Responsible agent
Implementation owner plus separate performance investigator.

## Outputs
Barrier implementation and benchmark evidence.

## Checkpoints
After barrier; after cancellation path; after benchmarks; before release.

## Metrics
Premature closes target 0; `Stream closed` failures target 0 for covered workloads; retries lower than baseline; p95 latency within stated budget.

## Retry policy
At most two implementation iterations before returning to diagnosis.

## Stop conditions
Metrics and correctness pass, or blocking regression/escalation.

## Failure path
If liveness is fixed but latency grows materially, profile settlement ownership; do not reintroduce premature close or remove permission checks.

## Verification
Deterministic trace tests plus production-equivalent workload traces.

## Definition of Done
Implemented, measured and independently verified; shutdown remains bounded.
