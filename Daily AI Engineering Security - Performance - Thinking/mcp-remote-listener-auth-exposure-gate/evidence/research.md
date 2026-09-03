# Research Evidence

## Topic
MCP Remote Listener Authentication Exposure Gate

## Category
Security

## Problem
Self-hosted MCP servers can expose privileged tools to the network when HTTP/SSE transports bind to non-loopback interfaces while authentication, authorization, and origin protections are absent or misconfigured. Because many MCP tools execute with server-side credentials, a network caller can become a confused-deputy beneficiary of those credentials.

## Why it matters now
A critical advisory published on 2026-08-29 reports that `argocd-mcp` 0.8.0 binds its HTTP transport to every network interface and accepts MCP sessions without caller credentials when an Argo CD API token is configured. Reachable attackers can invoke tools using the operator's stored token to create applications, request syncs, and modify Argo CD resources. This is not an isolated implementation pattern: multiple 2026 advisories for MCP servers describe the same combination of `0.0.0.0`, absent authentication, and server-side credential reuse.

## Affected users
Developers and platform teams running HTTP/SSE MCP servers, especially in containers, Kubernetes, shared hosts, CI environments, internal networks, remote developer machines, or gateways that hold privileged upstream credentials.

## Current public evidence

### Observed evidence
1. GitHub Advisory Database entry GHSA-p2x5-x87w-v2xj / CVE-2026-82456, published 2026-08-29, rates the `argocd-mcp` exposure Critical (CVSS 10.0). The advisory states that HTTP binds to every interface, does not require caller credentials, and allows remote tool invocation with the configured Argo CD token.
2. GitHub-reviewed advisory GHSA-73cv-556c-w3g6 / CVE-2026-49257 documents `mcp-pinot` defaulting to `0.0.0.0:8080` with OAuth disabled. The 3.1.0 fix changed the default bind host to `127.0.0.1` and refuses non-loopback exposure unless OAuth is enabled.
3. GitHub-reviewed advisory GHSA-fj4g-2p96-q6m3 / CVE-2026-42856 documents Network-AI exposing an MCP HTTP endpoint on `0.0.0.0` without authentication, allowing callers to enumerate and invoke privileged management tools.
4. A July 2026 advisory for `mcp-atlassian` reports unauthenticated HTTP requests falling back to globally configured Jira/Confluence credentials while the server binds to all interfaces by default.

### Interpretation
The recurring failure is a deployment-policy gap, not only a dependency-version problem. HTTP MCP transports need a secure-by-default relationship between listener scope, authentication, origin validation, and server-side credential authority. A non-loopback listener should be treated as a privileged exposure event that requires explicit proof of protections.

### Proposed solution
Introduce a deterministic deployment gate that classifies listener addresses, checks whether remote exposure is authenticated, verifies origin protection where browser-reachable transports are used, records whether privileged upstream credentials are available, and blocks deployment when effective network reachability exceeds the authorization boundary.

## Existing approaches
- Patch vulnerable MCP servers to versions that bind to loopback or enforce authentication.
- Put the MCP server behind an authenticated reverse proxy or service mesh.
- Rely on firewall rules, Kubernetes NetworkPolicy, or security groups.
- Bind local-only servers to `127.0.0.1` or `::1`.
- Add OAuth or another supported authentication provider to the HTTP transport.

## Remaining limitations
- Container port publishing can make a service reachable even when operators believe it is development-only.
- Reverse-proxy authentication can be bypassed if the backend listener is separately reachable.
- Network policy alone does not prove caller identity and may broaden over time.
- Authentication without authorization may still expose high-impact tools to every authenticated principal.
- Browser-reachable transports need Origin/DNS-rebinding defenses in addition to bearer authentication.
- Server-side credentials amplify impact because the MCP service can act with more authority than the caller.

## Root-cause analysis
1. Local development defaults (`0.0.0.0` for convenience) migrate into remote deployments.
2. Transport reachability and tool authorization are configured independently, so no component enforces their combined invariant.
3. Operators conflate network adjacency with authentication.
4. Upstream credentials are attached to the server process and implicitly available to every tool invocation.
5. Deployment review checks package version but not effective listener, proxy, container-publish, or ingress state.
6. Security controls are often documented but not converted into a blocking pre-deploy check.

## Improvement opportunity
Create a reusable exposure contract with deterministic checks for loopback binding, caller authentication, authorization scope, origin validation, and privileged credential use. Require a fail-closed outcome when a remote listener lacks identity enforcement or when the backend can be reached around the intended proxy.

## Goal
Ensure that no remotely reachable MCP HTTP/SSE endpoint can invoke privileged tools without authenticated and authorized caller identity, and that local-only deployments remain bound to loopback by default.

## Metrics
- Number of non-loopback listeners without authentication: target 0.
- Number of remote listeners without explicit authorization policy: target 0.
- Number of browser-reachable endpoints without Origin validation: target 0.
- Number of backend MCP ports directly reachable around the authenticated proxy: target 0.
- Security regression test pass rate: 100%.
- Unauthorized tool-call test result: blocked before tool dispatch.

## Trigger
Run before enabling HTTP/SSE transport, publishing a container port, adding ingress/load-balancer exposure, changing bind host, changing authentication middleware, or attaching privileged upstream credentials to an MCP server.

## Inputs
Deployment descriptor, bind host, transport, authentication state, authorization scope, origin-validation state, proxy topology, server credential authority, and tool-impact classification.

## Outputs
A deterministic PASS/FAIL exposure decision, identified violations, required remediation, and verification evidence.

## Relevant sources
- GitHub Advisory Database, CVE-2026-82456 / GHSA-p2x5-x87w-v2xj, published 2026-08-29: https://github.com/advisories/GHSA-p2x5-x87w-v2xj
- NVD CVE-2026-82456: https://nvd.nist.gov/vuln/detail/CVE-2026-82456
- GitHub Advisory Database, CVE-2026-49257 / GHSA-73cv-556c-w3g6: https://github.com/advisories/GHSA-73cv-556c-w3g6
- GitHub Advisory Database, CVE-2026-42856 / GHSA-fj4g-2p96-q6m3: https://github.com/advisories/GHSA-fj4g-2p96-q6m3
- MCP Atlassian advisory GHSA-vc8m-84rp-53hx: https://github.com/sooperset/mcp-atlassian/security/advisories/GHSA-vc8m-84rp-53hx
- GitHub Advisory Database, PraisonAI MCP SSE exposure CVE-2026-57123 / GHSA-x227-pf99-vffg: https://github.com/advisories/GHSA-x227-pf99-vffg
