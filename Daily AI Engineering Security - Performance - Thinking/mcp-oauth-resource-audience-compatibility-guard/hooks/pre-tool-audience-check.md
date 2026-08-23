# Hook — Pre-Tool Audience Check

## Trigger
Before any OAuth-protected MCP tool call.

## Preconditions
A sanitized evidence JSON exists for the active access token/session and contains no bearer token value.

## Action
Run the deterministic audience guard using the active policy.

## Script/command
`python3 scripts/audience_guard.py runtime/audience-evidence.json --policy config/policy.json`

## Expected result
Exit `0` for strict allow. Exit `3` only for an explicitly configured low-risk compatibility fallback. Exit `4` denies execution. Exit `2` indicates malformed evidence/configuration.

## Failure behavior
Exit `2` or `4` blocks the tool call. Exit `3` blocks any tool whose impact class is not explicitly listed in `fallback_allowed_for_impact` and records a fallback audit event.

## Blocking
Yes. A caller MUST NOT reinterpret deny/invalid as allow.
