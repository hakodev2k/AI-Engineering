# Model Serving Architecture

## Purpose
Design production LLM serving systems that meet latency, throughput, reliability, and cost targets without coupling applications to one runtime.

## When to use
Use for a new inference platform, major model/runtime change, capacity redesign, or architecture review.

## Inputs
Model artifacts, traffic profile, SLOs, hardware inventory, deployment constraints, security requirements, and cost targets.

## Context to inspect
Existing gateways, schedulers, runtimes, model stores, GPU topology, autoscaling, observability, failure domains, and client contracts.

## Core knowledge
Separate request admission, routing, scheduling, execution, model lifecycle, and telemetry. LLM workloads are shaped by prompt length, generated tokens, batching, KV-cache pressure, and accelerator memory. Optimize end-to-end service objectives rather than isolated kernel speed.

## Procedure
1. Quantify request-rate and token distributions, concurrency, TTFT, inter-token latency, and availability targets.
2. Estimate model memory and compute requirements for target precisions and context lengths.
3. Define control-plane and data-plane boundaries.
4. Choose runtime and parallelism strategy from measured model/hardware behavior.
5. Design routing, admission control, batching, cache ownership, health checks, and graceful draining.
6. Define artifact loading, warm-up, rollout, rollback, and version compatibility.
7. Model failure domains and degraded modes.
8. Instrument queue, prefill, decode, GPU, cache, and client-visible metrics.
9. Load-test representative distributions and document capacity assumptions.

## Decision points
Prefer simpler single-node serving when the model fits and SLOs are met. Use distributed execution only when memory or throughput requires it. Separate pools when workloads have materially different latency or context characteristics.

## Common failure patterns
Designing from average traffic, hiding queue latency, uncontrolled concurrency, runtime-specific client coupling, cold-start surprises, and no rollback path.

## Verification
Validate SLOs under representative and burst load, node loss, rollout, and model reload. Reconcile measured capacity with the capacity model.

## Expected output
Architecture, capacity assumptions, operational boundaries, SLO evidence, and explicit trade-offs.

## Stop conditions
Escalate when model licensing, hardware availability, security policy, or required SLOs make the proposed architecture infeasible.