# Research Evidence

## Topic
MCP Capability Refresh Consistency Guard

## Category
Performance

## Problem
MCP clients can keep a stale tool catalog after a server changes capabilities or reconnects. The transport may be healthy while the model still sees missing or obsolete tools/schemas, forcing manual reconnects, session restarts, repeated failed calls, and expensive context reloads.

## Why it matters now
The 2026-07-28 MCP specification explicitly supports mutable tool catalogs through `listChanged`, subscriptions, `tools/list`, TTLs, and cache metadata. Current client issue reports show implementations still serving stale catalogs or failing to refresh after change/reconnect.

## Affected users
Developers of dynamic MCP servers, coding-agent users, tool-gateway operators, platform teams, and applications that project tools from databases, permissions, deployments, or feature flags.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #66869 (created 2026-06-10, updated 2026-08-15) reports that `notifications/tools/list_changed` does not make newly projected or updated tools visible during the same session; the catalog stays frozen until reconnect/restart.
2. Claude Code issue #40025 provides a detailed reproduction where an MCP server grows from 5 to 15 tools but Claude Code continues showing 5 even after restart; renaming the server causes all 15 to appear, suggesting stale cache identity/invalidation behavior.
3. The MCP 2026-07-28 Tools specification states that tool sets may change over time, defines `listChanged`, describes `notifications/tools/list_changed` followed by `tools/list`, and includes cache TTL/scope semantics.

### Interpretation
The practical failure is a cache-coherency problem across four states: transport connection, server capability generation, client tool cache, and model-visible tool index. A reconnect alone is not sufficient evidence that the model-visible catalog is current.

## Existing approaches
- Manual `/mcp` reconnect or complete client restart.
- Renaming an MCP server to defeat stale cache keys.
- Static meta-tools that proxy dynamic operations.
- Time-based cache expiry.
- Server-emitted `notifications/tools/list_changed`.

## Remaining limitations
- Manual restart reloads context and interrupts work.
- TTL-only refresh can remain stale for the whole TTL and does not prove the model index updated.
- Reconnect can restore transport without refreshing model-visible schemas.
- Name-keyed caches can survive binary/tool changes incorrectly.
- A dynamic meta-tool sacrifices native discovery, schemas, approval UX, and tool-specific policy.

## Root-cause analysis
1. Capability identity is often inferred from server name or connection lifetime instead of a content/generation fingerprint.
2. Change notifications may not be subscribed to or may not trigger an end-to-end refresh.
3. Transport health and capability freshness are treated as one state.
4. Refresh is not verified against the actual model-visible catalog.
5. Cache invalidation lacks bounded retry and fallback semantics.

## Improvement opportunity
Add a reusable capability refresh gate that fingerprints normalized tool definitions, tracks server generation, invalidates on notification/reconnect/TTL/auth-scope change, performs `tools/list`, compares expected vs observed fingerprints, and blocks completion or tool dispatch when the client/model catalog is stale.

## Goal
Keep model-visible MCP capabilities consistent with the authoritative server catalog without unnecessary full-session restarts.

## Metrics
Refresh latency, stale-call count, reconnect-to-usable latency, full-session restart count, catalog mismatch count, tool-list cache hit rate, and tokens/time spent on recovery.

## Trigger
`list_changed`, transport reconnect, server deployment/version change, auth-scope change, TTL expiry, tool-not-found/schema mismatch, or operator verification.

## Inputs
Previous catalog snapshot, current `tools/list` response, server identity, transport/session identity, authorization scope fingerprint, timestamps, and configured thresholds.

## Outputs
Normalized catalog fingerprint, per-tool fingerprints, mismatch report, refresh decision, metrics, and PASS/BLOCK status.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/66869
- https://github.com/anthropics/claude-code/issues/40025
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
