# Load Shedding and Backpressure

## Purpose
Protect critical service capacity during overload by rejecting, delaying, or degrading lower-priority work before saturation causes broad failure.

## When to use
Use for bursty traffic, queue-based systems, fan-out services, overloaded dependencies, or repeated saturation incidents.

## Inputs
Traffic classes, capacity limits, queue behavior, SLOs, retry behavior, request priorities, and degradation options.

## Preconditions
Critical and non-critical work must be distinguishable enough to apply policy safely.

## Context to inspect
Ingress rate limits, worker concurrency, queues, thread pools, connection pools, retry policies, autoscaling delay, and upstream/downstream feedback.

## Core knowledge
Systems degrade nonlinearly near saturation. Backpressure slows producers; load shedding rejects work that cannot be served reliably. Protecting bounded capacity often yields better user outcomes than attempting every request and timing out all of them.

## Procedure
1. Identify saturation points and maximum sustainable throughput.
2. Classify requests or jobs by priority and cost.
3. Establish queue and concurrency limits.
4. Define admission control before critical resources saturate.
5. Shed low-priority or excess load with explicit responses.
6. Prevent clients from immediately retrying rejected work.
7. Apply backpressure to producers when protocols allow it.
8. Preserve capacity for health, recovery, and high-value paths.
9. Test overload and recovery behavior.
10. Monitor shed rate, queue age, saturation, and user impact.

## Decision points
Reject synchronously when work cannot be completed within its deadline. Buffer asynchronously only when bounded queues and freshness requirements permit it. Prefer priority-aware shedding when workload value differs materially.

## Common failure patterns
Unbounded queues, accepting work that will inevitably time out, retry storms after rejection, shedding health checks, and protecting one tier while overwhelming another.

## Verification
Load beyond expected peak and confirm critical paths remain within SLO, resources stay bounded, rejection is explicit, and recovery occurs without backlog collapse.

## Expected output
Capacity limits, admission policy, backpressure behavior, overload tests, and operational metrics.

## Stop conditions
Escalate when business priorities are undefined, rejected work can cause unsafe data loss, or protocol constraints prevent reliable overload signaling.