# Observability and Incident Rules

## Purpose
Provide sufficient operational evidence to detect, diagnose, and contain model-registry failures.

## Scope
Logs, metrics, traces, alerts, lifecycle events, artifact operations, and incident response.

## MUST
- Registry telemetry MUST cover request failures, latency, storage errors, promotion failures, artifact verification failures, and authorization denials.
- Logs MUST identify model namespace and immutable version where relevant without exposing secrets or sensitive payloads.
- Alerts MUST map to actionable conditions and accountable ownership.
- Incident analysis MUST use available logs, metrics, traces, audit events, and deployment records as evidence.
- Confirmed registry failure modes MUST produce corrective controls or regression coverage.

## MUST NOT
- MUST NOT log credentials, tokens, private signing material, or sensitive model payloads unnecessarily.
- MUST NOT delete evidence needed for an active investigation.
- MUST NOT claim root cause solely from timing correlation.

## SHOULD
- Annotate dashboards with deployments, schema changes, and storage migrations.
- Track SLO-relevant error and latency distributions.

## Exceptions
Telemetry reductions require documented privacy, cost, or platform constraints and alternative evidence.

## Verification
Inspect dashboards, alert rules, log redaction, incident records, and post-incident test coverage.