# Research — MCP Tool Schema Generation Pin

## Topic
MCP Tool Schema Generation Pin

## Category
Thinking / Security

## Problem
An MCP client can start a `tools/call` using one tool schema generation, receive a `tools/list_changed` refresh while the call is in flight, and then validate the old call's result against the newer schema. Cache refresh can also corrupt or partially replace validator state when schema compilation fails.

## Why it matters now
Dynamic tool discovery is a core MCP feature and current SDK issue reports show concrete race and cache-integrity failures around refreshed tool metadata.

## Affected users
MCP client/SDK maintainers, agent hosts using dynamic MCP tools, platform teams relying on output schemas for correctness or security decisions.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/typescript-sdk` issue #2612, opened 2026-08-04, reports `Client.callTool()` retrieving the cached output validator after awaiting the response; a concurrent `listTools()` can replace the validator cache so the completed call is checked against a newer schema: https://github.com/modelcontextprotocol/typescript-sdk/issues/2612
2. The same SDK issue list includes #2614, opened 2026-08-04, reporting `Client.listTools()` corrupting cached tool metadata when an output schema fails to compile: https://github.com/modelcontextprotocol/typescript-sdk/issues/2614
3. MCP Python SDK issue #2107 documents clients dropping `notifications/tools/list_changed`, which prevents consumers from reliably invalidating or rebuilding derived tool state: https://github.com/modelcontextprotocol/python-sdk/issues/2107
4. MCP 2026-07-28 tool specification explicitly supports tool-list caching and changed notifications, making generation changes an expected protocol behavior rather than an exceptional case: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

### Interpretation
A tool call needs a snapshot-consistent contract. Validation should use the same schema generation that authorized and initiated the call, while new calls use the refreshed generation. Cache updates must be atomic: failed compilation must not replace the last known-good generation.

## Existing approaches
- Global mutable validator caches keyed only by tool name.
- Refresh-on-`list_changed` behavior.
- Re-listing tools before a call.
- SDK-specific output validation.

## Remaining limitations
- Name-only cache keys cannot distinguish generations.
- In-flight calls can observe refreshed state after awaiting network I/O.
- Failed schema compilation can leave partially updated derived state.
- Some clients historically ignored change notifications.

## Root-cause analysis
1. Tool schema is treated as mutable global state instead of immutable generation data.
2. Call records do not capture schema hash/generation at dispatch.
3. Cache refresh is not transactional.
4. Validator lookup happens after async suspension instead of being pinned before dispatch.
5. Notification handling and cache invalidation are not consistently coupled.

## Improvement opportunity
Create immutable per-generation tool metadata snapshots. Before dispatch, bind every call to tool name + server instance + schema hash/generation and retain the compiled validator reference. Refresh into a staging generation; publish it atomically only after all schemas compile. In-flight calls finish against their pinned generation.

## Relevant sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2612
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2614
- https://github.com/modelcontextprotocol/python-sdk/issues/2107
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Goal and metrics
- 0 in-flight calls validated against a different schema hash than dispatch.
- 0 partial cache publication after compilation failure.
- 100% handled tool-list change events trigger staged generation rebuild.
- Refresh failure leaves the last known-good generation callable for new calls only when policy permits stale-but-valid use.

## Trigger / Inputs / Outputs
- Trigger: initial `tools/list`, `tools/list_changed`, reconnect, or tool metadata refresh.
- Inputs: server instance id, tool list, schemas, call id, schema hash/generation.
- Outputs: immutable generation snapshot, pinned call contract, atomic publish/rollback decision, verification metrics.
