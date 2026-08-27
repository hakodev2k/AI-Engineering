# Hook: Pre-Approval / Pre-Execution Integrity Gate

## Trigger
Before rendering an approval request and again immediately before executing an approved tool call.

## Preconditions
Leaf tool identity, parsed arguments, delegation chain, consequence class, and destination are available.

## Action
For request rendering:
`python scripts/approval_guard.py --event approval-request.json --policy config/policy.json --mode request`

Bind the user/policy decision to the returned fingerprint.

Before execution:
`python scripts/approval_guard.py --event execution-event.json --policy config/policy.json --mode execute`

## Expected result
Request mode returns `request-approval` with a fingerprint. Execute mode returns `allow-execution` only if the actual call still matches the approved fingerprint.

## Failure behavior
Exit code 3 blocks approval/execution and records machine-readable reasons. Exit code 2 indicates invalid input/config and also blocks.

## Blocks completion
Yes for high-risk actions; do not downgrade to automatic execution.
