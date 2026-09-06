# Cloud Networking Reliability

## Purpose
Design and operate reliable cloud networking across virtual networks, subnets, route tables, peering, gateways, private endpoints, and managed load balancers.

## When to use
Use for cloud landing zones, multi-region design, hybrid connectivity, service exposure, or cloud network incidents.

## Inputs
Cloud topology, VPC/VNet configuration, route tables, security controls, quotas, private-link design, traffic flows, and provider limits.

## Context to inspect
Inspect regional/AZ boundaries, peering transitivity, route propagation, managed-service dependencies, NAT/egress, DNS integration, and control-plane limits.

## Core knowledge
Cloud networks are software-defined but still constrained by routing, addressing, state, quotas, and failure domains. Managed services reduce device operations but can hide provider-specific limits.

## Procedure
1. Map critical cloud traffic flows.
2. Review address-space allocation and growth.
3. Validate route ownership and propagation.
4. Check cross-zone and cross-region failure paths.
5. Inspect egress and private-service connectivity.
6. Review security-group and network-ACL interactions.
7. Validate provider quotas and scaling limits.
8. Test representative failover paths.
9. Document provider-specific dependencies.

## Decision points
Use hub-and-spoke for centralized governance; use distributed transit when scale or blast-radius constraints justify it. Prefer private endpoints when security benefits outweigh DNS and routing complexity.

## Common failure patterns
Overlapping CIDRs, assuming peering is transitive, hidden zone dependencies, quota exhaustion, centralized egress bottlenecks, and inconsistent private DNS.

## Verification
Validate live routes, connectivity tests, quota headroom, failover behavior, and flow telemetry across representative workloads.

## Expected output
A verified cloud network design or remediation plan with explicit failure domains and limits.

## Stop conditions
Escalate when provider account permissions, organization policies, or managed-service constraints prevent safe validation.