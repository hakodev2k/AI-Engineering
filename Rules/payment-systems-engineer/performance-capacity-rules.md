# Payment Performance and Capacity Rules

## Purpose
Maintain payment throughput and latency without sacrificing financial correctness.

## Scope
Payment APIs, queues, provider calls, persistence, reconciliation, and batch settlement processing.

## MUST
- Performance objectives MUST distinguish customer-facing latency from asynchronous completion time.
- Capacity estimates MUST account for retries, webhook bursts, settlement batches, promotions, and provider degradation.
- Performance changes MUST be supported by before/after measurements under representative workload.
- Backpressure MUST prevent overload from causing uncontrolled retries or duplicate financial effects.
- Queue age, saturation, provider latency, database contention, and error rate MUST be observable for critical paths.

## MUST NOT
- MUST NOT trade away idempotency, durability, validation, or audit logging solely to reduce latency.
- MUST NOT claim scalability from average-load testing alone.
- MUST NOT allow unbounded queues or worker concurrency where downstream systems have finite capacity.

## SHOULD
- Capacity tests SHOULD include degraded provider and database scenarios.

## Exceptions
Exceptions require measured evidence, risk analysis, and rollback criteria.

## Verification
Review load tests, latency percentiles, saturation metrics, retry amplification, queue behavior, and capacity headroom.