# Network Incident Response Rules

## Purpose
Restore service safely while preserving coordination, evidence, and accountability.

## Scope
Network outages, degradation, security-related network events, and major service-impacting failures.

## MUST
- Establish incident ownership, impact, affected scope, timeline, and communication channel for material incidents.
- Prioritize safe restoration while recording material actions and observations.
- Use available logs, metrics, traces, flow data, packet evidence, and change history for production conclusions.
- Separate mitigation from verified root cause and schedule corrective actions.

## MUST NOT
- Perform high-risk destructive actions during an incident without authorized approval unless pre-authorized emergency procedure explicitly permits them.
- Erase logs or configuration evidence needed for investigation.

## SHOULD
- Maintain tested runbooks for recurring critical failure modes.

## Exceptions
Immediate life/safety or severe service risk may justify emergency procedure; actions remain auditable and reviewable.

## Verification
Review incident record, telemetry, action timeline, approvals, restoration evidence, RCA, and tracked corrective actions.