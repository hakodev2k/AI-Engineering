# Rules: Token Cache Reliability

- A performance/token optimization MUST start with a measured baseline.
- Cache success MUST be measured from per-request cache-read/cache-creation counters, not assumed from configuration.
- Stable prompt-prefix fingerprints SHOULD be recorded without storing raw prompt text.
- Required task context MUST NOT be deleted solely to improve cache hit rate.
- A cache regression claim MUST include at least one measured churn event and before/after metrics.
- Optimization loops MUST stop after two unsuccessful hypotheses.
- Tool output and repository context SHOULD be deduplicated before entering stable prefixes.
- Secrets, raw credentials, private prompt content, and retrieved sensitive data MUST NOT be written to cache-analysis logs.
- A candidate optimization MUST NOT be marked Verified until quality/regression checks pass.
