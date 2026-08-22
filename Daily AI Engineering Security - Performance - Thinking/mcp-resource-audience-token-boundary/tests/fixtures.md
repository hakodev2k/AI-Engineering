# Deterministic Fixtures

Use synthetic metadata only; never commit bearer tokens.

| Fixture | Expected |
|---|---|
| valid issuer + expected audience + required scope + distinct upstream fingerprint | allow / exit 0 |
| wrong audience | deny `audience_or_resource_mismatch` / exit 3 |
| expired token | deny `expired_token` / exit 3 |
| missing required scope | deny `missing_required_scope` / exit 3 |
| identical inbound and upstream fingerprints | deny `inbound_token_passthrough` / exit 3 |
| malformed record | invalid / exit 2 |

## Example policy
`{"expected_issuer":"https://auth.example.test","expected_audiences":["https://mcp.example.test"],"required_scopes":["mcp.read"]}`

## Example valid record
`{"issuer":"https://auth.example.test","audience":"https://mcp.example.test","scopes":["mcp.read"],"token_fingerprint":"in-123","upstream_token_fingerprint":"up-456","expired":false}`

## Verification
Run each fixture through `scripts/token_boundary_check.py`. A release fails if any expected deny is allowed or if a valid fixture is denied without a documented policy reason.
