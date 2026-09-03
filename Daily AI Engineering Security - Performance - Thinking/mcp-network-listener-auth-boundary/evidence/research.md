# Research Evidence

## Topic
MCP Network Listener Authentication Boundary

## Category
Security

## Problem
MCP servers that were designed for local agent use can become remotely reachable when they bind to all interfaces or are published through containers/proxies. If inbound caller authentication is absent or confused with an outbound service credential, any reachable client may inherit the server's full tool authority.

## Why it matters now
Two independent critical 2026 disclosures show the same secure-default failure in current MCP infrastructure. `argocd-mcp` 0.8.0 bound its HTTP transport to every interface and accepted MCP sessions without an inbound credential even when an Argo CD API token gave the server powerful downstream authority. `mcp-router` similarly defaulted its aggregator listener to all interfaces and only required authentication when explicitly configured. Both fixes moved toward loopback-by-default and mandatory authentication for wider binds.

## Affected users
MCP server authors, developers running local agent tools, platform teams exposing MCP through HTTP/SSE/streamable HTTP, container and Kubernetes operators, and teams whose MCP servers hold credentials for production APIs or infrastructure.

## Current public evidence

### Observed evidence
1. **GHSA-rp45-5x3v-48mr**, published 2026-08-11 for `argocd-mcp`, reports that version 0.8.0 bound HTTP to every interface and required no inbound caller credential. A reachable attacker could invoke tools using the operator's stored Argo CD token. Version 0.9.0 patched the issue. The advisory recommends loopback-by-default, DNS-rebinding protection, Host/Origin validation, and a separate inbound credential.
2. **CVE-2026-82456 / GHSA-p2x5-x87w-v2xj**, published 2026-08-29, independently records the unrestricted bind/authentication failure and rates it critical.
3. **CVE-2026-81094 / GHSA-g448-x63h-m2m3**, published 2026-08-27 for `mcp-router`, reports that the CLI defaulted to an all-interface address and authentication was optional. Release 0.6.3 changed the default to loopback and refuses unauthenticated non-loopback binds.
4. The `mcp-for-argocd` security guidance now explicitly distinguishes the inbound MCP authentication token from downstream Argo CD credentials and notes that Host validation is required to address DNS rebinding scenarios where Origin may be absent.

### Interpretation
The recurring root problem is an authorization-boundary mismatch: the server possesses high-value downstream authority, but listener reachability is treated as equivalent to caller identity. Binding and authentication must be coupled. A server that is safe on loopback can become critical-risk when a Docker port, reverse proxy, pod networking rule, or explicit `0.0.0.0` bind expands reachability.

### Proposed solution
Create a reusable startup gate that classifies the effective bind as loopback or exposed and refuses exposed startup unless inbound authentication is configured. Require distinct inbound/outbound credentials, Host/Origin/DNS-rebinding controls for browser-reachable transports, and deployment verification that the actual listening socket matches intended policy.

## Existing approaches
- Documentation warning users to keep MCP local.
- Optional bearer-token flags.
- Binding to `0.0.0.0` for container convenience.
- Reverse proxies or network policies placed in front of the server.
- Reusing downstream API tokens as proof that the server is “authenticated.”

## Remaining limitations
- Documentation does not enforce runtime behavior.
- Optional auth fails open when operators omit a flag.
- Container publishing can expose a listener that appeared local in development.
- Downstream credentials authenticate the MCP server to another service, not the inbound caller to the MCP server.
- Origin checks alone do not stop non-browser clients and may not stop DNS rebinding.
- Proxies can alter effective Host/Origin semantics unless configured explicitly.

## Root-cause analysis
1. **Local-first assumptions leak into network deployments:** stdio/local trust expectations are carried into HTTP transports.
2. **Bind/auth decoupling:** host selection and authentication policy are configured independently instead of enforcing an invariant.
3. **Credential-role confusion:** outbound service tokens are mistaken for inbound access control.
4. **Deployment indirection:** Docker, Kubernetes, proxies, and port publishing change reachability after application configuration is chosen.
5. **Incomplete browser threat model:** Origin is used without Host validation or DNS-rebinding defenses.
6. **No deterministic startup attestation:** systems do not fail startup when effective exposure exceeds the configured trust boundary.

## Improvement opportunity
Enforce `non-loopback bind => inbound auth required` as a startup invariant; default all network transports to loopback; keep inbound and downstream credentials separate; validate Host and allowed Origin where browser/rebinding threats apply; and attest the actual socket/proxy exposure during verification.

## Goal
Prevent unauthenticated callers from acquiring MCP tool authority merely by reaching the listener.

## Metrics
- Exposed unauthenticated startup attempts rejected: 100%.
- Loopback default coverage for fresh installs: 100%.
- Inbound/outbound credential separation violations: 0.
- Unauthorized request acceptance in tests: 0.
- Effective-listener attestation coverage: 100% for network MCP deployments.
- Host/Origin/rebinding regression tests: 100% pass where applicable.

## Trigger
Use when adding HTTP/SSE/streamable-HTTP transport, changing bind addresses, containerizing an MCP server, publishing a port, adding reverse-proxy access, or giving an MCP server a privileged downstream credential.

## Inputs
Configured bind host/port, effective listener address, transport type, inbound-auth configuration, downstream credentials, allowed Host/Origin policy, proxy/container exposure, and tool authority level.

## Outputs
Startup allow/deny decision, listener exposure classification, credential-role assessment, deployment attestation, and verification report.

## Relevant sources
- `argocd-mcp` advisory GHSA-rp45-5x3v-48mr, published 2026-08-11: https://github.com/argoproj-labs/mcp-for-argocd/security/advisories/GHSA-rp45-5x3v-48mr
- GitHub Advisory Database CVE-2026-82456 / GHSA-p2x5-x87w-v2xj, published 2026-08-29: https://github.com/advisories/GHSA-p2x5-x87w-v2xj
- GitHub Advisory Database CVE-2026-81094 / GHSA-g448-x63h-m2m3, published 2026-08-27: https://github.com/advisories/GHSA-g448-x63h-m2m3
- `mcp-for-argocd` security guidance: https://github.com/argoproj-labs/mcp-for-argocd/security
