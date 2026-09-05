# Performance and Latency Rules

## Purpose
Make throughput and latency decisions measurable across producers, brokers, and consumers.

## Scope
Publish latency, end-to-end latency, batching, compression, message size, consumer processing, and tail performance.

## MUST
- Performance objectives MUST define workload, percentile latency, throughput, and message-size assumptions.
- Performance changes MUST be supported by before/after measurements under comparable conditions.
- End-to-end latency MUST distinguish producer, broker, queueing, and consumer time where practical.
- Large-message or high-batch settings MUST be tested for memory, network, and failure impact.

## MUST NOT
- MUST NOT claim optimization from average latency alone when tail latency matters.
- MUST NOT increase batch size solely for throughput if it violates required latency or memory bounds.
- MUST NOT benchmark with unrealistic payloads and generalize results to production.

## SHOULD
- Maintain repeatable load-test scenarios for representative traffic classes.

## Exceptions
Accepted regressions require documented benefit, user impact, evidence, and approval.

## Verification
Inspect benchmark configs, p95/p99 metrics, throughput, message-size distribution, and resource telemetry.