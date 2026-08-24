# Hook — Pre-Resume Replay Validation

## Trigger
Immediately before a checkpointed task is resumed.

## Preconditions
Dispatch and resume evidence JSON exist and contain the declared required fields.

## Action
Run `python scripts/replay_guard.py --evidence <path>`.

## Expected result
Exit 0 and `status=PASS`.

## Failure behavior
Exit 2 blocks resume for missing/mismatched inputs. Exit 3 blocks resume for malformed evidence. Preserve evidence and escalate according to the workflow.

## Blocks completion
Yes. A failed hook MUST prevent resumed model/tool/side-effect execution.
