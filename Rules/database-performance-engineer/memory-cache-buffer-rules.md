# Memory, Cache, and Buffer Rules
## Purpose
Use memory deliberately without hiding underlying inefficiency or causing eviction pressure.
## Scope
Database buffer caches, plan caches, application-side database caches, and memory grants.
## MUST
- Correlate cache hit behavior with latency, I/O, memory pressure, and workload characteristics.
- Investigate spills, excessive grants, and eviction patterns on critical workloads.
- Validate cache sizing changes under representative steady and burst conditions.
## MUST NOT
- Treat cache-hit ratio alone as proof of healthy performance.
- Allocate memory beyond documented host or service safety limits without approval.
## SHOULD
- Separate reusable cache policy from workload-specific exceptions.
## Exceptions
Short-lived emergency resizing requires capacity evidence, rollback criteria, and operational approval.
## Verification
Review memory telemetry, cache metrics, spill evidence, eviction rates, configuration, and benchmark results.