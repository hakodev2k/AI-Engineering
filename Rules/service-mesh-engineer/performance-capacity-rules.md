# Performance and Capacity
## Purpose
Bound mesh overhead and protect latency and throughput objectives.
## Scope
Proxy CPU, memory, connections, TLS, telemetry, gateways, and control-plane capacity.
## MUST
- Performance claims MUST use before/after measurements under representative load.
- Capacity plans MUST include peak traffic, failure redistribution, and telemetry overhead.
- Resource saturation thresholds MUST be monitored for critical mesh components.
## MUST NOT
- MUST NOT optimize from intuition alone when measurable evidence is available.
- MUST NOT remove security controls solely for performance without security approval.
- MUST NOT ignore tail latency introduced by proxying or retries.
## SHOULD
- Benchmarks SHOULD separate application, network, and mesh overhead.
## Exceptions
Temporary capacity risk requires documented duration, monitoring, and rollback trigger.
## Verification
Use load tests, latency percentiles, CPU/memory profiles, connection metrics, and comparative benchmarks.