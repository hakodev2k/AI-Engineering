# Research — MCP Tool Schema Budget Gate

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Token

## Problem
MCP clients can spend a large fraction of the context window on tool definitions before useful task context is loaded. Deferred tool discovery reduces this, but current implementations still show regressions, tool-list overhead, and discovery failures. Teams need a deterministic budget gate around tool schemas instead of relying on client heuristics alone.

## Current public signals
1. MCP issue #2808 (2026-05-28) measured production MCP definitions at roughly 100–1,000 tokens per tool and reported 15–30 KB of schema context for 20–30 tools. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808
2. Claude Code issue #27208 reports ~200 deferred tools still consume context through the deferred name list, motivating hierarchical discovery. Source: https://github.com/anthropics/claude-code/issues/27208
3. Claude Code issues #18397, #19890, and #32343 document cases where automatic Tool Search did not activate or regressed, causing MCP tools to be preloaded again. Sources: https://github.com/anthropics/claude-code/issues/18397 , https://github.com/anthropics/claude-code/issues/19890 , https://github.com/anthropics/claude-code/issues/32343
4. MCP SEP-1300 states context overload from too many tools is a frequent concern and describes startup filtering/grouping as an existing workaround; the proposal was rejected, so there is no protocol-level group/tag standard from that SEP. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1300
5. The 2026-07-28 MCP revision makes list responses cacheable with `ttlMs` and `cacheScope`, helping repeated discovery traffic, but this does not itself cap model-context schema footprint. Source: https://blog.modelcontextprotocol.io/posts/2026-07-28/

## Existing approaches
- Preload every tool: simplest, but consumes context even for unused tools.
- Client-side Tool Search/deferred loading: strong when available, but issue history shows activation and registry regressions.
- Manually enable/disable MCP servers: effective but operationally fragile.
- Server-specific toolsets: reduces exposure but lacks a shared budget policy across servers.
- Prompt caching: can reduce billing/latency for repeated prefixes but does not restore context-window capacity consumed by schemas.

## Observed limitations
- No universal per-session schema-token budget is enforced by MCP.
- Deferred discovery can still leave name/index overhead.
- Client heuristics can change across versions or providers.
- Teams often measure only total context, not per-tool contribution.
- Removing descriptions blindly can harm tool selection and correctness.

## Root-cause hypotheses
1. Tool registration is capability-driven rather than task/budget-driven.
2. Full JSON Schema descriptions are treated as free metadata.
3. Tool exposure policy is not versioned or tested as an artifact.
4. Token optimization is applied after context assembly instead of before registration.
5. There is no regression gate comparing baseline footprint and selection quality.

## Improvement target
Create a provider-neutral preflight that inventories tool definitions, estimates or exactly counts tokens, ranks cost, applies explicit `hot`, `deferred`, and `disabled` policies, and fails CI when budgets regress. Never remove fields needed for correctness without an explicit policy decision.

## Success metrics
- total tool-schema tokens/session;
- token share by server and tool;
- number of hot/deferred/disabled tools;
- percent reduction versus baseline;
- tool-selection success on a fixed task suite;
- false-disable rate;
- budget violations detected before deployment.

## Observed evidence vs interpretation vs proposal
**Observed:** multiple public issues quantify context overhead and deferred-loading regressions.  
**Interpretation:** client auto-defer alone is not a sufficient engineering control for predictable context budgets.  
**Proposal:** enforce a repository-owned schema budget and regression gate before tools reach the agent runtime.