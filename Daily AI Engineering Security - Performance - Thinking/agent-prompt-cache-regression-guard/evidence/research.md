# Research — Agent Prompt Cache Regression Guard

## Problem
Long-running AI coding/agent sessions can suffer prompt-cache regressions where cache reads suddenly collapse and large prefixes are re-created even though the user-visible task changed little. The result is higher latency, quota consumption, and billed input cost without corresponding work.

## Category
Performance (primary), with Token implications.

## Why it matters now
Two recent Claude Code reports show this is not merely theoretical:

1. Anthropic Claude Code issue #76058, opened 2026-07-09, reports 1-hour prompt-cache entries being intermittently invalidated about every 11–12 minutes during active sessions. The reporter measured large cache-creation bursts after sub-minute gaps and described hundreds of thousands of tokens being rewritten.
2. Anthropic Claude Code issue #83542, opened 2026-08-03, reports 17 mid-session prompt-cache drops in roughly three hours, with about 10.4M redundant cache-write tokens according to the reporter's transcript analysis.

Official Claude Code documentation also states that model switches, MCP server connect/disconnect events, compaction, and upgrades invalidate some or all cached prompt state. Tool definitions live in the system-prompt layer, so an MCP tool-set change can invalidate the prefix.

OpenAI's API exposes `cached_tokens` in response usage, provides `prompt_cache_key` to improve cache bucketing, and exposes `prompt_cache_retention`; this confirms cache behavior is observable and suitable for engineering telemetry rather than being treated as an opaque optimization.

## Observed evidence vs interpretation

### Observed
- Cache-hit/read and cache-create metrics are exposed by providers.
- Large, repeated cache-rewrite anomalies have been reported in 2026 in long coding sessions.
- Provider-documented events can invalidate prompt caches.
- Cache writes can cost materially more than cache reads on Anthropic pricing tiers.

### Interpretation
- Teams need a provider-neutral regression guard that distinguishes expected invalidation from unexplained or repeated misses.
- Cache health should be monitored as a performance SLO, not inferred from total token count alone.
- A single miss may be legitimate; repeated misses with a stable prefix fingerprint and no known invalidator are the stronger anomaly signal.

### Proposed engineering solution
Instrument every request with normalized cache usage plus a stable fingerprint of cache-relevant configuration. Detect suspicious cache resets, attribute known invalidators, compare against a baseline, and fail CI/benchmark gates when cache efficiency regresses beyond thresholds.

## Existing approaches
- Rely on provider-managed automatic prompt caching.
- Manually inspect token usage after a costly session.
- Keep prompts static and place stable content early.
- Avoid model/MCP changes mid-session.
- Use provider cache keys/retention settings where supported.

## Observed limitations
- Automatic caching does not itself reveal whether a regression is expected or anomalous.
- Raw total token metrics hide cache composition.
- Manual JSONL inspection is slow and usually happens after cost/quota damage.
- Cache-hit percentage alone is misleading for tiny inputs; token-weighted ratios are more useful.
- Expected invalidation events need attribution so alerts do not produce noise.
- Provider-specific usage fields differ, making cross-provider comparison harder.

## Root-cause hypotheses
1. Cache-relevant prefix or configuration mutation: model, tool definitions, system prompt, thinking/effort settings, cache key, or compaction state.
2. Provider-side cache eviction/invalidation.
3. Client-side breakpoint or cache-key churn.
4. MCP reconnect/tool-set mutation.
5. Session resume/upgrade behavior.
6. Context truncation or compaction moving/removing cached prefixes.

These are hypotheses until correlated with request telemetry.

## Improvement target
- Detect cache-reset anomalies within the same run.
- Attribute known invalidators separately from unexplained resets.
- Measure token-weighted cache-read ratio and cache-create amplification.
- Preserve provider-neutral telemetry.
- Make regressions reproducible in CI/benchmarks.
- Never claim a provider bug solely from cache metrics; report evidence and attribution status.

## Success metrics
- `cache_read_ratio = cache_read_tokens / cache_eligible_input_tokens`.
- `cache_creation_ratio = cache_creation_tokens / cache_eligible_input_tokens` when available.
- unexplained cache-reset count per 100 requests.
- cache-write amplification: repeated cache creation divided by incremental uncached growth.
- p50/p95 request latency before vs after.
- estimated cache-related cost per successful task when pricing is configured.
- false-positive rate for known invalidation events.

## Sources
- Claude Code issue #76058, 2026-07-09: https://github.com/anthropics/claude-code/issues/76058
- Claude Code issue #83542, 2026-08-03: https://github.com/anthropics/claude-code/issues/83542
- Claude Code prompt-caching documentation: https://code.claude.com/docs/en/prompt-caching
- OpenAI API reference (`cached_tokens`, `prompt_cache_key`, `prompt_cache_retention`): https://platform.openai.com/docs/api-reference/responses
- OpenAI prompt-caching overview: https://openai.com/index/api-prompt-caching/
- Anthropic pricing/cache multipliers: https://docs.anthropic.com/en/docs/about-claude/pricing

Research reviewed on 2026-08-19 (UTC+7).
