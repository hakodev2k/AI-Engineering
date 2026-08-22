# Research

## Topic
MCP Resource Audience Boundary Guard

## Category
Security

## Problem
MCP servers can accept authentic tokens that were issued for a different resource, or forward inbound MCP client tokens to downstream APIs. Both violate the intended OAuth resource boundary.

## Why it matters now
The MCP 2026-07-28 authorization specification makes resource indicators and audience validation explicit normative requirements, and current SDK documentation has added resource-aware auth helpers/options.

## Affected users
MCP server authors, AI platform teams, connector builders, enterprise identity teams, and agents that call protected tools.

## Current public evidence
### Observed evidence
1. MCP 2026-07-28 Security Considerations says servers MUST validate that access tokens are specifically intended for that MCP server, MUST reject tokens lacking the intended audience/resource, MUST NOT pass inbound client tokens through to upstream APIs, and clients MUST use the RFC 8707 `resource` parameter: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
2. MCP security best-practices documentation describes token passthrough as an anti-pattern and identifies wrong-audience acceptance and confused-deputy risk: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
3. MCP Python SDK exposes RFC 8707 resource canonicalization utilities and a `validate_resource_url` auth hook, demonstrating that resource identity is a concrete implementation concern: https://py.sdk.modelcontextprotocol.io/api/mcp/shared/auth_utils/
4. COSAI/OASIS secure-ai-tooling tracked the confused-deputy risk in agentic delegation in 2026: https://github.com/cosai-oasis/secure-ai-tooling/issues/196

### Interpretation
Signature/issuer validation is necessary but not sufficient. Resource identity is a separate security invariant and should be tested deterministically at the MCP boundary.

### Proposed solution
Add a resource-audience policy gate over already cryptographically verified claims; reject ambiguous/wrong resource identity and token-passthrough mode; require separate downstream credentials/token exchange.

## Existing approaches
- OAuth/JWT verification middleware.
- MCP SDK authorization helpers.
- RFC 8707 Resource Indicators.
- Separate upstream OAuth clients/token exchange.

## Remaining limitations
- Generic middleware may verify token authenticity without enforcing application-specific resource identity.
- Legacy integrations may forward a bearer token because it already works with the downstream API.
- Resource URL canonicalization can differ by trailing slash, path, case, or fragment handling.
- Scope checks do not compensate for wrong audience.

## Root-cause analysis
1. Authentication and resource authorization are conflated.
2. Resource identifier is implicit instead of configured as an invariant.
3. Upstream API credentials are not separated from client-to-MCP credentials.
4. Negative tests focus on expired/invalid signatures but omit valid-token/wrong-audience cases.

## Improvement opportunity
Make resource identity executable policy with CI fixtures. This complements provider libraries rather than replacing cryptographic verification.

## Goal
Block cross-resource token reuse and passthrough before any tool handler executes.

## Metrics
Wrong-audience acceptance 0%; passthrough acceptance 0%; valid-resource fixture pass 100%; secret exposure 0.

## Trigger / Inputs / Outputs
- Trigger: protected MCP request before tool execution.
- Inputs: verified claims, configured MCP resource URI, required scopes, downstream mode.
- Output: allow/deny plus non-secret reason codes.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
- https://py.sdk.modelcontextprotocol.io/api/mcp/shared/auth_utils/
- https://github.com/cosai-oasis/secure-ai-tooling/issues/196
