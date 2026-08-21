# Cloud Networking

## Purpose
Design and troubleshoot secure, reliable network paths across cloud and hybrid environments.

## When to use
Use for VPC/VNet design, ingress/egress, DNS, load balancing, private connectivity, peering, firewalls, or connectivity incidents.

## Inputs
System topology, CIDRs, traffic flows, security zones, DNS requirements, on-prem connectivity, latency constraints.

## Context to inspect
Route tables, security groups/NSGs, firewalls, DNS zones, load balancers, NAT, proxies, flow logs, private endpoints.

## Core knowledge
Connectivity depends on routing, name resolution, policy, source NAT, stateful filtering, TLS, and asymmetric-path behavior. Segment by trust boundary, not convenience.

## Procedure
1. Draw source-to-destination flow.
2. Resolve DNS at each hop.
3. Validate route selection both directions.
4. Check security policies and ports.
5. Confirm load-balancer health and backend reachability.
6. Check NAT and outbound limits.
7. Use flow logs/packet evidence where available.
8. Test from representative network locations.
9. Minimize broad CIDR or public exposure.
10. Document dependency and failure modes.

## Decision points
Prefer private endpoints for sensitive services; centralize egress when governance matters; avoid excessive peering complexity when transit architecture is clearer.

## Common failure patterns
Overlapping CIDRs, DNS split-horizon mistakes, asymmetric routes, 0.0.0.0/0 rules, hidden proxy behavior, exhausted SNAT ports.

## Verification
Connectivity tests, DNS resolution, flow logs, health probes, and policy review confirm intended paths only.

## Expected output
Validated traffic-flow design or root-cause evidence with secure remediation.

## Stop conditions
Stop when a network change can disconnect production without tested recovery.