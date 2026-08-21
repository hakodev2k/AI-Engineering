# Research: MCP Authorization Boundary Guard

## Topic
MCP authorization boundary failures across OAuth audience validation, resource ownership, session binding, and tool-level permissions.

## Category
Security

## Problem
Recent MCP implementations have repeatedly authenticated a caller without correctly authorizing that caller for the specific MCP resource, session, workflow, or tool. This can permit cross-user execution, token audience confusion, session hijacking, or privileged tool execution.

## Why it matters now
MCP adoption is expanding while authorization behavior is still evolving. The July 28, 2026 MCP specification update explicitly hardened authorization, and multiple 2026 advisories show independent failures in production implementations.

## Affected users
MCP server authors, AI platform teams, agent users, SaaS integrators, security reviewers, and teams exposing privileged tools over Streamable HTTP/SSE.

## Current public evidence
### Observed evidence
1. CVE-2026-14541 / GHSA-656w-qf75-c5gf: Google mcp-toolbox 1.4.0 could accept Google OAuth tokens minted for unrelated applications when audience/clientId was not explicitly configured.
   Source: https://github.com/advisories/GHSA-656w-qf75-c5gf
2. CVE-2026-65594 / GHSA-q5xf-xhwf-cwqf: n8n's MCP OAuth flow failed to verify access to the workflow resource, allowing member users to obtain a token for another user's MCP workflow.
   Source: https://github.com/advisories/GHSA-q5xf-xhwf-cwqf
3. CVE-2026-52869 / GHSA-jpw9-pfvf-9f58: MCP Python SDK HTTP transports routed session requests by session identifier without verifying that the authenticated principal matched the principal that created the session.
   Source: https://github.com/advisories/GHSA-jpw9-pfvf-9f58
4. CVE-2026-16496 / GHSA-4crw-p722-vr7h: Terraform MCP Server stateful HTTP mode could execute tool calls using another user's Terraform credentials when a session ID was obtained.
   Source: https://github.com/advisories/GHSA-4crw-p722-vr7h
5. MCP authorization guidance requires clients to use Resource Indicators and servers to validate that presented tokens were issued specifically for that server. The July 28, 2026 specification revision further tightened authorization behavior.
   Sources: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization and https://blog.modelcontextprotocol.io/posts/2026-07-28/

## Interpretation
The recurring failure pattern is not simply missing login. Authentication succeeds, but authorization context is not consistently propagated and checked at every boundary. Session IDs, workflow IDs, tool names, and backend credentials become implicit capabilities when ownership or audience checks fail open.

## Existing approaches
- OAuth 2.1 bearer-token validation.
- RFC 8707 Resource Indicators and audience validation.
- Per-server or per-tool authorization.
- Random session identifiers.
- Ad hoc permission checks in tool handlers.
- Human approval before sensitive tool use.

## Remaining limitations
- Authentication middleware may validate signature and issuer but omit audience/resource binding.
- Tool handlers often duplicate authorization logic and drift over time.
- Stateful transports may bind requests to session IDs but not principal identity.
- Backends may trust a privileged server credential, making the MCP layer the only effective authorization boundary.
- Missing claims or policy configuration may accidentally fail open.
- Tests often cover allowed calls but omit cross-principal and cross-resource negative cases.

## Root-cause analysis
1. Authentication and authorization are conflated.
2. Security context is not propagated from transport to session to tool execution.
3. Missing claims, grants, or policies are treated as permissive defaults.
4. Server-wide service credentials mask caller identity from downstream systems.
5. Ownership checks are implemented inconsistently per endpoint/tool.
6. Adversarial authorization-matrix tests are absent.

## Improvement opportunity
Use a reusable authorization matrix over principal, audience/resource, session owner, tool, action, and approval requirement. Validate it before tool execution, fail closed on missing data, and run deterministic negative tests that deliberately attempt cross-user/session/resource access.

## Goal
Make authorization failures observable and testable before deployment without relying on the LLM to make security decisions.

## Metrics
- 100% sensitive tools mapped to explicit policy entries.
- 0 successful cross-principal/session/resource negative tests.
- 0 accepted tokens with invalid or missing required audience.
- 0 fail-open decisions caused by absent grants/claims.
- 100% high-risk tool calls require configured approval.

## Trigger
New or changed MCP server, transport, OAuth configuration, sensitive tool, session model, or security incident.

## Inputs
Policy JSON, tool inventory, expected audiences/resources, test identities, session ownership fixtures, approval policy.

## Outputs
Authorization findings, deterministic policy-check results, negative-test report, and blocking exit code on violations.

## Relevant sources
- https://github.com/advisories/GHSA-656w-qf75-c5gf
- https://github.com/advisories/GHSA-q5xf-xhwf-cwqf
- https://github.com/advisories/GHSA-jpw9-pfvf-9f58
- https://github.com/advisories/GHSA-4crw-p722-vr7h
- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
