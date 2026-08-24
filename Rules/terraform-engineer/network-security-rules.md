# Network Security

## Purpose
Ensure Terraform-managed network exposure is intentional, minimal, and reviewable.

## Scope
Firewalls, security groups, network ACLs, routing, load balancers, gateways, private endpoints, and public addressing.

## MUST
- New ingress and egress paths MUST identify source, destination, protocol, port, purpose, and exposure boundary.
- Internet-facing resources MUST be intentional and protected according to workload risk.
- Network policy changes MUST preserve required segmentation and least connectivity.
- Broad exposure changes MUST receive security review when risk is material.

## MUST NOT
- `0.0.0.0/0` or equivalent broad access MUST NOT be introduced for administrative or sensitive ports without explicit approved justification.
- Private resources MUST NOT become public as an incidental consequence of refactoring.
- Network controls MUST NOT be disabled to work around application or deployment failures.

## SHOULD
- Private connectivity SHOULD be preferred for internal service dependencies.
- Reusable modules SHOULD encode secure defaults.

## Exceptions
Required public exposure needs documented threat context, compensating controls, monitoring, ownership, and approval.

## Verification
Review plans, route tables, firewall rules, public IP assignments, reachability analysis, cloud security findings, architecture diagrams, and post-deployment connectivity tests.