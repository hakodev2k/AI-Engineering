# Research: Stable Prefix Cache Boundary Profiler

## Topic
Stable prefix cache boundary failures in AI agents cause unnecessary cache writes, uncached input, latency, and cost even when most startup context is reusable.

## Category
Token

## Problem
Agent runtimes often rebuild large prompts whose early sections are semantically stable but byte-unstable, place cache boundaries after volatile content, use unstable cache keys across related sessions/subagents, or expose no telemetry that identifies where reuse stops. The result is repeated full-price processing of system prompts, tool schemas, skills, repository instructions, and inherited history.

## Why it matters now
GPT-5.6 added explicit prompt-cache breakpoints and cache-write accounting, making prefix placement directly measurable. Current agent issues show that cache misses still occur because clients cannot express boundaries, reorder otherwise static prompt components, lose cache lineage across subagents, or provide insufficient visibility into misses.

## Affected users
AI coding-agent users, platform engineers, multi-agent framework authors, gateway operators, and teams paying per-token API costs.

## Current public evidence
### Observed evidence
1. OpenAI's current GPT-5.6 guidance documents explicit prompt caching, `prompt_cache_breakpoint`, `prompt_cache_options`, `cached_tokens`, and `cache_write_tokens`, and recommends measuring cache behavior because cache writes cost more than ordinary uncached input.
   Source: https://developers.openai.com/api/docs/guides/latest-model
2. OpenAI Codex issue #35300 reports that Codex could not serialize `prompt_cache_breakpoint`; a controlled replay with a roughly 9k-token stable developer prefix reported 0% hits without the explicit boundary and 98.6% hits after adding the boundary on the tested backend/workload.
   Source: https://github.com/openai/codex/issues/35300
3. OpenAI Codex issue #35925 reports a long session where cache misses represented the dominant share of uncached cost and users lacked enough telemetry to identify misses while they happened.
   Source: https://github.com/openai/codex/issues/35925
4. Anthropic Claude Code issue #49038 reports prompt-cache misses caused by non-deterministic ordering of sub-agent descriptions, which invalidated an otherwise reusable prefix.
   Source: https://github.com/anthropics/claude-code/issues/49038
5. Browser-use issue #4887 describes byte-stability problems in agent prompt construction that reduce Gemini implicit cache reuse.
   Source: https://github.com/browser-use/browser-use/issues/4887
6. OpenAI Codex issue #24704 reports forked subagents losing prompt-cache lineage for inherited parent context.
   Source: https://github.com/openai/codex/issues/24704

## Interpretation
The recurring problem is not simply "enable caching." Cache effectiveness depends on deterministic rendering, stable placement of reusable material, compatible cache keys/lineage, and runtime telemetry. A client can nominally support caching while still repeatedly invalidating the prefix before the expensive static region.

## Existing approaches
- Provider-managed implicit prompt caching.
- Explicit cache breakpoints where supported.
- Stable `prompt_cache_key`/session affinity.
- Manual ordering of system prompts and tool definitions.
- Context compaction and summary replacement.
- Provider usage fields such as cached/read/write token counts.

## Remaining limitations
- Semantic equivalence does not guarantee byte-stable prompt rendering.
- Tool/schema/plugin enumeration may be non-deterministic.
- Volatile timestamps, environment data, permissions, or repository state can be inserted before static blocks.
- Compaction/history rewriting changes the prefix and can force a cold request.
- Subagents and resumptions may use new cache keys despite inheriting large prefixes.
- Cache metrics are frequently aggregated at request level without identifying the exact component that first diverged.
- Applying explicit breakpoints everywhere can create unnecessary writes; boundary selection must be measured.

## Root-cause analysis
1. Prompt construction is optimized for readability/function rather than prefix stability.
2. Static and volatile context are not explicitly classified.
3. Serialization order is not deterministic across runs.
4. Cache lineage is coupled to ephemeral session identifiers.
5. Context mutation and compaction happen without cache-regression checks.
6. Observability reports token totals but not component-level stability.

## Improvement opportunity
Introduce a provider-neutral profiler that records prompt components, fingerprints each component, measures change rates and cache outcomes, identifies the earliest unstable component, and gates cache optimizations on quality-preserving before/after evidence. Use explicit breakpoints only when the provider supports them and the measured boundary is actually stable.

## Goal
Reduce avoidable uncached/cache-write tokens while preserving task quality and required context.

## Metrics
- `cached_tokens / input_tokens`.
- `cache_write_tokens / input_tokens`.
- uncached input tokens per completed task.
- cost per completed task.
- p50/p95 request latency.
- earliest unstable prompt component.
- stable-prefix bytes/tokens.
- quality/regression pass rate.

## Trigger
High token cost, low cache hit ratio, new model/provider, prompt-layout change, tool/plugin change, context-compaction change, or multi-agent rollout.

## Inputs
JSONL request traces containing ordered prompt components plus optional provider usage and quality fields.

## Outputs
Component stability report, earliest divergence, baseline metrics, optimization candidate, and regression verdict.

## Proposed solution
The package implements deterministic component fingerprinting, a measurable cache-policy workflow, enforceable stability rules, bounded retries, and a preflight hook. It does not assume a cache hit is guaranteed and never removes correctness-critical context solely to improve hit rate.

## Relevant sources
- https://developers.openai.com/api/docs/guides/latest-model
- https://developers.openai.com/api/reference/java/resources/responses/methods/compact
- https://github.com/openai/codex/issues/35300
- https://github.com/openai/codex/issues/35925
- https://github.com/openai/codex/issues/24704
- https://github.com/anthropics/claude-code/issues/49038
- https://github.com/browser-use/browser-use/issues/4887
