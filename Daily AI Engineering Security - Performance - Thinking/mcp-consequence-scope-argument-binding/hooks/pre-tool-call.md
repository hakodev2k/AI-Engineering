# Hook: Pre Tool Call Scope Gate

## Trigger
Immediately before an MCP tool invocation that carries repository, branch, filesystem, or endpoint target arguments.

## Preconditions
The event JSON contains tool name plus applicable target fields; `config/policy.json` is trusted configuration.

## Action
Run:
`python scripts/target_scope_guard.py --event <event.json> --policy config/policy.json`

## Expected result
Exit `0` and `decision=allow` only when every supplied target is inside policy and required approval is present.

## Failure behavior
Exit `3` blocks the tool call and records non-secret reason codes. Exit `2` is a configuration/input error and also blocks completion.

## Blocking
Yes. The caller MUST NOT downgrade a block to a warning.
