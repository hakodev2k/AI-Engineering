# Hook: Pre MCP Tool Call

## Trigger
Immediately before an MCP tool can perform a side effect.

## Preconditions
Tool-call envelope and policy exist; canonical-path data is available for path-sensitive tools.

## Action
Run:
`python scripts/mcp_arg_guard.py --event <tool-call.json> --policy config/tool-argument-policy.json`

## Expected result
Exit 0 with `allow` only for policy-compliant arguments.

## Failure behavior
Any non-zero exit blocks the tool call and records non-secret reason codes.

## Blocks completion
Yes.
