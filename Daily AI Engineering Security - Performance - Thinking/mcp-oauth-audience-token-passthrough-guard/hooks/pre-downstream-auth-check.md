# Hook: Pre-Downstream Auth Check

## Trigger
Immediately before an MCP server sends an authenticated request to a different downstream resource.

## Preconditions
Decoded validated inbound claims are available; outbound credential has a provenance label; raw tokens are passed only to the local process and never logged.

## Action
Serialize the redacted/synthetic request metadata expected by `oauth_boundary_guard.py` and evaluate policy.

## Command
`python3 scripts/oauth_boundary_guard.py request.json --policy config/policy.json`

## Expected result
Exit `0` and `decision=allow` only when audience/scopes are valid and outbound credentials are independently sourced.

## Failure behavior
Exit `2` means invalid evidence/config; exit `5` means deny. Both block the downstream request and emit a redacted audit event.

## Blocking
Yes. Failure blocks completion for protected actions.
