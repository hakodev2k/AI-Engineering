# Research — MCP Schema Generation Consistency Guard

## Topic
MCP tool-schema refresh races and partial validator-cache replacement.

## Category
Security

## Problem
Long-running MCP clients may refresh `tools/list` while tool calls are in flight. If schema metadata is replaced non-atomically, an old call can be validated against a newer schema, or a failed refresh can erase previously valid validators. That can produce false failures or, more seriously, skip output validation after cache corruption.

## Why it matters now
The MCP 2026-07-28 release made list results cacheable and expanded schema-driven behavior. In August 2026, two open TypeScript SDK issues documented separate generation-consistency failures around `listTools()` and `callTool()` in SDK 1.30.0.

## Affected users
- MCP client/platform developers with dynamic tool catalogs.
- Agent hosts that refresh tool metadata in background.
- Security-sensitive systems relying on `outputSchema` as a validation boundary.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/typescript-sdk` issue #2612 (2026-08-04) demonstrates an in-flight `callTool()` being validated against a newer schema after concurrent `listTools()` refresh.
2. Issue #2614 (2026-08-04) reports `listTools()` clearing/replacing validator/task caches before all new schemas compile; a later compile failure can leave metadata partially replaced and subsequent calls may skip output validation.
3. The official 2026-07-28 MCP release makes list results cacheable, increasing the importance of coherent cache generations.
4. Current SDK server code explicitly treats tool output-schema validation as an enforcement step, showing validation is intended to be a real protocol boundary rather than optional documentation.

### Interpretation
The reusable engineering problem is cache-generation atomicity. A tool catalog and the validators derived from it must be treated as one immutable generation. Calls should pin the generation active at dispatch; refresh should build a complete candidate generation and publish it only after every schema validates.

### Proposed solution
Add a host-side generation guard with deterministic schema hashing, transactional catalog publication, generation pinning for calls, rollback on compile failure, and audit metrics for generation mismatch/refresh failure.

## Existing approaches
- Refreshing `tools/list` and overwriting client caches.
- Compiling JSON Schema validators on discovery.
- Validating `structuredContent` after tool completion.
- Cache TTL/refresh controls in newer MCP implementations.

## Remaining limitations
- A simple dictionary/map replacement does not ensure dependent metadata is published atomically.
- Reading the current validator after awaiting network I/O creates a time-of-check/time-of-use generation race.
- Failed compilation can mutate shared cache state before success is known.
- Generic retries can worsen races without proving which schema governed the original call.

## Root-cause analysis
1. Mutable shared validator cache spans asynchronous operations.
2. Catalog refresh and call lifecycle are not version-bound.
3. Publication occurs before full candidate validation.
4. Failure rollback is incomplete when old metadata has already been cleared.
5. Observability often records tool name but not schema generation/hash.

## Improvement opportunity
Represent tool metadata as immutable generations. Build/compile a candidate generation off to the side, publish with one atomic pointer swap, and attach generation/hash to every dispatched call. Results are validated only against the pinned generation.

## Metrics
- refresh success/failure count;
- partial-publication incidents (target 0);
- generation mismatch detections;
- calls with pinned schema generation (target 100% for schema-bearing tools);
- skipped-validation count (target 0 unless no output schema exists);
- refresh latency and validator compile time.

## Relevant sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2612
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2614
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/packages/server/src/server/mcp.ts

## Evidence status
**Implemented:** this package supplies a reusable generation registry/checker and workflow.

**Measured:** adopting hosts must collect refresh/call metrics.

**Verified:** only after race, rollback, and normal-path tests pass in the target integration.
