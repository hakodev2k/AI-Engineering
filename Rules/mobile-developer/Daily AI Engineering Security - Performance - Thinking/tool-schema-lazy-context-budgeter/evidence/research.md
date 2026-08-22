# Research — Tool Schema Lazy Context Budgeter

## Topic
Tool Schema Lazy Context Budgeter

## Category
Token

## Problem
Tool-heavy agents often inject every enabled tool's full JSON Schema into every model request. Large MCP and built-in tool catalogs can consume tens of thousands of tokens before user/task context, increasing cost and latency while shrinking effective reasoning space.

## Why it matters now
A May 28, 2026 MCP issue measured individual production tool definitions at roughly 100–1,000 tokens and estimated 10,000-token schema footprints for 20 tools. A July 19, 2026 Hermes Agent issue reported 54 tools consuming about 27,000 schema tokens and 83.1% of a request token budget. Another July 26 Hermes report observed about 14.4K tokens/request from core tool definitions even after disabling nine toolsets. MCP's tool model requires full JSON Schema for each listed tool, and newer JSON Schema 2020-12 support can make expressive schemas larger. The protocol does not require clients to inject all tool definitions into every LLM call.

## Affected users
Agent-framework maintainers, MCP client authors, AI coding-agent users, gateway operators, and teams paying for tool-heavy multi-turn workflows.

## Current public evidence
1. MCP issue #2808, opened May 28, 2026 — measured 11 production MCP tool schemas from ~103 to ~1,024 tokens/tool and documented first-turn/context-window overhead. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808
2. MCP discussion #2812 — follow-up corpus-scale measurements reported tiered schema discovery saving 87% on average before charging invoked-tool definitions, with caveats for small toolsets. https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812
3. Hermes Agent issue #67273, July 19, 2026 — reported tool schemas at 83.1% of request tokens with 54 tools (~27K schema tokens/request), and noted filtering infrastructure not exposed across common interactive/gateway paths. https://github.com/NousResearch/hermes-agent/issues/67273
4. Hermes Agent issue #71894, July 26, 2026 — reported ~14.4K tokens/request from core tool definitions on an already-trimmed setup. https://github.com/NousResearch/hermes-agent/issues/71894
5. MCP specification — `tools/list` returns full tool definitions including descriptions and JSON Schema; implementations decide how to present/expose tools to the model. https://modelcontextprotocol.io/specification/2025-11-25/server/tools

## Existing approaches
- Disable unused toolsets manually.
- Rely on prompt caching.
- Shorten descriptions/schema fields.
- Load all tools for maximum recall.
- Use tool include/exclude configuration.
- Proposed lazy/tiered tool discovery: first expose compact descriptors, then expand selected tools.

## Remaining limitations
Manual filtering requires users to know future tool needs; prompt caching reduces billing in some providers but not context-window occupancy; description trimming has limited gains on complex schemas; all-tools mode preserves recall but wastes tokens; naive lazy loading can hurt tool recall, add an extra model round trip, or load the wrong schema if selection metadata is too weak.

## Root-cause analysis
- Tool registry design is often coupled directly to model request construction.
- No explicit per-request tool-schema token budget exists.
- Relevance is evaluated after full schemas have already been injected.
- Clients lack measured thresholds for when tiering helps versus harms small toolsets.
- Cache hit rate and schema-token attribution are not treated as first-class metrics.
- Tool changes can invalidate cached prefixes, causing repeated cold costs.

## Improvement opportunity
Create a token-budget controller that measures serialized schema cost, keeps a compact discovery catalog, selects a bounded relevant subset per task, expands full schemas only for selected tools, and falls back safely when confidence is low. Preserve correctness with forced inclusion for safety-critical/core tools and verify retrieval precision/recall against recorded tasks.

## Goal
Reduce tool-definition token footprint and latency without meaningful task-quality or tool-selection regressions.

## Metrics
- Tool-schema tokens/request and percentage of total input.
- Total input tokens/task and cost/task.
- First-token/request latency and total task latency.
- Selected-tool recall against tools actually needed.
- Wrong-tool/extra-round-trip rate.
- Task success/regression rate.
- Prompt-cache hit rate when applicable.

## Trigger
At session setup and before each model request when enabled tools exceed configured token/count thresholds or the registry changes.

## Inputs
Tool definitions, task text/goal, configured core tools, token estimator, token budget, recent tool usage, and optional relevance hints.

## Outputs
Compact catalog, selected full-schema subset, token measurements, inclusion reasons, fallback decision, and before/after benchmark report.

## Observed evidence
Independent MCP and Hermes reports show substantial schema-token overhead in real tool-heavy configurations.

## Interpretation
The evidence supports dynamic/tiered loading for sufficiently large toolsets, but also indicates a caveat: tiering can be counterproductive for small catalogs. Therefore the package measures before enabling optimization and preserves a fallback path.

## Proposed solution
A measured lazy-schema controller with deterministic token accounting, threshold-based activation, core-tool pinning, task-keyword/recent-use selection, bounded expansion, and regression benchmarking. It does not remove context required for correctness solely to save tokens.