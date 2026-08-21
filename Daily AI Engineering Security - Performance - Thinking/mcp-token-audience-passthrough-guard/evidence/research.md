# Research — MCP Token Audience & Passthrough Guard

## Topic
MCP Token Audience & Passthrough Guard

## Category
Security

## Problem
MCP servers that accept access tokens issued for a different resource, or forward client-provided access tokens unchanged to an upstream API, collapse OAuth trust boundaries. That enables cross-service token reuse, confused-deputy behavior, weaker auditing, and possible data exposure.

## Why it matters now
The MCP 2026-07-28 authorization specification explicitly requires resource-bound tokens and rejects token passthrough. The matching 2026 security guidance highlights audience validation, token theft, and confused-deputy risk. This is operationally relevant as MCP deployments increasingly front SaaS APIs and enterprise connectors.

## Affected users
MCP server authors, platform/security teams, connector developers, OAuth gateway owners, and operators of agents with authenticated remote tools.

## Current public evidence
### Observed evidence
1. MCP Authorization 2026-07-28 requires clients to request resource-specific tokens and servers to validate that access tokens were issued for themselves; tokens intended for another resource must not be accepted: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
2. MCP Security Considerations 2026-07-28 states that audience binding is critical, token passthrough is forbidden, and upstream API tokens must be separate from client-to-MCP tokens: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations
3. MCP Security Best Practices documents token passthrough as an anti-pattern that can bypass controls, damage accountability, and create trust-boundary issues: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
4. RFC 8707 defines the OAuth `resource` parameter used to bind access-token requests to protected resources: https://www.rfc-editor.org/rfc/rfc8707

## Existing approaches
- Validate signature, issuer and expiry only.
- Trust an API gateway to reject inappropriate tokens.
- Reuse a single bearer token across MCP and upstream APIs for convenience.
- Add static allowlists for issuers/scopes.

## Remaining limitations
Signature and expiry checks do not prove the token was issued for the current MCP resource. Scope checks can also be insufficient when the same scope name exists across services. Gateway validation is often disconnected from the MCP server's actual canonical resource URI. Static issuer allowlists do not prevent token passthrough. Teams may also regress during refactors because the expected audience/resource is not tested deterministically.

## Root-cause analysis
- Authentication is treated as equivalent to authorization for a specific resource.
- Resource/audience validation is omitted or inconsistent across token formats.
- Downstream calls reuse inbound credentials rather than performing an explicit token exchange or separate OAuth flow.
- Canonical MCP resource URIs are not centrally configured.
- Tests focus on valid-token success paths and do not include wrong-audience/passthrough fixtures.

## Improvement opportunity
Add a deterministic token-boundary gate at the MCP ingress and upstream-egress boundaries. The gate verifies issuer, expiry metadata supplied by the trusted validator, audience/resource match, required scopes, and explicitly forbids propagating the inbound bearer token to downstream hosts. A separate egress identity record proves which credential source is used upstream.

## Goal
Make cross-resource token acceptance and bearer-token passthrough mechanically detectable and blockable before a tool action executes.

## Metrics
- 100% protected MCP requests have audience/resource validation evidence.
- 0 accepted fixtures with missing or mismatched audience.
- 0 outbound requests reuse the inbound token fingerprint.
- 100% upstream API calls identify a distinct credential source.
- Security regression suite passes on every policy change.

## Trigger
Any authenticated MCP request and any outbound call from the MCP server to a protected upstream API.

## Inputs
Canonical MCP resource URI, validated token claims/metadata, required scopes, outbound destination, inbound token fingerprint, outbound credential fingerprint/source.

## Outputs
`allow`, `deny`, or `invalid` decision; reasons; audit-safe token fingerprints; validated audience/resource; scope result; passthrough result.

## Interpretation
The protocol guidance shows a concrete security boundary, not evidence that all MCP implementations violate it. The reusable package targets implementations where resource binding or upstream credential separation is incomplete or difficult to verify.

## Proposed solution
A policy-backed ingress/egress validator, adversarial fixtures, and a security-review workflow that distinguishes signature validation from resource authorization and verifies that downstream credentials are independently obtained.