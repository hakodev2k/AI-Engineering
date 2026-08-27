# Research — MCP Reconnect/Auth Storm Circuit Breaker

**Topic:** Bound repeated MCP reconnect/initialize/OAuth/tool-list work that inflates latency, token usage, and rate-limit failures.

**Category:** Performance

**Research date:** 2026-08-28 (UTC+7)

## Problem
Agent clients can repeatedly reconnect the same MCP endpoint, redo OAuth/initialize/tool-list work, and reinject tool definitions into model context. A single logical session can therefore create dozens of redundant connection cycles, high latency, 429/timeouts, and token waste without delivering useful work.

## Why it matters now
The July 2026 MCP spec introduced a stateless protocol core and cacheable list results specifically to improve reliability/scalability and keep upstream prompt caches stable across reconnects, yet current client reports still show repeated connection churn and very slow startup with multiple MCP servers.

## Affected users
Developers using coding agents with remote MCP servers, teams operating authenticated MCP integrations, agent-platform builders, and users paying for repeated context/tool-schema tokens.

## Current public evidence
### Observed evidence
1. `github/copilot-cli` issue #3706 (2026-06-06) reports one Azure DevOps MCP server logging 79 connection events in one CLI session, repeated OAuth churn, HTTP 429 responses, and `-32001 Request timed out` despite a healthy endpoint: https://github.com/github/copilot-cli/issues/3706
2. `anthropics/claude-code` issue #43895 (2026-04-05 evidence; issue crawled 2026) reports repeated GitHub MCP disconnect/reconnect cycles, reinjection of 40+ tool definitions (~2,000+ tokens per cycle), sluggish sessions, and timeouts with billed input but no output: https://github.com/anthropics/claude-code/issues/43895
3. `anthropics/claude-code` issue #84692 (2026-08-07) reports first-response latency from 45 seconds to 8+ minutes in a large project with multiple MCP servers/skills, while subsequent responses are 5–15 seconds: https://github.com/anthropics/claude-code/issues/84692
4. MCP 2026-07-28 release notes say the stateless core removes mandatory handshake/session state and list responses now carry `ttlMs`/`cacheScope` so clients can cache tool catalogs and keep prompt caches stable across reconnects: https://blog.modelcontextprotocol.io/posts/2026-07-28/

### Interpretation
The recurring weakness is missing client-side connection-work budgeting and deduplication. Stateless transport removes server-side session requirements but does not automatically prevent a client/orchestrator from repeatedly starting equivalent work. Cache hints help only if clients preserve endpoint identity, auth state, and tool-catalog reuse across retry paths.

## Existing approaches
Transport retries/backoff, OAuth token caches, tool-list caching, lazy server loading, connection pooling, MCP stateless requests, and generic rate-limit handling.

## Remaining limitations
- Retry loops may exist at several layers and multiply each other.
- Backoff alone still permits redundant successful reconnects.
- OAuth and `tools/list` work may not share a stable endpoint/session key.
- Reconnects can repeatedly invalidate or reinject large tool schemas.
- Users often lack metrics separating useful tool calls from connection-maintenance work.

## Root-cause analysis
1. No single-flight lock for equivalent connect/auth/discovery work.
2. Retry budgets are local to components rather than global to a logical session.
3. Endpoint identity/auth subject/tool-catalog identity are not normalized into a stable key.
4. Reconnect and discovery telemetry is not tied to model-token/latency cost.
5. Circuit breakers usually react to failures, not redundant successful churn.

## Improvement opportunity
Add a deterministic per-session reconnect budget and single-flight state keyed by normalized endpoint + auth subject + tool-catalog identity. Reuse fresh discovery results, enforce cooldown/backoff, block duplicate concurrent initialization, and emit metrics for connection attempts, OAuth starts, tool-list refreshes, schema reinjection tokens, 429s, and timeouts.

## Relevant sources
- https://github.com/github/copilot-cli/issues/3706
- https://github.com/anthropics/claude-code/issues/43895
- https://github.com/anthropics/claude-code/issues/84692
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
