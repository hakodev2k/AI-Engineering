# Hook: Post Step Progress Check

## Trigger
After every retry, tool call, model recovery step, or context-compaction step in a long-running agent loop.

## Preconditions
The step emits `event`, normalized `action_signature`, and `progress` when observable progress occurred.

## Action
Append the event to the run JSONL trace and execute:
`python scripts/retry_progress_guard.py --trace <trace.jsonl> --policy config/policy.json`

## Expected result
Exit 0 allows the workflow to continue within budget. Exit 3 means `halt_and_escalate`.

## Failure behavior
Exit 3 blocks further autonomous retry/recovery. Exit 2 means the guard could not validate the trace and also blocks continuation.

## Blocking
Yes for autonomous recovery. A human/operator may resume only through the bounded failure-recovery workflow.
