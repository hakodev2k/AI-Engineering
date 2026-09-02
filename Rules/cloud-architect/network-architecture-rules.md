# Network Architecture Rules

## Purpose
Design cloud networking with explicit trust boundaries, predictable routing, controlled exposure, and operable failure domains.

## Scope
Applies to virtual networks, subnets, routing, ingress, egress, peering, private connectivity, DNS, and hybrid connectivity.

## MUST
- Network architecture MUST define trust zones, address plans, routing ownership, ingress paths, egress paths, DNS dependencies, and failure domains.
- Internet exposure MUST be justified by workload requirements and protected by appropriate controls.
- Private connectivity MUST be preferred for sensitive control-plane and data-plane paths when technically appropriate.
- Routing and firewall changes with broad blast radius MUST be reviewed and tested before production application.

## MUST NOT
- MUST NOT create overlapping address spaces where future connectivity is plausible without an explicit translation strategy.
- MUST NOT permit unrestricted east-west or egress traffic by default for sensitive environments.
- MUST NOT introduce transitive trust accidentally through peering or shared network hubs.

## SHOULD
- Prefer simple routing topologies with clear ownership.
- Reserve address space for credible growth and integration needs.

## Exceptions
Exceptions require topology evidence, risk analysis, compensating controls, rollback steps, and approval.

## Verification
Inspect route tables, firewall/security-group policy, peering, DNS, connectivity tests, flow logs, and architecture diagrams.