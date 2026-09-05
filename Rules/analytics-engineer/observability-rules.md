# Analytics Observability Rules

## Purpose
Provide operational evidence for freshness, failures, volume changes, quality regressions, and downstream impact.

## Scope
Applies to transformation jobs, datasets, orchestration, warehouse workloads, and published analytical outputs.

## MUST
- Critical pipelines MUST expose execution status, duration, freshness, and failure information.
- Critical datasets MUST have observable freshness and volume expectations where relevant.
- Alerts MUST identify actionable conditions, severity, and accountable ownership.
- Production conclusions MUST use logs, run metadata, query history, quality results, or equivalent evidence.
- Deployment or transformation version information MUST be traceable during incident investigation.

## MUST NOT
- MUST NOT rely solely on dashboard user reports to detect critical pipeline failures.
- MUST NOT alert on every transient event without considering actionability and noise.
- MUST NOT expose sensitive row contents unnecessarily in logs or alerts.

## SHOULD
- Track lineage-aware blast radius for failed critical models.
- Monitor duration and cost trends to detect gradual degradation.

## Exceptions
Reduced telemetry requires documented rationale, risk, and alternative evidence.

## Verification
Inspect dashboards, alerts, run logs, freshness monitors, query history, ownership, and incident examples.