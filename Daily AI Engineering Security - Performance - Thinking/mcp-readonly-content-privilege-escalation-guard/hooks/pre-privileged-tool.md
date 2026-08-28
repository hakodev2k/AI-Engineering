# Hook: Pre Privileged Tool Call

## Trigger
Before a coding agent invokes a privileged tool after consuming MCP/resource/tool content.

## Preconditions
Origin, raw content, requested tool, authorization source, and approval state are serialized into `event.json`.

## Action
Run:
`python scripts/mcp_content_guard.py --event event.json --policy config/policy.json`

## Expected result
Exit 0 only when the content can remain data-only and all configured privilege-crossing conditions are satisfied.

## Failure behavior
Exit 3 quarantines the content and blocks the privileged call. Exit 2 blocks on invalid evidence.

## Blocking
Yes.
