# Observability Rules

## Purpose
Make contract health and violations visible in production.

## Scope
Applies to contract validation, quality, freshness, availability, compatibility, and consumer-facing failures.

## MUST
- Critical contracts MUST expose operational evidence for agreed quality and freshness guarantees.
- Contract validation failures MUST identify the affected contract version and failure category.
- Alerting MUST route actionable violations to an accountable owner.
- Production conclusions MUST use available metrics, logs, lineage, or equivalent evidence rather than assumption.

## MUST NOT
- Contract violations MUST NOT be silently dropped solely to preserve pipeline success.
- Monitoring MUST NOT expose sensitive data values unnecessarily.
- Alert success MUST NOT be inferred from dashboard existence without verifying signal collection and routing.

## SHOULD
- Observability SHOULD separate producer failures, transport failures, and semantic-quality failures.
- Dashboards SHOULD show trends and breach duration, not only current status.

## Exceptions
Exceptions require documented visibility gap, risk, compensating detection method, owner, and remediation plan.

## Verification
Inspect monitors, alerts, dashboards, sampled failure events, routing configuration, and incident records.