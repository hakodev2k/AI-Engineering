# Hook: Persistent-Agent Pre-Action Lease Check

## Trigger
Immediately before a consequential tool call or side effect.

## Preconditions
Current lease state and `config/lease-policy.json` are available.

## Action
Run:
`python scripts/lease_guard.py --state <state.json> --policy config/lease-policy.json`

## Expected result
`allow` permits the action. `renew` pauses execution until the lease is renewed from fresh checkpoint evidence. `stop` blocks execution.

## Failure behavior
Missing/invalid state or any guard error blocks the action. Preserve the last safe checkpoint and escalate if renewal cannot be justified.

## Blocks completion
Yes for any consequential action without a valid lease.
