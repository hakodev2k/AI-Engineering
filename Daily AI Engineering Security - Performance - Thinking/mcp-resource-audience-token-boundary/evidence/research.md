# Research — MCP Resource Audience Token Boundary

## Topic
MCP Resource Audience Token Boundary

## Category
Security

## Problem
MCP servers that accept bearer tokens intended for another resource, or pass inbound client tokens through to upstream APIs, can collapse OAuth trust boundaries and create confused-deputy and token-replay risks.

## Why it matters now
The MCP specification dated 2026-07-28 explicitly requires resource-bound tokens, audience validation, and rejection of token passthrough. The current guidance is stricter and more operationally explicit than earlier MCP deployments commonly assumed.

## Affected users
MCP server authors, platform teams, AI-agent developers, API gateway teams, and security reviewers integrating MCP with third-party APIs.

## Current public evidence
### Observed evidence
1. MCP 2026-07-28 authorization security considerations state that MCP servers MUST validate that access tokens are specifically intended for the MCP server, MUST reject tokens with the wrong audience, and MUST NOT pass inbound client tokens through to upstream APIs: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
2. The same specification requires MCP clients to use OAuth Resource Indicators (`resource`) and describes token passthrough as an anti-pattern that can create confused-deputy behavior: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
3. MCP Security Best Practices independently documents audience-validation failures and token passthrough as critical dimensions of this class of vulnerability: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx

### Interpretation
The problem is not lack of normative guidance; it is implementation drift. Servers need deterministic checks that bind issuer, audience/resource, scope, and downstream token exchange to explicit trust boundaries.

## Existing approaches
- Generic JWT signature/expiry validation.
- API gateway authentication middleware.
- OAuth scopes and consent.
- Manual server-specific checks.
- Upstream API calls using service credentials.

## Remaining limitations
- Signature-valid tokens can still target the wrong audience.
- Scope checks do not replace audience/resource checks.
- Middleware may validate authentication but not downstream token provenance.
- Teams may accidentally forward the inbound bearer token to an upstream API.
- Human code review is inconsistent across multiple MCP servers.

## Root-cause analysis
1. Authentication success is mistaken for authorization-to-this-resource.
2. Issuer/audience/resource/scopes are validated independently or incompletely.
3. Inbound and outbound credentials are not modeled as separate token domains.
4. Resource metadata is duplicated in configuration and drifts.
5. No deterministic preflight test enforces token-boundary invariants.

## Improvement opportunity
Create a reusable boundary package that validates token metadata, enforces expected resource/audience, separates inbound from upstream credentials, rejects passthrough, and runs negative security fixtures before deployment.

## Goal
Block wrong-audience tokens and passthrough paths before tool execution.

## Metrics
- 100% rejection of wrong-audience fixtures.
- 100% rejection of inbound-token reuse as an upstream bearer token.
- 0 secrets written to logs.
- All valid resource-bound fixtures continue to pass.

## Trigger / Inputs / Outputs
- Trigger: MCP request authorization and outbound upstream request construction.
- Inputs: issuer, audience/resource, scopes, token fingerprint, upstream credential source, policy.
- Outputs: allow/deny decision, reason code, safe audit record.
