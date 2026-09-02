# Business Impact Analysis Rules

## Purpose
Establish evidence-based recovery priorities for business services and supporting technology.

## Scope
Applies to business impact analysis, criticality classification, recovery targets, and dependency mapping.

## MUST
- Critical services MUST have documented business impact across time, financial, legal, operational, customer, and safety dimensions.
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) MUST be derived from impact tolerance, not guessed from technical preference.
- Dependencies, upstream providers, downstream consumers, people, facilities, data, and technology MUST be identified for critical services.
- Assumptions MUST be dated, owned, and periodically revalidated.

## MUST NOT
- MUST NOT assign criticality solely from stakeholder opinion without impact evidence.
- MUST NOT set recovery targets that supporting systems cannot demonstrably meet.

## SHOULD
- Use consistent scoring and escalation criteria across business units.
- Reassess criticality after material architecture, regulatory, or operating-model changes.

## Exceptions
Exceptions require documented rationale, risk, compensating controls, owner approval, and review date.

## Verification
Review approved BIAs, dependency maps, target traceability, evidence supporting impact estimates, and periodic recertification records.
