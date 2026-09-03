# Workflow: Measure Optimize Verify

## Trigger
Trace payload budget violation, exporter drop, observability latency regression, or tracing rollout.

## Goal
Reduce telemetry overhead while preserving required diagnostic structure.

## Inputs
Representative trace dataset, `config/payload-budget.json`, application latency baseline, exporter errors.

## Baseline
Record workload identity, trace count, total bytes/task, p95/max span bytes, largest attributes, exporter errors, and tracing-enabled latency.

## Stages
1. Observe and collect a representative trace sample.
2. Measure baseline using `scripts/trace_payload_profiler.py`.
3. Diagnose dominant span/attribute contributors.
4. Form one explicit hypothesis.
5. Implement one retention/truncation/externalization improvement.
6. Measure the same workload again.
7. If thresholds do not improve, re-evaluate; maximum three attempts.
8. Independently verify protected fields and debugging evidence remain available.

## Responsible agent
Trace Performance Investigator; independent verifier owns final acceptance.

## Tools
Profiler script, application benchmark, exporter/backend metrics.

## Outputs
Baseline report, hypothesis log, optimized report, regression comparison, final verification status.

## Checkpoints
Baseline captured; first hypothesis approved; after-change metrics collected; protected-field review complete.

## Metrics
Bytes/task, p95/max span bytes, maximum attribute bytes, exporter drops, application latency delta, protected-field coverage.

## Retry policy
Maximum three optimization iterations. Do not silently relax budgets or remove protected fields to force a pass.

## Stop conditions
Verified improvement with acceptable diagnostic coverage; or three failed iterations requiring escalation.

## Failure path
Restore previous working telemetry config, preserve reports, and escalate transport/backend constraints.

## Definition of Done
Baseline and after metrics exist, configured thresholds pass or approved exception exists, protected fields remain, exporter drops are not hidden, tests pass, and independent verifier records Verified.
