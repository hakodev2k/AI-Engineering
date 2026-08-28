# Rules: Token and Cache Stability

- Tool declarations for the same semantic tool set MUST use deterministic serialization and ordering.
- Stable system/tool content MUST precede volatile per-turn content when provider cache semantics permit.
- Teams MUST measure cached and uncached input tokens separately before claiming token optimization.
- An optimization MUST NOT remove correctness-critical policy, evidence, permissions, or tool definitions merely to improve cache metrics.
- Deferred tool loading MUST have a deterministic fallback for tasks that require an unavailable tool.
- Tool-schema drift SHOULD be reviewed when the same canonical tool set produces multiple ordered fingerprints.
- Before/after comparisons MUST use representative equivalent workloads.
- Quality or regression pass rate MUST meet the configured floor.
- Optimization loops MUST be bounded to at most 2 implementation retries unless a human explicitly changes the experiment plan.
- Cache misses caused by legitimate tool/schema changes MUST NOT be mislabeled as avoidable regressions.
