# Research — OpenRouter Cache Affinity Regression Guard

**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Multi-turn agent workflows can silently lose prompt-cache reuse when OpenRouter session affinity is absent or unstable, causing repeated large prefixes/tool schemas to be billed and processed as fresh input.

## Problem
Agent runtimes often resend stable system instructions, tool schemas and policy context on every model call. When requests drift across provider endpoints or the conversation identity changes, a warm provider cache cannot be reused. The task still succeeds, so teams may not notice the regression until token cost and latency increase.

## Why it matters now
Two independent agent projects reported this exact integration gap in July–August 2026, while OpenRouter's current documentation explicitly recommends a stable `session_id` for multi-turn agentic workflows whose opening messages may change.

## Affected users
Developers and teams running paid multi-turn agents through OpenRouter, especially workflows with large repeated system prompts/tool schemas and frequent internal model calls.

## Current public evidence
### Observed evidence
1. Zoo Code issue #1277, opened 2026-08-18, reports prompt-cache misses because requests do not send stable session affinity and newer cache-capable Claude models can miss explicit cache breakpoints due to a static model allowlist. The report notes `cached_tokens` may remain zero when turns route to different upstream endpoints. https://github.com/Zoo-Code-Org/Zoo-Code/issues/1277
2. Hermes Agent issue #70820, opened 2026-07-24, reports OpenRouter requests do not forward `session_id`, disabling sticky routing/prompt caching for paid multi-turn agent loops. https://github.com/NousResearch/hermes-agent/issues/70820
3. OpenRouter prompt-caching documentation states sticky routing keeps follow-up requests on the same provider endpoint and recommends explicit `session_id` for multi-turn agentic workflows where opening messages may change. https://openrouter.ai/docs/guides/best-practices/prompt-caching
4. OpenRouter's July 2026 tutorial explains that changing opening blocks or provider drift can create cold-cache turns and recommends checking `cached_tokens` to verify cache reuse. https://openrouter.ai/blog/tutorials/prompt-caching-sticky-routing/

### Interpretation
The recurring weakness is observability plus session-identity drift: cache behavior is an optimization layer external to task correctness, so normal functional tests do not fail when reuse disappears. Static cache-capability allowlists add another failure mode as model catalogs evolve.

## Existing approaches
- Provide OpenRouter `session_id` / `x-session-id` for stable sticky routing.
- Keep reusable prompt prefixes stable and place dynamic content later.
- Add provider-specific `cache_control` where explicit caching is required.
- Inspect `usage.prompt_tokens_details.cached_tokens` or equivalent usage fields.
- Maintain lists of cache-capable models.

## Remaining limitations
- A `session_id` can accidentally change every turn, eliminating affinity while appearing configured.
- Provider failover legitimately resets cache, so a single cold turn is not sufficient evidence of a bug.
- Dynamic timestamps/run metadata near the prompt prefix can defeat cache reuse even with stable routing.
- Static model allowlists become stale as new cache-capable models ship.
- Functional tests rarely assert cache-hit ratios, token cost or prefix stability.

## Root-cause analysis
1. Session identity is not treated as a first-class invariant of the agent run.
2. Cache telemetry is not captured alongside normal model-call metrics.
3. Cache eligibility is sometimes encoded as static model-name logic instead of provider capability metadata.
4. Prefix stability is not measured, so benign prompt assembly changes can invalidate caches.
5. Teams optimize based on configuration presence rather than measured cache reads.

## Improvement opportunity
Add a deterministic trace profiler and regression gate that measures session-id stability, reusable-prefix hash stability, cache-hit ratio, cached-token share, fresh-input-token overhead and cold-turn streaks. Require before/after evidence and tolerate bounded failover-induced cold turns instead of demanding impossible 100% hits.

## Relevant sources
- https://github.com/Zoo-Code-Org/Zoo-Code/issues/1277
- https://github.com/NousResearch/hermes-agent/issues/70820
- https://openrouter.ai/docs/guides/best-practices/prompt-caching
- https://openrouter.ai/blog/tutorials/prompt-caching-sticky-routing/
