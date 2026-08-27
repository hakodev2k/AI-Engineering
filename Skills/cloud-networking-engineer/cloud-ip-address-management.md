# Cloud IP Address Management

## Purpose
Plan and govern cloud IP address space so networks can grow, interconnect, and migrate without collisions or emergency renumbering.

## When to use
Use when allocating CIDRs, adding environments/regions, integrating acquisitions, connecting hybrid networks, or resolving address exhaustion/overlap.

## Inputs
Existing prefixes, projected workloads, subnet sizing, Kubernetes/service ranges, on-premises ranges, partner networks, provider constraints, and growth horizon.

## Preconditions
Build an authoritative prefix inventory across all connected domains; do not rely on naming conventions alone.

## Context to inspect
IPAM systems, VPC/VNet CIDRs, subnet assignments, route tables, VPN/Direct Connect/ExpressRoute ranges, container address pools, private endpoints, NAT, and reserved provider addresses.

## Core knowledge
Address space is a finite architectural resource. Allocation should preserve summarization, regional/environment boundaries, future growth, and compatibility with hybrid routing. Oversized blocks waste space; undersized blocks force disruptive expansion.

## Procedure
1. Inventory every routed and potentially routed prefix.
2. Identify overlaps, fragmentation, and undocumented allocations.
3. Classify consumers by environment, region, workload type, and growth rate.
4. Establish hierarchical allocation rules and reservation pools.
5. Size subnets using realistic host and managed-service consumption.
6. Reserve space for Kubernetes, private services, migrations, and acquisitions.
7. Prefer summarizable allocations for transit routing.
8. Define allocation, reclamation, and exception workflows.
9. Automate collision checks in IaC/CI.
10. Document ownership and utilization thresholds.
11. Test expansion and interconnection scenarios.

## Decision points
Use RFC1918 where interoperability permits; consider provider-supported non-RFC1918/private schemes only with explicit compatibility analysis. Choose larger aggregate reservations when growth uncertainty is high, but avoid allocating them directly to individual workloads.

## Common failure patterns
Copying the same CIDR across environments that later need connectivity, ignoring container ranges, allocating by convenience rather than hierarchy, and discovering exhaustion only during deployment.

## Verification
Prove uniqueness across connected domains, route summarization feasibility, subnet headroom, automated collision detection, and documented ownership. Simulate planned growth against utilization.

## Expected output
A governed address plan, prefix registry, allocation policy, utilization thresholds, and remediation plan for overlaps or exhaustion.

## Stop conditions
Stop if authoritative inventories conflict, renumbering affects production without an approved migration, or partner/on-premises ranges cannot be confirmed.