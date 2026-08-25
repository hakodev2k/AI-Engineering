# Capacity and Saturation Rules

## Purpose
Ensure the traffic tier and backend pools retain sufficient headroom and degrade predictably near limits.

## Scope
Throughput, concurrency, connection capacity, CPU, memory, bandwidth, queue depth, and backend pool sizing.

## MUST
- Capacity plans MUST identify the constraining resources and expected peak traffic, not only average load.
- Production pools MUST retain documented headroom for failures, deployments, and realistic demand spikes.
- Load-balancer capacity MUST include control-plane and data-plane limits, quotas, connection rates, and bandwidth.
- Saturation signals MUST be monitored before hard limits are reached.
- Capacity claims MUST be supported by measurements, provider limits, or load-test evidence.

## MUST NOT
- MUST NOT assume autoscaling is instantaneous or unlimited.
- MUST NOT size redundancy such that a single expected failure causes immediate saturation.
- MUST NOT raise limits blindly when the actual bottleneck is downstream.

## SHOULD
- Model N+1 or stronger failure capacity according to service criticality.
- Use realistic traffic distributions and connection behavior in tests.

## Exceptions
Lower headroom requires explicit risk acceptance, monitoring, and a recovery plan.

## Verification
Review peak metrics, quota usage, backend utilization, failover capacity, scaling latency, saturation alerts, and representative load tests.