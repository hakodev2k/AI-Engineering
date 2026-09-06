# Cloud Deployment and Networking

## Purpose
Design secure, scalable deployment topology for AI applications across cloud services, private networks, model endpoints, data systems, and edge or hybrid environments.

## When to use
Use during production architecture, cloud migration, regional expansion, private-connectivity design, or infrastructure modernization.

## Inputs
Cloud platform, regions, residency requirements, model hosting strategy, data locations, network policies, availability targets, deployment constraints, and traffic profile.

## Context to inspect
Inspect current subscriptions/accounts, virtual networks, DNS, egress controls, private endpoints, load balancers, container/serverless platforms, regions, identity, and observability services.

## Core knowledge
Deployment topology affects latency, data exposure, resilience, cost, and operability. AI solutions often cross boundaries between application compute, managed model APIs, vector/search services, object storage, databases, and external tools. Network and regional decisions must be explicit.

## Procedure
1. Map runtime components and data locations.
2. Define region and residency requirements.
3. Identify public and private connectivity needs.
4. Minimize unnecessary internet egress and cross-region traffic.
5. Define ingress, service-to-service, and outbound network policies.
6. Select deployment primitives based on workload duration, scale, and operational needs.
7. Design multi-zone or multi-region resilience where justified.
8. Define configuration and infrastructure-as-code ownership.
9. Plan deployment, rollback, and environment promotion.
10. Validate network paths, quotas, failover, and observability before launch.

## Decision points
Use managed/serverless services for elasticity and reduced operations when constraints permit; containers or dedicated compute for stronger runtime control; multi-region only when business continuity justifies added complexity.

## Common failure patterns
Cross-region data paths hidden in architecture, unrestricted outbound traffic, coupling environments through shared state, no quota planning, and assuming managed services remove operational responsibility.

## Verification
Deployment tests validate connectivity, isolation, regional behavior, rollback, scaling, and failure recovery under representative conditions.

## Expected output
A deployment architecture showing regions, networks, runtime components, connectivity, environments, resilience, and release flow.

## Stop conditions
Stop when residency rules conflict with required services, network ownership is unresolved, or mandatory availability cannot be supported by the proposed topology.