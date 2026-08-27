# Incident Response

## Purpose
Restore database service safely while preserving evidence and preventing secondary damage.

## Scope
Availability, corruption, performance, security, replication, and capacity incidents.

## MUST
- Incident actions MUST distinguish observation, recommendation, preparation, and execution authority.
- Responders MUST preserve relevant logs, metrics, timelines, and state before destructive remediation when feasible.
- High-impact actions such as failover, forced recovery, mass session termination, or data deletion MUST require authorized human direction.
- Recovery status MUST be validated against user-visible or application-relevant service criteria.

## MUST NOT
- MUST NOT destroy diagnostic evidence merely to make symptoms disappear.
- MUST NOT conceal uncertainty about data loss, corruption, or recovery completeness.
- MUST NOT perform irreversible actions outside granted authority.

## SHOULD
- Mitigation SHOULD prioritize reversible actions when they provide adequate risk reduction.
- Incidents SHOULD produce follow-up actions tied to demonstrated causes or control gaps.

## Exceptions
Immediate safety actions may precede normal approval only where established emergency authority explicitly permits them.

## Verification
Review timelines, command history, approvals, telemetry, recovery validation, root-cause evidence, and follow-up completion.