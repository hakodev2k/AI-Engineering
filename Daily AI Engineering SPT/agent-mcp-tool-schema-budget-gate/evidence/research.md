# Research — MCP Tool-Schema Budget Gate

## Problem
MCP clients and agent hosts can expose many tool schemas to the model up front. In tool-heavy setups, verbose schemas consume a substantial fraction of the usable context before the task starts. This raises token cost and latency, reduces room for code/history, and can make tool selection harder.

## Category
**Token**

## Why it matters now
The problem is active across the MCP ecosystem in 2026, not an isolated implementation detail.

## Current public signals

1. **MCP issue #2808 (2026-05-28)** reports tool definitions consuming roughly 5–15× more tokens than minimal type-only schemas and estimates 15–30 KB of schema context for 20–30 tools. The issue asks the protocol to address schema overhead.
   - https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808
2. **OpenAI Codex issue #14507 (2026-03-12)** requests extending deferred tool loading/tool search to general MCP tools because schemas are injected up front; the reporter measures a large avoidable cost for rarely used tools.
   - https://github.com/openai/codex/issues/14507
3. **Claude Code issue #26415 (2026-02-17)** requests dynamic loading because all MCP tool definitions are loaded at session start even when unused.
   - https://github.com/anthropics/claude-code/issues/26415
4. **Claude Code issue #23787 (2026-02-06)** reports ~25k+ tokens consumed by tool schemas with multiple MCP servers and proposes lazy loading.
   - https://github.com/anthropics/claude-code/issues/23787
5. **MCP SEP #1576** proposes schema deduplication, adaptive fields, response granularity, and retrieval-based selection specifically to mitigate token bloat.
   - https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1576
6. A 2026 study on semantic tool discovery reports that selecting a small relevant subset of tools can sharply reduce tool-related tokens while preserving high retrieval hit rate.
   - https://arxiv.org/abs/2603.20313
7. The 2026-07-28 MCP specification still defines tools as named capabilities with metadata/schema and leaves client exposure patterns implementation-defined, so hosts can add a budget gate without violating protocol semantics.
   - https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Existing approaches

### Eager registration
Register every available tool and send every schema to the model.

**Strength:** simple and complete.

**Limitation:** token footprint scales with total catalog size rather than task need.

### Manual enable/disable
Users disable MCP servers/tools when not needed.

**Strength:** no retrieval dependency.

**Limitation:** manual, easy to forget, poor for multi-project or multi-agent workflows.

### Shorter descriptions
Trim tool descriptions and optional schema metadata.

**Strength:** cheap and immediately useful.

**Limitation:** aggressive compression can reduce tool-selection quality; it does not solve scaling to hundreds of tools.

### Deferred loading / tool search
Expose a compact catalog, retrieve candidate tools for the task, then load full schemas on demand.

**Strength:** aligns context cost with task relevance.

**Limitation:** retrieval can miss a needed tool; hosts need observability, fallback, budgets, and regression tests instead of assuming top-k selection is always safe.

## Observed evidence, interpretation, proposed solution

### Observed evidence
- Multiple implementations/users report substantial up-front tool-schema cost.
- Protocol discussions and research independently propose deduplication or selective loading.
- Relevance-based retrieval can reduce schema tokens, but introduces recall risk.

### Interpretation
The missing reusable engineering control is not merely “use lazy loading”; it is a **measurable tool-schema budget gate** that quantifies the current tax, selects/promotes only necessary schemas, verifies retrieval recall, and fails safely when confidence is low.

### Proposed engineering solution
Create a host-side gate with:
1. deterministic schema inventory and token estimation;
2. per-task and per-agent tool-schema budgets;
3. lexical retrieval baseline requiring no external service;
4. optional host replacement with embeddings/tool-search;
5. fallback escalation when candidate confidence is insufficient;
6. before/after metrics and regression fixtures;
7. no silent removal of explicitly required tools.

## Root-cause hypotheses
1. Tool registration is treated as static configuration rather than task-scoped context.
2. Full JSON schemas are loaded before intent is known.
3. Descriptions duplicate boilerplate across tools.
4. Hosts optimize model prompt/history but do not separately budget tool metadata.
5. Retrieval quality is rarely measured, so teams avoid selective loading or deploy it without recall tests.

## Improvement target
Measure and improve:
- tool-schema tokens/task;
- percentage of context consumed by tool definitions;
- selected tools / total tools;
- retrieval recall@k on representative tasks;
- false exclusion rate for required tools;
- task success/regression rate;
- latency attributable to selection;
- cost/task when provider usage data is available.

## Success criteria
A deployment is verified only when:
- baseline schema footprint is recorded;
- post-gate schema footprint is measurably lower;
- required-tool recall meets configured threshold;
- representative task quality does not regress beyond configured tolerance;
- explicitly pinned tools are never removed;
- any low-confidence selection triggers bounded fallback rather than silent omission.

## Scope
This package optimizes **tool-definition context**, not tool-result payloads, conversation summarization, model routing, or provider billing policy.
