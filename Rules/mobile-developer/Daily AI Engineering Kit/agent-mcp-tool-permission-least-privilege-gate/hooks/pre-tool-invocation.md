# Hook: Pre Tool Invocation

## Trigger
Immediately before any MCP/tool call.

## Preconditions
A normalized permission request exists and the task has an approved plan.

## Action
Run:

`python scripts/check-permissions.py --policy config/policy.json --requests <requests.json>`

Then compare the concrete invocation arguments with the approved resource/path/host/environment boundary.

## Expected result
Exit code 0 and, for high-risk actions, a non-empty approval ID present in the request/evidence chain.

## Failure behavior
Block the tool call. Do not broaden scope or substitute credentials automatically. Preserve validator output.

## Blocking
Yes.
