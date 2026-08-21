# Skill: Flaky Test Triage and Recovery

## Purpose
Diagnose nondeterministic automated tests without normalizing retries as the solution.

## Trigger
A test alternates pass/fail without product changes, is quarantined, or causes repeated CI noise.

## Inputs
Failure history, traces/logs/screenshots, test code, fixture/config, worker/shard data, environment status, recent code changes.

## Procedure
1. Confirm nondeterminism from historical evidence; do not label flaky from one unexplained failure.
2. Categorize likely cause: timing/synchronization, shared state, test data collision, order dependency, infrastructure, external service, selector instability, clock/randomness, resource contention, product race.
3. Reproduce using a bounded stress command or repeated focused execution.
4. Reduce variables: one worker, fixed seed where possible, isolated data, trace enabled.
5. Identify the earliest causal divergence rather than the last assertion failure.
6. Fix root cause in test, fixture, product, or environment owner.
7. Re-run focused stress then affected suite.
8. Remove quarantine only after the acceptance threshold in config is met.
9. Record root cause and prevention lesson.

## Retry policy
Diagnostic reruns are capped. Runtime retries may collect evidence but cannot be used to claim the root cause is fixed.

## Stop conditions
After two unsuccessful diagnosis cycles with no stronger evidence, escalate with collected artifacts and hypotheses rather than continuing random changes.
