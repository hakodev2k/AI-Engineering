# Research — Local Agent Prefix Cache Regression Profiler

**Category:** Performance  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Detect and prevent local-agent prompt/prefix-cache regressions without accepting unsafe cache reuse.

## Problem
Multi-step agents repeatedly send long, mostly shared prefixes. When KV/prompt-cache reuse is absent, every step re-prefills the whole context and TTFT grows with history. Conversely, incorrect trim/restore behavior can report a cache hit while returning KV state inconsistent with the token prefix.

## Why it matters now
Ollama issue #17829, opened August 17 and closed as completed August 26, 2026, reported MLX multi-step sessions reprocessing roughly 20–30K prompt tokens each step, 0% cache hit rate, and effective throughput falling from about 26 tok/s to 3 tok/s as history grew. MLX-LM issue #1494, opened July 7 and closed August 21, documented a cache-reuse correctness bug where windowed/concatenated cache state could no longer match the prefix key. Rapid-MLX issue #214 described growing multi-turn conversations missing prefix cache every turn while mlx_lm.server kept TTFT roughly flat.

## Affected users
Local-agent developers, Apple Silicon users, MLX/Ollama/Rapid-MLX operators, inference-server maintainers, and agent harness authors with long system prompts/tool schemas.

## Current public evidence
### Observed evidence
1. Ollama #17829: MLX engine had no effective prompt/prefix caching between agent steps; repeated full prefill caused linear TTFT growth. The issue was completed Aug 26, making regression verification especially timely.  
   https://github.com/ollama/ollama/issues/17829
2. MLX-LM #1494: `LRUPromptCache.fetch_nearest_cache` could return KV state that did not correspond to its keyed prefix for windowed/concatenated caches, causing silently wrong reuse rather than safe recomputation.  
   https://github.com/ml-explore/mlx-lm/issues/1494
3. Rapid-MLX #214: growing multi-turn hybrid-model conversations missed prefix cache every turn and re-prefilled the cumulative conversation; identical-prompt fixes did not cover the append-only agent pattern.  
   https://github.com/raullenchai/Rapid-MLX/issues/214
4. MLX-LM #1194: direct `stream_generate` users lacked a first-class prefix-aware helper and had to hand-roll prefix matching and cache trimming/state tracking.  
   https://github.com/ml-explore/mlx-lm/issues/1194

### Interpretation
The durable engineering problem is broader than one fixed bug: local agent stacks need an engine-independent contract proving both reuse effectiveness and cache correctness for exact-repeat and append-only prefixes.

## Existing approaches
- LRU prompt caches and trie/LCP lookup.
- Context checkpoints and suffix-only prefill.
- Prompt-cache trimming/restore.
- Server metrics such as prompt-eval duration and cached tokens.
- Engine-specific regression tests.

## Remaining limitations
- Cache behavior varies by transformer, sliding-window, chunked, and recurrent/hybrid architectures.
- Exact-repeat tests miss the dominant append-only multi-turn agent pattern.
- Cache-hit counters do not prove KV state corresponds to the requested prefix.
- Agent harnesses often lack normalized cache-read and TTFT instrumentation.
- Fixes in one serving layer can regress after engine/model upgrades.

## Root-cause analysis
1. Prefix-cache contracts are implicit and architecture-specific.
2. Performance telemetry and correctness verification are separated.
3. Benchmarks underrepresent growing multi-turn prompts.
4. Cache state provenance/key correspondence is not always validated.
5. No release gate enforces before/after TTFT and equivalence evidence.

## Improvement opportunity
Standardize a trace schema and deterministic profiler for exact-repeat plus growing-prefix workloads. Measure reusable-prefix coverage, cached-token coverage, full-refill rate and TTFT slope; pair it with an external deterministic-equivalence signal. Reject optimizations that improve latency but fail equivalence.

## Relevant sources
- https://github.com/ollama/ollama/issues/17829
- https://github.com/ml-explore/mlx-lm/issues/1494
- https://github.com/raullenchai/Rapid-MLX/issues/214
- https://github.com/ml-explore/mlx-lm/issues/1194
