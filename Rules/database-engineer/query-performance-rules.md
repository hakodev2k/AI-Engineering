# Query Performance Rules
## Purpose
Diagnose and improve database workload performance using evidence.
## Scope
SQL, query plans, cardinality, statistics, scans, joins, sorts, and regressions.
## MUST
- Capture representative runtime evidence and execution plans before significant optimization.
- Identify the dominant bottleneck before changing SQL, indexes, schema, or configuration.
- Compare before/after latency, resource use, and result correctness.
## MUST NOT
- Claim an optimization from intuition alone.
- Optimize a synthetic query while ignoring production parameter distributions or concurrency.
## SHOULD
- Prefer changes that improve the target workload without destabilizing other important workloads.
## Exceptions
Incident mitigations may precede full analysis but require retrospective validation.
## Verification
Compare plans, logical reads, CPU, duration, waits, throughput, and correctness tests.