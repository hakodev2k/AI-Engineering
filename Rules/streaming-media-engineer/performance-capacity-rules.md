# Performance and Capacity Rules

## Purpose
Keep streaming workloads within explicit latency, throughput, compute, memory, accelerator, network, and storage budgets.

## Scope
Transcoders, packagers, origins, control services, accelerators, network paths, and capacity planning.

## MUST
- Capacity models MUST use measured workload characteristics and include peak concurrency, burst behavior, failover headroom, and media-profile mix.
- Performance changes MUST include before/after evidence under representative load.
- Resource limits and saturation behavior MUST be observable for CPU, memory, accelerator, disk, and network bottlenecks relevant to each component.
- Admission control or load shedding MUST protect critical paths when finite resources are exhausted.

## MUST NOT
- MUST NOT size production solely from average traffic.
- MUST NOT claim optimization from microbenchmarks when end-to-end constraints dominate.
- MUST NOT allow untrusted media parameters to request unbounded compute or memory.

## SHOULD
- Cost per processed or delivered media unit SHOULD be tracked alongside technical capacity.
- Headroom SHOULD reflect recovery and maintenance scenarios, not only steady state.

## Exceptions
Temporary reduced headroom requires documented duration, risk, monitoring, and approval.

## Verification
Use load tests, resource profiles, saturation tests, capacity forecasts, production metrics, and failover-capacity exercises.