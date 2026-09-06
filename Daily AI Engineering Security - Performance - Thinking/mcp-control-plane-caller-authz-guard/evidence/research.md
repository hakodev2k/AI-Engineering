# Research

## Topic
MCP Control-Plane Caller Authorization Guard

## Category
Security

## Problem
An MCP server can hold a valid backend service credential while accepting inbound MCP sessions from callers that have not been independently authenticated or authorized. When the exposed tools control deployment or other infrastructure, this collapses two trust directions: the server-to-backend identity is incorrectly treated as proof that the inbound caller is trusted.

## Why it matters now
CVE-2026-82456 and the corresponding argocd-mcp advisory were published in August 2026. The vulnerable 0.8.0 HTTP transport listened on every network interface and could accept MCP sessions without caller credentials when `ARGOCD_API_TOKEN` was configured, allowing reachable callers to invoke the tool surface with the operator's stored Argo CD token. The project fixed the issue in 0.9.0 and added explicit operator guidance distinguishing listener protection from backend credentials.

## Affected users
MCP server maintainers, platform engineers, GitOps teams, internal developer-platform teams, AI-agent platform builders, Kubernetes operators, and teams exposing privileged MCP adapters over HTTP/SSE.

## Current public evidence
### Observed evidence
1. GitHub advisory GHSA-rp45-5x3v-48mr, published 2026-08-11, documents that argocd-mcp 0.8.0 bound its HTTP transport broadly and accepted sessions without an inbound credential while using the stored Argo CD token. Patched version: 0.9.0.
2. CVE-2026-82456, published 2026-08-29, records a CVSS 10.0 condition where reachable callers could invoke Argo CD operations without authenticating to the MCP listener.
3. Current argocd-mcp security guidance explicitly states that the listener token protects the listener and that distinct callers requiring different reach should use separate instances/credentials; it also notes that Origin checks are not sufficient for an exposed bind.
4. Current project documentation separates transport-level caller controls from backend token resolution and documents read-only mode as a separate capability-reduction control.

### Interpretation
The reusable engineering problem is broader than one package version. Any MCP adapter that proxies privileged backend credentials can become an authority-confusion boundary if it lacks an explicit inbound caller identity, authorization policy, network exposure constraint, and least-privilege tool surface.

## Existing approaches
- Patch to argocd-mcp 0.9.0 or later.
- Restrict the listener to loopback/private networks.
- Require a listener authentication token or upstream authenticated proxy.
- Restrict Origin/Host where applicable.
- Run separate MCP instances for callers that need different reach.
- Use read-only mode for workflows that do not need mutations.
- Scope backend tokens and Argo CD project policies to least privilege.

## Remaining limitations
- A backend API token is still easy to confuse with an inbound caller credential during custom MCP implementation.
- Shared listener secrets authenticate possession but may not provide per-caller identity or tool-level authorization.
- Network allowlists reduce exposure but do not establish application-layer identity.
- Read-only mode reduces impact but does not solve unauthorized data access.
- Static deployment review does not prove the effective runtime bind address, proxy path, or enabled mutating tools.
- Teams frequently review MCP tool permissions separately from the backend credential that actually executes them.

## Root-cause analysis
1. Inbound and outbound trust directions are modeled as one credential boundary.
2. Listener exposure is treated as an operational detail instead of an authorization decision.
3. Mutating tool registration is enabled independently of caller identity strength.
4. Backend tokens are broader than the minimum tool surface.
5. Security review lacks a deterministic preflight that evaluates bind address, inbound auth, backend credential presence, and mutating capabilities together.

## Improvement opportunity
Create a reusable fail-closed preflight and review workflow that treats caller authentication, network exposure, backend credentials, and tool mutability as one authorization envelope. The deterministic checker blocks risky combinations such as wildcard/public binds plus no inbound authentication plus privileged backend credentials, and it requires explicit per-caller authorization for mutating tools.

## Relevant sources
- GitHub advisory GHSA-rp45-5x3v-48mr, 2026-08-11: https://github.com/argoproj-labs/mcp-for-argocd/security/advisories/GHSA-rp45-5x3v-48mr
- GitHub Advisory Database / CVE-2026-82456, 2026-08-29: https://github.com/advisories/GHSA-p2x5-x87w-v2xj
- argocd-mcp security policy and operator notes: https://github.com/argoproj-labs/mcp-for-argocd/security
- argocd-mcp project documentation: https://github.com/argoproj-labs/mcp-for-argocd

## Status language
- **Implemented**: package artifacts and deterministic checker exist.
- **Measured**: a deployment has been evaluated and results captured.
- **Verified**: risky authority-confusion paths are blocked and an independent reviewer has confirmed the effective deployment boundary.
