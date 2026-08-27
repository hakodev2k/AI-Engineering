# Overload and Load Shedding Rules

## Purpose
Keep systems controllable under excess demand and prevent saturation from becoming total failure.

## Scope
Applies to request-serving systems, queues, workers, databases, caches, gateways, and shared infrastructure.

## MUST
- Critical services MUST define saturation signals and safe operating limits for their constrained resources.
- Systems MUST reject, defer, or degrade work before resource exhaustion makes recovery unreliable.
- Load shedding MUST prioritize critical traffic using explicit, reviewable criteria when workloads have different business importance.
- Admission control MUST account for work cost where requests differ materially in resource consumption.
- Overload behavior MUST be tested at and beyond expected peak demand.

## MUST NOT
- MUST NOT accept unlimited queued work when processing capacity is bounded.
- MUST NOT shed health, recovery, or control traffic in a way that prevents stabilization unless an alternative recovery channel exists.
- MUST NOT rely solely on autoscaling when scaling latency is longer than overload onset.

## SHOULD
- Services SHOULD expose backpressure to upstream callers where protocols permit.
- Capacity margins SHOULD account for failover and maintenance conditions, not only steady-state averages.

## Exceptions
Unbounded intake is permitted only when an external durable system demonstrably provides the necessary capacity and backpressure, with documented limits.

## Verification
Run overload and burst tests, inspect queue depth and resource saturation, confirm priority behavior, and demonstrate that latency and error rates recover after excess load is removed.