# Research — MCP Resource Audience Enforcement Gate

## Topic
MCP Resource Audience Enforcement Gate

## Category
Security

## Problem
Remote MCP deployments can accept a bearer token that is cryptographically valid but was issued for a different resource, issuer, or scope. In an agent ecosystem with gateways, aggregators, and many MCP servers, accepting a token merely because its signature is valid creates replay/confused-deputy risk and can widen an agent's authority beyond the intended server.

## Why it matters now
The current MCP 2026-07-28 authorization specification strengthens resource binding and issuer validation. It requires clients to send RFC 8707 `resource` indicators in authorization and token requests, requires MCP servers to use Protected Resource Metadata, and defines issuer-response validation. These requirements are easy to miss in older OAuth middleware that only verifies signature/expiry.

## Affected users
MCP server authors, gateway/platform teams, enterprise identity engineers, AI-agent developers, and operators exposing protected MCP tools over HTTP.

## Current public evidence
### Observed evidence
1. The MCP 2026-07-28 Authorization specification requires clients to implement RFC 8707 Resource Indicators, include `resource` in authorization and token requests, and identify the intended MCP server with its canonical URI. It also requires Protected Resource Metadata and defines issuer validation rules: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
2. The same specification states that a protected MCP server acts as an OAuth resource server and includes least-privilege scope guidance and step-up authorization behavior. These are current normative requirements, not optional application conventions: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
3. Cloud Security Alliance's 2026 IAM guidance for AI agents highlights sender-constrained tokens, scope attenuation, distinct agent identities, and the complexity of delegation chains in agent systems, reinforcing that token possession alone is not a sufficient trust boundary: https://cloudsecurityalliance.org/artifacts/navigating-identity-and-access-management-iam

### Interpretation
Generic JWT validation is necessary but insufficient for a protected MCP server. A reusable gate should consume claims only after cryptographic verification by trusted middleware, then deterministically enforce expected issuer, intended audience/resource, required scopes, and canonical MCP resource identity.

## Existing approaches
- Standard OAuth/JWT middleware validating signature, expiry, and issuer.
- API gateway audience configuration.
- Static scope checks inside individual tool handlers.
- Network allowlists or service-to-service credentials.

## Remaining limitations
- Some middleware treats any token from a trusted issuer as acceptable.
- Audience/resource configuration drifts between gateway and MCP server.
- Scope checks duplicated in handlers are inconsistent and hard to audit.
- Gateways can unintentionally forward upstream tokens to downstream servers.
- Canonical URI mismatches (path, port, trailing slash, wrong host) cause either unsafe broad acceptance or brittle failures.

## Root-cause analysis
1. Signature validity is confused with authorization for this resource.
2. Resource identity is not centralized as configuration.
3. Audience, issuer, and scope checks occur in different layers with no shared contract.
4. Delegated/gateway token flow is not explicitly modeled.
5. Security tests emphasize expired/invalid signatures but omit valid-token-wrong-resource cases.

## Improvement opportunity
Add a fail-closed post-verification authorization gate that validates trusted token claims against one canonical MCP resource identifier, an issuer allowlist, allowed audiences, and operation-specific scopes. Require negative tests for wrong-resource, wrong-audience, missing-scope, and unverified-claims paths. Never decode and trust bearer tokens inside this package.

## Goal
Block cross-resource token replay and excessive authorization while preserving interoperable OAuth flows.

## Metrics
- 100% wrong-resource fixtures denied
- 100% wrong-issuer/audience fixtures denied
- 100% missing-scope fixtures denied
- 0 accepted requests with `claims_verified != true`
- security regression suite pass rate
- number of duplicated handler-level auth checks removed after centralization

## Trigger / Inputs / Outputs
- Trigger: before any protected MCP request or tool dispatch after trusted token verification.
- Inputs: verified claims envelope, canonical request resource, operation scopes, policy.
- Outputs: allow/deny decision with machine-readable reason; no token contents logged beyond approved metadata.

## Relevant sources
- MCP 2026-07-28 Authorization: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
- RFC 8707 Resource Indicators: https://www.rfc-editor.org/rfc/rfc8707
- RFC 9728 Protected Resource Metadata: https://datatracker.ietf.org/doc/html/rfc9728
- RFC 9207 Authorization Server Issuer Identification: https://datatracker.ietf.org/doc/html/rfc9207
- CSA IAM guidance for agents: https://cloudsecurityalliance.org/artifacts/navigating-identity-and-access-management-iam
