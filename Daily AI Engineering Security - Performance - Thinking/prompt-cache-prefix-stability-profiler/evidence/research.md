# Research — Prompt Cache Prefix Stability Profiler

## Topic
Prompt Cache Prefix Stability Profiler

## Category
Token / Performance

## Problem
Agent requests repeatedly resend large static instructions and tool definitions, but small structural changes near the prompt prefix—tool ordering, dynamic descriptions, feature toggles, or reasoning/search settings—can invalidate prompt/KV-cache reuse. Teams then pay higher input cost and latency without clear evidence of what changed.

## Why it matters now
Modern agent stacks increasingly depend on prompt caching to keep long-context/tool-heavy workflows affordable. Current 2026 guidance emphasizes exact/stable prefixes and documents that changes to tool definitions or early prompt structure can invalidate downstream cache segments.

## Affected users
Agent platform teams, coding-agent users, RAG/assistant builders, API cost owners, and teams with large tool catalogs or repeated system context.

## Current public evidence
### Observed evidence
1. Current Claude prompt-caching documentation summaries state that cache matching is prefix-based, tools/system/messages are hierarchical, exact matching is required, and modifying tool definitions invalidates tool/system/message cache segments: https://claudecode.jp/en/docs/claude/prompt-caching
2. A 2026 engineering article on tool selection at scale identifies dynamic tool retrieval/order changes as a KV-cache stability problem and recommends stable ordering/deferred loading/prefix caching: https://ajing.github.io/posts/2026-01-10-tool-selection-optimization-llm-agents-at-scale/
3. A July 28, 2026 cross-provider prompt-caching guide highlights structurally stable prefixes as the common engineering requirement across major providers: https://mixroute.ai/blog/prompt-caching-guide/

### Interpretation
Caching is not only a provider switch; it is an application-level determinism problem. Without canonicalization and telemetry, cache misses look like provider variability even when the application changed its own prefix.

## Existing approaches
- Provider prompt caching or automatic cached-token accounting.
- Manual placement of static instructions first.
- Keeping all tools static.
- Deferred/dynamic tool loading.
- Ad hoc cache-hit dashboards.

## Remaining limitations
- Cache metrics often show the miss but not the first structural divergence.
- JSON/tool arrays can be semantically identical but byte/order unstable.
- Dynamic timestamps/request IDs accidentally enter cacheable prefixes.
- Feature/model settings can invalidate later segments without being attributed.
- Teams optimize total prompt length while ignoring prefix churn.

## Root-cause analysis
1. No canonical representation for cache-intended prompt segments.
2. Static and dynamic fields are mixed.
3. Tool lists are assembled from nondeterministic sources/order.
4. Cache-hit telemetry is not joined with prompt fingerprints.
5. Optimization lacks a before/after benchmark and quality guardrail.

## Improvement opportunity
Create a provider-neutral profiler that canonicalizes cache-intended prompt segments, fingerprints tools/system/static context separately, identifies the first changed segment between requests, and joins those fingerprints with cache read/write token metrics. Gate deployments on prefix stability and quality-preserving token/cost improvements.

## Goal
Increase prompt-cache reuse and reduce uncached input tokens/latency without removing context required for correctness.

## Metrics
- Cache read ratio / cached-input ratio.
- Uncached input tokens per task.
- Cache writes per repeated task family.
- First-divergence frequency by segment.
- p50/p95 TTFT or request latency where available.
- Quality/regression pass rate.

## Trigger
Prompt/tool/schema/settings changes or observed cache-hit degradation.

## Inputs
Normalized request snapshots, tool definitions, system blocks, static context, provider usage metrics.

## Outputs
Segment fingerprints, divergence report, stability score, before/after metrics, and blocking regression decision.

## Relevant sources
- https://claudecode.jp/en/docs/claude/prompt-caching
- https://ajing.github.io/posts/2026-01-10-tool-selection-optimization-llm-agents-at-scale/
- https://mixroute.ai/blog/prompt-caching-guide/
