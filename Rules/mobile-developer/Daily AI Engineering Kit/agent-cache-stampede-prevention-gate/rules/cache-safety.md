# Cache Stampede Safety Rules

## MUST
- Identify the exact cache-key scope and regeneration function before modifying behavior.
- Measure backend invocation count during concurrent misses and expiry boundaries.
- Bound regeneration concurrency per logical key or prove an equivalent mechanism.
- Test backend failure behavior and ensure retries remain bounded.
- Preserve evidence for load parameters, backend call counts, latency, and failures.
- Require explicit approval for production cache flushes, production config/deployment, infrastructure changes, schema changes, secrets, or data deletion.
- Record remaining risks in the final assessment.

## MUST NOT
- Flush or mass-invalidate production caches to reproduce a stampede without explicit approval.
- Add a global lock for unrelated cache keys when a narrower per-key mechanism is sufficient.
- Treat a cache hit-rate improvement as proof that stampede risk is removed.
- Add unbounded retries around cache regeneration.
- Hide backend load by weakening tests or omitting failed requests from metrics.
- Cache sensitive data beyond existing policy or log sensitive cached values.

## SHOULD
- Prefer per-key single-flight/request coalescing for hot keys.
- Add TTL jitter or equivalent expiry spreading when many entries expire together.
- Consider stale-while-revalidate or stale-on-error when business semantics permit it.
- Use bounded timeouts/cancellation around backend regeneration.
- Emit metrics for cache hit/miss, regeneration count, concurrent regeneration, latency, stale serve, and failures.
- Keep mitigations local to the affected cache path unless evidence supports broader change.
