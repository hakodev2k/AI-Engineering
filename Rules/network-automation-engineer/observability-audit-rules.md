# Observability and Audit Rules

## Purpose
Make automated network decisions and effects reconstructable during operations and incidents.

## Scope
Logs, metrics, traces, execution records, diffs, actor identity, and audit events.

## MUST
- Each production execution MUST have a unique correlation identifier and record actor, targets, code/version, intent revision, start/end status, and material changes.
- Logs MUST distinguish planning, validation, mutation, verification, rollback, and failure phases.
- Metrics MUST expose success, failure, duration, retries, skipped targets, and change volume at useful dimensions.
- Sensitive values MUST be redacted before telemetry emission.
- Audit evidence for privileged changes MUST be retained according to applicable policy.

## MUST NOT
- MUST NOT log secrets or complete reusable credentials.
- MUST NOT report a workflow as successful when required targets or verification steps failed.
- MUST NOT depend on ephemeral console output as the only record of production mutations.

## SHOULD
- Traces SHOULD correlate controller, worker, external API, and device operations where practical.
- Dashboards SHOULD surface systemic error patterns and abnormal change volume.

## Exceptions
Telemetry degradation must not silently remove required change accountability; use a documented fallback record or halt high-risk changes.

## Verification
Inspect sample execution records, redaction tests, metric cardinality, failure-state reporting, retention configuration, and correlation across planning, mutation, and verification evidence.