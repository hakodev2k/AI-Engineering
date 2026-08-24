# Model Serving Platform Design

## Purpose
Design a reusable platform for deploying and operating model inference services with predictable latency, scalability, isolation, and lifecycle controls.

## When to use
Use when standardizing inference across teams or replacing one-off serving deployments.

## Inputs
Model formats, traffic patterns, latency/throughput SLOs, hardware targets, deployment constraints, security requirements.

## Context to inspect
Current runtimes, model registry, container strategy, autoscaling, routing, rollout process, telemetry, caching, batching, and tenant isolation.

## Core knowledge
Serving platforms must coordinate model loading, memory residency, batching, concurrency, request routing, autoscaling, versioning, rollback, and resource isolation.

## Procedure
1. Classify workloads by online, streaming, and batch inference.
2. Define a standard model artifact and runtime contract.
3. Establish resource-request and accelerator-placement rules.
4. Define health, readiness, warmup, and model-load semantics.
5. Choose routing, batching, and concurrency controls.
6. Design autoscaling using workload-appropriate signals.
7. Define version rollout, canary, rollback, and compatibility policies.
8. Add request, model, GPU, and queue telemetry.
9. Load-test representative models and failure scenarios.

## Decision points
Use dedicated serving for strict isolation or unique runtimes; shared multi-model serving for utilization efficiency when interference is controlled. Scale on queue/latency signals when CPU is not representative.

## Common failure patterns
Cold-start storms, GPU OOM during concurrent model loads, CPU-based autoscaling for GPU services, unbounded queues, and rollouts without model warmup.

## Verification
Validate SLOs under normal, burst, rollout, and node-failure conditions.

## Expected output
A platform architecture and operational contract for repeatable model deployment.

## Stop conditions
Stop when model runtime compatibility or serving SLOs are undefined.