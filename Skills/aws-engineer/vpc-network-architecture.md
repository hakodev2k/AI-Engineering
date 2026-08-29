# VPC Network Architecture

## Purpose
Design AWS network topology that is routable, secure, observable, and scalable across VPCs, accounts, and regions.

## When to use
Use for new VPCs, hybrid connectivity, multi-account networking, IP exhaustion, segmentation, or connectivity incidents.

## Inputs
CIDR requirements, workload placement, connectivity matrix, throughput, latency, hybrid links, DNS needs, security boundaries.

## Context to inspect
VPCs, subnets, route tables, TGW, peering, NAT, IGW, endpoints, security groups, NACLs, Route 53 resolver, Direct Connect/VPN.

## Core knowledge
Subnet labels do not create security; routing and controls do. CIDR planning is hard to reverse. Transit Gateway scales hub-and-spoke better than dense peering. PrivateLink reduces routing coupling for service exposure.

## Procedure
1. Build a source/destination connectivity matrix.
2. Allocate non-overlapping CIDRs with future growth margin.
3. Separate subnet tiers by routing and failure-domain needs.
4. Select hub-spoke, peering, or PrivateLink patterns.
5. Define egress and ingress paths explicitly.
6. Add VPC endpoints for sensitive or high-volume AWS-service traffic.
7. Design DNS resolution across boundaries.
8. Enable flow logs and network observability.
9. Test route symmetry, MTU, failover, and expected denies.

## Decision points
Use TGW for many interconnected VPCs, peering for simple bilateral connectivity, and PrivateLink for producer-consumer service isolation.

## Common failure patterns
Overlapping CIDRs, routing through accidental NAT paths, overly broad security groups, asymmetric routes, DNS split-horizon mistakes, and no IP-growth plan.

## Verification
Validate reachability with Reachability Analyzer, flow logs, endpoint tests, and failure scenarios.

## Expected output
Network diagram, CIDR plan, route model, controls, and validation evidence.

## Stop conditions
Escalate when enterprise CIDR ownership is unclear, hybrid routing changes require external coordination, or proposed changes can partition production.