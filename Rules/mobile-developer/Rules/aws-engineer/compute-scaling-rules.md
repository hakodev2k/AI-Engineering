# Compute and Scaling Rules
## Purpose
Match compute capacity and scaling behavior to measured workload demand.
## Scope
EC2, Auto Scaling, load balancing, instance families, capacity, and scaling policies.
## MUST
- Base instance and scaling choices on workload metrics, failure behavior, and capacity objectives.
- Define minimum safe capacity and maximum scaling limits for production workloads.
- Test scale-out and scale-in behavior, including startup time and connection draining.
- Protect critical state from ephemeral compute lifecycle assumptions.
## MUST NOT
- Claim a workload scales because Auto Scaling is enabled without validating bottlenecks and dependencies.
- Scale solely on average CPU when it does not represent demand or saturation.
## SHOULD
- Prefer immutable replacement over in-place mutation for repeatable fleets.
## Exceptions
Fixed-capacity designs require documented demand bounds and recovery approach.
## Verification
Inspect launch templates, scaling policies, load tests, saturation metrics, health checks, draining behavior, and capacity events.