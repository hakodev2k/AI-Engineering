# Research — Cache-Aware Prompt Compression Gate

## Topic
Cache-Aware Prompt Compression Gate

## Category
Token

## Problem
Production LLM systems often combine prompt compression with prefix caching, but query-dependent compression can destroy stable prefixes and reduce cache reuse. A smaller prompt can therefore cost more or run slower than a larger cacheable prompt.

## Why it matters now
OpenAI documents prefix-based prompt caching and exposes cached token accounting. Anthropic recommends keeping stable reusable content at the beginning and notes cache hits require exact prefix identity. July 2026 research on Cache-Aware Prompt Compression reports that aggressive/query-aware compression can invalidate cacheable prefixes and become more expensive than cache-preserving strategies in realistic workloads.

## Affected users
Agent-platform teams, RAG developers, multi-turn assistants, tool-heavy systems, API cost owners, and teams compressing large system/tool/repository contexts.

## Current public evidence
1. OpenAI Prompt Caching: cached reuse applies to previously computed prompt prefixes and usage exposes cached tokens: https://openai.com/index/api-prompt-caching/
2. OpenAI Responses API exposes `prompt_cache_key`, `prompt_cache_retention`, and cached token usage, confirming caching is an operational optimization that should be measured: https://platform.openai.com/docs/api-reference/responses
3. Anthropic Prompt Caching docs state cache hits require exact matching and recommend stable reusable prefixes before variable suffixes: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
4. "Cache-Aware Prompt Compression: A Two-Tier Cost Model for LLM API Caching" (2026-07-17) reports that query-aware compression can mechanically invalidate cache prefixes and that cache-aware compression reduced cost while preserving benchmark quality: https://arxiv.org/abs/2607.15516

## Existing approaches
- Compress everything before sending.
- Cache everything and accept large prompts.
- Use provider-native automatic caching without measuring cache hit rate.
- Apply query-aware compression per request.
- Manually split stable and dynamic context.

## Remaining limitations
Compression is usually optimized for token count, not total billed cost or time-to-first-token. Cache-aware placement is often undocumented in application architecture. Dynamic fields such as timestamps, volatile retrieval blocks, or request-specific tool metadata can move into the stable prefix and invalidate reuse. Teams frequently lack a regression gate combining input tokens, cached tokens, cache-write cost, latency, and answer quality.

## Root-cause analysis
- Token minimization is treated as equivalent to cost minimization.
- Prompt assembly lacks explicit stable/dynamic segment metadata.
- Compression happens after prompt assembly, so it can reorder or rewrite reusable prefixes.
- Cache metrics are not part of test/benchmark acceptance criteria.
- Quality checks are separated from token/cost checks.

## Improvement opportunity
Introduce a deterministic gate that profiles prompt segments, preserves stable cacheable prefixes, compresses only eligible sections, and compares candidate strategies using total token cost, cache-hit ratio, latency, and quality regression. The gate rejects compression that saves raw tokens but worsens effective cost/latency beyond configured thresholds.

## Goal
Reduce effective tokens/cost/latency without losing required context or destroying valuable prefix reuse.

## Metrics
- input tokens/task
- cached tokens/task and cache-hit ratio
- cache-write tokens where exposed
- estimated cost/task
- time-to-first-token and end-to-end latency
- answer/task quality score
- critical-context regression count

## Trigger
Prompt-template change, context compression change, tool-schema change, RAG context policy change, or provider/model migration.

## Inputs
Segmented prompt, provider usage logs, pricing/config values, baseline benchmark cases, quality scores, and latency measurements.

## Outputs
Baseline report, candidate report, accept/reject decision, failed metrics, and recommended compression/cache policy.

## Observed evidence
Current provider documentation and recent evaluation results show that prefix stability materially affects cache reuse and cost.

## Interpretation
The optimal prompt is not necessarily the shortest prompt. The best production configuration minimizes effective cost and latency subject to correctness and required-context constraints.

## Proposed solution
A cache-aware compression workflow with deterministic segment profiling and before/after regression checks. It does not assume a provider-specific tokenizer; usage logs remain the source of truth when available.