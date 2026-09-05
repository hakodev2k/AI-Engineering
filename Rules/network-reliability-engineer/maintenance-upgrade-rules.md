# Maintenance and Upgrade Rules

## Purpose
Reduce reliability risk from firmware, software, platform, and managed-service maintenance.

## Scope
Network operating systems, appliances, gateways, agents, managed services, and planned maintenance windows.

## MUST
- Upgrades MUST identify compatibility constraints, affected services, expected interruption, and rollback or recovery strategy.
- Critical upgrades MUST be validated in a representative environment or bounded production cohort before broad rollout.
- Maintenance MUST account for redundancy so paired components are not made unavailable simultaneously unless explicitly approved.
- Version support and known defect information MUST be reviewed before production adoption.

## MUST NOT
- MUST NOT upgrade all redundant components at once when staged maintenance is feasible.
- MUST NOT remove the last known-good recovery option before validation completes.
- MUST NOT treat vendor recommendation alone as sufficient evidence of environment compatibility.

## SHOULD
- Prefer supported stable versions over unnecessary novelty.
- Capture upgrade duration and observed impact for future planning.

## Exceptions
Emergency upgrades require documented urgency, risk, rollback, monitoring, and approval.

## Verification
Review compatibility evidence, release notes, maintenance plan, staged results, health metrics, and recovery readiness.