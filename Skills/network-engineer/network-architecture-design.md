# Network Architecture Design

## Purpose
Design maintainable enterprise and cloud networks from requirements rather than vendor defaults.

## When to use
Use for new sites, cloud connectivity, segmentation redesigns, mergers, or material traffic-growth changes. Do not use as a substitute for an approved security or business requirement.

## Inputs
Business flows, application dependencies, user/site counts, latency and availability targets, addressing constraints, security zones, cloud regions, budget, and existing diagrams/configuration.

## Preconditions
Confirm authoritative requirements and identify owners for security, applications, infrastructure, and operations.

## Context to inspect
Current L2/L3 topology, routing domains, WAN/Internet circuits, failure domains, NAT, DNS/DHCP/IPAM, firewall boundaries, cloud networks, monitoring, and known incidents.

## Core knowledge
Prefer explicit failure domains, deterministic routing, summarization, bounded blast radius, redundant paths without accidental complexity, and capacity headroom. Availability comes from eliminating correlated failure, not merely duplicating devices.

## Procedure
1. Translate business requirements into traffic, availability, security, scale, and recovery requirements.
2. Map producers, consumers, trust boundaries, north-south and east-west flows.
3. Establish addressing and summarization strategy.
4. Define L2 boundaries and L3 routing domains.
5. Select routing protocols and convergence objectives.
6. Design Internet, WAN, cloud, and data-center interconnects.
7. Place security enforcement points without creating hidden asymmetric paths.
8. Model device, link, site, provider, and control-plane failures.
9. Calculate bandwidth and growth headroom.
10. Define management-plane access and out-of-band recovery.
11. Specify observability and operational ownership.
12. Document alternatives and rejected trade-offs.
13. Validate through diagrams, route/path simulation, and failure walkthroughs.

## Decision points
Choose L2 extension only when workload constraints justify its larger failure domain. Prefer dynamic routing when topology or failover complexity exceeds what static routes can safely express. Choose active/active only when state, routing symmetry, and operations support it.

## Common failure patterns
Oversized broadcast domains, overlapping address space, undocumented NAT, single-provider dependencies, asymmetric firewall paths, unbounded route redistribution, fragile L2 stretch, and designs that cannot be operated during partial failure.

## Verification
Prove intended and failure-state paths, convergence, security boundaries, capacity, monitoring coverage, and recovery procedures. A diagram is implemented documentation; successful failover evidence is verification.

## Expected output
Architecture diagrams, addressing/routing plan, failure-domain analysis, capacity assumptions, security boundaries, operational requirements, and decision record.

## Stop conditions
Escalate when requirements conflict, address ownership is unknown, security policy is unresolved, provider capabilities are unverified, or the design requires destructive production changes without an approved migration plan.