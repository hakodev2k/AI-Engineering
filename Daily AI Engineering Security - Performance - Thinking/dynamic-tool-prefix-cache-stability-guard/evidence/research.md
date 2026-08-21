# Research — Dynamic Tool Prefix Cache Stability Guard

## Topic
Dynamic Tool Prefix Cache Stability Guard

## Category
Token

## Problem
Agent runtimes that add, remove, reorder, or rewrite tool definitions during a conversation can invalidate prompt-prefix caches, increasing cold input tokens and latency even when the logical tool set barely changes.

## Why it matters now
MCP's 2026-07-28 specification added cacheable list results and deterministic ordering to help keep upstream prompt caches stable. July 2026 Claude Code issue #75142 reports cache invalidation when a tool is first loaded mid-session, while Qwen Code issue #4777 reports deferred-tool discovery rewriting the cached system instruction. VS Code's current Cache Explorer docs state that small early-prefix changes such as reordered tools can break downstream cache hits.

## Affected users
AI coding-agent users, MCP-heavy workflows, agent-platform builders, usage-based model customers, and systems using dynamic tool discovery.

## Current public evidence
1. MCP 2026-07-28 release — cacheable list responses and deterministic ordering: https://blog.modelcontextprotocol.io/posts/2026-07-28/
2. Claude Code issue #75142, opened 2026-07-07 — first-time mid-session tool loading can invalidate cache: https://github.com/anthropics/claude-code/issues/75142
3. Qwen Code issue #4777, opened 2026-06-04 — deferred-tool discovery/reveal rewrites the cached system prompt: https://github.com/QwenLM/qwen-code/issues/4777
4. VS Code Agent Cache Explorer docs — prompt caches match prefixes; reordered tool definitions can break later cache hits: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/agent-troubleshooting/cache-explorer.md
5. MCP issue #2808 — tool-schema token overhead and cache fragility: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808

## Existing approaches
Provider-side prompt caching, deferred/lazy tool loading, MCP list TTL caching with deterministic order, tool-search abstractions, and manual cache diagnostics.

## Remaining limitations
Caching cannot help if clients regenerate semantically equivalent prefixes with different bytes. Lazy loading can itself trigger mid-session prefix mutation. Tool schemas may be reordered or serialized inconsistently, and cache telemetry is rarely correlated with tool-set revisions.

## Root-cause analysis
- Prompt caching is prefix-sensitive while tool registries are often mutable and unordered.
- Tool discovery lifecycle is coupled to system-prompt construction.
- Schema serialization lacks a canonical hash contract.
- Cache telemetry is not correlated with tool revision events.
- Semantically irrelevant changes can occur before stable cache breakpoints.

## Improvement opportunity
Canonicalize tool schemas, compute stable prefix fingerprints, separate stable catalog metadata from per-turn dynamic state, detect avoidable prefix mutations before model calls, and record cache regressions against tool-revision events.

## Goal
Reduce avoidable cold-prefix tokens and latency without hiding tools required for correctness.

## Metrics
Stable fingerprint rate, prefix mutation rate/session, prompt-cache hit ratio, cold input tokens/task, p50/p95 latency, and tool-selection quality regression rate.

## Trigger
Before model request construction, after tool discovery/list refresh, or when cache hit ratio falls below policy.

## Inputs
Tool definitions, instruction blocks, tool revision events, prior fingerprint, cache/token telemetry, model context limit.

## Outputs
Canonical catalog, fingerprint, mutation diff, decision, and measurement record.

## Observed evidence
The cited sources show real cache instability and recent protocol changes intended to improve cacheability.

## Interpretation
Not every dynamic tool load is avoidable. The target defect is unnecessary prefix churn for equivalent or incrementally changed catalogs.

## Proposed solution
Use deterministic serialization and stable ordering, isolate dynamic discovery state after cache-stable prefixes where provider semantics permit, and gate model calls on measurable cache-budget policy. Never suppress required tool context solely to save tokens.
