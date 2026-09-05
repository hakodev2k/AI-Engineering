# Research evidence

## Topic
MCP HTTP Auth + Bind Guard

## Category
Security

## Problem
Critical MCP capabilities can be exposed to unauthenticated network clients when a server binds broadly and authentication is optional or omitted by a caller.

## Why it matters now
CVE-2026-81735 was published on 2026-08-27 with CVSS 10.0. The disclosed UI-TARS-desktop MCP HTTP server defaulted to `::`; command and filesystem entry points did not pass authentication middleware. The fix changed the default listen address to loopback, while the package version reportedly remained unchanged, making configuration/build provenance important.

## Affected users
Developers running local or remote MCP servers; platform teams exposing agent tools; users of desktop agents; teams granting shell, filesystem, cloud, browser, or repository capabilities.

## Current public evidence
### Observed evidence
1. CVE-2026-81735 describes unauthenticated remote command execution in ByteDance UI-TARS-desktop MCP server components because the transport could listen on all interfaces and authentication middleware was optional. Published 2026-08-27. Patch references include commit `c2ad42e3eb9b27830db41a3e6f51ca7179d9b168` and PR #1918.
2. CVE-2026-35568 in the Model Context Protocol Java SDK, published 2026-04-07, showed a separate MCP transport trust-boundary failure: DNS rebinding could let a browser reach a local/private MCP server and make tool calls. The fixed version is 1.0.0.
3. Airlock's current MCP permissions gateway documents a practical control pattern: per-agent allow/ask/deny policy, human approval, audit logs, domain/command restrictions, and fail-closed mediation between agents and tools.

### Interpretation
Transport reachability, caller authentication, and tool authorization are separate controls. Fixing only one layer leaves residual risk: loopback does not authenticate local processes; authentication alone does not enforce least privilege; permission policy does not compensate for an accidentally public unauthenticated endpoint.

### Proposed solution
Use a deterministic preflight gate that evaluates all declared listeners against network exposure, authentication, dangerous capabilities, and approved exceptions before deployment, followed by negative tests and independent review.

## Existing approaches
Vendor patching; loopback binding; host/network firewalls; authentication middleware; reverse proxies; MCP permission gateways; human approval for dangerous calls; audit logging.

## Remaining limitations
Controls are frequently optional and split across transport, caller, proxy, and tool layers. A secure proxy can be bypassed if the backend also listens broadly. Version labels may not uniquely identify patched code. Purely model-level instructions cannot enforce network authentication.

## Root-cause analysis
- Insecure or ambiguous listener defaults.
- Authentication middleware is optional rather than mandatory for sensitive capabilities.
- Capability exposure is not coupled to authentication state.
- Local-development assumptions leak into production/networked deployment.
- Deployment checks inspect port health but not authorization invariants.

## Improvement opportunity
Make secure transport invariants executable and CI/deployment-blocking. Treat wildcard binds plus no auth as a hard failure; treat dangerous capabilities without auth as a hard failure; require explicit documented exception metadata for narrowly scoped local development.

## Relevant sources
- https://nvd.nist.gov/vuln/detail/CVE-2026-81735
- https://github.com/bytedance/UI-TARS-desktop/pull/1918
- https://github.com/bytedance/UI-TARS-desktop/commit/c2ad42e3eb9b27830db41a3e6f51ca7179d9b168
- https://www.ionix.io/threat-center/cve-2026-81735/
- https://advisories.gitlab.com/pkg/maven/io.modelcontextprotocol.sdk/mcp-core/CVE-2026-35568/
- https://airlock.bot/
