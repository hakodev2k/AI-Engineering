# Research

## Topic
MCP OAuth Resource Audience Binding Guard

## Category
Security

## Problem
MCP deployments can authenticate a token successfully while still accepting a credential minted for a different resource, or can forward the MCP client's bearer token to an upstream API. Both patterns break resource isolation and enable replay/confused-deputy behavior.

## Why it matters now
The MCP 2026-07-28 authorization security guidance explicitly requires resource indicators and resource-specific token validation. Earlier in 2026, the MCP Registry fixed CVE-2026-44428 (GHSA-95c3-6vvw-4mrq), where GitHub OIDC tokens used a shared audience and were replayable across registry deployments. The combination of a concrete ecosystem vulnerability and tightened specification language makes resource binding an immediate implementation concern.

## Affected users
MCP server authors, MCP gateway operators, enterprise identity teams, agent-platform builders, registry operators, and developers connecting MCP servers to upstream SaaS APIs.

## Current public evidence
### Observed evidence
1. MCP specification security considerations dated 2026-07-28 state that MCP servers MUST accept only access tokens intended for themselves and clients MUST use RFC 8707 `resource` to identify the target resource.
2. The same guidance says an MCP server calling an upstream API MUST use a separate upstream token and MUST NOT pass through the token received from the MCP client.
3. GitHub Advisory GHSA-95c3-6vvw-4mrq / CVE-2026-44428, published 2026-05-04 and updated 2026-06-01, documents cross-registry replay of GitHub OIDC tokens because multiple MCP Registry deployments shared the `mcp-registry` audience. Patched version: registry 1.7.6.
4. RFC 8707 defines the OAuth `resource` request parameter specifically to communicate the intended protected resource to the authorization server.

### Interpretation
Signature, issuer and scope validation are insufficient when the intended resource is ambiguous. A token that is valid in cryptographic terms can still be invalid for the receiving MCP server. Resource and audience binding therefore need an explicit, testable contract at every MCP authorization boundary.

### Proposed solution
Introduce a preflight and regression gate that validates declared resource, expected audience, issuer, scope allowlist and token-passthrough prohibition from sanitized authorization metadata before deployment or connector activation.

## Existing approaches
OAuth 2.1 authorization, RFC 8707 Resource Indicators, Protected Resource Metadata, JWT audience validation, issuer checks, scope checks, separate OAuth client credentials for upstream APIs, and gateway policy enforcement.

## Remaining limitations
- OAuth libraries may validate signature/expiry while leaving audience checks optional or application-specific.
- Teams can reuse a convenient common audience across several deployments.
- Gateways can accidentally forward inbound bearer tokens to upstream services.
- Scope checks alone do not prove the token targets the current resource.
- Manual architecture review does not continuously verify effective configuration.

## Root-cause analysis
1. Authentication success is conflated with authorization for the current resource.
2. Resource identifiers are omitted or normalized inconsistently across client, authorization server and MCP server.
3. Shared audiences are used as deployment shortcuts.
4. Upstream API calls reuse inbound credentials instead of a distinct OAuth exchange/client relationship.
5. There is no deterministic CI/preflight check for authorization-boundary metadata.

## Improvement opportunity
A reusable metadata-level guard can fail closed before traffic is sent, without handling secrets. It can also be used as a regression fixture around gateway/config changes and gives reviewers an explicit artifact proving that the resource, audience, issuer and scope relationships match policy.

## Relevant sources
- MCP Authorization Security Considerations, 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
- GitHub Advisory GHSA-95c3-6vvw-4mrq / CVE-2026-44428: https://github.com/advisories/GHSA-95c3-6vvw-4mrq
- MCP Registry security fix context: https://github.com/modelcontextprotocol/registry
- RFC 8707, OAuth 2.0 Resource Indicators: https://www.rfc-editor.org/rfc/rfc8707
