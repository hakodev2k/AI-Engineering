# Research Evidence

## Topic
Shared Agent Artifact Authorization Parity Guard

## Category
Security

## Problem
Agent platforms can mark shared/template agents or scoped resources as read-only through one API/UI path while alternate mutation paths enforce weaker authorization. Because agent bundles can contain executable MCP configuration, a single missing guard can turn ordinary session edit permission into cross-session mutation or runner code execution.

## Why it matters now
GitHub Advisory GHSA-jrrm-9hc7-2v3h / CVE-2026-62674 was updated 2026-09-02. It documents Omnigent allowing an authenticated user to overwrite a shared/template agent through a full bundle upload endpoint even though the dedicated MCP edit endpoint correctly rejected shared agents. The poisoned bundle could add a `stdio` MCP server and execute attacker-controlled commands in future runner sessions. Independent 2026 advisories show the same structural class: Grackle applied scoped-agent authorization inconsistently across mutating MCP tools while its backend used a full server API key, and n8n's AI Agents MCP connector bypassed credential domain restrictions on an alternate execution path.

## Affected users
Teams hosting multi-user agent platforms, developers building shared agent/template catalogs, MCP platform builders, and operators granting users scoped/session-level edit access.

## Current public evidence

### Observed evidence
1. Omnigent GHSA-jrrm-9hc7-2v3h / CVE-2026-62674: `PUT /sessions/{session_id}/agent` checked session edit permission but did not enforce the shared-agent read-only guard used by the dedicated MCP edit endpoint. Updating the shared agent bundle could introduce a `stdio` MCP command and lead to authenticated runner RCE. Patched in 0.3.0; advisory updated 2026-09-02.
2. Grackle GHSA-f9ff-5x35-7gfw: scoped-agent authorization was enforced inline and inconsistently across mutating MCP tools; backend gRPC calls used the full server API key and did not enforce caller-based authorization, allowing cross-task/session mutations.
3. n8n GHSA-h44j-f5r5-ph73 / CVE-2026-59207: an AI Agents MCP execution path failed to enforce credential Allowed HTTP Request Domains, so a member with use-only access could send a shared secret to an attacker-controlled domain. Fixed in 2.28.1 and 2.27.4.

### Interpretation
These incidents share a policy-parity failure: a security property exists, but not at every path capable of causing the protected effect. UI/read-only metadata, one guarded endpoint, or an upstream scoped identity is insufficient when another route or downstream service executes with broader authority.

### Proposed solution
Inventory all mutation paths for protected/shared agent artifacts and require identical resource-level authorization invariants at the enforcement boundary. Add deterministic configuration validation for route parity and tests proving that alternate paths cannot mutate protected resources.

## Existing approaches
- UI flags such as read-only or non-editable.
- Per-endpoint guards.
- Session-level edit permissions.
- Scoped agent identities at the MCP/tool layer.
- Backend service credentials and shared runner identities.
- Vendor patches for known vulnerable paths.

## Remaining limitations
- UI flags do not enforce server-side authorization.
- Copy-pasted endpoint guards drift as new mutation routes are added.
- Session edit permission may be broader than protected artifact ownership.
- Downstream use of a full service credential can erase caller scope.
- Tests often cover the intended edit endpoint but omit bundle import, clone, restore, upload, migration, or tool-mediated mutations.

## Root-cause analysis
1. Authorization is attached to routes/tools instead of the protected resource/effect.
2. Multiple code paths mutate the same artifact but do not share one policy function.
3. Session ownership and shared artifact ownership are conflated.
4. Downstream services authenticate the platform rather than the initiating scoped caller.
5. Security tests lack a mutation-path matrix.

## Improvement opportunity
Define protected artifact classes and mandatory controls once, then validate every write path against them: authenticated caller, resource ownership/scope check, shared/template immutability guard, downstream identity attenuation or independent backend authorization, audit event, and human approval for intentionally modifying shared executable templates.

## Goal
Prevent alternate-path mutation of shared/template agent artifacts and preserve caller scope through downstream execution.

## Metrics
- Protected mutation paths inventoried / total mutation paths.
- Authorization-parity violations.
- Shared-template unauthorized mutation tests blocked / attempted.
- Downstream calls preserving scoped identity or re-authorizing / total protected calls.
- Audit coverage for denied and approved shared mutations.

## Trigger
Use when adding agent import/upload/clone/restore APIs, MCP configuration editing, shared templates, scoped subagents, backend service credentials, or any new mutation path touching reusable agent artifacts.

## Inputs
Route/tool inventory JSON describing protected resource, mutation effect, caller scope checks, immutability guard, downstream authorization and audit behavior.

## Outputs
Parity report, blocking violations, remediation targets, security-test evidence and independent verifier verdict.

## Relevant sources
- Omnigent GHSA-jrrm-9hc7-2v3h / CVE-2026-62674, updated 2026-09-02: https://github.com/advisories/GHSA-jrrm-9hc7-2v3h
- Grackle GHSA-f9ff-5x35-7gfw: https://github.com/advisories/GHSA-f9ff-5x35-7gfw
- n8n GHSA-h44j-f5r5-ph73 / CVE-2026-59207: https://github.com/advisories/GHSA-h44j-f5r5-ph73
