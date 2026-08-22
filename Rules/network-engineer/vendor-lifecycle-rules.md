# Vendor and Lifecycle Rules

## Purpose
Control operational, security, and continuity risk from network platforms and providers.

## Scope
Hardware/software lifecycle, support status, licensing, circuits, carriers, vendor dependencies, and upgrades.

## MUST
- Track support status, critical advisories, firmware/software lifecycle, and renewal dependencies for production platforms.
- Plan replacement before end-of-support creates an unmanaged critical dependency.
- Evaluate upgrades against compatibility, security, rollback, and operational evidence.
- Define escalation paths and service commitments for critical external providers.

## MUST NOT
- Keep unsupported critical infrastructure indefinitely without documented risk acceptance and compensating controls.
- Perform large platform migrations without staged validation and authorized change approval.

## SHOULD
- Reduce unnecessary vendor lock-in where portability materially improves resilience or negotiating position.

## Exceptions
Legacy retention requires owner, risk, controls, monitoring, and dated migration/review plan.

## Verification
Review lifecycle inventory, advisories, contracts, support status, upgrade tests, risk register, and migration plans.