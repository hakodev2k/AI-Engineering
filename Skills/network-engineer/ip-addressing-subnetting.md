# IP Addressing and Subnetting

## Purpose
Plan and evolve IPv4/IPv6 address space so networks remain routable, scalable, understandable, and compatible with future connectivity.

## When to use
Use for new sites/VPCs/VNets, subnet expansion, mergers, hybrid connectivity, IPv6 adoption, or address exhaustion.

## Inputs
Existing CIDRs, expected hosts, routing boundaries, reserved ranges, cloud/provider constraints, DHCP/static needs, and growth forecasts.

## Context to inspect
Inspect IPAM, route advertisements, NAT, VPN/peering ranges, Kubernetes/container ranges, management networks, and external partner ranges.

## Core knowledge
Address plans should avoid overlap, preserve aggregation, reserve growth space, and distinguish infrastructure, user, server, management, and transit needs where useful. IPv6 should be designed intentionally rather than copied from IPv4 habits.

## Procedure
1. Inventory assigned and advertised ranges.
2. Identify overlap and exhaustion risks.
3. Forecast capacity by zone and lifecycle.
4. Allocate hierarchical, aggregatable blocks.
5. Reserve infrastructure and expansion space.
6. Define DHCP, static, and IPAM ownership rules.
7. Validate cloud, VPN, partner, and container compatibility.
8. Plan migration if renumbering is required.
9. Update authoritative IPAM and diagrams.

## Decision points
Use larger subnets when operational simplicity matters and broadcast/L2 constraints allow it; use smaller routed segments for isolation. Prefer globally unique private planning across connected estates to reduce future NAT complexity.

## Common failure patterns
Overlapping CIDRs, allocating every address with no growth reserve, undocumented static IPs, inconsistent IPAM, assuming RFC1918 uniqueness, and ignoring IPv6/security parity.

## Verification
Check route aggregation, collision-free connectivity, DHCP pools, gateway/reserved addresses, security rules, monitoring, and IPAM accuracy.

## Expected output
A documented address plan with allocations, reservations, ownership, growth strategy, and migration steps.

## Stop conditions
Escalate when connected parties have irreconcilable overlaps or renumbering affects critical systems without tested migration and rollback.