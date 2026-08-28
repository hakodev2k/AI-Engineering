# Observability and Incident Rules

## Purpose
Detect, investigate, and contain BI production failures using operational evidence.

## Scope
Applies to data pipelines, warehouses, semantic models, refreshes, and business-critical dashboards.

## MUST
- Critical BI workflows MUST expose execution status, duration, freshness, and failure evidence.
- Incidents MUST identify affected datasets, reports, business processes, and time windows when determinable.
- Production conclusions MUST use logs, job history, query telemetry, data checks, or equivalent evidence.
- Recovery MUST include validation that corrected outputs are complete and consistent.

## MUST NOT
- MUST NOT mark an incident resolved solely because a job reran successfully.
- MUST NOT silently backfill or replace materially incorrect published data without recording the correction.

## SHOULD
- Recurring failures SHOULD receive root-cause analysis and preventive action proportional to impact.

## Exceptions
Exceptions require documented observability limitations, manual evidence, risk, and responsible owner.

## Verification
Review alerts, run history, incident timeline, validation results, and corrective-action records.