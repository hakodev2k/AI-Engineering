# Network Security Architecture Rules

## Purpose
Design network controls to reduce exposure, contain compromise, and support observable enforcement.

## Scope
Ingress, egress, segmentation, service communication, remote access, administrative networks, and hybrid connectivity.

## MUST
- Network architecture MUST minimize exposed services and explicitly document allowed traffic paths.
- Segmentation MUST reflect trust, sensitivity, and blast-radius requirements rather than organizational convenience.
- Egress from high-value environments MUST be restricted and monitored where feasible.
- Administrative access MUST use dedicated, strongly authenticated paths.
- Network controls MUST be represented as code or otherwise reproducibly managed where practical.

## MUST NOT
- MUST NOT rely on flat-network assumptions for sensitive systems.
- MUST NOT allow unrestricted ingress or egress without documented need and risk acceptance.
- MUST NOT use network location as the sole authorization mechanism.

## SHOULD
- Prefer default-deny policies and explicit service identities.
- Architecture SHOULD account for DNS, routing, proxy, and load-balancer compromise paths.

## Exceptions
Require scope, rationale, compensating controls, residual risk, expiry, and approval.

## Verification
Inspect diagrams, firewall/security-group rules, routing, egress policy, remote-access configuration, and connectivity tests.