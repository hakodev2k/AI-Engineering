# Skill: Token Boundary Audit

## Purpose
Audit an MCP authentication path for resource/audience binding and inbound-token passthrough.

## Trigger
Use before enabling a new authenticated MCP server, after OAuth/auth-proxy changes, or when a downstream API is added.

## Inputs
- Canonical MCP resource URI.
- Trusted issuer set.
- Required scopes.
- Representative validated token claims.
- Outbound host list.
- Credential-source map for upstream calls.

## Preconditions
Token signature/cryptographic validation must already be performed by a trusted OAuth/JWT library or introspection endpoint. This skill does not implement signature verification.

## Allowed tools
Repository read/search, configuration inspection, safe local scripts/tests, HTTP metadata inspection against non-production test endpoints.

## Constraints
- MUST NOT print raw bearer or refresh tokens.
- MUST NOT weaken issuer/audience checks to make tests pass.
- MUST NOT call production write endpoints.
- MUST treat scope and audience as separate checks.

## Procedure
1. Record the canonical MCP protected-resource URI from server configuration.
2. Locate the authentication middleware and identify where issuer, expiry and audience/resource are checked.
3. Enumerate outbound protected APIs and the credential source used for each.
4. Create four fixtures: correct audience, wrong audience, missing audience, and expired/invalid-validation metadata.
5. Create two egress fixtures: distinct upstream credential and identical inbound/outbound token fingerprint.
6. Run `scripts/token_boundary_guard.py` with `config/policy.json`.
7. Trace any `deny` to the exact missing boundary check.
8. Update implementation, then rerun all fixtures.
9. Have `subagents/security-verifier.md` independently verify the changed path.

## Decision points
- If cryptographic validation is absent: stop and escalate; this package cannot compensate.
- If audience metadata is unavailable: deny until the authorization design supplies a resource-binding signal.
- If upstream requires the same literal bearer token: classify as passthrough and redesign the integration rather than allowlisting it.

## Expected output
An audit record containing tested boundaries, fixture results, affected code/config, residual risk, and verification status.

## Metrics
Audience-negative-test rejection rate; passthrough rejection rate; protected-route coverage; count of raw-token log exposures (target zero).

## Verification
All adversarial fixtures must fail closed and valid fixtures must pass. The security verifier must confirm that the implementation uses the configured canonical resource URI.

## Failure handling
Capture the failing fixture and policy reason. Maximum implementation/retest cycles: 3. After three unsuccessful cycles, stop and require human security review.

## Stop conditions
Stop on missing cryptographic token validation, unknown canonical resource identity, unsafe production-only reproduction, or any request to log raw credentials.