# Concurrency and Contention Rules
## Purpose
Prevent concurrency limits, locks, and shared resources from collapsing throughput.
## Scope
Threads, tasks, locks, pools, queues, connection limits, and shared state.
## MUST
- Measure contention, queueing, pool exhaustion, and concurrency limits under load.
- Bound concurrency where downstream resources have finite capacity.
- Validate correctness when changing synchronization for performance.
## MUST NOT
- Remove synchronization merely to improve benchmark numbers.
- Increase concurrency blindly when the bottleneck is a saturated dependency.
## SHOULD
- Prefer backpressure and explicit capacity limits over uncontrolled fan-out.
## Exceptions
Unbounded concurrency requires evidence of safety and an approved rationale.
## Verification
Inspect profiles, wait metrics, pool telemetry, load tests, race tests, and configuration.