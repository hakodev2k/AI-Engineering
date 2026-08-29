# Research — MCP App Tool Origin Provenance Gate

## Topic
Per-call provenance for MCP tool invocations when both an embedded app and the model can invoke the same tool.

## Category
Security

## Problem
A dual-visible MCP App tool can be invoked by the model or by an embedded app, yet the receiving server may lack a standardized trustworthy signal identifying the initiating principal. Policies that need different treatment for app-originated and model-originated calls can therefore be forced to infer provenance from untrusted or ambiguous evidence.

## Why it matters now
The MCP Apps extension is formalizing richer interactive applications where Views can call MCP tools directly. On 2026-08-04, the official `modelcontextprotocol/ext-apps` repository received issue #738 requesting host-attested invocation provenance specifically because servers cannot reliably distinguish app-initiated from model/agent-initiated `tools/call` requests for dual-visible tools.

## Affected users
- MCP host/client implementers;
- MCP App developers;
- MCP server authors with mutating or sensitive tools;
- security/platform teams applying per-origin authorization or approval;
- operators investigating unexpected tool actions.

## Current public evidence
### Observed evidence
1. Official MCP Apps issue #738, opened 2026-08-04, states that dual-visible tools can be invoked by either model or embedded app but the server lacks a reliable standardized way to tell which initiated the call. The proposal asks for host-attested provenance and explicitly notes that provenance is not authorization.
   - https://github.com/modelcontextprotocol/ext-apps/issues/738
2. MCP Apps specification documentation defines tool visibility to `model`, `app`, or both, with the default allowing both surfaces. It states that Views call server tools through the Host and that Hosts must reject app calls to tools not visible to apps.
   - https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html
3. MCP Apps security guidance recommends clear attribution/audit trails for app-provided tool calls and treats the Host as the security boundary for View capabilities.
   - https://modelcontextprotocol.io/extensions/apps/security
4. Core MCP tool security guidance requires access controls, input validation, rate limiting, and output sanitization, which remain necessary regardless of invocation provenance.
   - https://modelcontextprotocol.io/specification/2025-06-18/server/tools

### Interpretation
Visibility answers whether an initiating surface may call a tool; it does not by itself prove which surface initiated a particular call. Tool identity similarly identifies the capability/server, not the initiating principal. Therefore per-call provenance needs to be attached at a trusted Host boundary and kept separate from untrusted tool arguments.

## Existing approaches
- Host-side app visibility enforcement.
- Separate app-only and model-only tool names.
- Custom headers/request context between Host and server.
- Server authentication and resource-level authorization.
- Human approval for consequential calls.

## Remaining limitations
- splitting tools duplicates schemas/implementations and can drift;
- custom metadata is non-portable and may be stripped by gateways;
- caller-supplied origin fields are forgeable;
- normal authentication often identifies the host/user/session, not whether model or app initiated the call;
- audit logs without origin provenance cannot reconstruct causality reliably.

## Root-cause analysis
1. **Shared capability surface:** one tool can be intentionally exposed to model and app.
2. **Missing per-call initiator principal:** core `tools/call` semantics focus on tool name/arguments, not initiator provenance.
3. **Trust confusion:** an origin marker inside tool arguments has the same trust level as other caller-controlled input.
4. **Authorization/provenance conflation:** systems may assume authenticated host identity proves model/app origin.
5. **Gateway context loss:** ad-hoc transport metadata can disappear across adapters.

## Improvement opportunity
Define a host-controlled provenance record outside tool arguments and enforce it before dispatch to origin-sensitive tools. Treat missing provenance as `unknown`; fail closed when the tool policy requires a known origin. Keep provenance additive to normal authz and approval.

## Goal
Make app-vs-model initiation observable and enforceable without changing tool arguments or weakening existing security controls.

## Metrics
Trusted-provenance coverage, unknown-origin block rate, visibility mismatch count, forged marker detections, approval-origin mismatches, and security test coverage.

## Trigger
Every `tools/call` or equivalent dispatch for a tool whose allowed behavior depends on initiating surface.

## Inputs
Tool visibility, optional stricter allowed origins, host-attested origin, sensitivity flag, and normal authorization result/context.

## Outputs
Allow/block decision, sanitized reason codes, trusted-origin audit field, and evidence for downstream authorization/incident logs.

## Relevant sources
- https://github.com/modelcontextprotocol/ext-apps/issues/738
- https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html
- https://modelcontextprotocol.io/extensions/apps/security
- https://modelcontextprotocol.io/specification/2025-06-18/server/tools
