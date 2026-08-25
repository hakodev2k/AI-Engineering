# Performance Benchmark Rules
## Purpose
Require defensible evidence for PostgreSQL performance decisions.
## Scope
Latency, throughput, resource use, load tests, and tuning claims.
## MUST
- Define workload, dataset, concurrency, warmup, measurement window, and success criteria before comparative tests.
- Report before/after distributions and resource effects for claimed improvements.
- Test at representative data scale when scale affects plans or storage behavior.
## MUST NOT
- Claim improvement from one run, planner cost alone, or non-comparable environments.
## SHOULD
- Preserve benchmark scripts and environmental metadata for repeatability.
## Exceptions
Exploratory measurements may guide hypotheses but must not be presented as production proof.
## Verification
Re-run benchmarks, compare p50/p95/p99 and throughput, inspect CPU/I/O/memory, and confirm semantic equivalence.