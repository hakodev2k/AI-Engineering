# Skill — MCP Resource and Audience Validation

## Purpose
Enforce that a cryptographically verified OAuth access token is valid for this specific MCP resource, issuer, audience, operation, and scope.

## Trigger
Before protected MCP request dispatch and before invoking any protected tool.

## Inputs
- Trusted claims envelope from authentication middleware
- `config/policy.json`
- Operation name
- Canonical MCP resource URI

## Preconditions
- Signature, expiry, and token integrity have already been verified by trusted middleware.
- Protected Resource Metadata and authorization-server metadata are configured according to the current MCP authorization specification.

## Required context
Expected issuer, canonical server URI, allowed audience values, per-operation scopes, and any gateway/delegation design.

## Allowed tools
Read-only policy/config inspection, trusted identity middleware outputs, deterministic gate script, security tests, audit logs.

## Constraints
- MUST NOT parse an unverified bearer token and treat its claims as trusted.
- MUST fail closed when issuer, resource, audience, or required scope is missing or mismatched.
- MUST NOT log raw bearer tokens.
- MUST NOT broaden resource or audience matching merely to restore compatibility.

## Procedure
1. Confirm upstream authentication marks claims as cryptographically verified.
2. Resolve the canonical MCP resource URI from one centralized policy source.
3. Compare issuer with the explicit allowlist.
4. Verify token audience intersects the configured audience allowlist.
5. Require exact resource equality by default.
6. Resolve required scopes for the requested operation and ensure all are granted.
7. Execute `scripts/audience_gate.py` with the trusted envelope and policy.
8. On deny, emit only machine-readable reason codes and approved metadata.
9. For gateway/delegation use cases, model the downstream resource explicitly rather than forwarding an upstream token by assumption.
10. Run negative fixtures before marking the integration Verified.

## Decision points
- Claims not verified: deny and fix authentication middleware.
- Issuer mismatch: deny; do not attempt fallback issuers automatically.
- Audience/resource mismatch: deny and inspect token acquisition/resource-indicator flow.
- Missing scope: return authorization failure/step-up path rather than silently broadening scopes.

## Expected output
Allow/deny decision, operation, resource-match indicator, missing scopes, and violation codes.

## Metrics
Wrong-resource denial rate, wrong-issuer/audience denial rate, missing-scope denial rate, unverified-claims denial rate, security-test pass rate.

## Verification
All positive fixtures pass and all negative fixtures are denied. Independent security reviewer confirms gateway/delegation boundaries.

## Failure handling
Configuration ambiguity blocks deployment. Invalid claims envelopes are treated as errors, never allows. After two failed integration attempts, stop and escalate identity/resource design.

## Stop conditions
Verified negative tests pass, configuration remains ambiguous, or compatibility would require weakening resource/audience validation.
