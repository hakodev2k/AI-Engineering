# Bulkhead Isolation Workflow

## Trigger
Use when a shared worker/resource pool shows saturation, starvation, timeout amplification, or when a new high-latency/high-risk workload is introduced.

## Entry conditions
- A concrete workload and shared finite resource can be named.
- The repository/configuration can be inspected.
- Verification can run outside production.

## Inputs
Task statement, repository, current runtime configuration, telemetry, dependency limits, SLOs, acceptance criteria.

## Context
Load only the modules that create/use the shared resource, adjacent tests, retry/timeout configuration, and evidence needed to validate hypotheses.

## Stages
1. **Map** — Resource Mapper identifies workloads, shared pools, downstream limits, and saturation evidence.
2. **Plan** — Bulkhead Planner chooses partitions, bounded concurrency/queue/deadline/retry behavior and a minimal change set.
3. **Policy gate** — run `python scripts/validate_bulkhead.py --policy config/bulkhead-policy.yaml`.
4. **Implement** — Implementation Agent applies the smallest safe change and adds tests/metrics required by the plan.
5. **Local verification** — run project tests plus `python -m unittest tests/test_validate_bulkhead.py`.
6. **Isolation verification** — Verification Agent overloads one partition in a non-production test and confirms healthy partitions retain permits and meet agreed error/latency bounds.
7. **Diff review** — inspect changed files for unrelated edits, unbounded queues/retries, removed cancellation, secrets, or approval-boundary changes.
8. **Complete** — report `verified` only when all checks pass.

## Produced artifacts
Policy, implementation diff, test evidence, saturation evidence, and a final verification result.

## Checkpoints
- After mapping: shared bottleneck is supported by evidence.
- After planning: every limit is bounded and justified or marked provisional.
- Before implementation: no dangerous action is required.
- Before completion: independent verification succeeds.

## Retry rules
- Transient test/tool failure: retry at most 2 times; preserve logs from each attempt.
- Build/test failure caused by the implementation: implementation agent may fix and retest at most 2 cycles.
- Policy validation failure: no retry without changing invalid policy; preserve validator output.
- Permission or production-access failure: do not retry by escalating privileges; stop and escalate.

## Approval points
Explicit human approval is required before production capacity/configuration changes, disabling isolation, infrastructure changes, secret changes, or permission expansion.

## Failure paths
- Missing evidence: mark plan provisional and stop before production tuning.
- Starvation still reproduced: split partitions further or reduce per-partition limits, then re-run one bounded verification cycle.
- Repeated failure after retry budget: status `failed`; preserve evidence and unresolved hypothesis.

## Definition of Done
- Resource map exists.
- Policy validator passes.
- Relevant project tests and package tests pass.
- Saturation test demonstrates isolation.
- Queue, timeout, and retry behavior are bounded.
- No unintended changes or secrets are present.
- Required approvals exist for any approval-boundary action.
- Independent verifier returns `verified`.
