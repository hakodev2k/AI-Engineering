# Cloud Network Engineering

## Purpose
Design and troubleshoot secure, scalable networking across public-cloud VPC/VNet environments and hybrid connectivity.

## When to use
Use for landing zones, cloud migrations, peering/transit, private endpoints, hybrid connectivity, or cloud reachability incidents.

## Inputs
Cloud accounts/subscriptions, CIDRs, regions, application flows, route tables, security controls, gateways, DNS, on-prem topology, and cost constraints.

## Context to inspect
VPC/VNet topology, subnets, route tables, transit hubs, peering, NAT/Internet gateways, private endpoints, load balancers, security groups/NACLs, DNS, VPN/direct connectivity, and flow logs.

## Core knowledge
Cloud networking is software-defined but still obeys routing and stateful-flow fundamentals. Provider-specific route precedence, quotas, implicit routers, security semantics, and data-processing charges materially affect design.

## Procedure
1. Map accounts, regions, networks, CIDRs, and trust boundaries.
2. Detect address overlap before connectivity is introduced.
3. Define hub-and-spoke, transit, or direct connectivity based on scale and policy.
4. Design subnet and route-table boundaries.
5. Establish ingress, egress, NAT, and private-service access patterns.
6. Integrate hybrid routing with explicit advertisement/filtering.
7. Design DNS resolution across environments.
8. Apply least-privilege security controls.
9. Evaluate zonal/regional failure modes and gateway dependencies.
10. Estimate bandwidth and processing/egress costs.
11. Enable flow logs and route diagnostics.
12. Test representative paths and failures.

## Decision points
Use centralized transit for policy/scale when its cost and blast radius are acceptable; direct peering can suit small simple topologies. Prefer private endpoints for sensitive service access when DNS and routing complexity are manageable.

## Common failure patterns
Overlapping CIDRs, transitive-routing assumptions, route-table omissions, asymmetric inspection, private-endpoint DNS mistakes, hidden NAT costs, and single-zone appliances.

## Verification
Confirm effective routes, security decisions, DNS, flow logs, hybrid advertisements, failover, throughput, and cost assumptions.

## Expected output
Cloud network architecture/change, route/security model, hybrid/DNS plan, failure analysis, and verified path evidence.

## Stop conditions
Escalate when address overlap lacks an approved remediation, cloud quotas block design, security ownership is unclear, or changes affect shared transit without coordinated approval.