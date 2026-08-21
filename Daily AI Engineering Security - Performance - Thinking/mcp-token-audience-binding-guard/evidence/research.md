# Research — MCP Token Audience Binding Guard

## Topic
MCP Token Audience Binding Guard

## Category
Security

## Problem
MCP servers can authenticate a syntactically valid OAuth token yet authorize the wrong client/resource when audience, issuer, active state, or downstream token boundaries are not validated fail-closed. Passing an inbound MCP token directly to an upstream API creates an additional confused-deputy/token-passthrough path.

## Why it matters now
The MCP 2026-07-28 security guidance explicitly requires resource indicators, audience validation, and prohibits token passthrough. This is not merely theoretical: CVE-2026-14541, published July 30, 2026, describes Google mcp-toolbox 1.4.0 accepting unrelated Google OAuth tokens when MCP audience/client configuration was absent. Other 2026 mcp-toolbox CVEs document fail-open opaque-token claim validation when issuer or active-state fields are missing.

## Affected users
MCP server authors, gateway/platform teams, enterprise agent integrators, connector developers, and users granting agents access to protected tools/data.

## Current public evidence
### Observed evidence
1. MCP's July 28, 2026 security best-practices document defines token passthrough as an anti-pattern and explains audience-validation/confused-deputy risk: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
2. MCP's current authorization specification requires clients to use RFC 8707 resource indicators and servers to validate that tokens were issued specifically for the MCP server: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
3. NVD CVE-2026-14541 (published 2026-07-30) documents an audience-confusion authentication bypass in Google mcp-toolbox 1.4.0 when `mcpEnabled` was true but audience/clientId was not explicitly configured: https://nvd.nist.gov/vuln/detail/CVE-2026-14541
4. NVD CVE-2026-11718 documents a separate opaque-token validation path in mcp-toolbox that could accept unintended issuer tokens when introspection omitted `iss`, demonstrating the importance of fail-closed claim validation: https://nvd.nist.gov/vuln/detail/CVE-2026-11718
5. MCP's July 28, 2026 release notes say authorization has consumed substantial implementer integration effort and added further issuer-validation protections: https://blog.modelcontextprotocol.io/posts/2026-07-28/

## Existing approaches
- Validate JWT signatures and expiry.
- Use OAuth introspection for opaque tokens.
- Configure scopes at the authorization server.
- Forward a user's token to downstream APIs for convenience.
- Depend on framework defaults for audience/issuer checks.

## Remaining limitations
A valid signature does not establish intended resource. Introspection responses can be incomplete. Optional or missing configuration can turn checks into fail-open behavior. Broad scopes do not establish per-resource intent. Token passthrough collapses separate trust boundaries and exposes inbound credentials to downstream services.

## Root-cause analysis
- Authentication validity is conflated with authorization for the MCP resource.
- Audience/resource and issuer expectations are not explicit configuration invariants.
- Missing claims/configuration are sometimes treated as 'no restriction' instead of denial.
- Inbound and downstream OAuth client roles are conflated.
- Raw bearer tokens may leak into logs/tool arguments/telemetry.

## Improvement opportunity
Add a deterministic pre-tool authorization gate that operates on validated token metadata, not raw secrets. Require explicit expected MCP resource/audience and issuer, fail closed on absent required claims, reject token passthrough, require separate downstream credentials, and bind high-impact operations to least-privilege scopes.

## Interpretation
The CVEs concern specific mcp-toolbox versions/paths and do not imply all MCP implementations are vulnerable. They provide concrete current evidence that audience and fail-closed claim validation are easy to implement incorrectly in real MCP infrastructure.

## Proposed solution
A reusable metadata-only guard plus security rules and bounded verification workflow. The guard rejects raw token input, wrong/missing audience or issuer, inactive/unknown token state, forbidden passthrough, and insufficient scopes before a protected tool action proceeds.

## Goal
Ensure every protected MCP action is authorized for the intended MCP resource with explicit fail-closed boundaries, without exposing credentials.

## Metrics
- 100% protected actions evaluated against expected resource/audience and issuer.
- 0 raw bearer tokens accepted by the guard/log contract.
- 100% missing required claims fail closed.
- 0 inbound MCP tokens reused as downstream API credentials.
- Security fixture pass rate and denied attack-path count.

## Trigger
Before a protected MCP tool call, after token validation/introspection metadata is available, or when configuring an MCP server/gateway authorization boundary.

## Inputs
Non-secret token metadata: issuer, audiences, active state, scopes; expected MCP resource; operation-required scopes; downstream target and whether passthrough is requested.

## Outputs
Allow/deny decision, deterministic reasons, missing scopes, and safe audit metadata with no credentials.
