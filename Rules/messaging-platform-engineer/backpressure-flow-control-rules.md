# Backpressure and Flow-Control Rules

## Purpose
Prevent slow consumers or bursty producers from causing unbounded queues, memory exhaustion, or cascading failure.

## Scope
Client buffers, broker quotas, consumer concurrency, queue depth, admission control, and load shedding.

## MUST
- Every high-volume flow MUST define bounded buffering and overload behavior.
- Consumer concurrency MUST be limited by downstream capacity, not broker availability alone.
- Queue depth, processing rate, and age of oldest work MUST be observable where applicable.
- Backpressure MUST propagate or shed work predictably when downstream capacity is exhausted.

## MUST NOT
- MUST NOT allow unbounded in-memory buffering.
- MUST NOT increase consumer concurrency without checking downstream saturation and ordering requirements.
- MUST NOT hide persistent backlog behind larger queues as the only remediation.

## SHOULD
- Use quotas, admission control, or rate limits to preserve critical traffic classes.

## Exceptions
Temporary buffer expansion requires capacity evidence, expiry, monitoring, and owner.

## Verification
Inspect buffer limits, load tests, saturation metrics, queue age, and overload behavior.