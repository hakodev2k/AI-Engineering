# Parallel Tool Execution Rules

1. Parallelism changes **MUST** have a measured concurrency-1 baseline.
2. Every parallel batch **MUST** record expected tool-call IDs and delivered result IDs.
3. A batch **MUST NOT** be considered successful when any expected result is missing, even if all external tool executions completed.
4. Production concurrency **MUST NOT** exceed the highest level verified against the configured integrity SLO.
5. Prompt guidance **MUST NOT** be the sole mechanism enforcing a concurrency cap.
6. Unknown state-mutating tools **MUST** default to sequential execution unless conflict safety is proven.
7. Incomplete mutating batches **MUST NOT** be blindly replayed; idempotency/side-effect evidence is required.
8. Performance claims **MUST** include before/after p95 latency and result completeness.
9. Concurrency tuning **SHOULD** be repeated after executor, provider, transport, or toolchain changes.
10. Recovery loops **MUST** be bounded: at most one lower-concurrency retry before serial fallback/escalation.
11. Security and human-approval gates **MUST NOT** be weakened to increase throughput.
12. The implementer **MUST NOT** be the sole verifier of a production concurrency increase.