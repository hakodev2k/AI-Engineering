# Audit and Observability Rules

## Purpose
Ensure identity events can support detection, investigation, access review, and compliance evidence.

## Scope
Applies to authentication, authorization, provisioning, privilege, federation, policy, and administrative events.

## MUST
- Security-relevant identity events MUST record actor, target, action, result, timestamp, and source context where available.
- Privilege changes, factor resets, federation changes, risky sign-ins, and emergency access MUST be observable.
- Audit data MUST be protected from unauthorized modification and access.
- Retention MUST meet incident investigation and governance requirements.
- Alerting logic MUST be tested against representative events.

## MUST NOT
- Logs MUST NOT contain passwords, private keys, bearer tokens, recovery codes, or equivalent authentication secrets.
- Monitoring MUST NOT rely solely on successful-event telemetry.
- Missing telemetry MUST NOT be silently treated as proof that no identity event occurred.

## SHOULD
- Correlate identity events across provider, application, endpoint, and privileged-access systems.
- Maintain normal baselines for high-impact accounts and administrative actions.

## Exceptions
Exceptions require documented data limitation, risk, alternative evidence, and approval.

## Verification
Inspect event schemas, redaction, retention settings, alert tests, sample investigations, and telemetry coverage across critical identity flows.