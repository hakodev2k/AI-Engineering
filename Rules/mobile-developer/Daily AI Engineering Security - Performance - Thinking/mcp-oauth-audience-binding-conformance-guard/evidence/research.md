# Research — MCP OAuth Audience Binding Conformance Guard

## Problem
Remote MCP clients and servers still mis-handle OAuth resource/audience binding. Common failure modes include clients omitting RFC 8707 `resource`, authorization servers issuing tokens for the wrong resource, resource servers accepting tokens with unrelated audiences, and MCP gateways passing inbound bearer tokens through to upstream APIs.

## Category
Security

## Why it matters now
The MCP 2026-07-28 authorization specification requires clients to request resource-bound tokens and servers to validate that tokens were issued specifically for the MCP resource. Yet recent implementation bugs show both sides still diverge from those requirements.

## Current public signals
1. MCP 2026-07-28 Security Considerations requires clients to include `resource`, servers to validate intended audience, and servers not to pass inbound access tokens through to upstream APIs. It explicitly frames incorrect audience acceptance as an access-control failure.
2. n8n issue #30733 (opened 2026-05-19) documents its MCP OAuth2 client omitting RFC 8707 `resource` on authorization and token requests. OAuth consent succeeds, but compliant MCP servers reject the resulting token because it is not resource-bound.
3. n8n issue #30500 documents the reverse direction: its instance MCP server ignored the requested resource and issued a token with hardcoded `aud: "mcp-server-api"`.
4. Apache Solr MCP PR #123 (May 2026) added JWT audience validation because accepting sibling-application JWTs from the same IdP enabled token-confusion risk.
5. A May 2026 measurement study of remote MCP authentication found pervasive OAuth deployment flaws across tested real-world servers, reinforcing that authorization correctness is not merely theoretical.

## Existing approaches
- Follow OAuth 2.1, RFC 8707 Resource Indicators, RFC 9728 Protected Resource Metadata, and MCP authorization rules.
- Configure framework middleware to validate issuer, audience, expiry, and scopes.
- Depend on IdP-specific OAuth libraries and manual integration tests.
- Fix individual client/server defects after interoperability or security failures appear.

## Observed limitations
- OAuth flows can complete successfully while producing unusable or dangerously over-broad tokens; login success is not conformance evidence.
- Client and server defects are symmetric: request construction, token issuance, and resource-server validation can each fail independently.
- Provider behavior differs. Some IdPs are scope-centric, so blindly checking only whether a `resource` parameter exists is insufficient; the security invariant is that the resulting token is audience-restricted to the target resource.
- Generic JWT validation often verifies signature/issuer/expiry but leaves audience validation disabled or too broad.
- Token passthrough may bypass intended resource separation even when inbound validation exists.
- Manual testing rarely covers negative cases: wrong audience, missing resource, token replay to sibling service, refresh-token resource drift, and passthrough.

## Root-cause hypotheses
- Teams treat authentication success as equivalent to authorization correctness.
- Audience/resource invariants are distributed across client, authorization server, resource server, proxy, refresh flow, and upstream API integration.
- Framework defaults vary and often require explicit audience configuration.
- Conformance checks are not continuously executable in CI.

## Improvement target
Create a reusable fail-closed conformance package that:
- models canonical MCP resource identity;
- validates authorization/token/refresh requests for resource binding;
- decodes test JWTs locally and verifies issuer/audience/expiry/scope invariants;
- rejects sibling-resource tokens;
- checks that upstream calls use separate credentials rather than inbound token passthrough;
- provides deterministic positive and negative fixtures suitable for CI;
- produces machine-readable evidence distinguishing Implemented, Measured, and Verified states.

## Success metrics
- 100% of negative audience fixtures rejected.
- 100% of valid resource-bound fixtures accepted.
- zero inbound-token passthrough in tested proxy traces.
- refresh flow preserves intended resource binding.
- conformance script returns non-zero on missing/incorrect audience validation.
- no real secrets required for local test mode.

## Sources
- MCP 2026-07-28 authorization security considerations: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
- MCP 2026-07-28 authorization specification: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
- n8n #30733: https://github.com/n8n-io/n8n/issues/30733
- n8n #30500: https://github.com/n8n-io/n8n/issues/30500
- Apache Solr MCP PR #123: https://github.com/apache/solr-mcp/pull/123
- Measurement study, authentication security in remote MCP servers: https://arxiv.org/abs/2605.22333

## Evidence classification
**Observed:** the cited specifications, issues, PR, and study above.

**Interpretation:** audience/resource correctness remains an integration-level gap because compliant behavior depends on several independently configured components.

**Proposed engineering solution:** deterministic conformance checks around the OAuth/MCP boundary, with CI-enforceable negative tests and token-passthrough detection.
