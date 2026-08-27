# Hook: Pre-MCP Spawn
## Trigger
Immediately before creating an MCP stdio subprocess.

## Preconditions
A structured event containing `server_id`, `transport`, `executable`, and `argv`.

## Action
Run:
`python scripts/command_guard.py --event <event.json> --policy config/policy.json`

## Expected result
Exit 0 with `allow_spawn`.

## Failure behavior
Any non-zero exit blocks process creation and records reason codes without secrets.

## Blocking
Yes.
