# Hook — Pre-Tool Approval Gate

## Trigger
Immediately before an MCP tool call is authorized.

## Preconditions
Local policy file exists; server identity and tool metadata are available.

## Action
Serialize a decision input and run:
`python3 scripts/mcp_annotation_gate.py --input <decision.json> --policy <policy.json>`

## Expected result
Exit 0 for `allow`; exit 10 for `ask`; exit 20 for `deny`; exit 30 for malformed input/policy.

## Failure behavior
Any unexpected error or malformed input is blocking and MUST be treated as `deny` or host-defined fail-closed approval.

## Blocks completion
Yes. A tool call must not execute until the host handles the returned decision.
