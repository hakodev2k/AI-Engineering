# Hook: Pre-request Boundary Check

## Trigger
Immediately after trusted token cryptographic validation and before dispatching an MCP tool/resource action; run the egress portion before a protected upstream request.

## Preconditions
Validated token metadata is available without exposing the raw token; policy is loaded; canonical MCP resource URI is configured.

## Action
Create a sanitized JSON envelope and execute:

`python scripts/token_boundary_guard.py request.json --policy config/policy.json --strict`

For egress, include `outbound_host`, `inbound_token_fingerprint`, `outbound_credential_fingerprint`, and `outbound_credential_source`.

## Expected result
Exit 0 with `decision=allow` and explicit audience/scope/egress results.

## Failure behavior
Exit 2 means malformed evidence/config and blocks execution. Exit 3 means a security-policy violation and blocks execution. Capture only the structured reason; never log raw tokens.

## Blocks completion
Yes. A protected operation must not execute after hook failure.