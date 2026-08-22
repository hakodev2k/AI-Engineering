# Research — MCP Local HTTP DNS Rebinding Attestation

## Topic
MCP Local HTTP DNS Rebinding Attestation

## Category
Security

## Problem
Local MCP servers exposed over Streamable HTTP or SSE can be reachable from a victim's browser through DNS rebinding when Host/Origin validation, loopback binding, or authentication is missing or misconfigured. The risk is not merely theoretical: current 2026 advisories show multiple SDKs and concrete MCP servers were affected, including servers holding powerful access tokens.

## Why it matters now
The MCP ecosystem is rapidly standardizing HTTP transports while local developer servers commonly expose filesystem, shell, CI/CD, browser, or credential-backed tools. Recent July 2026 advisories and specification guidance make the control requirements explicit, but implementation defaults and app-level configuration still vary.

## Affected users
MCP server authors, desktop/CLI MCP clients, developer-tool vendors, platform teams operating local agents, and users who run credential-bearing MCP servers on localhost or LAN interfaces.

## Current public evidence
### Observed evidence
1. CircleCI's MCP server advisory GHSA-jwj7-74jh-p5c4, published 2026-07-22, states that missing Host/Origin validation enabled DNS rebinding against a local server holding a CircleCI PAT. Exposed tools included pipeline execution, workflow reruns, and rollbacks. Fixed in `@circleci/mcp-server-circleci` 0.17.0: https://github.com/CircleCI-Public/mcp-server-circleci/security/advisories/GHSA-jwj7-74jh-p5c4
2. MCP Ruby SDK advisory GHSA-rjr6-rcgv-9m7m, published 2026-07-08 and updated 2026-07-30, reports Streamable HTTP transport accepted requests without Host/Origin protection through 0.22.0; fixed in 0.23.0: https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
3. MCP Python SDK GHSA-9h52-p55h-vw2f documents DNS-rebinding protection not enabled by default in versions before 1.23.0 for vulnerable localhost HTTP configurations: https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-9h52-p55h-vw2f
4. MCP Go SDK GHSA-xw59-hvm2-8pj6 documents the same class for versions before 1.4.0: https://github.com/modelcontextprotocol/go-sdk/security/advisories/GHSA-xw59-hvm2-8pj6
5. MCP security best-practices documentation for the 2026-07-28 specification explicitly discusses DNS rebinding, localhost services, metadata endpoints, local MCP compromise, and recommends least privilege, sandboxing, validation, and consent controls: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
6. TypeScript SDK issue #2489, opened 2026-07-14, reports an allowlist validation edge case where userinfo in Origin/Host values could be accepted because parsing compared only `.hostname`: https://github.com/modelcontextprotocol/typescript-sdk/issues/2489

### Interpretation
Upgrading vulnerable SDKs is necessary but not sufficient for platform assurance. App-level wrappers, reverse proxies, custom transports, environment overrides, bind-address changes, authentication settings, or allowlist parsing can reintroduce exposure. Teams need an executable attestation that checks effective runtime behavior, not only dependency versions.

## Existing approaches
- Upgrade SDKs to patched versions.
- Configure allowed hosts/origins.
- Bind local HTTP servers only to loopback.
- Add authentication/request tokens.
- Use stdio transport where appropriate.
- Place a reverse proxy/WAF in front of public servers.

## Remaining limitations
- Dependency version checks do not prove runtime configuration is safe.
- Static config can diverge from the actual listener address and middleware chain.
- Reverse proxies can rewrite Host/Origin and accidentally weaken assumptions.
- Allowlist implementations can contain parsing edge cases.
- Some local servers hold long-lived PATs or broad tool permissions, increasing blast radius.

## Root-cause analysis
1. Browser-to-localhost is treated as inherently trusted.
2. HTTP bind address and Host/Origin policy are configured independently.
3. Security defaults differ across SDK versions and languages.
4. Authentication is sometimes omitted because the server is 'local only'.
5. Teams validate source configuration instead of probing the effective endpoint.
6. Tool permission scope is not factored into network-exposure severity.

## Improvement opportunity
Build a deterministic preflight and runtime attestation that probes effective listener/bind state, rejects foreign Host/Origin combinations, checks request authentication where required, records the exposed tool capability class, and blocks startup/completion when a localhost HTTP server is reachable under an unsafe policy.

## Goal
Prove that local HTTP MCP exposure preserves the browser-to-localhost trust boundary under the deployed configuration.

## Metrics
- 100% rejection of configured foreign Host probes.
- 100% rejection of configured foreign Origin probes.
- 100% authentication enforcement for policy-marked sensitive servers.
- Zero wildcard bind without an explicit public-server policy.
- Zero high-impact tool exposure on unauthenticated local HTTP.
- Deterministic machine-readable attestation report for every deployment/startup check.

## Trigger
Server startup, dependency/transport upgrade, proxy/config change, new tool exposure, or security regression verification.

## Inputs
Endpoint URL, expected bind scope, allowed hosts, allowed origins, authentication requirement, exposed capability classification, and optional safe probe token.

## Outputs
`pass`, `block`, or `manual-review`, with per-control evidence and remediation guidance.

## Relevant sources
- CircleCI MCP advisory: https://github.com/CircleCI-Public/mcp-server-circleci/security/advisories/GHSA-jwj7-74jh-p5c4
- MCP Ruby SDK advisory: https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
- MCP Python SDK advisory: https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-9h52-p55h-vw2f
- MCP Go SDK advisory: https://github.com/modelcontextprotocol/go-sdk/security/advisories/GHSA-xw59-hvm2-8pj6
- MCP 2026-07-28 security best practices: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
- TypeScript SDK #2489: https://github.com/modelcontextprotocol/typescript-sdk/issues/2489
