# Incident Response Rules

## Purpose
Restore Azure services safely while preserving evidence and reducing recurrence.

## Scope
Operational incidents, outages, degraded service, security-related infrastructure failures, mitigation, and post-incident actions.

## MUST
- Establish incident severity, owner, communication path, and current impact from evidence.
- Preserve relevant logs, metrics, activity records, and configuration evidence before destructive remediation when feasible.
- Prefer reversible containment when root cause is uncertain.
- Record material actions and timestamps during high-severity incidents.
- Separate immediate mitigation from root-cause and permanent corrective work.

## MUST NOT
- Make multiple uncontrolled production changes that destroy causal evidence.
- Declare root cause from correlation alone.
- Conceal failed mitigation attempts or operational mistakes from the incident record.

## SHOULD
- Use tested runbooks for recurring failure modes.
- Convert significant lessons into monitored or automated preventive controls.

## Exceptions
Urgent life/safety or catastrophic-impact actions may precede full evidence collection when authorized.

## Verification
Review incident timeline, Azure activity logs, telemetry, change history, mitigation evidence, postmortem, and corrective actions.