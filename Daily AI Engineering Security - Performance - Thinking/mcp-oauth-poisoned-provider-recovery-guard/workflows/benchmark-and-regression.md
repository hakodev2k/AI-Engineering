# Workflow — Benchmark and Regression

## Trigger
Any change to retry thresholds, provider lifetime, reconnect orchestration, or circuit behavior.

## Goal
Prove recovery improves liveness without retry amplification or cross-server disruption.

## Inputs
Baseline trace set, candidate implementation, policy, expected outcomes.

## Baseline
Record mean/p95 connection latency, retries/failure, provider recreations, parked duration, warnings/hour, full-process restarts.

## Stages
1. Replay ordinary transient connection failures.
2. Replay explicit lock-poison failure.
3. Replay repeated timeouts crossing poison threshold.
4. Replay post-recreation success.
5. Replay repeated poison until circuit opens.
6. Replay mixed healthy/unhealthy servers for isolation.
7. Compare before/after metrics and decisions.
8. Independent investigator reviews regressions.

## Checkpoints
Any increase in retry count; any whole-process effect; any credential/log exposure; any circuit that fails to bound retries.

## Retry policy
Maximum two implementation corrections per run.

## Stop conditions
Regression, exhausted correction budget, or verified improvement.

## Failure path
Restore previous verified configuration, preserve benchmark evidence, escalate.

## Verification
All tests pass; bounded attempts; provider generation changes; successful recovery resets only target server; no secret-bearing fixtures/logs.

## Definition of Done
Implemented, Measured, Verified states are distinct and documented; improvement is metric-backed.
