# Research — MCP OAuth Audience & Token Passthrough Guard

## Topic
MCP OAuth Audience & Token Passthrough Guard

## Category
Security

## Problem
Remote MCP servers can validate a token's signature but still accept a token minted for another resource, or forward the inbound client token to a downstream API. Both break resource/audience boundaries and can create confused-deputy or cross-service replay paths.

## Why it matters now
The current MCP authorization/security guidance explicitly treats resource binding and token passthrough as security-critical. Recent 2026 production guidance continues to highlight these as recurring deployment mistakes, especially in proxy-style MCP servers.

## Affected users
MCP server authors, agent platform teams, API gateway owners, security engineers, and teams exposing remote tools through OAuth-protected MCP endpoints.

## Current public evidence
### Observed evidence
1. Current MCP security guidance states that MCP servers must not accept tokens not explicitly issued for the MCP server and identifies token passthrough/confused-deputy risks. Current-spec engineering summaries in August 2026 continue to call these out as named failure modes: https://pharosproduction.com/insights/engineering/mcp-server-development/
2. A practical MCP security guide published August 19, 2026 emphasizes validating token audience and using separate upstream credentials rather than forwarding the client token: https://www.mariusmanolachi.com/blog/how-to-secure-an-mcp-server-for-ai-agents
3. A June 2026 OAuth-for-MCP analysis describes RFC 8707 resource indicators/audience validation and token passthrough as central authorization controls, while noting deployment compliance remains uneven: https://anomity.ai/blog/oauth-for-mcp-servers-explained/

### Interpretation
OAuth presence alone is insufficient. The meaningful boundary is whether each inbound token is bound to the canonical MCP resource and whether downstream calls use an independently authorized credential.

## Existing approaches
- JWT signature/issuer/expiry validation.
- API gateways that enforce authentication.
- OAuth 2.1 resource indicators and audience claims.
- Manual code review for downstream HTTP clients.
- Separate service credentials for upstream APIs.

## Remaining limitations
- Generic JWT middleware can validate a token without enforcing the exact MCP resource audience.
- Proxy code may accidentally copy the inbound `Authorization` header into outbound requests.
- Scope checks can pass while audience binding is wrong.
- Manual review is easy to miss across many tools/HTTP clients.
- Fallback behavior sometimes reuses the client token when upstream credential acquisition fails.

## Root-cause analysis
1. Authentication and resource authorization are treated as the same check.
2. Canonical MCP resource URI is not centralized in configuration.
3. Inbound and outbound credential objects are represented identically.
4. Shared HTTP-client/header middleware propagates `Authorization` too broadly.
5. Failure paths prioritize availability over fail-closed credential separation.

## Improvement opportunity
Introduce a deterministic boundary guard that validates issuer, expiry, audience/resource and scopes before tool execution, and separately scans runtime request metadata to ensure downstream authorization is not byte-identical to the inbound bearer token. Couple it with explicit upstream credential provenance and blocking tests.

## Goal
Reject cross-audience tokens and prevent inbound bearer-token reuse at downstream boundaries without weakening normal OAuth flows.

## Metrics
- 100% rejection of wrong-audience fixtures.
- 100% detection of direct token passthrough fixtures.
- 0 protected tool executions after failed audience/scope validation.
- 0 fallback-to-client-token behavior when upstream credential acquisition fails.
- Security test suite passes before completion.

## Trigger
Before protected MCP tool execution and before every authenticated downstream HTTP request.

## Inputs
Canonical MCP resource, token claims, required scopes, downstream target, outbound credential provenance/fingerprint.

## Outputs
Allow/deny decision, reason code, redacted evidence, audit event, and remediation hint.

## Relevant sources
- https://pharosproduction.com/insights/engineering/mcp-server-development/
- https://www.mariusmanolachi.com/blog/how-to-secure-an-mcp-server-for-ai-agents
- https://anomity.ai/blog/oauth-for-mcp-servers-explained/
- https://blog.mcpservers.org/posts/mcp-security-best-practices
