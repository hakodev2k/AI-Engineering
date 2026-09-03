# Model Serving Architecture

## Purpose
Design production inference systems that meet latency, throughput, reliability, and cost objectives without coupling the application unnecessarily to a single model runtime or hardware shape.

## When to use
Use when introducing a new model service, redesigning an overloaded serving path, or evaluating runtime and deployment topology. Do not use for model-quality selection alone.

## Inputs
Model artifacts, traffic profile, SLOs, hardware constraints, context/output distributions, runtime options, network topology, and cost limits.

## Context to inspect
Inspect request flow, model size and precision, tokenizer/preprocessing, accelerator inventory, concurrency, batching, cache layers, autoscaling, health checks, and downstream dependencies.

## Core knowledge
Inference architecture is a queueing and resource-allocation problem. Accelerator utilization, memory residency, scheduler behavior, batching, network hops, and admission control jointly determine tail latency and capacity.

## Procedure
1. Define p50/p95/p99 latency and availability targets.
2. Characterize prompt, output, and concurrency distributions.
3. Determine memory footprint and compute intensity.
4. Select runtime candidates based on supported model operations and hardware.
5. Decide replica, sharding, and batching topology.
6. Define queue limits and admission control.
7. Separate prefill and decode paths when evidence supports it.
8. Add health checks, warmup, rollback, and fallback behavior.
9. Instrument end-to-end and stage-level latency.
10. Load test with production-like distributions.
11. Compare alternatives on cost per successful request or token.
12. Document architecture and operational limits.

## Decision points
Choose scale-up when the model cannot be partitioned efficiently or low latency dominates. Choose scale-out when requests are independently parallelizable. Introduce disaggregated serving only when network overhead is justified by utilization gains.

## Common failure patterns
Average-latency optimization, unbounded queues, cold replicas receiving traffic, mismatched runtime kernels, hidden preprocessing bottlenecks, and capacity plans based on synthetic uniform requests.

## Verification
The design is implemented when the serving path exists; it is verified only when production-like tests demonstrate SLO compliance, stable saturation behavior, safe failure handling, and measured capacity headroom.

## Expected output
Serving architecture, capacity assumptions, SLO mapping, benchmark evidence, and operational runbook.

## Stop conditions
Escalate when hardware access, representative workloads, model licensing, or reliability requirements are unresolved.