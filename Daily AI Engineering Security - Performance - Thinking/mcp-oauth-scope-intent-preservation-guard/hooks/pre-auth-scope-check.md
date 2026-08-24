# Hook: Pre-Auth Scope Check

## Trigger
Immediately before an MCP client launches interactive authorization, reauthorization, or step-up; also after OAuth metadata/config reload.

## Preconditions
A sanitized JSON document containing only scope names and policy flags is available.

## Action
Run the deterministic scope guard and require a successful exit before proceeding.

## Script/command
`python scripts/mcp_scope_guard.py <scope-input.json> --pretty`

## Expected result
Exit code `0`, `ok=true`, all mandatory scopes present in `effective_scopes`, and provenance recorded for each requested scope.

## Failure behavior
Exit code `1`: block the auth transition and show errors. Exit code `2`: block because input is invalid/unreadable. Do not fall back to a broader or narrower scope set automatically.

## Blocking
Yes. A preflight failure blocks completion because silent scope mutation can create an authorization downgrade or break non-interactive refresh behavior later.
