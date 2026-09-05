# Research

## Topic
LiteLLM MCP Auth Fallback Fail-Closed Gate

## Category
Security

## Problem
Authentication failure in an AI gateway must never become a more permissive identity state. CVE-2026-59822 showed the opposite pattern in LiteLLM MCP handling.

## Why it matters now
The GitHub reviewed advisory for GHSA-7488-6r32-c95q states that LiteLLM `<1.84.0` could accept a fabricated bearer token through an OAuth2 passthrough fallback and allow requests to reach MCP tooling without a valid LiteLLM key. The advisory was published June 30, 2026 and updated July 22, 2026. On September 2, 2026, CISA added CVE-2026-59822 to the Known Exploited Vulnerabilities catalog, making remediation operationally urgent for exposed deployments.

## Affected users
Platform engineers running LiteLLM; teams using LiteLLM as an MCP gateway; agent platforms exposing internal tools/services through MCP; security teams responsible for API and tool authorization.

## Current public evidence
### Observed evidence
1. GitHub Advisory Database, GHSA-7488-6r32-c95q / CVE-2026-59822: affected versions `<1.84.0`, fixed in `1.84.0`, CVSS 8.8. The described fallback replaced failed LiteLLM key validation with an empty `UserAPIKeyAuth()` for OAuth2 passthrough, allowing a fabricated Authorization header to establish an MCP session and potentially list/call configured tools.
2. LiteLLM's fixing work (`BerriAI/litellm#26463`, commit referenced by the advisory) tightened OAuth2 fallback gating and public-route detection. Independent public root-cause analysis of the patch documents that the change also narrowed `.well-known` handling to a path-scoped check and conditioned fallback on targeted servers actually using OAuth2.
3. CISA's Known Exploited Vulnerabilities catalog added CVE-2026-59822 on 2026-09-02, providing a separate current signal that exploitation is not merely theoretical.

### Interpretation
The reusable engineering problem is broader than one CVE: auth exception/fallback ladders can accidentally turn invalid credentials into an accepted anonymous identity. AI gateways amplify the consequence because an accepted identity may traverse into tools and connected services. Positive authentication tests alone do not cover this failure mode.

### Proposed solution
Add a deployment gate and negative-test procedure that makes invalid credentials, public-route exceptions, OAuth2 passthrough, and MCP tool authorization explicit and testable. Authentication failure MUST preserve or reduce privilege, never increase it.

## Existing approaches
Upgrade to 1.84.0+; block `/mcp/` routes when upgrade is impossible; restrict gateway network exposure; use reverse-proxy validation; configure MCP server permissions; test authentication middleware.

## Remaining limitations
- Version checks alone do not prove the deployed binary/configuration is the expected build.
- Reverse proxies can protect one path while direct backend access remains reachable.
- OAuth2 passthrough is legitimate for some upstreams, so it cannot simply be removed everywhere.
- Tool-level authorization can make an auth bypass more or less severe; both layers must be tested.
- Positive-path tests rarely exercise malformed bearer tokens and route-exception edge cases.

## Root-cause analysis
- Authentication and OAuth2 passthrough were represented in one fallback ladder.
- Error status (401/403) was used as evidence that a token belonged upstream instead of requiring explicit target configuration.
- Public discovery routing used insufficiently narrow matching before the fix.
- An empty auth object could be interpreted downstream as an accepted caller state.
- Security tests did not fully assert the invariant that failed authentication cannot increase authorization.

## Improvement opportunity
Convert the invariant into deterministic predeployment policy plus negative tests. Couple identity validation and tool authorization evidence, require path-scoped public exceptions, and block known-vulnerable versions or exposed MCP routes until remediated.

## Relevant sources
- https://github.com/advisories/GHSA-7488-6r32-c95q
- https://nvd.nist.gov/vuln/detail/CVE-2026-59822
- https://github.com/BerriAI/litellm/pull/26463
- https://github.com/BerriAI/litellm/releases/tag/v1.84.0
- https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- https://github.com/Aviral2642/ai-infra-security/blob/main/CVE-2026-59822/root-cause.md
