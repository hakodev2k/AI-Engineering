# Research — MCP DNS Rebinding Ingress Guard

**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Local HTTP MCP servers remain vulnerable to browser-driven DNS rebinding when `Host`/`Origin` validation, loopback binding, or request authentication is missing or inconsistently enabled.

## Problem
A browser visiting an attacker-controlled site can rebind an attacker hostname to `127.0.0.1` or a private address. If a local MCP HTTP transport trusts arbitrary `Host`/`Origin`, the page can reach the MCP endpoint and invoke exposed tools under the victim's local identity or server-held credentials.

## Why it matters now
The failure pattern is recurring across multiple MCP implementations in 2026, including fresh July advisories for the Ruby SDK and CircleCI MCP server plus updated advisories affecting Python, Go, Java and other MCP servers. This indicates an ecosystem-level deployment/control gap rather than a single implementation defect.

## Affected users
Developers running MCP over Streamable HTTP/SSE, desktop-agent users, platform teams shipping local MCP servers, and operators whose MCP tools hold CI/CD, filesystem, cloud, database, or other credentials.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/ruby-sdk` advisory GHSA-rjr6-rcgv-9m7m / CVE-2026-63118, published 2026-07-08, reports missing `Host`/`Origin` checks in Streamable HTTP; fixed in 0.23.0. https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
2. CircleCI MCP advisory GHSA-jwj7-74jh-p5c4, published 2026-07-22, reports DNS rebinding allowing invocation of MCP tools with a server-held PAT; fixed in 0.17.0 with allowed-host/origin controls and loopback restrictions. https://github.com/CircleCI-Public/mcp-server-circleci/security/advisories/GHSA-jwj7-74jh-p5c4
3. GitHub Advisory Database entry GHSA-9h52-p55h-vw2f for the Python MCP SDK, updated 2026-07-16, documents DNS-rebinding exposure when localhost HTTP servers lack transport security settings; fixed in 1.23.0. https://github.com/advisories/GHSA-9h52-p55h-vw2f
4. GitHub Advisory Database entry GHSA-xw59-hvm2-8pj6 for the Go SDK documents the same default-protection class; fixed in 1.4.0. https://github.com/advisories/GHSA-xw59-hvm2-8pj6

### Interpretation
Patch-level fixes exist, but deployment correctness still depends on multiple independent controls: patched dependency, safe bind address, `Host` validation, `Origin` validation, and (for consequential tools) request authentication. Teams need a deterministic ingress contract and regression test instead of assuming SDK defaults remain safe across languages and versions.

## Existing approaches
- Upgrade to patched MCP SDK/server versions.
- Configure allowed hosts/origins.
- Bind local servers to loopback only.
- Require an unpredictable request token or authentication.
- Place MCP behind a reverse proxy that validates `Host`/`Origin`.

## Remaining limitations
- Defaults differ by SDK/version and can regress during transport migration.
- Reverse proxies may normalize or overwrite headers, hiding weak downstream checks.
- `Origin` can be absent for non-browser clients, so simplistic allow/deny logic can break legitimate clients or create bypasses.
- Loopback binding alone does not defeat browser DNS rebinding.
- Dependency scanning proves version state, not runtime ingress behavior.

## Root-cause analysis
1. HTTP transport is treated as local-only even though browsers can target loopback/private services.
2. Security controls are spread across framework, SDK, proxy and application layers.
3. Deployments lack a single fail-closed policy that binds host, origin, bind address and authentication requirements.
4. Teams rarely regression-test hostile `Host`/`Origin` combinations after upgrades.

## Improvement opportunity
Provide a reusable ingress policy and deterministic validator that checks runtime configuration before start, plus regression fixtures for hostile host/origin combinations. The guard blocks unsafe public binding, missing allowed-host/origin policy, wildcard origins and unauthenticated consequential-tool exposure.

## Relevant sources
- https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
- https://github.com/CircleCI-Public/mcp-server-circleci/security/advisories/GHSA-jwj7-74jh-p5c4
- https://github.com/advisories/GHSA-9h52-p55h-vw2f
- https://github.com/advisories/GHSA-xw59-hvm2-8pj6
