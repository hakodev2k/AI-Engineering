# Cache Continuity Rules

- Every model request with reusable context MUST record provider-reported input, cached-input, and cache-write counters when the provider exposes them.
- Reusable prompt segments MUST precede volatile task-specific segments when provider semantics reward common prefixes.
- Dynamic timestamps, request IDs, random values, and unordered collections MUST NOT be injected into a stable prefix unless correctness requires them.
- Structured stable segments SHOULD be canonicalized deterministically before fingerprinting.
- Cache keys and explicit breakpoints MUST be task/workspace scoped; they MUST NOT cross security or tenant boundaries.
- An optimization MUST NOT remove correctness-critical context merely to increase cache hit rate.
- A cache optimization MUST have a measured baseline and candidate comparison on the same representative fixtures.
- Result quality and critical-context retention MUST be verified together with token/cost/latency metrics.
- Aggregate cached-token counts MUST NOT be treated as proof of stable-prefix correctness.
- Sensitive prompt content MUST NOT be written to profiler logs by default; store hashes and safe metadata unless explicit policy permits content logging.
- Provider TTL assumptions MUST be configurable and MUST NOT be hard-coded as universal behavior.
- A regression exceeding configured thresholds MUST block a Verified status until explained or remediated.
