# MCP Resource Audience Token Boundary

**Category:** Security

## Problem
MCP servers can accept a cryptographically valid token that was issued for another resource or accidentally reuse the inbound MCP bearer token when calling an upstream API. Both break OAuth resource boundaries and can enable confused-deputy behavior.

## Evidence
See `evidence/research.md`. Current MCP 2026-07-28 authorization guidance requires audience/resource validation and explicitly forbids token passthrough.

## Existing approach and limitation
Generic JWT validation, scopes, and gateway authentication are useful but insufficient when they do not prove that the token targets this MCP resource and that upstream credentials are separately issued.

## Proposed improvement
Treat client→MCP and MCP→upstream as separate credential domains. Enforce issuer + audience/resource + scope + expiry on ingress, then verify that upstream Authorization uses a distinct credential.

## Architecture
```text
client token
   |
   v
[MCP resource boundary]
 issuer + audience/resource + scope + time
   |
   v
 tool authorization
   |
   v
[upstream credential boundary]
 separately issued token -> upstream API
```

## Package tree
```text
README.md
evidence/research.md
skills/token-boundary-review.md
rules/token-boundary-rules.md
subagents/security-verifier.md
workflows/verify-token-boundary.md
scripts/token_boundary_check.py
tests/fixtures.md
```

## Installation
Requires Python 3.9+ only for the deterministic checker. Integrate the rules with the application/framework's real token validator; the checker consumes metadata rather than bearer tokens.

## Configuration
Provide expected issuer, one or more expected MCP audiences/resources, and required scopes. Never place credentials in package configuration.

## Usage
1. Follow `skills/token-boundary-review.md` to map trust boundaries.
2. Enforce `rules/token-boundary-rules.md` in the server implementation.
3. Run `workflows/verify-token-boundary.md`.
4. Use `scripts/token_boundary_check.py` with synthetic/test metadata.
5. Have `subagents/security-verifier.md` independently verify release evidence.

## Metrics
Negative-fixture block rate, valid-fixture pass rate, inbound-token passthrough count, secret leakage count, unresolved identity assumptions.

## Verification
**Implemented:** boundary validation and separate upstream credential source exist. **Measured:** all fixtures have recorded outcomes. **Verified:** an independent reviewer reproduces the matrix with wrong-audience/passthrough blocked and valid traffic preserved.

## Safety
Fail closed. Never log bearer/refresh tokens or authorization codes. Do not automatically retry authorization failures. Production identity changes require human approval.

## Failure handling
Detection: deny reason or fixture mismatch. Evidence: claim metadata/fingerprint only. Retry: maximum 2 implementation retries. Fallback: revert unsafe change and keep server closed to invalid traffic. Escalation: identity/security owner. Stop: unknown provenance, exhausted retries, or required human decision.

## Definition of Done
- Evidence documented.
- Audience/resource and scope policy defined.
- Passthrough paths removed.
- Deterministic negative fixtures pass.
- Valid fixture passes.
- Independent verification complete.
- No secrets exposed.
- No blocking identity ambiguity remains.

## Customization
Extend fixture metadata for tenant, authorization server, or tool-specific scopes, but keep the invariant that inbound MCP and outbound upstream credentials are distinct resource-bound identities.
