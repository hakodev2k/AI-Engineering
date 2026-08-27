# Hook: Pre-Wait Barrier Validation

## Trigger
Immediately before a parent begins waiting on one or more child agents.

## Preconditions
Child IDs, start timestamps, required quorum, and policy are available.

## Action
Persist a state snapshot and run:
`python scripts/barrier_watchdog.py --state <state.json> --policy config/policy.json`

## Expected result
`release`, `release_degraded`, or `wait_bounded` with explicit child states. A `block` result is terminal until new evidence changes the state.

## Failure behavior
Script/config errors fail closed and block an unbounded wait. Emit reason codes and preserve the state snapshot.

## Blocks completion
Yes, when policy/state is invalid or quorum is unreachable. It does not block when a valid bounded wait is still allowed.
