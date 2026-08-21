# Research — MCP Tool Schema Budget Router

## Problem
AI agents that register many MCP/function tools often inject full tool schemas into model context before the user asks for anything. Large descriptions, nested JSON Schema, and many rarely used tools consume a fixed context budget, increase cold-start input size, reduce room for task data, and make cache prefixes fragile when tool catalogs change.

## Category
Token

## Why it matters now
The problem is active in 2026 across MCP and coding-agent ecosystems. MCP issue #2808 measured roughly 100–1,024 tokens per production tool definition and estimated 15–30 KB of context for 20–30 registered tools. A Claude Code issue reported about 16.5k tokens of fixed tool definitions in every conversation. Codex has implemented deferred tool search/spec planning, but a July 2026 Codex issue reports that deferred MCP tools can become unreachable for some model/app combinations, showing that lazy exposure itself still needs reliability controls.

## Current public signals
### Signal 1 — MCP schema overhead measurement
Model Context Protocol issue #2808, opened 2026-05-28, measured 11 MCP tools with Anthropic token counting. Heavy schemas were near 1,000 tokens each, while simple tools were about 100 tokens. The report identifies nested parameter schemas and long descriptions as the dominant source of overhead and calls out first-turn cost and cache invalidation.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808

### Signal 2 — Claude Code fixed tool-definition overhead
Anthropic Claude Code issue #26158, opened 2026-02-16, reports approximately 16.5k tokens of tool definitions before the user types anything and notes that behavioral guidance embedded in tool descriptions inflates the fixed prefix. The issue was closed as not planned, so downstream users still need practical mitigation patterns.

Source: https://github.com/anthropics/claude-code/issues/26158

### Signal 3 — Deferred-tool reliability gap
OpenAI Codex issue #33608, opened 2026-07-16, reports that deferred MCP tools were not reachable with a specific Codex model/app path because `tool_search` was not provided. This demonstrates that simply hiding schemas behind deferred discovery can fail if the discovery path is not guaranteed.

Source: https://github.com/openai/codex/issues/33608

### Signal 4 — Model-visible tools are a real prompt input
OpenAI's “Unrolling the Codex agent loop” explains that `tools` are passed alongside `instructions` and `input`, and that Codex includes CLI, API, user, and MCP-provided tools in the model-visible tool list.

Source: https://openai.com/index/unrolling-the-codex-agent-loop/

### Signal 5 — MCP requires valid JSON Schema tool metadata
The MCP 2026-07-28 specification requires tool `inputSchema` to be valid JSON Schema and permits rich descriptions/metadata. This is necessary for correctness but creates a structural size cost when every schema is eagerly exposed.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Existing approaches
1. Eagerly register all tools with full schemas.
2. Shorten tool descriptions manually.
3. Rely on prompt/prefix caching to reduce billed repeated input.
4. Use allowlists such as OpenAI remote-MCP `allowed_tools` filters.
5. Use deferred tool search/lazy registration when supported.
6. Split one large MCP server into multiple smaller servers.
7. Ask the model to choose among tool groups before loading detailed schemas.

OpenAI API reference exposes `allowed_tools` filtering for remote MCP tools, which can reduce the model-visible set when callers know the required subset.

Source: https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta

## Observed limitations
- Manual description shortening is inconsistent and can remove guidance needed for correct calls.
- Prompt caching can reduce repeated billing but does not restore context-window capacity, and catalog changes can invalidate a cached prefix.
- Static allowlists require the caller to know needed tools ahead of time.
- Deferred search can fail or be unavailable depending on client/model/runtime support.
- Server splitting adds configuration/authentication/operations overhead.
- Pure model-based routing can still expose the entire catalog if routing metadata is itself too verbose.
- Naive schema minification can break `$ref`, constraints, enums, descriptions, or runtime validation expectations.

## Root-cause hypotheses
1. Tool catalogs are treated as static prompt material instead of a budgeted retrieval corpus.
2. There is no explicit per-session budget for tool definitions.
3. Selection is often all-or-nothing rather than task-relevant.
4. Schema size is not measured during CI or server startup.
5. Description text mixes contract information with long behavioral procedures.
6. Lazy loading lacks a deterministic fallback when discovery is unavailable.

## Proposed improvement
Introduce a host-side **Tool Schema Budget Router** that treats tool definitions as budgeted context:

1. Profile every tool schema deterministically.
2. Separate compact routing metadata from full callable schemas.
3. Select candidate tools by explicit keywords/tags and stable rules before model invocation.
4. Enforce a maximum estimated tool-schema token budget.
5. Load full schemas only for the selected subset.
6. Preserve a deterministic fallback set of essential tools.
7. Detect discovery/lazy-loading failure and fall back to a bounded safe set, not the full catalog.
8. Track selection recall, schema tokens, cold-start input size, call success, and fallback rate.
9. Reject unsafe “optimization” that mutates parameter semantics.

## Improvement target
- Reduce model-visible tool-schema tokens by at least 50% on representative tasks while maintaining tool-selection recall and task success.
- Keep essential tools reachable even when lazy discovery is unavailable.
- Detect schema-budget regressions in CI.
- Preserve exact input-schema semantics for every exposed tool.

## Success metrics
- `tool_schema_estimated_tokens_before`
- `tool_schema_estimated_tokens_after`
- `schema_token_reduction_ratio`
- `selected_tool_count / catalog_tool_count`
- `essential_tool_reachability`
- `tool_selection_recall`
- `tool_call_success_rate`
- `fallback_activation_rate`
- `cold_start_input_tokens`
- `task_quality_regression_rate`

## Evidence / interpretation / proposal boundary
- **Observed evidence:** sources above document significant schema overhead, current tool-schema requirements, model-visible tool lists, and a real deferred-tool failure mode.
- **Interpretation:** tool definitions should be budgeted and retrieved selectively rather than always treated as fixed prompt material.
- **Proposed engineering solution:** the profiler, router, policy, hooks, and verification procedure in this package are a reusable design derived from those observations; they are not claimed to be an official MCP or OpenAI standard.
