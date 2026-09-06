# Hook: Preflight Authorization

## Trigger
Before enabling an MCP OAuth connector/server in CI, staging or production.

## Preconditions
A sanitized policy JSON exists; no token values are included.

## Action
Run `python scripts/mcp_oauth_guard.py <policy.json>` followed by `python -m unittest tests/test_mcp_oauth_guard.py`.

## Script/command
`python scripts/mcp_oauth_guard.py policy.json`

## Expected result
Exit 0 from both commands and a `PASS` summary.

## Failure behavior
Block activation/deployment and retain only sanitized violation metadata.

## Blocks completion
Yes. This hook is security-enforcing and MUST NOT be bypassed for convenience.