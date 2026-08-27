# Capacity and Scalability Rules

## Purpose
Ensure GPU capacity decisions survive peak demand, memory pressure, contention, and realistic scaling limits.

## Scope
Fleet sizing, concurrency, headroom, admission, scale-out, and growth forecasts.

## MUST
- Capacity models MUST use representative demand distributions and measured service capacity.
- GPU memory, compute, interconnect, CPU feeding, and storage/input pipelines MUST be considered as potential constraints.
- Headroom MUST be defined for failure recovery, demand bursts, and rollout overlap.
- Scale-out assumptions MUST be validated with measured efficiency at relevant device counts.
- Capacity exhaustion MUST have explicit admission or degradation behavior.

## MUST NOT
- MUST NOT size production solely from average utilization.
- MUST NOT assume compute is the bottleneck without evidence.
- MUST NOT count unhealthy or maintenance-bound devices as reliable capacity.

## SHOULD
- Forecast capacity using workload mix rather than only aggregate request count.
- Track fragmentation and stranded accelerator capacity.

## Exceptions
Temporary reduced headroom requires owner, expiry, risk assessment, monitoring, and approval.

## Verification
Review load tests, scaling curves, demand forecasts, saturation telemetry, failure scenarios, and admission-control tests.