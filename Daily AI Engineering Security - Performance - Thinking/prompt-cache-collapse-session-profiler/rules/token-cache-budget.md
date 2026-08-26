# Rules: Token Cache Budget
- Every cache optimization MUST start with a measured baseline.
- Cache health MUST be evaluated using normalized read/write ratios and absolute rewritten tokens.
- A single cache miss MUST NOT be labeled a persistent regression without the configured consecutive-request evidence.
- Correctness-critical context MUST NOT be removed solely to improve cache metrics.
- Root-cause claims MUST distinguish observed telemetry from hypotheses about client, provider, TTL, compaction, or prefix mutation.
- Optimization iterations MUST be bounded to the configured maximum.
- Before/after comparisons SHOULD use comparable task classes and context sizes.
- A claimed improvement MUST include token/cost or latency evidence and a quality/regression check.
