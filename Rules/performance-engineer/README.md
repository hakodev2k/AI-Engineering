# Performance Engineer Rules

Standalone, tool-neutral constraints for AI-assisted work in this discipline. Each rule file can be copied independently; this index and sibling rules are optional navigation, not runtime dependencies.

## How to use

1. Select only the rule files relevant to the requested change and its risk.
2. Apply them with the target repository policy, explicit authorization, and the stricter safety requirement.
3. Convert important constraints into target-repository checks when deterministic enforcement is needed.
4. Keep production, destructive, privileged, financial, or externally visible actions behind the target environment's approval process.

## Rule catalogue

- [Benchmark Design Rules](benchmark-design-rules.md)
- [Cache Performance Rules](cache-performance-rules.md)
- [Concurrency and Contention Rules](concurrency-contention-rules.md)
- [Cost Efficiency Rules](cost-efficiency-rules.md)
- [CPU and Memory Rules](cpu-memory-rules.md)
- [Database Performance Rules](database-performance-rules.md)
- [Distributed Systems Performance Rules](distributed-systems-rules.md)
- [Environment Fidelity Rules](environment-fidelity-rules.md)
- [Latency Rules](latency-rules.md)
- [Load Test Rules](load-test-rules.md)
- [Network and I/O Rules](network-io-rules.md)
- [Performance Observability Rules](observability-rules.md)
- [Optimization Decision Rules](optimization-decision-rules.md)
- [Performance Requirements Rules](performance-requirements-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Profiling Rules](profiling-rules.md)
- [Performance Regression Rules](regression-rules.md)
- [Release Performance Validation Rules](release-validation-rules.md)
- [Performance Root Cause Analysis Rules](root-cause-analysis-rules.md)
- [Scalability Rules](scalability-rules.md)
- [Performance Test Data Rules](test-data-rules.md)
- [Throughput and Capacity Rules](throughput-capacity-rules.md)

## Adoption note

Rules guide behavior but do not grant access, authority, or approval. Use the target repository's policy for ownership, secrets, and external actions.

