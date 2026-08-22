# Network Migration Planning

## Purpose
Move networks, circuits, addressing, routing, security, or services between architectures with controlled coexistence, cutover, validation, and rollback.

## When to use
Use for data-center/cloud migrations, firewall/router replacement, WAN transitions, renumbering, segmentation changes, provider moves, or major topology redesign.

## Inputs
Current/target architecture, dependencies, flows, address/routing plans, change windows, traffic criticality, migration constraints, and rollback options.

## Context to inspect
Inspect hidden dependencies, hard-coded IPs, DNS TTLs, NAT, asymmetric routing risks, monitoring, certificates, partner allowlists, automation, and legacy devices.

## Core knowledge
Migration risk often comes from coexistence states, not final architecture. Design intermediate routing, policy, DNS, and observability explicitly and minimize irreversible steps.

## Procedure
1. Establish verified current and target states.
2. Discover application and operational dependencies.
3. Identify coexistence constraints and incompatibilities.
4. Break migration into reversible waves.
5. Define temporary routing/NAT/policy only where necessary.
6. Prepare DNS, partner, monitoring, and automation changes.
7. Define pre-checks, cutover steps, validation, and rollback triggers.
8. Pilot a low-risk representative wave.
9. Measure and adjust before broader rollout.
10. Remove temporary compatibility paths after stabilization.

## Decision points
Use parallel coexistence when it materially lowers cutover risk; prefer a simpler big-bang only when state cannot coexist and rollback is strong. Renumber versus NAT based on long-term complexity and ownership.

## Common failure patterns
Undiscovered hard-coded dependencies, temporary routes becoming permanent, stale DNS, missing partner allowlists, asymmetric traffic, no rollback threshold, and decommissioning old paths too early.

## Verification
Validate every migration wave against flow, security, performance, monitoring, failover, and business acceptance criteria.

## Expected output
A staged migration plan with dependency map, intermediate states, exact validation, rollback, and cleanup.

## Stop conditions
Stop when critical dependencies remain unknown, rollback is impossible without explicit approval, or coexistence introduces uncontrolled routing/security risk.