# Workflow: Measure, Diagnose, Recover

## Trigger
Streaming agent SLO regression or stuck-task incident.
## Goal
Reduce semantic stalls and wasted retries using measured evidence.
## Inputs
Event traces, baseline metrics, event taxonomy, timeout/retry policy.
## Baseline
p50/p95/p99/max duration; completion/stall rate; retries; model/tool calls; duplicate effects.
## Context
Representative workload and side-effect semantics.
## Stages
Observe → measure baseline → classify transport/semantic gaps → form hypothesis → implement watchdog/threshold change → measure again → if not improved re-evaluate (max 2 iterations) → independent verify → complete.
## Responsible agent
Stream Stall Investigation diagnoses; runtime implementer changes policy; Performance Verifier verifies.
## Tools
Telemetry, included analyzer/tests, benchmark tooling.
## Outputs
Trace classification, threshold config, before/after metrics, verification record.
## Checkpoints
C1 baseline captured; C2 taxonomy validated; C3 recovery bounded/idempotency checked; C4 candidate measured; C5 independent verification.
## Metrics
Latency percentiles/max, stall/completion rate, semantic gaps, retries/task, calls/task, duplicate effects.
## Retry policy
Maximum two optimization iterations; runtime recovery maximum two attempts/task.
## Stop conditions
Overall deadline, unsafe replay, missing evidence, or two failed iterations.
## Failure path
Revert candidate policy and escalate with trace/metric evidence.
## Verification
Tests plus representative before/after workload comparison.
## Definition of Done
Measured improvement exists, regression checks pass, retry bounds hold, and verifier signs off.