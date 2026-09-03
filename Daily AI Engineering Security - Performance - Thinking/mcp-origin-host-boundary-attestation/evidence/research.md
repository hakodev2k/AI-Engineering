# Research

## Topic
MCP Origin/Host Boundary Attestation

## Category
Security

## Problem
Local and private-network MCP servers using Streamable HTTP can expose tools and data to browser-driven DNS rebinding or cross-origin access when Host/Origin validation is absent, incomplete, disabled, or delegated inconsistently to surrounding frameworks.

## Why it matters now
The MCP specification requires Origin validation for Streamable HTTP. Multiple official SDKs have shipped independent vulnerabilities in this exact boundary: TypeScript, Go, Java, Rust and Ruby. The Ruby SDK advisory published July 8, 2026 shows the failure class remains current rather than historical.

## Affected users
Developers running local MCP servers, platform teams embedding MCP HTTP transports, IDE/agent vendors, and operators exposing filesystem, shell, credential, browser, database, or internal-service tools through MCP.

## Current public evidence

### Observed evidence
1. MCP transport guidance states that Streamable HTTP servers MUST validate `Origin`, SHOULD bind local servers only to loopback, and SHOULD authenticate connections. Invalid present origins must be rejected with HTTP 403 in the current draft.
2. Ruby SDK advisory GHSA-rjr6-rcgv-9m7m, published 2026-07-08, reports that versions <=0.22.0 accepted arbitrary Host/Origin values, permitting a malicious webpage to drive locally exposed tools through DNS rebinding. Version 0.23.0 patched the issue.
3. Rust advisory GHSA-89vp-x53w-74fx reports the same attack class in `rmcp` before 1.4.0. A follow-up issue added Origin validation for defense in depth after Host-only mitigation.
4. Java advisory GHSA-8jxr-pr72-r468 documents missing Origin validation before 1.0.0 and explicitly notes that surrounding frameworks can change exposure.
5. Go advisory GHSA-xw59-hvm2-8pj6 documents protection disabled by default before 1.4.0.

### Interpretation
Upgrading one SDK is necessary but not sufficient for heterogeneous stacks. The durable engineering problem is attesting the effective HTTP trust boundary after SDK defaults, reverse proxies, CORS middleware, framework routing, bind addresses and deployment configuration are combined.

### Proposed solution
Use a secure-by-default policy oracle and verification workflow that rejects unapproved hosts and origins, forbids wildcard origins, records whether loopback-only binding or authentication is present, and requires deterministic negative tests before claiming the MCP endpoint is protected.

## Existing approaches
- Upgrade affected SDKs to patched versions.
- Enable SDK-provided DNS rebinding protection.
- Validate Host and Origin in a reverse proxy or web framework.
- Bind local servers to 127.0.0.1/::1.
- Require authentication.

## Remaining limitations
- Protection may be disabled by configuration or changed by framework integration.
- Host-only defenses do not attest the specification-required Origin behavior.
- Wildcard CORS can undermine browser-origin boundaries.
- Loopback binding reduces exposure but does not itself prove browser-origin rejection.
- Authentication does not replace source validation when browser credentials or ambient authority are involved.
- Teams often test successful MCP calls but not malicious Host/Origin combinations.

## Root-cause analysis
1. Effective policy is split across SDK, HTTP framework, proxy and deployment layers.
2. Defaults differ by language and release.
3. Browser-specific attack paths are easy to miss in agent-centric testing.
4. Positive-path integration tests do not prove rejection behavior.
5. Configuration drift can silently re-open the boundary after an upgrade.

## Improvement opportunity
Create one explicit policy artifact and a deterministic validator that can be reused in CI and deployment preflight. Require exact origin tuples, explicit allowed hosts, no wildcard, and evidence for authentication/bind mode. Treat unknown effective state as a blocking verification failure.

## Problem / Gap / Goal
- **Problem:** untrusted web origins can reach MCP HTTP endpoints when effective transport validation is weak.
- **Gap:** vendor patches do not prove the deployed boundary is still enforced end to end.
- **Goal:** make Host/Origin rejection an observable, testable invariant independent of SDK implementation.

## Metrics
- 100% malicious Host test cases rejected.
- 100% malicious Origin test cases rejected.
- 100% configured valid cases accepted by the policy oracle.
- Zero wildcard origins.
- Zero unclassified effective-boundary states at release time.
- Security regression suite pass rate.

## Trigger
Run when adding/upgrading an MCP HTTP server, changing proxy/CORS/auth settings, changing bind address, or before production/local distribution releases.

## Inputs
Allowed hosts, allowed origins, authentication requirement, bind mode, request fixtures, and deployment evidence.

## Outputs
Policy decision report, failing cases, remediation guidance, and verification status.

## Relevant sources
- MCP Streamable HTTP transport security warning: https://modelcontextprotocol.io/specification/draft/basic/transports
- Ruby SDK advisory GHSA-rjr6-rcgv-9m7m (2026-07-08): https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
- Rust SDK advisory GHSA-89vp-x53w-74fx (2026-04-29): https://github.com/modelcontextprotocol/rust-sdk/security/advisories/GHSA-89vp-x53w-74fx
- Rust Origin follow-up #822: https://github.com/modelcontextprotocol/rust-sdk/issues/822
- Java SDK advisory GHSA-8jxr-pr72-r468 (2026-04-07): https://github.com/modelcontextprotocol/java-sdk/security/advisories/GHSA-8jxr-pr72-r468
- Go SDK advisory GHSA-xw59-hvm2-8pj6 (2026-03-30): https://github.com/modelcontextprotocol/go-sdk/security/advisories/GHSA-xw59-hvm2-8pj6
- TypeScript SDK advisory GHSA-w48q-cv73-mx4w: https://github.com/modelcontextprotocol/typescript-sdk/security/advisories/GHSA-w48q-cv73-mx4w
