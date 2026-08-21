# Research — MCP OAuth Resource Audience Conformance Gate

## Topic
MCP OAuth Resource Audience Conformance Gate

## Category
Security

## Problem
MCP OAuth integrations can obtain or accept bearer tokens that are not bound to the intended MCP resource. Missing RFC 8707 `resource` parameters, incorrect `aud` claims, weak server-side audience validation, or token passthrough can create authorization failures and confused-deputy/security-boundary risks.

## Why it matters now
The MCP 2026-07-28 authorization specification explicitly requires clients to include `resource` in authorization and token requests and servers to validate tokens were issued for themselves. Current 2026 implementation reports show ecosystem gaps: Supabase Auth issue #2610 requests RFC 8707 support because its current OAuth audience behavior cannot satisfy MCP resource binding, and Codex issue #13891 reports MCP login omitting the resource indicator and receiving the wrong token audience. Microsoft MCP documentation notes 2026-07-28-aligned issuer/audience/scope validation for inbound authentication.

## Affected users
MCP server authors, MCP client/runtime teams, OAuth provider maintainers, enterprise connector developers, platform security teams, and users connecting agents to protected APIs.

## Current public evidence
### Observed evidence
1. MCP authorization/security docs (2026-07-28) require Resource Indicators, intended-audience validation, and prohibit accepting/transiting unrelated tokens: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
2. MCP security best practices describe audience-validation failures and token passthrough as risks that can enable confused-deputy behavior: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
3. Supabase Auth #2610 (opened 2026-07-02) requests RFC 8707 support because ignored `resource` parameters yield an unsuitable default audience for MCP: https://github.com/supabase/auth/issues/2610
4. OpenAI Codex #13891 reports MCP OAuth login omitting the resource indicator and allowing a default/wrong audience token to be minted: https://github.com/openai/codex/issues/13891
5. Microsoft MCP authentication documentation states inbound JWT issuer, audience, and scope validation for 2026-07-28-aligned flows: https://github.com/microsoft/mcp/blob/main/docs/Authentication.md

## Existing approaches
- Trust OAuth provider defaults.
- Validate signature/expiry but not resource audience.
- Add provider-specific configuration for expected audience.
- Pass client bearer tokens to downstream APIs.
- Manually inspect tokens during integration testing.

## Remaining limitations
Provider defaults differ; some authorization servers still lack Resource Indicator support; clients may omit `resource`; server validation can be misconfigured; successful signature validation does not prove the token is intended for the MCP server; manual tests do not reliably cover authorization/token endpoints and downstream token separation.

## Root-cause analysis
- OAuth interoperability assumptions replace explicit resource binding.
- Audience validation is sometimes treated as optional configuration rather than a trust boundary.
- Client and server teams validate their halves independently without end-to-end conformance tests.
- Downstream API calls tempt implementations to reuse inbound tokens instead of obtaining separate upstream credentials.

## Improvement opportunity
Create a deterministic conformance gate that validates authorization request `resource`, token request `resource`, resulting token audience, issuer/scope expectations, and downstream-token separation. Run it in CI and before enabling a protected MCP connector.

## Goal
Ensure protected MCP flows are resource-bound end to end and reject token passthrough or wrong-audience acceptance before production.

## Metrics
- 100% tested authorization/token requests contain canonical `resource`.
- 100% accepted access tokens match configured MCP audience.
- 0 inbound bearer tokens forwarded unchanged to downstream APIs in test fixtures.
- Wrong-audience/issuer/expired/insufficient-scope fixtures rejected.
- Conformance test pass rate by client/provider/server combination.

## Trigger
New MCP OAuth integration, provider/client upgrade, auth configuration change, protected-resource metadata change, or security regression run.

## Inputs
Canonical MCP resource URI, authorization request capture, token request capture, decoded token claims or introspection result, expected issuer/audience/scopes, downstream request trace.

## Outputs
Pass/fail findings for resource binding, audience, issuer, scope, token separation, plus remediation evidence.

## Interpretation
The specification is clear, but current issues show implementation and provider interoperability gaps. The package does not assume a specific OAuth vendor; it verifies observable protocol behavior.

## Proposed solution
Reusable conformance procedure, enforceable authorization rules, independent reviewer role, bounded integration workflow, pre-enable hook, and a deterministic claim/request validator.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
- https://github.com/supabase/auth/issues/2610
- https://github.com/openai/codex/issues/13891
- https://github.com/microsoft/mcp/blob/main/docs/Authentication.md
