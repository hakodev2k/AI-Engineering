# Hook: Post-Tool Progress Check

## Trigger
After each autonomous tool result in a workflow protected by loop control.

## Preconditions
The orchestrator can emit the current deterministic `state_id`; verification events identify freshness and pass/fail state.

## Action
Append a JSON event to the task trace and run:

`python scripts/progress_loop_guard.py trace.jsonl --max-identical 3 --max-verifications 5`

## Script/command
The hook consumes the controller exit code and reason-coded JSON output.

## Expected result
Exit 0 permits continued execution. Exit 3 stops the autonomous cycle and records the reason. Exit 2 indicates malformed evidence and blocks automatic continuation.

## Failure behavior
Fail closed. Preserve the trace and escalate instead of disabling loop protection.

## Blocks completion
Yes, when the controller reports terminal, stagnant, redundant-verification, or malformed-evidence conditions.
