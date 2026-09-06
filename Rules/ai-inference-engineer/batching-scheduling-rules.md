# Batching and Scheduling Rules

## Purpose
Balance throughput, fairness, and latency when scheduling inference work.

## Scope
Dynamic batching, continuous batching, queueing, admission order, priority, cancellation, and scheduler policies.

## MUST
- Scheduler policies MUST define maximum queue delay and batch-size bounds for each latency-sensitive workload class.
- Batching changes MUST be evaluated against both throughput and tail-latency measurements.
- Priority scheduling MUST define starvation prevention or explicit starvation acceptance.
- Cancelled requests MUST release queued and accelerator resources promptly where technically possible.
- Batch construction MUST preserve request isolation and output-to-request mapping.

## MUST NOT
- MUST NOT maximize average throughput by violating documented latency SLOs without approval.
- MUST NOT allow unbounded queue growth.
- MUST NOT mix incompatible model versions or execution shapes in a batch unless the runtime explicitly supports and validates it.

## SHOULD
- Scheduling SHOULD account for request size, sequence length, memory pressure, and model characteristics.
- Queue metrics SHOULD be segmented by workload class and model version.

## Exceptions
Exceptions require measured benefit, affected SLOs, risk, and approval.

## Verification
Review scheduler configuration, load tests, queue metrics, starvation tests, and request-mapping tests.