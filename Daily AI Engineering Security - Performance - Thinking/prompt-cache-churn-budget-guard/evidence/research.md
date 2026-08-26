# Research — Prompt Cache Churn Budget Guard

**Topic:** Prompt cache churn in long-running AI sessions  
**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Long-running agent sessions can repeatedly lose a previously effective prompt cache and rewrite or re-meter very large contexts. This can sharply increase token cost and latency even when the user-visible task changes only slightly.

## Why it matters now
Large-context coding agents increasingly run for hours and accumulate hundreds of thousands of input tokens. Recent public bug reports show cache behavior becoming a dominant cost and latency factor rather than a minor optimization detail.

## Affected users
Developers using long-running coding agents, agent-platform teams, orchestration maintainers, and teams paying for large-context model workloads.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #85326, opened August 9, 2026, reports a roughly 950k-token session where a successful ~966k-token cache read was followed about 33 seconds later by cache collapse to a fixed ~38.7k prefix, forcing repeated large cache writes and rapidly consuming usage. The report describes five prompts using about half of a five-hour usage window: https://github.com/anthropics/claude-code/issues/85326
2. OpenAI Codex issue #37299, opened August 6, 2026, reports wait/status orchestration repeatedly re-metering a ~140k-token context at 10–30 second intervals while subagents were effectively idle, consuming about 90% of a weekly Pro allowance over roughly 15.5 hours: https://github.com/openai/codex/issues/37299
3. OpenAI's Realtime API documentation explicitly notes that truncation drops messages from the beginning of a conversation and reduces cached tokens on the next turn, "busting the cache"; retention-ratio truncation is documented as a way to reduce truncation frequency and improve cache rate: https://platform.openai.com/docs/api-reference/realtime
4. Anthropic pricing documentation shows that cache writes and cache reads have materially different token prices; for supported Claude tiers, cache reads are substantially cheaper than cache writes, so churn can directly amplify cost: https://docs.anthropic.com/en/docs/about-claude/pricing

### Interpretation
The engineering problem is not simply "use prompt caching." It is failure to treat cache continuity as an observable runtime invariant. Agents may continue generating requests after a sudden cache-hit collapse without checking whether the loss is expected (for example, a deliberate truncation) or pathological (for example, unstable prefixes, orchestration mutation, or repeated reconstruction).

## Existing approaches
- Provider-managed prompt caching.
- Stable prompt prefixes and prompt-cache keys.
- Context compaction or truncation.
- Session summaries and retrieval-based context selection.
- Usage dashboards that expose cached-token counters after the fact.

## Remaining limitations
- Provider caching is often opaque to the orchestrator.
- A high cache-hit ratio can suddenly collapse and remain unnoticed until quota or cost has already spiked.
- Compaction/truncation can intentionally invalidate cache, making a simple low-hit alert too noisy.
- Wait/status turns can be semantically tiny while still re-metering a very large prefix.
- Aggregate dashboards do not necessarily identify the exact request where cache continuity broke.

## Root-cause analysis
1. Cache performance is treated as a billing detail rather than an agent-control signal.
2. Orchestrators lack a stable-prefix fingerprint or equivalent continuity marker.
3. Cache invalidation events are not correlated with prompt/context mutations.
4. Large-context polling continues without a per-turn token budget or no-op suppression.
5. Recovery logic retries the expensive request shape before diagnosing why cache reuse disappeared.

## Improvement opportunity
Introduce a provider-agnostic cache-churn guard that records per-turn input tokens, cached tokens, optional cache-write tokens, latency and a stable-prefix identifier. It should detect abrupt cache-ratio collapse, distinguish expected prefix changes from unexplained churn, enforce a bounded expensive-turn budget, and block repeated no-op polling until the caller compacts, restores a stable prefix, or explicitly accepts the cost.

## Relevant sources
- Claude Code #85326: https://github.com/anthropics/claude-code/issues/85326
- Codex #37299: https://github.com/openai/codex/issues/37299
- OpenAI Realtime cache/truncation documentation: https://platform.openai.com/docs/api-reference/realtime
- Anthropic prompt-cache pricing: https://docs.anthropic.com/en/docs/about-claude/pricing
