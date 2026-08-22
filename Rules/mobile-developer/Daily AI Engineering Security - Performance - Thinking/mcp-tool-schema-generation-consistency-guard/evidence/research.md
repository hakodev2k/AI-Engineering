# Research — MCP Tool Schema Generation Consistency Guard

## Problem
MCP clients may validate an in-flight `tools/call` response against a different tool-schema generation than the one active when the request was dispatched. A failed metadata refresh can also partially clear previously valid validators, allowing subsequent results to bypass expected validation.

## Category
Security (trust-boundary and validation integrity), with secondary correctness/reliability impact.

## Why it matters now
The MCP 2026-07-28 specification allows tool catalogs to change and explicitly recommends that clients validate structured results against `outputSchema`. Dynamic refresh therefore creates a concurrency boundary: a tool call, its input decision, task metadata, and its output validator must belong to one coherent metadata generation.

## Current public signals
1. **TypeScript SDK issue #2612**, opened 2026-08-04 and still open/updated 2026-08-18, reproduces a race where `callTool()` waits for a response and then looks up the validator from mutable cache. A concurrent `listTools()` can replace the cache, causing an old-generation response to be checked against a new-generation schema. The issue is labeled bug/P2/ready-for-work and reproduced on SDK 1.30.0.
2. **TypeScript SDK issue #2614**, opened 2026-08-04 and still open/updated 2026-08-18, shows that `listTools()` clears metadata caches before all replacement schemas compile. If a later schema compilation fails, the previous valid generation may be erased or partially replaced; later `callTool()` operations can skip validation and lose task-support metadata. The issue proposes failure-atomic replacement.
3. **MCP specification 2026-07-28** states that tool sets may change, supports `notifications/tools/list_changed`, and says clients SHOULD validate structured tool results against `outputSchema`. The same revision adds caching/freshness semantics around list results, increasing the importance of coherent cache generations.

## Observed evidence vs interpretation
### Observed
- Mutable validator metadata can change while a tool request is in flight.
- Failed catalog compilation can leave validator/task metadata incomplete.
- MCP explicitly permits dynamic tool-list changes and expects output validation when schemas are present.

### Interpretation
These failures are two manifestations of one consistency defect: metadata is treated as mutable per-tool cache entries instead of an immutable, versioned snapshot whose lifetime spans dispatch through response validation.

### Proposed engineering solution
Introduce a generation-pinned metadata layer:
- compile a complete candidate catalog off to the side;
- atomically publish it as an immutable generation only after successful compilation;
- capture the generation and validator at dispatch;
- validate the response with that captured generation;
- retain old generations while calls referencing them are in flight;
- record generation IDs in audit telemetry;
- fail closed if a response that requires validation has no trustworthy pinned validator.

## Existing approaches
- Mutable client-side maps keyed by tool name.
- Refresh-on-notification or refresh-on-TTL.
- Output validation after the request completes.
- Re-fetching tools after `list_changed`.

## Observed limitations
- Tool name alone does not identify schema version.
- In-place clear/repopulate is not failure atomic.
- Looking up validators after `await` creates TOCTOU behavior.
- Refresh retry alone does not restore a destroyed previous cache generation.
- Global locking of all tool calls during refresh would preserve correctness but can unnecessarily serialize unrelated execution and increase latency.

## Root-cause hypotheses
1. Cache identity is `(tool_name)` instead of `(catalog_generation, tool_name)`.
2. Publication is mutation-based rather than snapshot-based.
3. Request lifecycle does not carry schema-generation provenance.
4. Validation and task-routing metadata are read at different points in time.
5. No invariant test asserts that refresh failure preserves the previous complete generation.

## Improvement target
- 0 responses validated against a generation different from dispatch generation.
- 0 validation bypasses after failed refresh.
- 100% failed refreshes leave the previous generation intact.
- In-flight calls complete using their pinned validator while new calls use the newly published generation.
- Refresh publication adds only O(1) critical-section work; schema compilation happens outside the publish lock.

## Sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2612
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2614
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2549-TTL-for-list-results.md

Research date: 2026-08-20 (UTC+7).
