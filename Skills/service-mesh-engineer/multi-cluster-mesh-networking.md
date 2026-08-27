# Multi-Cluster Mesh Networking

## Purpose
Design reliable service discovery, identity and traffic routing across clusters without creating a global failure domain.

## When to use
Use for regional expansion, cluster failover, migration or shared multi-cluster services.

## Inputs
Cluster topology, networks, trust domains, DNS, latency, failure objectives and data residency constraints.

## Context to inspect
Inter-cluster gateways, routing, firewall rules, endpoint discovery, CA federation, locality and overlapping address space.

## Core knowledge
Multi-cluster meshes couple discovery, trust and network reachability. Global service names can mask regional failure and data-residency constraints. Failover requires spare capacity and tested routing convergence.

## Procedure
1. Define why cross-cluster traffic is needed.
2. Map network reachability and address conflicts.
3. Choose shared or federated discovery.
4. Define trust-domain relationships.
5. Establish locality and failover priorities.
6. Enforce residency and tenant constraints.
7. Size gateways and remote capacity.
8. Test cluster, network and control-plane isolation failures.
9. Measure convergence and cross-region latency.
10. Document degraded-mode behavior.

## Decision points
Prefer explicit federation when clusters have independent ownership. Use flat networking only when operationally justified; gateways provide stronger boundaries at additional hops.

## Common failure patterns
Assuming remote capacity exists, accidental cross-region traffic, overlapping CIDRs, global CA blast radius and DNS/discovery disagreement.

## Verification
Simulate cluster loss, confirm intended failover, validate identity across boundaries and prove residency rules.

## Expected output
A multi-cluster topology with discovery, trust, failover and capacity rules.

## Stop conditions
Escalate on unresolved residency, routing ambiguity, or insufficient failover capacity.