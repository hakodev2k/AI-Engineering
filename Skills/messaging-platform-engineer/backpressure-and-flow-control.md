# Backpressure and Flow Control

## Purpose
Protect brokers, consumers, and downstream services from overload by designing explicit flow-control and admission behavior.

## When to use
Use when lag grows during spikes, producers overwhelm broker buffers, consumers saturate dependencies, or workloads need burst tolerance.

## Inputs
- Peak and sustained message rates
- Consumer service times
- Queue/lag tolerance
- Downstream capacity
- Broker quota and flow-control capabilities

## Context to inspect
Inspect producer buffers, broker quotas, queue depths, consumer prefetch/fetch settings, autoscaling rules, dependency saturation, and overload history.

## Core knowledge
Backpressure is end-to-end. Senior engineers should understand Little's Law, queue buildup, bounded buffers, credit/prefetch systems, producer throttling, rate limits, admission control, and load shedding.

## Procedure
1. Measure sustainable processing rate and burst profile.
2. Define acceptable queue depth or lag and recovery time.
3. Bound producer and consumer buffers.
4. Configure broker quotas or flow control per tenant/workload.
5. Tune prefetch/fetch sizes to avoid hoarding work.
6. Propagate overload signals to producers when possible.
7. Autoscale consumers only within downstream capacity limits.
8. Define shedding or rejection behavior for disposable traffic.
9. Alert on sustained growth rate, not only absolute depth.
10. Load test recovery after overload.

## Decision points
Buffer short bursts when delayed processing is acceptable. Throttle or reject when backlog threatens SLOs, retention, or downstream stability.

## Common failure patterns
- Unbounded producer memory queues
- Autoscaling consumers until the database fails
- Huge prefetch causing unfairness
- Measuring only current lag, not lag growth
- No plan for traffic exceeding physical capacity

## Verification
Run burst and sustained overload tests, verify memory remains bounded, observe throttling, and confirm backlog drains within the target recovery window.

## Expected output
An overload-control design with quotas, buffer limits, scaling constraints, alerts, and recovery targets.

## Stop conditions
Stop when sustainable service rate is unknown, overload policy conflicts with business loss tolerance, or downstream capacity cannot be measured.