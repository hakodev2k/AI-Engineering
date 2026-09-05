# Serving Architecture Design

## Purpose
Design production inference architectures that meet latency, throughput, availability, cost, and model-quality requirements without over-coupling applications to one runtime or provider.

## When to use
Use when introducing a new model-serving stack, redesigning an overloaded inference path, or reviewing whether an existing deployment can support new workloads.

## Inputs
Model type and size, traffic profile, SLOs, hardware options, runtime constraints, scaling targets, deployment environment, security requirements, and cost envelope.

## Preconditions
Confirm the model can be executed in at least one target runtime and that representative workload characteristics are available.

## Context to inspect
Current request path, gateways, schedulers, model runtimes, accelerators, networking, storage, autoscaling, observability, and failover mechanisms.

## Core knowledge
Serving architecture is shaped by queueing behavior, model load time, memory footprint, batching, concurrency, accelerator topology, admission control, routing, and failure domains. Fast kernels alone do not guarantee low tail latency.

## Procedure
1. Define SLOs for latency, availability, throughput, and cost.
2. Characterize request size, output length, concurrency, and burstiness.
3. Estimate model memory, KV-cache, and compute requirements.
4. Choose online, asynchronous, or batch serving modes per workload.
5. Define routing, admission control, batching, and queue boundaries.
6. Define replica, region, and failure-domain topology.
7. Plan model loading, warmup, rollout, and rollback.
8. Specify observability and capacity metrics.
9. Validate with load tests using representative traffic.
10. Record architecture trade-offs and operational risks.

## Decision points
Prefer simpler stateless serving when workload permits. Add disaggregated or specialized components only when measured bottlenecks justify complexity.

## Common failure patterns
Sizing from average traffic, ignoring tail latency, underestimating model load time, no admission control, and designing without rollback.

## Verification
Verify architecture against representative load, failure injection, model reload, and scaling scenarios.

## Expected output
A serving architecture with quantified capacity assumptions, failure boundaries, scaling strategy, and validation evidence.

## Stop conditions
Escalate when hardware availability, regulatory constraints, or required SLOs make the proposed architecture infeasible.