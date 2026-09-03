# Concurrency and Backpressure Rules

## Purpose
Prevent overload, queue collapse, and unfair resource contention.

## Scope
Applies to request admission, worker concurrency, queues, streams, and accelerator scheduling.

## MUST
- Set explicit concurrency and queue limits per serving tier or model class.
- Reject or shed excess load predictably when safe capacity is exhausted.
- Propagate cancellation so abandoned work releases resources promptly.
- Measure queue depth, wait time, active work, and rejection rates.

## MUST NOT
- Use unbounded queues for inference work.
- Increase concurrency without validating memory pressure and tail latency.
- Hide overload through indefinite retries or client hangs.

## SHOULD
- Prefer admission control close to the resource bottleneck.
- Apply differentiated limits when workloads have materially different costs.

## Exceptions
Exceptions require bounded duration, explicit capacity evidence, monitoring, and rollback criteria.

## Verification
Inspect queue configuration, concurrency settings, overload tests, cancellation tests, and saturation metrics.