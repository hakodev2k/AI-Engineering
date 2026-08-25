# Hook: Pre-Child-Action Gate

## Trigger
Before accepting the first task-specific child action and at final delegation verification.

## Preconditions
Delegation trace records task delivery and acknowledgement.

## Action
Run the deterministic validator over the trace.

## Script/command
`python3 scripts/delivery_guard.py delegation-trace.jsonl`

## Expected result
Exit 0; each child has matching task delivery/ACK before first action and sequence ordering is valid.

## Failure behavior
Exit 2 blocks trust in delegated work and triggers bounded recovery. Exit 1 blocks completion due to malformed evidence.

## Blocks completion
Yes.