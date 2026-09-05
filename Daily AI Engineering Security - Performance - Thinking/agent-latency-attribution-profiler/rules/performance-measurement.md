# Performance Measurement Rules

1. Optimization **MUST** start with a reproducible baseline.
2. Lifecycle **MUST** separate approval, dispatch/queue, execution, result propagation, and resume overhead when present.
3. Approval wait **MUST NOT** be called tool execution time.
4. Security approval **MUST NOT** be weakened for latency.
5. Missing timestamps **MUST** reduce coverage and **MUST NOT** be imputed as zero.
6. Claims **MUST** state sample count and p50/p95 where feasible.
7. Before/after runs **MUST** use equivalent workload/environment/correctness criteria.
8. Improvement **MUST NOT** be claimed if delay shifts phases or failures increase.
9. Trace payloads **MUST NOT** contain secrets; sensitive payloads **SHOULD** be omitted.
10. Optimization loops **MUST** be bounded to at most two iterations.
11. Implementer **SHOULD NOT** be sole verifier of material claims.
12. Unknown attribution **MUST** remain unknown, not guessed.