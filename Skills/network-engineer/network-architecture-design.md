# Network Architecture Design

## Purpose
Design secure, resilient, scalable network architectures that satisfy application, user, operational, and compliance requirements without unnecessary complexity.

## When to use
Use for new environments, major topology changes, cloud/hybrid connectivity, segmentation redesign, capacity expansion, or recurring reliability problems.

## Inputs
Business requirements, application flows, site/cloud topology, traffic estimates, availability targets, security constraints, address space, existing diagrams, and operational capabilities.

## Preconditions
Confirm scope, ownership boundaries, critical workloads, recovery expectations, and constraints. Do not assume existing diagrams are current.

## Context to inspect
Inspect physical and logical topology, routing domains, trust zones, WAN/Internet paths, DNS/DHCP dependencies, firewalls, load balancers, cloud networks, monitoring, and failure domains.

## Core knowledge
Prefer simple failure domains, explicit trust boundaries, deterministic routing, redundant critical paths, summarizable addressing, and observable dependencies. Redundancy without independent failure paths can create false resilience.

## Procedure
1. Identify consumers, services, traffic flows, and NFRs.
2. Map current topology and constraints.
3. Define trust zones and failure domains.
4. Design IP, routing, ingress, egress, and service connectivity.
5. Design redundancy and convergence behavior.
6. Validate MTU, DNS, NAT, firewall, and load-balancing implications.
7. Model normal, degraded, maintenance, and disaster states.
8. Estimate capacity and growth headroom.
9. Define observability and operational ownership.
10. Document decisions, assumptions, migration sequence, and rollback.

## Decision points
Choose L2 extension only when unavoidable; prefer routed boundaries for fault isolation. Choose centralized controls for consistency versus distributed controls for locality and blast-radius reduction. Select active-active only when applications and state handling support it.

## Common failure patterns
Single hidden dependencies, asymmetric routing, overlapping address space, excessive L2 domains, undocumented NAT, redundant devices sharing one upstream failure, and designs that cannot be operated by the team.

## Verification
Validate diagrams against configurations, simulate failure paths, review route tables and policies, test representative traffic, measure convergence where relevant, and confirm monitoring detects critical path failures.

## Expected output
An implementable network design with topology, flows, addressing, routing, security boundaries, resilience model, capacity assumptions, observability, migration, and rollback guidance.

## Stop conditions
Stop and escalate when requirements conflict, ownership is unclear, address-space collisions cannot be resolved safely, or the change risks production without an approved rollback path.