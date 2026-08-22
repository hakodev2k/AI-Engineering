# Workflow — Measure, Optimize, Verify Polling

## Trigger
A long-running agent workflow uses repeated status/wait polling.

## Goal
Reduce redundant model turns, context traffic, and status payload bytes without losing material progress or increasing completion detection beyond the accepted threshold.

## Inputs
Poll trace, status shape, task-duration expectations, policy config, token/model-call telemetry.

## Baseline
Collect polls/task, no-change polls, visible events, model calls, tokens, poll intervals, terminal-detection latency, stale-state count, and wall-clock duration.

## Stages
1. Observe a representative workload.
2. Measure baseline.
3. Define normalized material state.
4. Hypothesize which unchanged states can be suppressed.
5. Configure controller thresholds.
6. Replay baseline through `scripts/poll_guard.py`.
7. Run live canary workload.
8. Measure again.
9. Independent verification by `subagents/poll-verifier.md`.
10. Adopt, revise once, or rollback.

## Responsible agent
Performance investigator implements; Poll Performance Verifier independently checks results.

## Tools
Poll traces, telemetry, `scripts/poll_guard.py`, unit tests.

## Outputs
Policy, metrics comparison, suppressed-event audit, verification decision.

## Checkpoints
Baseline recorded; material fields reviewed; replay passes; live canary passes; verifier approves.

## Retry policy
At most two optimization iterations. A second iteration must change a documented hypothesis/threshold based on measured evidence.

## Stop conditions
Verified improvement, regression, insufficient evidence after two iterations, terminal workflow completion, or safety/accuracy concern.

## Failure path
Missed material change or excessive detection latency -> rollback config -> preserve baseline -> revise once -> otherwise escalate.

## Verification
No material status changes missed; terminal status emitted immediately; model-visible no-change events and model calls decrease; detection-latency SLO remains satisfied.

## Definition of Done
Before/after comparison complete, tests pass, thresholds bounded, circuit breaker tested, verifier approves, and no blocking regression remains.