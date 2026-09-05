# Research

## Topic
MCP Tool Outcome Contract Verifier

## Category
Thinking

## Problem
Agents can form unsupported conclusions because tool failures are sometimes represented as successful/completed events across MCP middleware and client-adapter layers.

## Why it matters now
Two independent 2026 bug reports show opposite sides of the same contract break: a server emitting `isError:false` for permission denials, and a client mapping `isError:true` to a completed state. A third adapter documents an explicit compatibility shim because its host runtime otherwise records MCP failures as successes.

## Affected users
AI-agent developers, MCP server/client authors, platform integrators, users relying on agents for database/repository/browser/cloud changes.

## Current public evidence
### Observed evidence
1. Apache Superset issue #43358, opened 2026-08-20, reports that failed MCP tool calls—including RBAC permission denials—were caught by middleware and returned with `isError:false`. A conforming client could therefore conclude a forbidden write succeeded. PR #43374 proposes restoring the failure flag while retaining an encodable payload.
2. OpenCode issue #16969, opened 2026-03-11, reports the inverse client-side mapping bug: MCP `CallToolResult(isError=true)` was recorded as `state.status="completed"`, causing downstream applications to display failures as successes.
3. `pi-mcp-adapter` documents an `error-signal.ts` compatibility layer because returned MCP failures otherwise remain ordinary successful host results unless the adapter explicitly overrides `isError`.
4. Superset issue #40733 describes `generate_chart` succeeding but reporting a response-validation failure, which forced users to perform a follow-up listing call to determine actual state and could produce retry storms.

### Interpretation
Tool outcome is a cross-layer data contract, not merely an error message. Both false-success and false-failure states damage planning: the former produces unsupported completion claims; the latter causes duplicate side effects/retries. Consequential actions need explicit verification when transport outcome and real-world state can diverge.

### Proposed solution
Normalize statuses at integration boundaries, detect contradictions (`isError=true` + completed, permission-denial text + success, write success without required verification), and maintain conformance fixtures that exercise denied, validation-failed, thrown, timeout/unknown, successful-read, and successful-write cases.

## Existing approaches
MCP `isError`; SDK exceptions; adapter status mapping; application error text; read-after-write verification; retries.

## Remaining limitations
Some transports require compatibility catches; errors may be returned rather than thrown; UIs can remap states; real side effects may succeed before response serialization fails; text parsing is provider-specific.

## Root-cause analysis
- Error semantics are duplicated across protocol and runtime layers.
- Catch-all middleware converts exceptions to ordinary values.
- Clients assume protocol response completion equals tool success.
- Consequential actions often lack an independent state check.
- Integration tests cover payload shape but not semantic outcome invariants.

## Improvement opportunity
A reusable outcome-contract verifier can test adapters independently of model behavior and force evidence before an agent marks consequential work complete.

## Relevant sources
- https://github.com/apache/superset/issues/43358
- https://github.com/apache/superset/pull/43374
- https://github.com/anomalyco/opencode/issues/16969
- https://app.unpkg.com/pi-mcp-adapter@2.21.2/files/error-signal.ts
- https://github.com/apache/superset/issues/40733
