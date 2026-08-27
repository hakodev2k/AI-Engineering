# Workflow: Regression Verification
**Trigger:** lifecycle, transport, discovery, keepalive, or retry code changes.  
**Goal:** prove recovery behavior remains correct across HTTP and stdio.

## Baseline
Fixtures for 502 initialization, protocol incompatibility, stale stdio handle with live server, and confirmed process death.

## Stages
1. Run unit tests.
2. Replay transient HTTP error and confirm bounded retry.
3. Replay protocol error and confirm fail-fast.
4. Replay stale-handle/live-process case and confirm reconciliation.
5. Replay confirmed death and confirm stop.
6. Compare retry count and readiness latency with baseline.

## Retry policy
One implementation correction and one full rerun.

## Stop conditions
Unbounded retry, terminal error retried, or live server permanently disabled.

## Verification
Independent reviewer signs off on state transitions.

## Definition of Done
All fixtures pass and metrics show no retry storm or false terminal failure.
