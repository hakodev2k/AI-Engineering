# Secrets High Availability and Disaster Recovery

## Purpose
Design secrets services to remain available through component, zone, or regional failures while preserving consistency, revocation semantics, and controlled trust.

## When to use
Use when defining HA topology, multi-region replication, failover, or disaster-recovery procedures.

## Inputs
- Availability objectives
- Failure domains
- Secret-store replication model
- Network topology
- Consistency requirements

## Context to inspect
Inspect cluster quorum, storage backend, leader election, replication lag, regional dependencies, load balancing, DNS, identity providers, KMS/HSM availability, and failover automation.

## Core knowledge
Secrets systems are control-plane dependencies. Availability improvements can enlarge the trust and compromise domain. Senior design distinguishes local HA from disaster recovery, understands quorum and replication semantics, and validates revocation behavior across partitions.

## Procedure
1. Define SLO, RTO, RPO, and supported failure scenarios.
2. Map dependencies whose loss blocks authentication or decryption.
3. Design node and zone redundancy before multi-region complexity.
4. Select replication mode consistent with secret freshness and revocation needs.
5. Define traffic routing and failover authority.
6. Bound acceptable replication lag and stale-read behavior.
7. Ensure audit and policy configuration survives failover.
8. Define regional recovery and failback steps.
9. Test controlled failures and network partitions.
10. Measure recovery behavior and update operational thresholds.

## Decision points
Use active/passive when simplicity and consistency dominate. Use multi-active only when the platform safely supports conflict and replication semantics required by the threat model. Never trade revocation correctness blindly for availability.

## Common failure patterns
- Multi-region replication without understanding stale credentials
- All regions depending on one identity or KMS endpoint
- Untested failback
- Load balancer health checks that ignore functional secret issuance
- Recovery nodes with outdated policy or audit configuration

## Verification
Run fault tests covering node, zone, and planned regional loss; verify access policy, rotation, revocation, audit continuity, recovery timing, and no split-brain behavior.

## Expected output
A tested HA/DR topology with failure assumptions, failover/failback procedures, dependency map, and measured objectives.

## Stop conditions
Stop if replication semantics cannot meet security requirements, quorum safety is uncertain, or failover could expose secrets through a lower-trust region.