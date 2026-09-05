# Hook: Post-Tool Progress Check

## Trigger
After each successful tool call in a long-running subgoal.

## Preconditions
The event can be normalized to action, target, result fingerprint, and progress marker.

## Action
Append event to bounded trace and run the loop guard over the current subgoal window.

## Script / command
`python scripts/progress_loop_guard.py <guard.json> <events.jsonl>`

## Expected result
Exit 0 when no blocking non-progress cycle is detected.

## Failure behavior
Exit 4 stops the current autonomous subgoal and invokes `workflows/diagnose-and-recover.md`. Exit 1 blocks continuation until malformed/unknown progress data is fixed.

## Blocks completion
Yes for the current autonomous subgoal. A human may authorize a new, explicitly changed plan.