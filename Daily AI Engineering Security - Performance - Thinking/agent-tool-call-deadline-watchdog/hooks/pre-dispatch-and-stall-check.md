# Hook: Pre-Dispatch and Stall Check

## Trigger
Before tool dispatch and on each orchestrator observation tick while the call is in flight.

## Preconditions
Arguments validated; call metadata includes start time, side-effect class and idempotency.

## Action
Before dispatch, reject missing metadata. While in flight, serialize the call event and run:
`python scripts/tool_watchdog.py --event <event.json> --policy config/policy.json`

## Expected result
Exit 0 while healthy; exit 3 only when one safe bounded retry is permitted; exit 4 when cancellation/escalation is required; exit 2 on invalid input.

## Failure behavior
Any ambiguous state fails closed to escalation rather than automatic retry.

## Blocks completion
Yes, for stale or malformed call state.
