# Rules — Tool Schema Cache Stability

- Equivalent logical tool sets MUST serialize to the same canonical byte representation.
- Tool order MUST be derived from a documented stable identity, not discovery/insertion order.
- Nested JSON schema object keys MUST be serialized deterministically.
- Volatile request IDs, timestamps, session IDs, and metrics MUST NOT be inserted into cache-intended tool descriptions unless required for correctness.
- Required tools MUST NOT be removed solely to improve cache metrics.
- Performance changes MUST capture a baseline before optimization and a repeated after measurement.
- A cache optimization MUST NOT be reported as improved without lower uncached-token usage or latency on representative repeated workloads.
- Tool availability and tool-selection quality MUST remain within the accepted regression budget.
- Equivalent-input canonicalization tests MUST run in CI or another deterministic pre-release gate.
- Any intentional unstable field SHOULD be documented with its correctness rationale and expected cache impact.
