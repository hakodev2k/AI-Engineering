# Network Architecture Review

## Purpose
Evaluate network architecture for reliability, scalability, security boundaries, failure domains, and operational simplicity.

## When to use
Use for new environments, major topology changes, cloud migrations, hybrid connectivity, or recurring network incidents.

## Inputs
Topology diagrams, routing tables, addressing plans, traffic flows, dependency maps, SLOs, firewall policy, and incident history.

## Context to inspect
Inspect L2/L3 boundaries, routing domains, load balancers, DNS, egress paths, transit hubs, VPN/private links, redundancy, and management-plane dependencies.

## Core knowledge
Reliable networks avoid hidden single points of failure, uncontrolled route propagation, oversized blast radii, and dependencies on a single control plane. Simplicity improves recoverability.

## Procedure
1. Map critical traffic flows end to end.
2. Identify failure domains and shared dependencies.
3. Validate route convergence and redundancy assumptions.
4. Review segmentation and trust boundaries.
5. Check address-space growth and overlap risk.
6. Assess control-plane and data-plane resilience.
7. Review observability and troubleshooting access.
8. Document risks, alternatives, and migration constraints.
9. Prioritize improvements by impact and likelihood.

## Decision points
Prefer centralized transit when governance and visibility matter; prefer localized routing when reducing blast radius and latency is more important. Add redundancy only when paths are genuinely independent.

## Common failure patterns
Nominally redundant links sharing one provider, asymmetric routing, transitive trust, undocumented route leaks, overlapping CIDRs, and central chokepoints.

## Verification
Validate diagrams against live configuration, test failover paths where safe, review routing state, and confirm critical dependencies have independent paths.

## Expected output
A reviewed architecture with concrete reliability risks, decisions, and remediation priorities.

## Stop conditions
Escalate when topology evidence is incomplete, production testing is unsafe, or changes require cross-team approval.