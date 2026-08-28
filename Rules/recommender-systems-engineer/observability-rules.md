# Observability Rules

## Purpose
Make recommendation behavior diagnosable from retrieval through final slate delivery.

## Scope
Applies to metrics, logs, traces, model/version metadata, feature diagnostics, and ranking decision telemetry.

## MUST
- Production requests MUST expose traceable model, feature, retrieval, and configuration versions without leaking sensitive data.
- Metrics MUST cover request volume, errors, latency, candidate counts, feature availability, fallback rates, and material ranking-quality guardrails.
- Alerts MUST target actionable failure conditions rather than raw metric movement alone.
- Diagnostic logging MUST support root-cause analysis of representative ranking failures.
- Observability schemas MUST be versioned when downstream dashboards or incident tooling depend on them.

## MUST NOT
- MUST NOT log secrets, raw authentication tokens, or unnecessary personal histories.
- MUST NOT rely on aggregate success metrics that hide critical segment failures.
- MUST NOT disable production telemetry solely to reduce cost without risk review.

## SHOULD
- Traces SHOULD identify the dominant latency and fallback path for sampled requests.
- Dashboards SHOULD separate model quality, data quality, and serving health signals.

## Exceptions
Exceptions require documented reason, compensating evidence, duration, and owner.

## Verification
Inspect dashboards, alert rules, trace samples, log schemas, privacy filters, and incident evidence from recent failures.