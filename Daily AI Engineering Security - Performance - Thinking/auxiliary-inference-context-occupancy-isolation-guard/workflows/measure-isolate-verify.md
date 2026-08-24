# Workflow — Measure, Isolate, Verify
## Trigger
Auxiliary-call context spike, premature compaction or overflow.
## Goal
Correct occupancy semantics with measurable performance improvement.
## Inputs
Runtime version, trace, policy and benchmark workload.
## Baseline
Parent/child tokens, occupancy, compactions/task, overflows and latency.
## Stages
Observe → measure baseline → diagnose source semantics → form one hypothesis → isolate child usage → replay → compare → independent verification.
## Responsible agent
Implementer changes accounting; benchmark verifier independently verifies.
## Tools
Checker, tests, traces and benchmark workload.
## Outputs
Before/after traces and verification decision.
## Checkpoints
Before change, after each replay, before deployment.
## Metrics
Occupancy drift, compactions/task, overflow rate, tokens and latency.
## Retry policy
Maximum two diagnosis/implementation iterations.
## Stop conditions
Verified improvement, regression, or retry limit.
## Failure path
Restore last known-good occupancy source and escalate provider-semantic ambiguity.
## Definition of Done
Occupancy invariant passes and measured performance improves or correctness risk is removed without hidden usage.