# Network Response Rules

## Purpose
Use network controls and evidence safely during security investigations.

## Scope
Firewalls, proxies, DNS, VPN, network sensors, segmentation, and traffic captures.

## MUST
- Network containment MUST identify the exact indicator, scope, expected impact, owner, and rollback path.
- Traffic evidence MUST preserve timestamps, direction, relevant metadata, and collection scope.
- Broad blocking MUST be justified by measured threat and business impact.
- Emergency network changes MUST be validated after deployment.

## MUST NOT
- MUST NOT block shared infrastructure or broad address ranges without impact analysis unless an approved emergency playbook permits it.
- MUST NOT treat lack of network telemetry as proof of no communication.

## SHOULD
- Network response SHOULD prefer narrow, reversible controls and monitor for attacker adaptation.

## Exceptions
Emergency broad containment requires immediate documentation and retrospective review.

## Verification
Inspect firewall or proxy changes, approvals, packet or flow evidence, rollback plans, and post-change telemetry.