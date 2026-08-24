# Capacity and Scaling
## Purpose
Ensure edge capacity matches local demand despite uneven site utilization.
## Scope
Compute, storage, bandwidth, sessions, queues, and accelerator capacity.
## MUST
- Capacity plans MUST use representative peak and growth evidence per site class.
- Saturation thresholds MUST be observable before service objectives fail.
- Scaling strategy MUST account for hardware lead time and disconnected sites.
## MUST NOT
- MUST NOT extrapolate fleet capacity solely from average utilization.
- MUST NOT rely on cloud-style instant elasticity where physical capacity is fixed.
## SHOULD
- Capacity models SHOULD include failure and maintenance headroom.
## Exceptions
Running above target utilization requires bounded duration, mitigation, and risk acceptance.
## Verification
Review forecasts, percentiles, stress tests, queue behavior, saturation alerts, and hardware inventory.