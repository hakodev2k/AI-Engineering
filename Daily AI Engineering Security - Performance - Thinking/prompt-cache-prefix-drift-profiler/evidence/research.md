# Research — Prompt Cache Prefix Drift Profiler

**Topic:** silent prompt-cache collapse caused by unstable early prompt content  
**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Prompt caching relies on reusable prefixes, yet real agent stacks prepend changing memory, telemetry, tool registries, timestamps, or adapter-specific fields. A single early change can invalidate downstream cached work.

## Why it matters now
In 2026, coding agents routinely carry large system prompts, tool schemas, memory and repository context. Provider-side caching discounts make prefix stability a major cost/latency lever, while current bug reports show cache-hit rates collapsing from near-total reuse to near-zero because of seemingly small dynamic fields.

## Affected users
AI-agent developers, gateway/proxy teams, coding-assistant users, FinOps/platform engineers, and teams using Anthropic-compatible or OpenAI-compatible endpoints.

## Current public evidence

### Observed evidence
1. openclaw/openclaw issue #91223, open and updated August 26, 2026, reports active-memory injection reducing observed prompt-cache hit rate from ~99.9% baseline to ~22% production-weighted, with variable 32KB prepended context reproducing 0% warm hits: https://github.com/openclaw/openclaw/issues/91223
2. anthropics/claude-code issue #68900 reports a changing `cch` nonce in the first system block causing 0% prefix-cache hits on a third-party provider; normalizing the mutable block reportedly restored ~99.7% hits: https://github.com/anthropics/claude-code/issues/68900
3. Anthropic prompt-caching documentation states that cached content is prefix-based and that changing a block at or before a breakpoint changes the cumulative hash; it recommends putting static content first and using usage fields to verify caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
4. OpenAI prompt-caching documentation explains automatic reuse of previously computed prompt prefixes and exposes cached-token usage for verification: https://openai.com/index/api-prompt-caching/
5. Vercel's August 12, 2026 provider comparison emphasizes that one request-specific field before the cache boundary can drop reuse across prefix-caching providers: https://vercel.com/i/prompt-caching-across-providers

### Interpretation
The recurring engineering problem is observability and prompt-build determinism, not lack of a cache feature. Teams need to know exactly where two supposedly cache-compatible requests first diverge and whether provider usage confirms the predicted effect.

## Existing approaches
- Provider automatic caching.
- Explicit cache breakpoints.
- Manual placement of stable instructions before dynamic content.
- Aggregate `cached_tokens` / `cache_read_input_tokens` dashboards.
- Disabling memory/plugins suspected of causing cache misses.

## Remaining limitations
- Aggregate hit ratios do not identify the earliest unstable block.
- Adapter bugs can report zero cache reads even when upstream caching works.
- Dynamic content may be correct but placed before a reusable boundary.
- Tool/schema ordering can drift nondeterministically.
- Engineers may optimize token count while accidentally harming answer quality.

## Root-cause analysis
1. Prompt assembly is not treated as a deterministic build artifact.
2. Stable and dynamic blocks are interleaved.
3. Block ordering may depend on map iteration, plugin load order or per-request metadata.
4. Cache telemetry is provider-specific and sometimes mistranslated by proxies.
5. No regression gate links prompt structure to token/cost/TTFT measurements.

## Improvement opportunity
Represent prompts as ordered labeled blocks, hash each block, compare consecutive requests, identify the first divergence, and correlate that point with cache-read telemetry. Move only non-essential dynamic content after the reusable boundary; preserve correctness-critical context.

## Goal
Increase cache reuse and reduce tokens/cost/TTFT without critical context loss.

## Metrics
- cache read/input token ratio
- cache creation/input token ratio
- earliest drift block
- stable prefix bytes
- tokens/task and cost/task
- TTFT
- retrieval/result quality
- regression rate

## Trigger
Prompt-builder changes, memory/plugin changes, tool-registry changes, provider migrations, or cache-hit regression.

## Inputs
Redacted ordered prompt blocks and provider usage metadata from at least two comparable requests.

## Outputs
Earliest drift location, stable-prefix size, cache telemetry summary, optimization recommendation.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/91223
- https://github.com/anthropics/claude-code/issues/68900
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- https://openai.com/index/api-prompt-caching/
- https://vercel.com/i/prompt-caching-across-providers
