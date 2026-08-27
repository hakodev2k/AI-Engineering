# Performance

## Purpose
Optimize firmware using measured bottlenecks while preserving correctness.

## Scope
CPU cycles, latency, throughput, memory, bus traffic, and peripheral utilization.

## MUST
- Performance requirements MUST define representative workload and measurement method.
- Claimed improvements MUST include comparable before/after measurements.
- Optimization of critical code MUST preserve timing, concurrency, and numerical correctness.
- Worst-case paths MUST be evaluated when deadlines or buffer capacity depend on performance.

## MUST NOT
- Readability, safety checks, or synchronization MUST NOT be removed solely on assumed performance benefit.
- Microbenchmarks MUST NOT be generalized to system performance without validating system effects.

## SHOULD
- Profiling SHOULD precede nontrivial optimization.
- Hardware accelerators and DMA SHOULD be evaluated when they reduce deterministic load without unacceptable complexity.

## Exceptions
Measurement may be waived only when infeasible, with explicit rationale and conservative analysis.

## Verification
Use cycle counters, traces, profilers, bus analyzers, benchmarks, and production-build measurements.