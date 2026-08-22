# Research — Prefix Cache Gap-Aware Context Stabilizer

## Topic
Prefix Cache Gap-Aware Context Stabilizer

## Category
Performance / Token

## Problem
Long-running coding and tool-using agents repeatedly send large, mostly stable prefixes. Prefix caching reduces prefill work, but cache misses after idle gaps, gateway rewrites, or unstable prompt layout can force large prefixes to be processed again. The result is higher TTFT, cost, and end-to-end latency even when task semantics barely changed.

## Why it matters now
A 2026 real-world trace study covering roughly 4,300 coding-agent sessions, 350k LLM steps, and 430k tool calls reports very long contexts with short outputs, ~95.7% token-weighted prefix-cache hit rate, but expensive misses. It found user-initiated steps had materially lower hit rates than tool-result steps and estimated cache misses amplified prefill work by multiple times relative to irreducible fresh context.

## Affected users
Coding-agent users, agent platform teams, API gateway maintainers, multi-agent orchestrators, and teams operating long-lived interactive sessions.

## Current public evidence
### Observed evidence
1. TraceLab (University of Washington et al., 2026) reports coding-agent workloads with long contexts, high-but-imperfect prefix-cache hit rates, and misses associated with human/tool idle gaps. It reports ~95.7% overall token-weighted prefix-cache hit rate, lower user-initiated hit rates, and significant prefill amplification: https://tracelab.cs.washington.edu/ and https://github.com/uw-syfi/TraceLab
2. OpenAI's current prompt-caching documentation states that cache hits depend on exact prefix matches and recommends putting static/reused content first and variable content later. It exposes `cached_tokens` for observability: https://developers.openai.com/api/docs/guides/prompt-caching
3. Anthropic's prompt-caching documentation similarly exposes cache controls and cache lifetime behavior, making cache-boundary design an application concern rather than an automatic guarantee: https://platform.claude.com/docs/en/build-with-claude/prompt-caching

### Interpretation
Prefix caching works well when the reused prefix is stable and retained, but long-lived agents still incur expensive misses. Teams need deterministic telemetry to separate unavoidable misses from avoidable prompt-layout churn and to verify that optimizations reduce fresh-prefill work without dropping required context.

## Existing approaches
- Provider-native prompt/prefix caching.
- Stable system prompts and tool schemas.
- Manual inspection of cached-token counters.
- Prompt shortening or compaction.
- Gateway-level request caching.

## Remaining limitations
- High overall hit rate can hide a small number of extremely expensive misses.
- A cache miss caused by idle eviction looks different from a miss caused by prompt-prefix mutation, but most dashboards aggregate them.
- Prompt shortening can improve cache/cost metrics while silently removing correctness-critical context.
- Gateways can inject timestamps, request IDs, reordered tool definitions, or dynamic policy text near the prefix and destroy reuse.

## Root-cause analysis
1. No per-step stable-prefix fingerprint is recorded.
2. Cache metrics are averaged instead of weighted by input size and gap duration.
3. Dynamic fields appear before stable reusable content.
4. Tool/schema ordering is nondeterministic.
5. Idle-gap effects are not separated from application-induced churn.
6. Optimization is performed without quality regression fixtures.

## Improvement opportunity
Instrument each step with cached/input tokens, trigger, idle gap, and an optional stable-prefix fingerprint. Establish a baseline, identify high-cost miss clusters, stabilize prefix construction, then compare candidate versus baseline while requiring quality-equivalence tests.

## Goal
Reduce fresh-prefill tokens, TTFT, and token cost for long-running agent sessions without removing context required for correctness.

## Metrics
- token-weighted cache hit rate
- uncached input tokens/task
- p50/p95 TTFT when available
- miss rate by idle-gap bucket
- prefix fingerprint churn rate
- cost/task
- task success/regression rate

## Trigger / Inputs / Outputs
- Trigger: recurring high TTFT/cost or evidence of large cached-prefix workloads.
- Inputs: JSONL step telemetry with timestamp, input tokens, cached tokens, trigger, optional prefix fingerprint and TTFT.
- Outputs: baseline report, gap-bucket diagnostics, suspected application churn, before/after comparison, verification status.

## Relevant sources
- TraceLab project and paper: https://tracelab.cs.washington.edu/ ; https://github.com/uw-syfi/TraceLab
- OpenAI prompt caching: https://developers.openai.com/api/docs/guides/prompt-caching
- Anthropic prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
