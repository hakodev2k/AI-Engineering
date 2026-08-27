# GPU Profiling Rules

## Purpose
Ensure optimization targets observed bottlenecks rather than assumptions.

## Scope
Kernel, runtime, memory, interconnect, CPU/GPU overlap, and end-to-end profiling.

## MUST
- Material optimization work MUST begin from a measured bottleneck or explicitly bounded hypothesis.
- Profiling MUST use representative workload phases and configurations.
- Kernel analysis MUST consider occupancy, memory behavior, launch overhead, stalls, and achieved utilization as relevant.
- End-to-end analysis MUST include CPU scheduling, transfers, synchronization, and queueing where they contribute.
- Profiling overhead and instrumentation effects MUST be considered before conclusions are accepted.

## MUST NOT
- MUST NOT optimize solely from source inspection when runtime evidence is available.
- MUST NOT generalize one shape, batch size, or device result to materially different workloads without validation.

## SHOULD
- Preserve profiler captures for significant decisions.
- Correlate low-level metrics with user-facing latency or throughput.

## Exceptions
Early design estimates may use analytical models, but production conclusions require runtime evidence.

## Verification
Review profiler traces, metric definitions, workload metadata, bottleneck hypotheses, and post-change measurements.