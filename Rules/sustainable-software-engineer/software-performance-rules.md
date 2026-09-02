# Software Performance Rules

## Purpose
Treat performance efficiency as a sustainability control while preserving correctness and maintainability.

## Scope
Applies to application code, algorithms, database access, serialization, caching, concurrency, and runtime configuration.

## MUST
- Performance optimization MUST begin from a measured bottleneck or material recurring cost.
- Before/after comparisons MUST use representative workloads and record latency, throughput, resource use, and error behavior relevant to the change.
- Optimizations MUST preserve functional correctness, security controls, and required compatibility.

## MUST NOT
- MUST NOT introduce opaque complexity for speculative micro-optimizations.
- MUST NOT claim sustainability benefit from faster execution when total resource consumption was not evaluated.
- MUST NOT hide degraded tail latency or error rates behind improved averages.

## SHOULD
- Prefer algorithmic and I/O reductions before low-level tuning when they provide equivalent benefit.
- Remove redundant computation and unnecessary materialization on high-volume paths.

## Exceptions
Exceptions require the measured constraint, expected benefit, complexity cost, alternative considered, and regression evidence.

## Verification
Use profilers, benchmarks, load tests, query evidence, runtime metrics, regression tests, and code review to validate the optimization and its operational trade-offs.
