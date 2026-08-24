# Hook — Post-Child Completion Gate

## Trigger
Immediately after a child reports terminal/completed state and before the parent consumes its result.

## Preconditions
A normalized child-state JSON file exists.

## Action
Run the deterministic terminal-state validator.

## Script / command
`python3 scripts/validate_terminal_state.py --state <child-state.json>`

Optional artifact rules are embedded in the state JSON under `required_artifacts`.

## Expected result
Exit code `0` only for `accepted`. The script emits one JSON decision record to stdout.

## Failure behavior
Any non-zero exit code blocks automatic completion. Preserve stdout/stderr and route the task through `workflows/verify-and-recover.md`.

## Blocks completion
Yes. Unknown/malformed state also blocks completion.

## Safety
The hook is read-only. It never executes project-controlled commands and never replays deferred tools.