# Model Serving Architecture

## Purpose
Design an LLM serving topology that meets latency, throughput, reliability, security, and cost objectives without coupling the platform to one model or runtime.

## When to use
Use for a new serving platform, major model onboarding, topology redesign, or material scale change. Do not redesign solely because a newer serving framework exists.

## Inputs
Workload forecast, model characteristics, accelerator inventory, SLOs, traffic shape, tenancy requirements, deployment constraints, and cost targets.

## Context to inspect
Inspect current inference runtimes, gateways, schedulers, model stores, GPU topology, networking, autoscaling, observability, failure domains, and release process.

## Core knowledge
Serving is a queueing and resource-allocation system. Prefill and decode have different compute/memory behavior; KV cache consumes capacity over request lifetime. Architecture choices include colocated versus disaggregated prefill/decode, tensor/pipeline/data parallelism, static versus dynamic batching, and centralized versus distributed routing. Optimize end-to-end SLOs rather than isolated GPU utilization.

## Procedure
1. Define TTFT, inter-token latency, end-to-end latency, availability, throughput, and cost objectives.
2. Segment traffic by model, context length, output length, priority, and tenant.
3. Benchmark representative models on candidate hardware/runtime combinations.
4. Identify memory, compute, network, and scheduler bottlenecks.
5. Choose model placement and parallelism strategy.
6. Define routing, batching, queueing, admission control, and overload behavior.
7. Define artifact distribution, warmup, rollout, and rollback paths.
8. Design failure domains and recovery behavior.
9. Add metrics, traces, logs, and capacity signals at each boundary.
10. Load-test steady state, bursts, degraded nodes, and model rollouts.
11. Document architecture decisions and rejected alternatives.

## Decision points
Prefer the simplest topology that satisfies measured SLOs. Disaggregate prefill/decode only when workload evidence justifies added network and operational complexity. Prefer horizontal replicas when the model fits efficiently on one serving unit; use model parallelism when memory or compute requires it.

## Common failure patterns
Optimizing average latency, ignoring long-context traffic, assuming GPU utilization equals efficiency, unlimited queues, synchronized model reloads, hidden single points of failure, and no rollback path.

## Verification
Verify with production-shaped load tests, failure injection, rollout rehearsal, SLO dashboards, and cost-per-token measurements. Implementation is not verification until measured behavior meets objectives.

## Expected output
An evidence-backed serving architecture, capacity model, operational controls, and documented trade-offs.

## Stop conditions
Stop and escalate when SLOs are undefined, workload data is unavailable, required hardware cannot satisfy model constraints, or security/reliability requirements conflict with the proposed topology.