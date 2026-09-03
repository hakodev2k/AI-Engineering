# Pipeline Observability Rules

## Purpose
Make synthetic-data generation pipelines diagnosable, measurable, and safe to operate at scale.

## Scope
Applies to scheduled and on-demand generation, validation, filtering, labeling, packaging, and publishing pipelines.

## MUST
- Emit structured operational metrics for generation throughput, rejection rates, validation failures, latency, resource use, and dataset quality gates.
- Preserve correlation identifiers or equivalent traceability across generation, post-processing, validation, and publication stages.
- Alert on material deviations from expected output volume, failure rate, quality metrics, or distribution characteristics.
- Capture enough diagnostic context to distinguish generator defects, source-data issues, infrastructure failures, and validation failures without logging sensitive content unnecessarily.
- Monitor for silent partial completion, stale inputs, skipped validation stages, and publishing of incomplete outputs.
- Define ownership and response procedures for production pipeline alerts.

## MUST NOT
- Treat a successful job exit code as proof that a generated dataset is valid.
- Log raw sensitive source records, credentials, or unrestricted generated content merely for debugging convenience.
- Suppress recurring quality or pipeline alerts without documented root-cause handling.
- Publish artifacts when required validation telemetry is missing or inconclusive.

## SHOULD
- Track generator-version quality trends and rejection reasons over time.
- Use dashboards that separate operational health from dataset-quality health.
- Retain enough historical telemetry to investigate regressions between releases.

## Exceptions
Reduced telemetry requires a documented constraint, compensating checks, retention rationale, and owner approval.

## Verification
Inspect metrics, logs, traces, alert rules, dashboards, failure-injection tests, publishing gates, and evidence that alerts route to accountable owners and can identify the failed pipeline stage.