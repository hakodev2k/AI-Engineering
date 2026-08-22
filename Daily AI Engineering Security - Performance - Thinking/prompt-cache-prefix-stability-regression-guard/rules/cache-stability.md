# Rule — Cache Stability

1. Performance changes MUST begin with a measured baseline from equivalent representative tasks.
2. Request assembly MUST classify components as stable, conditionally stable, or volatile when prompt caching is relied upon.
3. Semantically stable tool schemas SHOULD use deterministic registration order and canonical serialization.
4. Volatile values such as timestamps, random IDs, request IDs, and session-local counters SHOULD NOT appear before cacheable static content unless required for correctness.
5. Cache optimization MUST NOT remove system policy, authorization context, security constraints, task-critical evidence, or user-required context.
6. Provider cache metrics MUST be labeled as measured only when returned by the provider or a verified local runtime; estimates MUST be labeled estimates.
7. A changed stable-prefix fingerprint MUST be explained before a cache-related performance change is accepted.
8. Tool-schema size regressions above the configured threshold MUST block completion unless explicitly justified by required new capability.
9. Cache-hit improvements MUST NOT be claimed from lower input size alone.
10. Before/after comparisons SHOULD use the same model/provider/settings, workload, and cache TTL window where applicable.
11. Context compaction MUST be evaluated for both token reduction and prefix-cache invalidation effects.
12. Optimizations that change outputs materially MUST pass task-quality and security regression fixtures.
13. If a provider has minimum cacheable-token thresholds, cache placement SHOULD respect them; otherwise cache-zero behavior MUST NOT be misdiagnosed as prefix instability.
14. Retry loops MUST be bounded to two optimization attempts per hypothesis.
15. Failure to improve cache behavior MUST NOT be hidden by weakening correctness or security requirements.
