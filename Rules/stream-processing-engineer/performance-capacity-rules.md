# Performance and Capacity
## Purpose
Provide evidence-based throughput and latency engineering.
## Scope
CPU, memory, network, serialization, state, throughput, and latency.
## MUST
- Capacity decisions MUST use representative workload measurements including skew and bursts.
- Performance changes MUST report before/after throughput, latency percentiles, resource use, and test conditions.
- Headroom MUST be defined for expected growth and failure scenarios.
## MUST NOT
- Average latency alone MUST NOT justify production performance claims.
- Parallelism MUST NOT be increased blindly when bottlenecks are downstream or skew-driven.
## SHOULD
- Benchmarks SHOULD separate source, operator, state, network, and sink bottlenecks.
## Exceptions
Provisional sizing requires explicit assumptions and post-deployment validation.
## Verification
Run repeatable load tests and inspect percentiles, saturation, lag, GC/runtime behavior, and bottleneck evidence.