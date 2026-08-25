# Performance and Capacity Rules
## Purpose
Protect control quality and autonomy from compute, memory, bandwidth, and thermal exhaustion.
## Scope
CPU/GPU, memory, storage, network, accelerator, thermal, and energy capacity.
## MUST
- Define budgets for critical latency, throughput, memory, bandwidth, storage, and thermal resources.
- Measure performance on representative robot hardware and workloads.
- Characterize overload behavior and preserve resources for safety/control-critical functions.
- Support performance claims with before/after evidence under comparable conditions.
## MUST NOT
- Infer real-time or field performance solely from developer workstations.
- Accept unbounded memory, queue, log, or storage growth in long-running robot processes.
## SHOULD
- Maintain production headroom for workload variability, aging, and environmental effects.
## Exceptions
Budget overruns require impact analysis, mitigation, owner, and evidence that critical behavior remains within limits.
## Verification
Use profiling, soak tests, resource telemetry, thermal tests, latency distributions, bandwidth tests, and regression thresholds.