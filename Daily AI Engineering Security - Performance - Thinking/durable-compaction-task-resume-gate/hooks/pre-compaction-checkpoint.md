# Hook: Pre-Compaction Checkpoint

## Trigger
Immediately before transcript compaction.

## Preconditions
Runtime can read active goal and write durable state.

## Action
Serialize the active goal checkpoint, then run the validator.

## Script / command
`python scripts/validate_checkpoint.py <checkpoint.json>`

## Expected result
Exit 0 before compaction is allowed.

## Failure behavior
Exit 1 or 2 blocks compaction and records the validation error. The runtime may attempt checkpoint repair at most twice.

## Blocks completion
Yes for compaction. If state remains invalid, the task becomes BLOCKED rather than being falsely completed.