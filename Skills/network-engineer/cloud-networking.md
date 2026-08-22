# Cloud Networking

## Purpose
Design and troubleshoot cloud networks while accounting for provider routing, security, managed services, private endpoints, scale limits, and hybrid dependencies.

## When to use
Use for VPC/VNet design, peering/transit, private services, cloud firewalls, hybrid connectivity, multi-account/subscription estates, or cloud reachability incidents.

## Inputs
Cloud topology, CIDRs, accounts/projects/subscriptions, route tables, security controls, service endpoints, hybrid paths, DNS, and availability requirements.

## Context to inspect
Inspect subnets, route tables, gateways, NAT, peering/transit hubs, security groups/NSGs, private endpoints, DNS zones/resolvers, load balancers, quotas, and flow logs.

## Core knowledge
Cloud networks are software-defined but still obey routing and stateful/stateless policy semantics. Provider implicit routes, asymmetric paths, quotas, and managed-service DNS commonly affect outcomes.

## Procedure
1. Map workloads and required flows.
2. Allocate non-overlapping address space.
3. Define hub/spoke or direct connectivity based on scale and governance.
4. Design ingress, egress, NAT, and private service access.
5. Apply least-privilege security controls.
6. Integrate hybrid routing and DNS.
7. Validate zone/region failure behavior.
8. Check service and route quotas.
9. Enable flow logs and health telemetry.
10. Test paths from actual source environments.

## Decision points
Use centralized transit/security for governance and shared services; distributed egress can reduce blast radius and hairpin cost. Prefer private endpoints for sensitive managed services when DNS and operational complexity are justified.

## Common failure patterns
CIDR overlap, transitive-routing assumptions, missing return routes, private-endpoint DNS errors, excessive centralized bottlenecks, hidden egress cost, and permissive security groups.

## Verification
Validate effective routes and policies, DNS resolution, ingress/egress identity, flow logs, failover, latency, and provider quotas.

## Expected output
A cloud network design or remediation with routing, security, DNS, connectivity, resilience, and cost considerations.

## Stop conditions
Escalate when organizational landing-zone policy is unknown, hybrid ownership is unresolved, or changes cross production boundaries without approval.