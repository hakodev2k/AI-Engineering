# Hook: Pre-Context Ingestion

## Trigger
Immediately before MCP server `instructions` or equivalent server-authored natural language is admitted to model context.

## Preconditions
Payload has server identity/provenance and policy configuration is available.

## Action
Run the deterministic instruction inspector and route only PASS content to the designated untrusted context class.

## Script / command
`python scripts/inspect_mcp_instructions.py config/policy.example.json <payload.json>`

## Expected result
Exit 0 and JSON output with `decision: "allow_untrusted"`.

## Failure behavior
Exit 2 blocks ingestion and records only non-secret finding metadata. Exit 1 blocks ingestion because validation was not possible.

## Blocks completion
Yes. A failure cannot be downgraded by model-generated text or server-provided instructions.