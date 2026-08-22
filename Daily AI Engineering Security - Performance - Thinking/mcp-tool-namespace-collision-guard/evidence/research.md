# Research — MCP Tool Namespace Collision Guard

## Topic
MCP Tool Namespace Collision Guard

## Category
Security

## Problem
Tool identity can become ambiguous when multiple MCP servers expose identical names or when clients sanitize distinct names into the same model-facing identifier.

## Why it matters now
MCP ecosystems increasingly combine many third-party servers. Collision behavior now affects both availability and trust: a client may reject tools, silently skip one provider, or map an invocation to an unintended tool.

## Affected users
MCP client authors, agent platforms, developers enabling multiple providers, and teams relying on model-controlled tool selection.

## Current public evidence
### Observed evidence
1. MCP specification security review #3180, opened July 31, 2026, identifies protocol-level tool-name shadowing because there is no cross-server namespace and recommends server-qualified names: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180
2. Hermes Agent #72032, opened July 26, 2026, reports distinct raw MCP tool/server names collapsing after sanitization and silently replacing valid tools: https://github.com/NousResearch/hermes-agent/issues/72032
3. DeepAgents #4666, opened July 12, 2026, reports collisions between MCP-prefixed tool names and MCP/built-in tools: https://github.com/langchain-ai/deepagents/issues/4666
4. OpenClaw #54886 documents duplicate names across MCP providers causing one tool to be skipped and asks for aliases/renaming: https://github.com/openclaw/openclaw/issues/54886
5. OpenAI Agents SDK #464 documents duplicate tool names across MCP servers preventing simultaneous usage: https://github.com/openai/openai-agents-python/issues/464

### Interpretation
The implementations differ, but the recurring root problem is missing stable global identity. Registration order, prefixes, and sanitization are not sufficient unless collision handling is explicit and deterministic.

## Existing approaches
- Reject duplicate names.
- Keep first registration and skip later tools.
- Prefix names with server labels.
- Sanitize names to provider-compatible character sets.

## Remaining limitations
- Rejection harms composability.
- First-wins behavior is order-dependent and unsafe.
- Human-readable server labels can collide.
- Lossy sanitization maps distinct names to one identifier.
- Schema drift can change meaning while preserving an alias.

## Root-cause analysis
1. Protocol tool names are scoped per server, while model tool registries are often global.
2. Model/provider naming restrictions encourage lossy transforms.
3. Alias registries are not always persisted or checked for drift.
4. Collision handling is treated as UX rather than a trust-boundary invariant.

## Improvement opportunity
Use a deterministic registry keyed by canonical server identity + raw tool name + schema digest. Generate stable model-facing aliases, detect both raw and normalized collisions, fail closed on ambiguity, and require explicit remapping on schema/provider drift.

## Goal
No ambiguous or silently replaced tool reaches model context.

## Metrics
Collision count, normalized-collision count, blocked ambiguities, stable-alias rate, schema-drift detections, false-positive blocks.

## Trigger / Inputs / Outputs
Trigger: server connect, `tools/list`, `tools/listChanged`, or configuration reload. Inputs: server identity, raw names, schemas, prior registry. Outputs: deterministic alias map or blocking diagnostics.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180
- https://github.com/NousResearch/hermes-agent/issues/72032
- https://github.com/langchain-ai/deepagents/issues/4666
- https://github.com/openclaw/openclaw/issues/54886
- https://github.com/openai/openai-agents-python/issues/464