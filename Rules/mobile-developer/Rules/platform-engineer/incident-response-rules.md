# Platform Incident Response Rules

## Purpose
Ensure platform incidents are stabilized quickly while preserving evidence and protecting dependent teams.

## Scope
Applies to outages, degraded shared services, failed provisioning, security-impacting platform failures, and widespread delivery failures.

## MUST
- Incidents MUST have an identified coordinator for high-severity events.
- Mitigation actions MUST prioritize reducing user impact and preventing further damage.
- Significant actions and observations MUST be time-stamped or otherwise reconstructable.
- Consumer-impacting incidents MUST communicate scope, workaround, and recovery status when known.

## MUST NOT
- MUST NOT delete evidence needed for root-cause analysis unless required to stop greater harm.
- MUST NOT perform unrelated risky changes during active stabilization.
- MUST NOT declare resolution before critical service behavior and telemetry are verified.

## SHOULD
- Prefer reversible mitigations during uncertainty.
- Run post-incident review for material reliability failures.

## Exceptions
Immediate safety actions may bypass normal change controls when delay creates greater risk; actions and rationale MUST be reviewed afterward.

## Verification
Use incident timelines, alerts, logs, metrics, traces, communications, recovery checks, and postmortem action tracking.