# Capacity and Sizing Rules

## Purpose
Size GPU deployments using measured demand, headroom, and failure scenarios.

## Scope
GPU count, memory capacity, concurrency, quotas, autoscaling inputs, and growth planning.

## MUST
- Capacity plans MUST use representative workload demand and measured per-device throughput or latency.
- Memory sizing MUST include peak model, workspace, cache, fragmentation, and concurrency requirements.
- Critical services MUST reserve headroom for defined failure and traffic-spike scenarios.
- Scale-out decisions MUST account for communication overhead and diminishing efficiency.
- Capacity assumptions MUST be revisited after material model, sequence-length, batch, or software changes.

## MUST NOT
- MUST NOT size fleets from theoretical peak FLOPS alone.
- MUST NOT rely on emergency quota increases as normal operating capacity.
- MUST NOT assume linear throughput scaling across additional GPUs without measurement.

## SHOULD
- SHOULD maintain workload-specific saturation curves.
- SHOULD forecast capacity using meaningful growth and failure scenarios.

## Exceptions
Reduced headroom requires documented risk, duration, mitigation, and owner approval.

## Verification
Review load tests, memory measurements, saturation curves, quota dashboards, and capacity forecasts.