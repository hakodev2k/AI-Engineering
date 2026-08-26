# Workflow: Measure → Diagnose → Hypothesize → Optimize → Measure Again
## Trigger
Repeated empty/truncated responses or unexpected model-call amplification.
## Goal
Reduce wasted retries while preserving output quality and safety.
## Inputs
Trace events, model/provider configuration, retry policy, representative tasks.
## Baseline
Measure model calls/turn, p50/p95 latency, token usage, failure rate and recovery rate.
## Stages
1. **Observe:** capture response metadata for failures.
2. **Measure baseline:** compute calls and latency by failure class.
3. **Diagnose:** run deterministic classification.
4. **Form hypothesis:** e.g. same-budget reasoning truncation is deterministic.
5. **Implement improvement:** apply one policy change.
6. **Measure again:** replay representative fixtures/tasks.
7. **Improved?** If no, permit at most 2 hypothesis revisions.
8. **Verify:** independent review confirms lower waste with unchanged acceptance criteria.
## Responsible agent
Performance Investigator measures; implementation owner changes policy; independent reviewer verifies.
## Tools
Telemetry, `scripts/retry_budget_guard.py`, unit tests.
## Outputs
Before/after metrics and verified policy.
## Checkpoints
After baseline; after classification; after each policy change.
## Metrics
Calls/failed turn, GPU/API seconds, p95 latency, recovery rate, quality regression rate.
## Retry policy
Maximum 2 optimization iterations. Runtime retry caps remain policy-controlled.
## Stop conditions
No measurable improvement after 2 iterations, quality regression, security regression, or cost ceiling.
## Failure path
Restore prior safe policy and escalate with measurements.
## Definition of Done
Lower wasted calls/latency on target failure class, tests pass, quality/safety acceptance criteria unchanged.
