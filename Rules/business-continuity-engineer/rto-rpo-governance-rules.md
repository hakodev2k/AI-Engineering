# RTO and RPO Governance Rules

## Purpose
Ensure recovery objectives are business-owned, feasible, and consistently interpreted.

## Scope
Applies to Recovery Time Objectives, Recovery Point Objectives, maximum tolerable disruption, and related service recovery commitments.

## MUST
- RTO and RPO values MUST trace to approved business impact and tolerance evidence.
- Supporting services MUST have recovery capabilities compatible with the objectives of the critical services that depend on them.
- Conflicts between business targets and demonstrated recovery capability MUST be explicitly recorded and escalated.
- Recovery objectives MUST state scope, measurement point, assumptions, and accountable owner.

## MUST NOT
- MUST NOT publish recovery targets as commitments when exercises or architecture evidence show they are unattainable.
- MUST NOT silently reinterpret an RTO as restoration of only a technically convenient subset of the service.

## SHOULD
- Use service tiers and common definitions to reduce inconsistent interpretation.
- Review objectives after material changes in business impact, architecture, suppliers, or regulation.

## Exceptions
Temporary objective gaps require documented impact, compensating measures, remediation owner, target date, and approval by accountable business and technical owners.

## Verification
Trace objectives to BIAs, service dependencies, recovery test results, operational capabilities, and signed risk decisions.
