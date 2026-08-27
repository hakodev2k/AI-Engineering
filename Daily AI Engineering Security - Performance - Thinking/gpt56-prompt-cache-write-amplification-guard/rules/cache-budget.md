# Rules: Prompt Cache Budget

- Cache optimization MUST begin with measured baseline usage, not assumptions.
- `cached_tokens` and `cache_write_tokens` MUST be tracked separately for GPT-5.6-family workloads when available.
- Stable instructions, reference context, tools, and schemas SHOULD remain byte/order stable before the intended cache breakpoint.
- Dynamic timestamps, request IDs, per-turn tool results, and other volatile fields SHOULD be placed after the reusable prefix when correctness permits.
- `prompt_cache_key` MUST be stable for requests intended to share a prefix and MUST NOT be treated as making different prefixes equivalent.
- Prompt compaction or summarization MUST NOT be adopted solely for token savings without measuring its cache-read/write effect and quality regressions.
- Correctness-critical context MUST NOT be removed to satisfy cache thresholds.
- A claimed improvement MUST include before/after tokens, cache reads/writes, latency or cost, and a quality/regression check.
- Optimization loops MUST stop after at most 2 failed hypotheses and escalate unresolved provider/integration behavior.
