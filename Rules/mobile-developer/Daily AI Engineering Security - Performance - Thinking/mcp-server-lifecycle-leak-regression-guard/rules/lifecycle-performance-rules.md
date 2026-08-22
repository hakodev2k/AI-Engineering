# Lifecycle Performance Rules

- A stateless MCP request factory MUST return a fresh protocol-bearing server instance per request unless the SDK explicitly documents a different safe lifecycle.
- Server/transport instances MUST NOT be reused merely to reduce allocation cost when doing so violates SDK lifecycle or isolation guarantees.
- Expensive reusable dependencies such as DB pools, HTTP clients, caches, immutable configuration, and safe compiled application artifacts SHOULD live outside the per-request server factory.
- Every optimization MUST begin with a baseline containing request count, p95 latency, throughput or duration, heap samples, error rate, and teardown result.
- Load tests MUST include explicit teardown after the measured request volume; a green steady-state response rate is insufficient.
- Server-instance identity SHOULD be instrumented in test builds so accidental reuse is detectable.
- A duplicate server identity in a fresh-per-request factory MUST block release.
- Heap growth MUST be evaluated after warmup against a configured threshold; a single before/after heap value SHOULD NOT be treated as sufficient evidence when multiple samples are available.
- A `RangeError`, unhandled rejection, OOM, or failed teardown MUST block completion.
- Performance claims MUST include before/after measurements from the same workload and environment.
- Retries of a failing benchmark MUST be bounded to two reruns and MUST preserve the failing evidence.
- Thresholds MUST NOT be relaxed during verification without a documented requirement change and reviewer approval.
- The implementing agent MUST NOT be the only verifier for lifecycle changes that affect production serving.
- Security/isolation guarantees MUST NOT be weakened to improve throughput or heap metrics.