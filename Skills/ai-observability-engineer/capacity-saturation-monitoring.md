# Capacity and Saturation Monitoring

## Purpose
Detect AI-serving capacity pressure before queueing, throttling, or resource exhaustion causes user-visible failure.

## When to use
Use for self-hosted inference, gateways, agent workers, retrieval systems, or provider quota management.

## Inputs
Concurrency, queue depth, GPU/CPU/memory, provider quotas, token throughput, request sizes, autoscaling behavior, and SLOs.

## Context to inspect
Inspect admission control, batching, worker pools, GPU utilization, KV-cache pressure, queue limits, provider rate limits, and scaling lag.

## Core knowledge
AI capacity is constrained by tokens, sequence lengths, memory, concurrency, batching, and external quotas—not request rate alone. Saturation often appears first as queueing and TTFT growth.

## Procedure
1. Identify each capacity-limited resource and its admission boundary.
2. Instrument active requests, queued requests, queue age, token throughput, memory pressure, and quota utilization.
3. Correlate saturation with TTFT and timeout distributions.
4. Segment by model and workload size where resource profiles differ materially.
5. Establish safe operating ranges from load tests and production evidence.
6. Configure autoscaling or admission-control signals based on leading indicators.
7. Alert before hard limits when intervention is possible.
8. Test burst, sustained load, and oversized-context scenarios.

## Decision points
Scale out when parallelism is effective; use batching when throughput improves within latency budgets; shed or queue work when capacity cannot meet demand safely.

## Common failure patterns
Scaling on CPU for GPU-bound inference, request-count quotas without token awareness, unbounded queues, autoscaling after latency already fails, and ignoring context-length mix.

## Verification
Load-test to the intended operating envelope and prove saturation indicators lead SLO failure with sufficient response time.

## Expected output
Capacity dashboards, safe ranges, scaling/admission signals, and validated alerts.

## Stop conditions
Stop if production load testing lacks approval or provider quota data is unavailable and conclusions would be speculative.