# Operational Readiness Rules

## Purpose
Ensure program outcomes can be operated, supported, observed, and maintained after delivery.

## Scope
Production services, platforms, data systems, integrations, and operational handoffs.

## MUST
- Operational ownership MUST be defined before production handoff.
- Monitoring, alerting, support paths, and runbooks MUST exist for critical services where applicable.
- Capacity, reliability, and recovery requirements MUST be validated against expected usage.
- Operational dependencies and support constraints MUST be reflected in launch readiness.

## MUST NOT
- MUST NOT hand off critical systems without a named support owner.
- MUST NOT assume deployment completion equals operational readiness.

## SHOULD
- Programs SHOULD include operational stakeholders before final implementation decisions.
- Early-life support SHOULD be planned for major changes.

## Exceptions
Exceptions require rationale, temporary support plan, owner, expiry, and approval.

## Verification
Inspect ownership records, runbooks, monitoring evidence, support rotations, recovery tests, and handoff records.