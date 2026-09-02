# Capacity and Scaling Rules

## Purpose
Prevent resource exhaustion and unsafe scaling behavior in production systems.

## Scope
Applies to compute, storage, queues, databases, network resources, quotas, and scaling policies.

## MUST
- Capacity planning MUST use observed workload, growth, saturation, and failure characteristics rather than nominal limits alone.
- Critical resources MUST have defined headroom or scaling triggers appropriate to provisioning latency.
- Scaling changes MUST account for downstream dependency capacity and quota constraints.
- Forecasts for high-impact systems MUST be reviewed before known traffic events or major launches.

## MUST NOT
- MUST NOT assume autoscaling eliminates capacity planning.
- MUST NOT increase concurrency or replicas without evaluating downstream amplification risk.
- MUST NOT claim capacity sufficiency without current measurement.

## SHOULD
- Test scaling behavior under representative load and failure conditions.
- Track resource saturation trends and time-to-exhaustion.

## Exceptions
Exceptions require documented workload assumptions, risk, compensating controls, and owner approval.

## Verification
Inspect utilization history, scaling policies, quota data, load tests, forecasts, and dependency capacity evidence.
