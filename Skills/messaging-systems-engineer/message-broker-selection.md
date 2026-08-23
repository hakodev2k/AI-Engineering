# Message Broker Selection

## Purpose
Choose a broker that matches delivery, ordering, throughput, latency, retention, routing, and operational requirements.

## When to use
Use when introducing or replacing asynchronous messaging.

## Inputs
Workload, message size/rate, ordering needs, retention, topology, SLOs, compliance, team skills, cost constraints.

## Context to inspect
Existing platforms, deployment model, failure modes, consumers, producer guarantees, observability and support ownership.

## Core knowledge
Queues, logs and pub/sub systems optimize different workloads. Delivery semantics are end-to-end properties, not broker labels.

## Procedure
1. Quantify workload and SLOs.
2. Define delivery, ordering and replay requirements.
3. Map routing and consumer patterns.
4. Evaluate candidate guarantees and limits.
5. Compare operability, ecosystem and cost.
6. Prototype critical paths.
7. Record trade-offs and migration risks.

## Decision points
Prefer the simplest platform satisfying measured requirements; avoid adopting streaming infrastructure for ordinary work queues without need.

## Common failure patterns
Feature-driven selection, ignoring operational ownership, assuming exactly-once processing, and benchmarking unrealistic workloads.

## Verification
Run representative load/failure tests and confirm required guarantees from producer through consumer side effects.

## Expected output
A justified broker decision with constraints, risks and evidence.

## Stop conditions
Escalate when critical SLOs, compliance constraints, or ownership are unresolved.