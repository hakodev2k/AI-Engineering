# Skill: Authorization Boundary Audit

## Purpose
Audit an MCP OAuth integration for issuer/resource binding failures before changing code.

## Trigger
Run when adding a remote MCP server, upgrading to the 2026-07-28 protocol, changing an IdP, migrating a resource, or investigating unexpected token reuse.

## Inputs
OAuth discovery metadata, protected-resource metadata, credential-store schema, callback handler, token verification code, refresh flow, protocol version, and representative audit logs.

## Preconditions
Use non-production credentials or redacted records. Do not log access tokens, refresh tokens, authorization codes, PKCE verifiers, or client secrets.

## Required context
Expected resource URI, expected issuer, supported authorization method, token audience/resource model, redirect URI class, and SDK/version behavior.

## Allowed tools
Repository search, static analysis, local tests, metadata fetches from known endpoints, and deterministic validation scripts.

## Constraints
- Never disable PKCE, state, issuer, audience, or resource validation to make a flow pass.
- Never move secrets into prompts or agent memory.
- Human approval is required before changing production IdP/client registrations.

## Procedure
1. Map trust boundaries: MCP client, resource server, authorization server, browser, credential store, proxy/gateway.
2. Trace one authorization transaction from protected-resource discovery through callback and token storage.
3. Record the expected issuer and resource at transaction start.
4. Verify callback processing compares returned/discovered issuer to the stored expected issuer before code redemption.
5. Inspect credential records for issuer, resource, client ID, creation protocol/version, and provenance.
6. Verify refresh logic refuses credentials when current resource metadata points to a different issuer.
7. Verify access-token checks include issuer and audience/resource, not only signature and expiry.
8. Create negative fixtures: wrong issuer, wrong audience, resource migration, stale credential, callback replay, missing provenance.
9. Run `scripts/validate_oauth_binding.py` for each fixture.
10. Classify findings as blocking, reauthorization-required, migration-required, or informational.

## Decision points
- Missing issuer/resource provenance: require reauthorization unless an independently verified migration can reconstruct binding.
- Issuer mismatch: deny redemption/use and invalidate affected credential record.
- Audience/resource mismatch: deny protected action.
- Metadata migration with unchanged verified issuer: allow only after policy and tests pass.

## Expected output
A boundary map, findings with evidence, affected flows, required changes, negative test cases, and verification status.

## Metrics
Binding coverage, negative-fixture block rate, legacy credential count, issuer-change invalidation rate, protected-call verification rate.

## Verification
An independent reviewer reruns negative fixtures and confirms no secret-bearing logs were produced.

## Failure handling
If required metadata is unavailable, stop token exchange and record the exact missing evidence. Do not guess issuer relationships.

## Stop conditions
Stop after all mapped flows are verified or when a blocking unknown prevents safe authorization. Maximum two implementation/retest cycles before escalation.