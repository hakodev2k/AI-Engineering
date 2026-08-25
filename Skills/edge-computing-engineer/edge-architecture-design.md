# Edge Architecture Design

## Purpose
Design edge systems that place compute, storage, and control logic deliberately across devices, gateways, regional nodes, and cloud services.

## When to use
Use when defining a new edge platform, decomposing cloud-only workloads, or reviewing latency, autonomy, bandwidth, or resilience constraints.

## Inputs
- Functional requirements
- Latency and availability targets
- Device and gateway capabilities
- Network characteristics
- Data sensitivity and retention rules
- Cloud dependencies

## Preconditions
Confirm the real deployment topology and operational ownership before proposing architecture.

## Context to inspect
Inspect device classes, protocols, fleet size, failure domains, cloud services, data flows, update mechanisms, and existing observability.

## Core knowledge
Senior edge design requires understanding failure domains, intermittently connected systems, bounded resources, consistency, state placement, remote operations, and security boundaries.

## Procedure
1. Map user and machine-critical flows.
2. Classify each flow by latency, bandwidth, autonomy, and consistency requirements.
3. Identify which decisions must remain available without cloud connectivity.
4. Place compute and state at device, gateway, regional, or cloud layers.
5. Define contracts between layers.
6. Define failure behavior for network, device, and cloud outages.
7. Define synchronization and conflict semantics.
8. Design deployment and rollback paths.
9. Define observability and security boundaries.
10. Validate capacity and cost at expected fleet scale.

## Decision points
Prefer local execution for hard latency or autonomy needs; prefer centralized execution when global state, elasticity, or operational simplicity dominates. Avoid duplicating state without an explicit reconciliation model.

## Common failure patterns
- Treating the edge as a small cloud region
- Requiring constant connectivity
- Unclear state ownership
- No degraded mode
- Hidden single points of failure at gateways

## Verification
Run architecture reviews against offline scenarios, partial failures, peak fleet scale, latency budgets, and upgrade/rollback paths.

## Expected output
An edge architecture with component placement, data flows, contracts, failure behavior, and operational responsibilities.

## Stop conditions
Stop when topology, autonomy requirements, or security boundaries are unknown enough to make placement decisions speculative.