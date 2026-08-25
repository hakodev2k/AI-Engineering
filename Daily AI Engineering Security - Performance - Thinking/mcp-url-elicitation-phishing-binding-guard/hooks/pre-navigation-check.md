# Hook — Pre-Navigation Check

## Trigger
Immediately before presenting or opening a URL-mode elicitation target.

## Preconditions
Authenticated MCP principal and server origin are known.

## Action
Construct a binding record and run the deterministic guard in `issue` mode.

## Command
`python scripts/elicitation_binding_guard.py issue --record binding.json`

## Expected result
Exit `0` with normalized `target_origin` and `binding_digest`.

## Failure behavior
Do not open the browser; surface reason code and preserve a redacted audit record.

## Blocks completion
Yes.
