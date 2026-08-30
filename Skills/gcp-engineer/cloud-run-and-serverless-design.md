# Cloud Run and Serverless Design

## Purpose
Design stateless services and event-driven workloads on Cloud Run with correct concurrency, scaling, identity, networking, and lifecycle behavior.

## When to use
Use for HTTP APIs, workers, lightweight services, containerized jobs, or migrations from always-on compute.

## Inputs
Request profile, execution duration, concurrency characteristics, startup cost, network dependencies, secrets, and scaling limits.

## Context to inspect
Container image, CPU/memory, concurrency, min/max instances, ingress, VPC egress, service account, revision traffic, and timeouts.

## Core knowledge
Cloud Run scales revisions based on demand and configured concurrency. Cold starts, downstream connection limits, and maximum instances are part of capacity design.

## Procedure
1. Confirm workload fits stateless serverless execution.
2. Size CPU and memory from measurement.
3. Set concurrency based on application behavior.
4. Bound maximum instances to protect dependencies.
5. Use minimum instances only when latency justifies cost.
6. Configure least-privilege identity.
7. Select ingress and VPC egress mode.
8. Externalize durable state.
9. Use revision-based rollout and rollback.
10. Load test with downstream limits included.

## Decision points
Choose Cloud Run over GKE when platform simplicity outweighs low-level orchestration needs. Use jobs for finite batch execution rather than long-lived request services.

## Common failure patterns
Unbounded autoscaling into a database, blocking startup, local filesystem assumptions, and public ingress by default.

## Verification
Measure cold/warm latency, scale behavior, rollback, IAM, and dependency saturation.

## Expected output
A bounded, scalable Cloud Run deployment model.

## Stop conditions
Stop when workload requires unsupported daemon, kernel, or persistent-host semantics.