# Autoscaling and Load Balancing

## Purpose
Distribute traffic safely and adapt capacity to demand without causing instability or dependency overload.

## When to use
Use for variable workloads, horizontal scaling, multi-zone services, and traffic growth.

## Inputs
Traffic shape, request cost, startup time, health behavior, capacity limits, SLOs.

## Context to inspect
Load balancers, target groups, health checks, scaling policies, queues, cooldowns, connection behavior, downstream limits.

## Core knowledge
Good scaling signals correlate with work and saturation. Scaling has delay; load balancers need meaningful health and draining behavior.

## Procedure
1. Quantify capacity per instance/task.
2. Choose load-balancing algorithm and health criteria.
3. Configure connection draining and graceful shutdown.
4. Select scaling metrics tied to demand or backlog.
5. Set minimum capacity for resilience and startup lag.
6. Bound maximum capacity by downstream safety and quotas.
7. Tune cooldown/stabilization windows.
8. Test burst, slow ramp, and scale-in behavior.
9. Monitor rejected requests and unhealthy targets.

## Decision points
Use queue depth for asynchronous workers; request rate or concurrency often works better than CPU for request services when request cost is predictable.

## Common failure patterns
CPU-only scaling for I/O workloads, aggressive scale-in, shallow health checks, no warm-up allowance, and unlimited scaling against fixed databases.

## Verification
Load-test scaling transitions and confirm no unacceptable error spikes or dependency saturation.

## Expected output
Stable load distribution and bounded elastic capacity.

## Stop conditions
Escalate when workload state prevents safe horizontal scaling or dependencies cannot absorb target capacity.