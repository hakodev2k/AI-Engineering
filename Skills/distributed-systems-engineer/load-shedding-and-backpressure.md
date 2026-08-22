# Load Shedding and Backpressure

## Purpose
Keep systems stable under overload by controlling admission, concurrency, queue growth, and producer pressure.

## When to use
Use for high-throughput APIs, queues, streams, fan-out services, expensive workloads, and systems with bursty traffic.

## Inputs
Capacity measurements, queueing behavior, latency SLOs, workload priorities, concurrency limits, and traffic patterns.

## Context to inspect
Inspect queues, thread/task pools, connection pools, autoscaling signals, rate limits, retry behavior, and downstream bottlenecks.

## Core knowledge
Once utilization approaches saturation, queues and tail latency can grow rapidly. Unlimited buffering converts overload into delayed failure. Stable systems reject or slow work before resource exhaustion.

## Procedure
1. Measure sustainable capacity and bottleneck resources.
2. Define overload signals before hard exhaustion.
3. Bound queues and concurrency.
4. Prioritize critical traffic where justified.
5. Apply admission control, rate limiting, or load shedding.
6. Propagate backpressure to producers when protocols support it.
7. Define retry-after or delayed-redelivery semantics.
8. Coordinate with autoscaling but do not rely on scaling alone.
9. Instrument saturation, queue age, rejection, and retry amplification.
10. Run overload and recovery tests.

## Decision points
Reject early when accepting work would violate deadlines or destabilize the service. Queue only when work remains valuable after waiting and queue capacity is bounded.

## Common failure patterns
Unbounded queues, retrying rejected work immediately, scaling on CPU alone, and treating all traffic as equal priority.

## Verification
Drive load beyond capacity and prove bounded memory, bounded queue age, controlled rejection, and fast recovery when load falls.

## Expected output
An overload-control policy with limits, prioritization, client behavior, and telemetry.

## Stop conditions
Escalate when business owners have not defined which work may be rejected or delayed.