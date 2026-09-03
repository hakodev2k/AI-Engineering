# Throughput and Capacity Rules

## Purpose
Ensure serving capacity is based on measured demand and bottleneck behavior.

## Scope
Applies to request throughput, token throughput, replicas, accelerators, and capacity headroom.

## MUST
- Capacity-plan from representative peak demand, concurrency, sequence lengths, and failure scenarios.
- Identify the limiting resource before scaling recommendations are made.
- Maintain explicit safety headroom for traffic variation and replica loss.
- Revalidate capacity after model, hardware, runtime, or batching changes.

## MUST NOT
- Size production solely from synthetic single-request benchmarks.
- Assume linear scaling across replicas or accelerators without measurement.
- Operate sustained production demand at known saturation thresholds without approved risk acceptance.

## SHOULD
- Forecast capacity using workload distributions rather than averages alone.
- Track tokens, requests, utilization, and queueing together.

## Exceptions
Reduced headroom requires documented duration, business rationale, monitoring, fallback actions, and approval.

## Verification
Review load tests, saturation curves, production utilization, headroom calculations, and failure-capacity exercises.