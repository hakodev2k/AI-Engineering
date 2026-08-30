# Performance Measurement Rules

1. Every optimization MUST start from a captured representative baseline.
2. End-to-end task latency MUST be measured in addition to component latency.
3. Reports MUST include p50 and p95 when sample size permits; averages alone MUST NOT justify an optimization claim.
4. Spans SHOULD classify `llm`, `tool`, `retrieval`, `sandbox`, `queue`, and `orchestration` separately.
5. External calls SHOULD have stable call keys so duplicate/retry behavior can be measured.
6. Retry count and retry-added latency MUST be reported separately from first-attempt latency.
7. A performance change MUST NOT be declared successful without a before/after replay on the same workload.
8. Quality/correctness MUST have an explicit floor; an optimization MUST NOT pass if it violates that floor.
9. Security checks, authorization, validation, human approvals, and required context MUST NOT be removed to improve latency.
10. Caches MUST preserve tenant/authorization boundaries and MUST define freshness/TTL semantics where results can change.
11. Optimization loops MUST be bounded to two attempts per hypothesis before re-evaluation.
12. The implementer SHOULD NOT be the only verifier of a material performance claim.
