# Skill: Retry Episode Analysis

## Purpose
Diagnose and correct retry-budget lifecycle defects in agent state machines without exposing hidden chain-of-thought.

## Trigger
Premature retry exhaustion, repeated identical retries, recovery loops, or inconsistent retry counters after successful tool/model transitions.

## Inputs
Structured event log with failure class, operation, state fingerprint, attempt, recovery action, outcome, and timestamps; retry policy; relevant state-machine code.

## Preconditions
Events must be ordered and redact secrets. Define observable success/recovery boundaries before changing reset logic.

## Required context
Retryable vs terminal failure classes, operation identity, side-effect/idempotency semantics, and turn/session boundaries.

## Allowed tools
Read-only logs/code, tests, `scripts/retry_episode_guard.py`, deterministic state-machine simulations.

## Constraints
Never retry unsafe, authorization-denied, or known non-transient actions merely to improve completion rate. Do not reset counters without an observable recovery event.

## Procedure
1. Capture a failing trace and a successful control trace.
2. Partition events into candidate episodes by failure class + operation + state fingerprint.
3. Mark verified recovery boundaries.
4. Check whether attempts leak across recovered episodes or reset within an unresolved episode.
5. Record Facts, Evidence, Hypothesis, Decision, Risk, Verification status.
6. Change one lifecycle rule.
7. Replay both traces plus a consecutive-failure control.
8. Compare premature-stop rate, repeated-identical retries, and total retry cost.

## Decision points
A new episode starts only after a verified recovery boundary or meaningful operation/state change. Consecutive identical failures stay in one episode. A second identical failure requires a changed recovery action or stop.

## Expected output
Episode ledger, lifecycle defect, scoped fix, replay results, and verification state.

## Metrics
Premature terminations, attempts/episode, identical-retry ratio, successful recoveries, recovery tokens/calls, terminal-message accuracy.

## Verification
At minimum test: non-consecutive failures reset; consecutive failures remain bounded; terminal failure never retries; changed strategy is required at threshold.

## Failure handling
Maximum two lifecycle hypotheses per investigation. Revert changes that enable additional side effects or unsafe retries.

## Stop conditions
All regression cases pass; two hypotheses fail; or safe episode identity cannot be determined from available events.
