# Research — Prompt Cache Continuity Profiler

## Topic
Prompt Cache Continuity Profiler

## Category
Token

## Problem
Long-running agent sessions can silently lose prompt-cache efficiency when stable prefixes change, cache keys drift, cache lifetimes expire, or tool/catalog ordering changes. The result is abrupt uncached-input cost and latency spikes even though the task appears structurally similar.

## Why it matters now
Prompt caching is increasingly central to agent economics, and current platform changes expose more explicit cache controls. At the same time, real-world reports show large cost spikes when active sessions fall out of cache.

## Affected users
AI-agent platform teams, coding-agent users, orchestration frameworks, RAG systems, and applications with long repeated system/tool/context prefixes.

## Current public evidence
### Observed evidence
1. VS Code issue #321551 (2026-06-16) reports active Copilot agent sessions losing prompt-cache benefits after gaps of roughly five minutes, with the next call paying full input cost across system instructions, history, and tool results: https://github.com/microsoft/vscode/issues/321551
2. OpenAI GPT-5.6 model guidance currently recommends tracking `cached_tokens` and `cache_write_tokens`, using explicit cache breakpoints when useful, and preserving reusable prefixes. GPT-5.6 explicit cache writes have separate cost semantics: https://developers.openai.com/api/docs/guides/latest-model
3. OpenAI's GPT-5.6 builder guide (August 2026) reports a minimum 30-minute cache TTL for the GPT-5.6 family and emphasizes deterministic cache breakpoints and consistent cache keys for higher hit rates: https://openai.com/index/builders-guide-to-gpt-5-6/
4. MCP 2026-07-28 added cache hints and deterministic ordering for list responses specifically so clients can cache tool catalogs and keep upstream prompt caches stable across reconnects: https://blog.modelcontextprotocol.io/posts/2026-07-28/

### Interpretation
The unresolved engineering problem is not whether prompt caching exists, but whether applications can explain why cache effectiveness changed across turns and prove that an optimization preserved answer quality. Provider telemetry alone does not identify which prompt segment caused prefix divergence.

## Existing approaches
- Provider `cached_tokens` usage counters.
- Static prompt ordering guidance.
- Explicit prompt cache keys/breakpoints.
- MCP cache hints for tool/resource lists.
- Manual prompt diffs when cost spikes appear.

## Remaining limitations
- Aggregate cached-token counts do not identify the first divergent segment.
- Dynamic tool catalogs, timestamps, IDs, retrieved chunks, or reordered JSON can destabilize a prefix.
- Cache expiry and prefix drift can look identical in billing telemetry without local fingerprints.
- Aggressive prompt compression can reduce cost while silently losing correctness-critical context.
- Teams often lack repeatable baseline and regression fixtures for cache efficiency.

## Root-cause analysis
1. Stable and volatile prompt segments are not explicitly separated.
2. Prefix fingerprints are not persisted per request.
3. Canonicalization is missing for semantically stable structured content.
4. Cache-key/TTL decisions are not logged alongside token usage.
5. Cost metrics are not evaluated together with task quality and critical-context retention.

## Improvement opportunity
Create a provider-neutral profiler that records ordered prompt segments, canonical fingerprints, cache metadata, and token counters; pinpoints the earliest prefix divergence; and compares baseline/candidate runs while enforcing quality and context-retention gates.

## Goal
Increase cache-hit effectiveness and reduce uncached input cost/latency without removing required context.

## Metrics
Cached-input ratio, cache-write tokens, uncached-input tokens/task, cost/task, p50/p95 latency, stable-prefix length, divergence position, result-quality score, critical-context regression rate.

## Trigger
On every model request and whenever cache-hit ratio, cost, or latency regresses beyond a configured threshold.

## Inputs
Ordered prompt segments, segment role/name, raw or canonical text, cache key/breakpoint metadata, provider usage counters, latency, task-quality result.

## Outputs
Per-request cache profile, earliest divergence, stable-prefix ratio, suspected cause, before/after metric comparison, and verification status.

## Relevant sources
- https://github.com/microsoft/vscode/issues/321551
- https://developers.openai.com/api/docs/guides/latest-model
- https://openai.com/index/builders-guide-to-gpt-5-6/
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
