# Skill — MCP OAuth Resource/Audience Conformance Review

## Purpose
Verify that an MCP OAuth flow is resource-bound end to end and that inbound tokens cannot cross trust boundaries incorrectly.

## Trigger
New protected MCP integration, OAuth provider/client/server upgrade, metadata/auth configuration change, or recurring security regression.

## Inputs
Canonical MCP resource URI, authorization URL/query, token request form, token claims/introspection output, expected issuer/audience/scopes, downstream request trace.

## Preconditions
Use test credentials/tokens only. Do not log reusable secrets. A canonical resource URI and expected issuer MUST be known.

## Required context
MCP authorization version in use, provider capabilities, server validation policy, downstream API credential strategy.

## Allowed tools
HTTP capture in test environment, JWT claim decoder without signature bypass, provider metadata reads, deterministic conformance script, security test runner.

## Constraints
Do not treat successful JWT decoding as validation. Do not accept a token merely because signature and expiry are valid. Do not forward inbound MCP bearer tokens to downstream APIs. Do not weaken audience checks for interoperability convenience.

## Procedure
1. Record canonical resource URI from protected-resource metadata/configuration.
2. Verify authorization request includes exactly the intended RFC 8707 `resource` value.
3. Verify token request includes the same canonical `resource`.
4. Validate issuer against the recorded authorization server.
5. Validate token audience contains the intended MCP resource according to the provider/token profile.
6. Validate required scope/role separately from audience.
7. Send wrong-audience, wrong-issuer, expired, and insufficient-scope fixtures; all MUST be rejected appropriately.
8. Trace downstream calls and prove the inbound token value/hash is not reused as an upstream bearer token.
9. Record evidence and remediation for any failed control.

## Decision points
- Provider lacks RFC 8707 -> integration is non-conformant unless an explicitly documented, equivalently secure resource-binding mechanism is supported by the applicable MCP profile; otherwise block enablement.
- Token audience ambiguous -> block.
- Multiple audiences -> require explicit policy proving the MCP resource is intended; do not infer from issuer alone.
- Downstream passthrough detected -> block and redesign credential exchange/delegation.

## Expected output
Structured pass/fail report covering resource parameter, issuer, audience, scopes/roles, rejection fixtures, and downstream token separation.

## Metrics
Control pass rate; negative-test coverage; number of wrong-audience accepts (target 0); passthrough detections (target 0); integration combinations verified.

## Verification
An independent reviewer reruns negative fixtures and compares evidence with configured expected values.

## Failure handling
Fail closed for connector enablement. Preserve sanitized request metadata and claim summaries; never expose access/refresh tokens.

## Stop conditions
Stop when required evidence cannot be collected safely, provider behavior cannot satisfy resource binding, or any wrong-audience/passthrough test remains unresolved.