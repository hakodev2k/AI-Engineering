# Research — Explicit Prompt Cache Breakpoint Profiler

## Topic
Explicit Prompt Cache Breakpoint Profiler

## Category
Token

## Problem
Agent applications often have large, mostly stable instructions, tool definitions, retrieved background, and repeated conversation prefixes. Prompt caching can cut repeated input work, but cache efficiency is fragile when dynamic content, files, provider adapters, or changing prompt structure alter the reusable prefix. Teams frequently see low or inconsistent cached-token ratios without a deterministic way to identify which content invalidated reuse.

## Why it matters now
Current OpenAI Agents SDK documentation exposes `prompt_cache_options` and explicit cache breakpoints for GPT-5.6+ while real developer reports show cache-hit collapse around file inputs and provider-adapter differences. This creates a practical optimization opportunity: measure prefix stability and place cache breakpoints based on evidence rather than guesswork.

## Affected users
Agent developers, platform teams with long system prompts, RAG applications, multimodal/file-processing agents, LiteLLM users, and teams optimizing model cost/latency.

## Current public evidence
### Observed evidence
1. Current OpenAI Agents SDK model documentation states that `prompt_cache_options` supports implicit or explicit caching, GPT-5.6 supports explicit cache breakpoints, and breakpoints can be added to reusable content parts: https://github.com/openai/openai-agents-python/blob/main/docs/models/index.md
2. OpenAI Python types document `prompt_cache_options`, explicit breakpoints, a 30-minute TTL for GPT-5.6+, and a bounded number of breakpoints per request: https://github.com/openai/openai-python/blob/main/src/openai/types/chat/completion_create_params.py
3. OpenAI Agents SDK issue #2784 reported a repeatable drop from about 96.7% cached tokens for text-only input to 0% on the first inline base64 file request, with a later repeat reaching about 90.3%. The issue demonstrates that mixed input structure can materially change cache behavior: https://github.com/openai/openai-agents-python/issues/2784
4. OpenAI Agents SDK issue #3008 reported that long stable system prompts routed through LiteLLM lacked an ergonomic cache-control path; the reporter measured 9,499 cached tokens of 9,544 prompt tokens with a patch versus 0 cached without it on the tested route: https://github.com/openai/openai-agents-python/issues/3008
5. Current Agents SDK documentation warns that LiteLLM support is best-effort and that usage reporting/provider behavior must be validated for the exact backend, reinforcing the need for measurement rather than assumed cache support: https://github.com/openai/openai-agents-python/blob/main/docs/models/index.md

## Existing approaches
- Rely on implicit caching.
- Add a prompt cache key or cache-control setting.
- Place static system prompts first.
- Upload files and reference them rather than embedding large payloads.
- Manually inspect `cached_tokens` from usage responses.
- Add explicit breakpoints where supported.

## Remaining limitations
A cache key does not explain which prefix segment changed. Usage totals alone do not show the first unstable block. Multimodal/file ordering and adapter transformations can change the effective request shape. Provider routes may not expose the same usage fields. Developers can optimize for token reduction while accidentally removing context required for correctness.

## Root-cause analysis
- Static and dynamic content are interleaved before a reusable prefix boundary.
- Tool schemas or generated instructions change between turns.
- Large inline files create new token sequences or routing behavior.
- Provider adapters rewrite content or omit cache-control metadata.
- Teams track total input tokens but not per-block fingerprints and cached-token ratio.
- Cache optimization is not regression-tested against answer quality.

## Improvement opportunity
Create a request profiler that fingerprints ordered prompt blocks, labels each block as static/dynamic, measures bytes/tokens approximately, compares consecutive request manifests to locate the first changed block, calculates cache-hit ratio from provider usage, and recommends only structural changes supported by measured prefix stability. Pair it with an explicit-breakpoint workflow and quality regression gate.

## Goal
Increase reusable-prefix stability and cached-token ratio while preserving required context and result quality.

## Metrics
- Cached-token ratio = cached input tokens / input tokens.
- Stable-prefix bytes/tokens across comparable requests.
- First changed block index and changed-block frequency.
- Input tokens/task, cost/task where available, latency/task.
- Result-quality regression rate on a fixed evaluation set.
- Cache observability coverage across production request classes.

## Trigger
Unexpected cache misses, rising input-token cost, adoption of GPT-5.6 explicit caching, addition of files/RAG/tool schemas, or provider/router migration.

## Inputs
Ordered prompt/request blocks, block role/type, optional static/dynamic label, usage input tokens, cached tokens, request class, provider/model, and quality-evaluation results.

## Outputs
Per-request manifest, block fingerprints, stable-prefix boundary, first divergence, cache-hit ratio, breakpoint candidate, and regression status.

## Interpretation
The evidence does not prove every inline file or adapter causes a cache miss. It shows that cache behavior depends on effective ordered request content and provider path, making deterministic profiling valuable.

## Proposed solution
A reusable profiling script plus rules/workflows that measure first, choose explicit breakpoints only on stable required context, and verify cached-token improvement together with unchanged task quality.

## Relevant sources
- https://github.com/openai/openai-agents-python/blob/main/docs/models/index.md
- https://github.com/openai/openai-python/blob/main/src/openai/types/chat/completion_create_params.py
- https://github.com/openai/openai-agents-python/issues/2784
- https://github.com/openai/openai-agents-python/issues/3008
