# Resource Exhaustion Rules
## Purpose
Validate graceful behavior near CPU, memory, disk, connection, and quota limits.
## Scope
Compute and bounded resources.
## MUST
- Define safe ceilings and abort thresholds before stressing resources.
- Observe saturation, queueing, shedding, and recovery.
## MUST NOT
- Exhaust shared production resources without bounded targeting and approval.
- Infer capacity from a single synthetic run without workload context.
## SHOULD
- Combine experiments with capacity and autoscaling telemetry.
## Exceptions
Dedicated load environments may explore failure limits more aggressively.
## Verification
Review saturation metrics, limits, autoscaling, errors, and post-test recovery.