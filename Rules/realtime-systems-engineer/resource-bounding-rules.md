# Resource Bounding Rules

## Purpose
Ensure finite resources cannot create unbounded latency or cascading failure.

## Scope
Queues, buffers, descriptors, connections, task counts, files, sockets, and device resources.

## MUST
- Every resource consumed by real-time work MUST have an explicit capacity or admission policy.
- Queue depth and buffer sizing MUST be derived from burst, service-rate, and deadline assumptions.
- Exhaustion behavior MUST be deterministic and preserve higher-criticality work where applicable.
- Capacity assumptions MUST be monitored in production or representative operation.

## MUST NOT
- MUST NOT use unbounded queues on latency-critical paths.
- MUST NOT allow lower-criticality traffic to consume resources reserved for critical functions without an explicit policy.

## SHOULD
- Prefer backpressure, admission control, and bounded shedding over uncontrolled accumulation.

## Exceptions
Exceptions require evidence that the resource is externally bounded and cannot violate timing or safety constraints.

## Verification
Inspect configuration, code-level limits, overload tests, resource telemetry, and failure-mode behavior.