# Hook: Pre-Send Context Budget

## Trigger
Immediately before serialization/transmission of every model request.

## Preconditions
Effective context window and token estimates for all request components are available.

## Action
Execute the pending-context guard with current and pending token counts.

## Script / command
`python scripts/pending_context_guard.py --config config/budget.example.json --history 52000 --pending 22000 --tool 6000`

## Expected result
Exit 0 with `SEND`, or exit 3 with `COMPACT` before the provider call. Exit 4 means `BLOCK` because hard usable capacity would be exceeded.

## Failure behavior
Invalid or missing capacity data exits 1 and blocks sending. COMPACT returns control to the bounded compaction workflow; BLOCK requires a different explicit strategy.

## Blocks completion
Yes for exit 1 or 4. Exit 3 blocks the current send until remeasurement after compaction.