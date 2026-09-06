# Research

## Topic
Ollama Model Residency Cold-Start Profiler

## Category
Performance

## Problem
Local AI agents can suffer large, bursty latency when a model is evicted from GPU/RAM and must be reloaded before the next agent turn. A static keep-alive value does not reliably solve the problem across hardware, concurrent requests, multi-model workloads, or runtime regressions.

## Why it matters now
Recent 2026 reports show both expected cold-start costs and unexpected residency failures. A waired-agent issue measured 17–56 seconds of first-token latency after its one-hour keep-alive boundary. Ollama issue #16610 reports repeated eviction/reload on 0.30.6 despite `OLLAMA_KEEP_ALIVE=30m`, with requests taking about a minute while 0.24.0 stayed hot. Ollama issue #17004 documents concurrent-request behavior that can prevent expected unloading. Public 2026 benchmarks also show material warm-versus-cold latency gaps.

## Affected users
Developers running local coding agents, RAG systems, MCP-backed agents, desktop assistants, and multi-model local inference services on Ollama-compatible runtimes.

## Current public evidence
### Observed evidence
1. waired-ai/waired-agent issue #861, opened 2026-08-19, reports a one-hour idle boundary causing 17–56 seconds of first-token latency with no re-warm across the boundary.
2. ollama/ollama issue #16610, opened 2026-06-07, reports a regression where 0.30.6 repeatedly evicts/reloads a large model despite a 30-minute keep-alive; load duration dominates total duration and rollback restores hot behavior.
3. ollama/ollama issue #17004, opened 2026-07-02, reports concurrent-request refcount behavior that can keep a model loaded when immediate unload is expected.
4. A 2026 Ollama RAG benchmark reports p50 cold latency around 3.1–3.5 seconds versus warm p50 around 0.8–1.0 seconds for its tested configuration, illustrating a measurable residency penalty even on smaller models.

### Interpretation
The engineering problem is not simply choosing a larger keep-alive. Operators need to measure residency state, load duration, traffic gaps, concurrency, VRAM pressure, and version-specific behavior, then select a policy that minimizes cold starts without pinning excessive memory.

## Existing approaches
- Set global `OLLAMA_KEEP_ALIVE` or per-request `keep_alive`.
- Preload/pin models.
- Monitor `ollama ps` and GPU memory.
- Increase keep-alive duration for intermittent agent workloads.
- Roll back regressions or change runtimes when scheduler behavior is unstable.

## Remaining limitations
- Long keep-alive can starve other models or workloads of VRAM.
- Static values ignore observed inter-arrival distributions.
- Residency regressions can defeat configured policy.
- Concurrent requests can change unload semantics.
- Teams often benchmark generation throughput but omit load duration and first-token latency after idle periods.

## Root-cause analysis
1. Residency policy is configured without an empirical idle-gap distribution.
2. Model load duration is not separated from prompt evaluation/generation latency.
3. Runtime version and concurrency behavior can alter residency semantics.
4. VRAM pressure is not treated as a first-class trade-off metric.
5. No regression gate compares cold-start rate and load-duration share before/after runtime changes.

## Improvement opportunity
Create a profiler that consumes request telemetry, classifies requests as cold/warm, computes idle-gap percentiles and load-duration share, recommends a bounded keep-alive range, and compares before/after traces. The package must not claim improvement until measured cold-start rate, p95 first-token latency, and VRAM residency costs are compared.

## Relevant sources
- waired-agent issue #861: https://github.com/waired-ai/waired-agent/issues/861
- Ollama issue #16610: https://github.com/ollama/ollama/issues/16610
- Ollama issue #17004: https://github.com/ollama/ollama/issues/17004
- 2026 Ollama RAG benchmark: https://markaicode.com/benchmarks/ollama-rag-benchmark/
