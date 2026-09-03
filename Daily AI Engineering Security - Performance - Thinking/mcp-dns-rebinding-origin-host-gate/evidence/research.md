# Research Evidence

## Topic
MCP DNS Rebinding Origin/Host Gate

## Category
Security

## Problem
Local and private-network MCP servers exposed through Streamable HTTP can be reachable from a malicious browser origin when the server transport fails to validate `Origin` and/or the effective `Host`. DNS rebinding can make an attacker-controlled hostname resolve to `127.0.0.1` or an RFC1918 address after the browser has established origin trust, letting the page drive `tools/list`, `tools/call`, resources, prompts, or other server capabilities.

## Why it matters now
The problem has recurred across official MCP SDK implementations in 2026 rather than appearing as a single isolated bug. The MCP specification already requires Origin validation for Streamable HTTP, yet recent Ruby, Rust, and Java SDK advisories show implementation gaps persisted across languages. Agent developers increasingly run filesystem, shell, credential, browser, and developer-tool MCP servers on loopback, so a browser-to-local-service pivot can expose high-impact capabilities.

## Affected users
Developers running local MCP servers, desktop agent users, platform teams embedding MCP transports, SDK maintainers, and organizations exposing MCP servers on LAN/private interfaces.

## Current public evidence

### Observed evidence
1. `modelcontextprotocol/ruby-sdk` advisory GHSA-rjr6-rcgv-9m7m, published 2026-07-08, states that Streamable HTTP accepted requests without validating `Host` or `Origin`. A malicious page could use DNS rebinding to enumerate and invoke local MCP tools. Versions through 0.22.0 were affected; 0.23.0 patched the issue.
2. `modelcontextprotocol/rust-sdk` advisory GHSA-89vp-x53w-74fx, published 2026-04-29, describes the same browser-to-local-MCP attack class due to missing Host validation. Versions before 1.4.0 were affected.
3. `modelcontextprotocol/java-sdk` advisory GHSA-8jxr-pr72-r468 / CVE-2026-35568, published 2026-04-07, reports a high-severity DNS rebinding vulnerability caused by missing Origin validation in versions before 1.0.0.
4. MCP transport security guidance explicitly requires servers to validate the `Origin` header on incoming Streamable HTTP connections and recommends binding local servers to loopback rather than all interfaces.

### Interpretation
The recurring weakness is not solved by checking only one language version. The security property belongs at the deployment boundary: every HTTP MCP server needs an explicit allowlist for host/origin, a well-defined policy for requests without `Origin`, loopback/private-network binding constraints, and tests that simulate browser-origin requests. Host-only or Origin-only checks can leave gaps, especially behind reverse proxies where effective host reconstruction is ambiguous.

### Proposed solution
A reusable deployment gate that evaluates normalized `Host`, `Origin`, listener address, proxy trust configuration, and request source against a deny-by-default policy. It includes a deterministic policy checker and regression tests for legitimate local clients, foreign browser origins, malformed hosts, forwarded-host confusion, and missing-Origin cases.

## Existing approaches
- Upgrade affected SDKs to patched versions.
- Follow MCP transport guidance and validate Origin.
- Bind local servers to `127.0.0.1`/`::1`.
- Put a reverse proxy in front of the MCP endpoint.
- Require authentication on MCP requests.

## Remaining limitations
- Binding to loopback alone does not stop DNS rebinding because the browser can reach loopback after rebinding.
- Authentication may be automatically attached by browser-accessible flows or may not exist for local developer servers.
- Reverse proxies can create Host/Forwarded-Host ambiguity if trust boundaries are not explicit.
- SDK patches do not protect custom transports, older pinned versions, wrappers, or future regressions.
- Origin-only validation may not cover non-browser routing confusion; Host-only validation does not establish browser origin trust.

## Root-cause analysis
1. Localhost is incorrectly treated as a trust boundary rather than only a network location.
2. HTTP-level browser security properties are delegated to generic web stacks without explicit MCP policy.
3. Implementations validate protocol JSON-RPC semantics but omit transport-origin semantics.
4. Proxy-derived headers are consumed without an explicit trusted-proxy list.
5. Regression suites focus on valid MCP calls rather than hostile browser request metadata.

## Improvement opportunity
Standardize a pre-dispatch gate with explicit `allowed_hosts`, `allowed_origins`, `allow_missing_origin`, `trusted_proxy_cidrs`, and `allowed_bind_addresses`. Reject before JSON-RPC dispatch, log a structured reason, and test the gate independently of the model or tool implementation.

## Goal
Prevent browser-driven DNS rebinding from reaching MCP application dispatch while preserving legitimate native MCP clients and approved browser-based integrations.

## Metrics
- 100% of hostile origin/host fixtures rejected before dispatch.
- 100% of approved native-client fixtures accepted according to policy.
- Zero requests with untrusted forwarded host data accepted.
- Zero wildcard host/origin rules in production policy.
- Security regression suite passes after SDK/proxy changes.

## Trigger
Run when enabling Streamable HTTP, adding a local/LAN MCP server, changing reverse-proxy routing, upgrading an MCP SDK, or changing authentication/browser integration.

## Inputs
Listener address, effective Host, Origin, proxy headers, trusted proxy configuration, SDK/version, and intended client classes.

## Outputs
Policy decision, rejection reason, deployment readiness status, and verification evidence.

## Relevant sources
- Ruby SDK advisory GHSA-rjr6-rcgv-9m7m: https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-rjr6-rcgv-9m7m
- Rust SDK advisory GHSA-89vp-x53w-74fx: https://github.com/modelcontextprotocol/rust-sdk/security/advisories/GHSA-89vp-x53w-74fx
- Java SDK advisory GHSA-8jxr-pr72-r468: https://github.com/advisories/GHSA-8jxr-pr72-r468
- CVE-2026-35568: https://www.cve.org/CVERecord?id=CVE-2026-35568
- MCP specification: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
