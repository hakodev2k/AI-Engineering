# Research — MCP Lazy Tool Context Budget

**Topic:** MCP Lazy Tool Context Budget  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent clients frequently load large MCP/tool inventories before a task proves those tools are relevant. Tool schemas consume context, increase prompt cost, reduce effective context for the actual task, and can place slow MCP discovery on the first-turn critical path.

## Why it matters now
Current bug reports show both token waste and user-visible latency from eager tool initialization. The engineering problem is not simply "use fewer tools": teams need a deterministic way to measure tool-schema cost, define a per-task budget, keep correctness-critical tools available, defer optional servers, and verify that lazy activation does not reduce result quality.

## Affected users
Coding-agent users, MCP-heavy development environments, platform teams exposing large tool catalogs, multi-agent systems, and cost/latency-sensitive agent applications.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #47645, opened 2026-04-13, reports MCP tools consuming about 14% of a fresh context window because tools were loaded automatically: https://github.com/anthropics/claude-code/issues/47645
2. Anthropic Claude Code issue #49813, opened 2026-04-17, requests easier MCP/tool toggles to reduce baseline token usage and reports roughly 14.5k tokens for GitHub MCP tools in one setup: https://github.com/anthropics/claude-code/issues/49813
3. OpenAI Codex issue #21318, opened 2026-05-06, reports many configured MCP servers blocking startup/first turn because startup and tool discovery are on the critical path, especially when some servers are slow or unreachable: https://github.com/openai/codex/issues/21318
4. OpenAI Codex issue #28640, opened 2026-06, provides a reproducer where a slow MCP `tools/list` response delays the first provider request by at least about two seconds and proposes bounded discovery/degraded startup: https://github.com/openai/codex/issues/28640

### Interpretation
The recurring failure is eager capability loading without an explicit context/latency budget. Tool availability, discovery cost, schema token cost, and task relevance are coupled implicitly. A reusable solution should make this tradeoff measurable and policy-driven rather than depending on users manually toggling servers.

## Existing approaches
- Manually disable MCP servers/tools.
- Global tool allowlists.
- Tool search / dynamic discovery where supported.
- Prompt caching.
- Shorter tool descriptions or schema simplification.
- Background/lazy initialization in some clients.

## Remaining limitations
- Manual toggling does not scale across tasks or agents.
- Prompt caching reduces repeated cost but does not recover context-window capacity occupied by irrelevant schemas.
- Global allowlists are not task-aware.
- Lazy loading without correctness constraints can omit a required tool.
- Tool-search systems still need measurable thresholds and fallback behavior.
- Startup latency can remain high if optional server discovery stays on the critical path.

## Root-cause analysis
1. No explicit per-task schema-token budget.
2. Tool catalogs are treated as static session configuration instead of dynamically loadable context.
3. Required versus optional capabilities are not declared by task phase.
4. Discovery latency and prompt-token cost are measured separately, if at all.
5. No verification gate compares quality/correctness before and after deferral.

## Improvement opportunity
Introduce a deterministic inventory profiler and activation planner. Every tool/server declares measured schema tokens, startup/discovery latency, task tags, and criticality. The planner always includes required capabilities, selects optional capabilities within token and startup budgets, defers the rest, and emits measurable before/after context and latency estimates. A verification stage checks task quality and critical-tool recall before accepting savings.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/47645
- https://github.com/anthropics/claude-code/issues/49813
- https://github.com/openai/codex/issues/21318
- https://github.com/openai/codex/issues/28640
