# Hook: Pre-Tool Authorization Boundary

## Trigger
Immediately after cryptographic bearer-token verification and before protected MCP tool dispatch.

## Preconditions
Claims have been verified by the production OAuth/JWT library. `config/policy.json` is loaded from trusted deployment configuration.

## Action
Serialize only non-secret verified claims and downstream mode to a temporary JSON input, then execute:

```bash
python scripts/audience_guard.py <claims.json> --policy config/policy.json
```

## Expected result
Exit `0`: allow dispatch. Exit `3`: deny request and emit a safe reason code. Exit `2`: configuration/input failure.

## Failure behavior
Any non-zero exit blocks the protected tool. Never fall back to permissive behavior. Do not include the bearer token in the temporary file.

## Blocking
Yes. This hook is a security boundary.