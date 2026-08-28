# Local Agent Prefix Cache Regression Profiler

**Category:** Performance

## Problem
Local agent workloads repeatedly append turns to long prompts. Prefix/KV caching can fail silently, yielding full re-prefill and rising TTFT, while unsafe cache reuse can also return state that no longer matches the keyed prefix. Optimizing only hit rate can therefore trade latency for incorrect output.

## Evidence
See `evidence/research.md`. Recent Ollama, MLX-LM, and Rapid-MLX issues show zero-cache-reuse regressions, growing multi-turn TTFT, and cache-state correctness defects in 2026.

## Existing approach
Prompt caches, longest-common-prefix matching, LRU caches, checkpoint restore, cache trimming, and server-specific metrics.

## Remaining limitation
Implementations differ by engine/model architecture; “cache hit” does not prove correct state; many agent harnesses do not measure reusable-prefix ratio, TTFT slope, cache-read coverage, and deterministic-output equivalence together.

## Proposed improvement
A reusable trace profiler and regression workflow that measures cache reuse and TTFT against stable/growing prefixes, flags suspicious re-prefill, and requires output-equivalence checks before accepting a cache optimization.

## Package tree
- `evidence/research.md`
- `config/thresholds.json`
- `skills/prefix-cache-baseline.md`
- `rules/performance-evidence.md`
- `subagents/benchmark-verifier.md`
- `workflows/measure-diagnose-optimize.md`
- `hooks/cache-regression-check.md`
- `scripts/prefix_cache_profiler.py`
- `tests/test_prefix_cache_profiler.py`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/prefix_cache_profiler.py trace.jsonl --thresholds config/thresholds.json`

## Metrics
Cache-read ratio, reusable-prefix ratio, TTFT p50/p95, TTFT slope versus prompt growth, full-refill rate, deterministic-equivalence failures.

## Verification
Run `python -m unittest tests/test_prefix_cache_profiler.py`, then compare cold/warm and growing-prefix traces on the same model/configuration.

## Safety
Do not enable a faster reuse path when equivalence verification fails. Performance changes must not weaken model-output correctness or security boundaries.

## Failure handling
Maximum two optimization hypotheses. Fallback is recomputation/no reuse. Stop on output mismatch, corrupted cache state, or missing baseline.

## Definition of Done
**Implemented:** profiler/hook integrated.  
**Measured:** cold, exact-repeat, and growing-prefix baselines captured.  
**Verified:** cache-read coverage improves or remains healthy, TTFT regression thresholds pass, and deterministic-equivalence tests show no correctness regression.
