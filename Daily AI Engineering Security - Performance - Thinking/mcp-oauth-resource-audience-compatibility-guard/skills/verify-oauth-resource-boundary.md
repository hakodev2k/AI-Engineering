# Skill — Verify OAuth Resource Boundary

## Purpose
Prove that an MCP deployment preserves resource/audience isolation even when its OAuth provider has incomplete RFC 8707 support.

## Trigger
Provider onboarding, MCP auth upgrade, protected-resource metadata change, token validation change, or pre-production security review.

## Inputs
Canonical MCP URI, authorization/token endpoint behavior, provider metadata, representative tokens or introspection responses, scopes, tool impact classification, `config/policy.json`.

## Preconditions
Use test identities/tokens only. Never paste live secrets into reports. Ensure the verifier can inspect claims or use a trusted introspection endpoint.

## Required context
MCP 2026-07-28 authorization requirements, provider-specific OAuth behavior, and configured protected-resource metadata.

## Allowed tools
HTTP client, JWT decoder without signature bypass, provider introspection endpoint, test MCP client/server, `scripts/audience_guard.py`.

## Constraints
Do not disable signature, issuer, expiry, nonce/PKCE, or TLS validation to make a test pass. Do not weaken production scopes to compensate for missing audience validation.

## Procedure
1. Resolve and normalize the canonical MCP resource URI.
2. Test whether authorization and token endpoints accept `resource`.
3. Capture token evidence without storing raw bearer tokens.
4. Verify issuer, expiry, and intended audience; for opaque tokens use trusted introspection.
5. Attempt a wrong-audience token against a protected test endpoint.
6. Classify tools by impact and evaluate fallback eligibility.
7. Run the deterministic guard on collected evidence.
8. Record `Implemented`, `Measured`, and `Verified` separately.

## Decision points
- Resource parameter supported + audience correct: allow.
- Resource parameter unsupported but independently verified audience and low-impact approved fallback: degraded-low-risk.
- Audience unverified, wrong, or high-impact under fallback: deny.

## Expected output
Decision, evidence type, expected/observed audience, provider capability, impacted tools, remediation, and fallback expiry if any.

## Metrics
Wrong-audience rejection rate, fallback count, high-impact fallback count, unresolved audience checks.

## Verification
A known-good token succeeds and a token valid for a different resource is rejected. No raw token appears in logs.

## Failure handling
If provider behavior is ambiguous, fail closed for high-impact tools and escalate to identity/security owners.

## Stop conditions
Stop after one complete good-token and one wrong-audience test, or immediately on a blocking validation failure. Maximum two configuration correction attempts per review.
