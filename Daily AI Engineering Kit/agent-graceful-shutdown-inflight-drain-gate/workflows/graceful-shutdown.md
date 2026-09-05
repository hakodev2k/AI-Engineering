# Workflow: Graceful Shutdown and In-Flight Drain

## Trigger
Host lifecycle, deployment, worker, queue consumer, timeout, cancellation, or shutdown configuration changes.

## Entry conditions
Repository readable; work sources known enough to investigate; relevant runtime/deployment configuration available.

## Stages
1. **Pre-change validation** — record revision and capture baseline lifecycle evidence.
2. **Explore** — Lifecycle Explorer maps admission, signals, cancellation, work duration, and ack/checkpoint behavior.
3. **Plan** — Drain Planner defines bounded ordering and timing.
4. **Implement** — implementation owner makes the smallest safe change.
5. **Lifecycle test** — start work, trigger shutdown, assert admission closes and in-flight disposition is safe.
6. **Capture candidate** — produce comparable shutdown snapshot.
7. **Gate** — run deterministic `shutdown_drain_gate.py`.
8. **Approval checkpoint** — stop before production lifecycle/infrastructure/acknowledgement changes requiring human approval.
9. **Verify** — independent Verification Agent inspects report, diff, tests, and approvals.
10. **Complete** — only when Definition of Done passes.

## Produced artifacts
Baseline/candidate lifecycle evidence, gate report, timeout rationale, lifecycle tests, host build/test output, approval record when required, verification result.

## Retry rules
Transient tool/environment failure: maximum 2 retries. Build/test/gate implementation failure: maximum 2 fix cycles. Permission/approval/business-rule failure: no automatic retry.

## Failure paths
Admission leak -> fix ordering. Premature termination -> adjust evidence-backed time budget. Unsafe ack/checkpoint -> stop and redesign. Unknown side-effect state -> stop and escalate. Retry budget exhausted -> preserve evidence and stop.

## Definition of Done
All work sources mapped, gate passes, lifecycle tests pass, acknowledgement/checkpoint safety proven, host validation passes, required approvals exist, verifier returns `verified`, and no blocking failure remains.
