# Research — Agent Prefix Cache Stability Profiler

## Topic
Agent Prefix Cache Stability Profiler

## Category
Performance

## Problem
Agent requests often reuse large instructions, tool schemas, examples, and repository context, but small or unnecessary mutations in the reusable prefix can destroy prompt-cache reuse, increasing latency and billed input work. On newer models, repeated cache writes can themselves have explicit cost, so low cache stability can become more expensive rather than merely missing a discount.

## Why it matters now
OpenAI's August 2026 GPT-5.6 guidance added explicit prompt-cache breakpoints and separate cache-write accounting, making prefix stability directly observable and economically important. OpenAI's Codex agent-loop engineering article states that cache hits require exact prefix matches and that tools must remain identical between requests. Recent developer reports also describe reproducible cache misses despite apparently stable large prefixes, reinforcing the need to measure rather than assume caching behavior.

## Affected users
Agent-platform engineers, coding-agent teams, RAG/application developers, framework maintainers, and teams running repetitive long-context workloads.

## Current public evidence
### Observed evidence
1. OpenAI's current GPT-5.6 model guidance says explicit prompt caching is available, cache writes are billed separately, and developers should track `cached_tokens` and `cache_write_tokens`: https://developers.openai.com/api/docs/guides/latest-model
2. OpenAI's Codex agent-loop engineering article states that cache hits require exact prompt-prefix matches and that images/tools must also be identical between requests: https://openai.com/index/unrolling-the-codex-agent-loop/
3. OpenAI's August 2026 builder guide reports a production example that used cache breakpoints and workspace-specific keys on a shared 29k-token prompt to reduce uncached input by 28%: https://openai.com/index/builders-guide-to-gpt-5-6/
4. A June 19, 2026 OpenAI Developer Community bug report presents controlled cases where a byte-identical long prefix unexpectedly failed to produce a cache hit when trailing content changed, showing why cache behavior should be benchmarked rather than inferred: https://community.openai.com/t/prompt-cache-documented-byte-prefix-matching-does-not-occur-on-gpt-5-4-gpt-5-5-when-trailing-user-content-exceeds-500-tokens/1384129

## Existing approaches
- Place stable instructions/examples first and dynamic user content last.
- Use provider cache keys or breakpoints.
- Inspect aggregate token billing after deployment.
- Manually keep tool definitions stable.

## Remaining limitations
Aggregate billing does not identify which prefix section is volatile. Cache keys do not repair changing content. Tool registries, generated timestamps, nondeterministic JSON ordering, dynamic policy text, or per-run repository dumps can silently mutate the reusable prefix. Provider caching is implementation-dependent, so identical-looking application payloads still require measured validation.

## Root-cause analysis
- No per-section fingerprinting of the reusable prefix.
- Stable and dynamic content are interleaved.
- Semantically equivalent structured content is serialized nondeterministically.
- Tool schemas are regenerated or reordered between calls.
- Teams optimize cache hit rate without checking correctness, latency, or cache-write cost.

## Improvement opportunity
Profile stable-prefix sections deterministically, measure section volatility and cache economics from real traces, then move only genuinely stable content before explicit cache boundaries. Canonicalize only data explicitly declared order-insensitive. Gate optimizations with before/after quality, latency, and cache metrics.

## Interpretation
The evidence does not prove that every cache miss is caused by application prefix churn. It shows that exact-prefix sensitivity, new cache-write economics, and observed misses make prefix stability a measurable production concern.

## Proposed solution
A reusable profiler and bounded workflow that fingerprints prefix sections, attributes volatility, compares baseline/candidate cache metrics, and blocks regressions. It never removes required context solely to improve cacheability.

## Goal
Reduce avoidable uncached input and latency while preserving task quality and required context.

## Metrics
- `cached_tokens / input_tokens`
- `cache_write_tokens / input_tokens`
- uncached input tokens per task
- p50/p95 latency
- per-section change rate
- correctness/regression rate from the team's existing evaluation suite

## Trigger
A repetitive agent workload has high input cost/latency, low cache reuse, new cache-write charges, or suspected prefix churn.

## Inputs
JSONL request traces with prefix sections and token/latency metrics; cache policy; optional baseline/candidate variant labels.

## Outputs
Section fingerprints, volatility ranking, cache ratios, latency percentiles, before/after regression decision, and evidence for optimization choices.
