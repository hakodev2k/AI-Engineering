# Hook: Pre-Turn Lease Check

## Trigger
Immediately before a mutation-capable turn, transcript mutation, checkpoint write, or background wake starts execution.

## Preconditions
Current durable lease snapshot and pending event are available as JSON.

## Action
Run the deterministic guard against the event sequence that includes the proposed action.

## Command
`python scripts/turn_lease_guard.py check --policy config/lease-policy.json --events <events.jsonl>`

## Expected result
Exit code 0 with `status=ok`. Any stale epoch, overlapping lease, duplicate operation ID, mutation without lease, or malformed required field returns non-zero.

## Failure behavior
Block mutation, preserve checker output and input evidence, require reconciliation. Do not auto-downgrade policy.

## Blocking
Yes. Failure blocks completion of the mutation-capable turn. Read-only behavior may continue only if the host can enforce it.