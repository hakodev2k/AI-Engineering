# CPU and Memory Rules
## Purpose
Prevent compute and memory inefficiency from becoming latency or stability failures.
## Scope
CPU utilization, allocations, garbage collection, memory residency, leaks, and pressure.
## MUST
- Correlate CPU and memory changes with workload and latency.
- Investigate sustained high allocation, GC pressure, leaks, and CPU saturation using profiles or runtime evidence.
- Test memory behavior over sufficient duration for leak-sensitive systems.
## MUST NOT
- Infer a memory leak from high usage alone.
- Trade correctness or safety for micro-optimizations without measured benefit.
## SHOULD
- Track allocation rate and working set for critical workloads.
## Exceptions
Platform-managed memory requires platform-specific interpretation.
## Verification
Use runtime counters, heap/CPU profiles, GC telemetry, soak tests, and before/after measurements.