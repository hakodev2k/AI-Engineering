# Service Mesh Architecture

## Purpose
Design a service mesh only when workload-to-workload networking needs justify its operational cost.

## When to use
Use for mesh adoption, topology redesign, or platform review. Do not use merely to replace ordinary ingress or simple client libraries.

## Inputs
Service inventory, traffic flows, protocols, trust boundaries, SLOs, cluster/network topology, team capabilities.

## Context to inspect
Existing proxies, gateways, DNS, Kubernetes policies, telemetry, failure history, compliance requirements, and ownership boundaries.

## Core knowledge
A mesh separates application logic from cross-cutting traffic policy through data-plane proxies and a control plane. Benefits include uniform mTLS, telemetry, routing and resilience; costs include latency, resource overhead, upgrade coupling and debugging complexity.

## Procedure
1. Map callers, destinations, protocols and trust zones.
2. Identify concrete problems a mesh must solve.
3. Define success metrics and non-goals.
4. Compare sidecar, ambient/node-proxy and library-based approaches.
5. Define control-plane blast radius and tenancy.
6. Design ingress, egress and east-west boundaries.
7. Establish identity and certificate lifecycle.
8. Define routing, resilience and telemetry ownership.
9. Model latency, CPU, memory and cost overhead.
10. Pilot representative services before broad rollout.
11. Document rollback and bypass paths.

## Decision points
Prefer the least complex architecture meeting security and reliability requirements. Centralize policy only where platform ownership and governance are mature; preserve application-level semantics in applications.

## Common failure patterns
Adopting a mesh without a measurable problem, hiding network semantics from developers, oversized blast radius, inconsistent proxy versions, and no emergency bypass.

## Verification
Validate pilot SLOs, mTLS identity, policy enforcement, telemetry completeness, failure isolation, upgrade/rollback, and measured overhead.

## Expected output
An architecture decision with topology, boundaries, ownership, SLO impact, rollout and rollback plan.

## Stop conditions
Escalate when requirements conflict, protocols are unsupported, compliance interpretation is unresolved, or rollback cannot be demonstrated.