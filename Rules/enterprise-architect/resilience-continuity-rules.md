# Resilience and Continuity Rules

## Purpose
Align technology resilience with business impact and recovery obligations.

## Scope
Critical services, dependencies, disaster recovery, continuity, regional strategy, and third-party resilience.

## MUST
- Critical capabilities MUST have approved availability, recovery-time, recovery-point, and dependency expectations.
- Resilience designs MUST address correlated failures and critical external dependencies.
- Recovery assumptions MUST be validated through exercises or tests at risk-appropriate intervals.

## MUST NOT
- MUST NOT claim high availability solely from component redundancy.
- MUST NOT accept recovery objectives that are unsupported by tested architecture and operations.

## SHOULD
- Resilience investment SHOULD be proportional to business impact and verified failure modes.

## Exceptions
Unmet objectives require explicit risk acceptance, remediation plan, and accountable owner.

## Verification
Review business-impact analysis, dependency maps, architecture, recovery tests, incidents, and continuity exercises.