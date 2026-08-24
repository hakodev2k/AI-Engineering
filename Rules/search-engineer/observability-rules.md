# Search Observability

## Purpose
Make search quality and system behavior diagnosable from production evidence.

## Scope
Metrics, logs, traces, dashboards, query diagnostics, and correlation.

## MUST
- Monitor latency, errors, timeouts, saturation, indexing lag, rejection rates, and availability for critical search paths.
- Provide correlation across request, retrieval, reranking, and downstream stages without exposing sensitive query data unnecessarily.
- Define alerts from user-impacting symptoms or actionable capacity risks.
- Retain version identifiers for ranking, schema, model, and index configuration in diagnostics.

## MUST NOT
- Log secrets, authentication tokens, or unrestricted sensitive query payloads.
- Use high-cardinality labels that can destabilize telemetry systems without controls.
- Treat absence of alerts as proof of relevance quality.

## SHOULD
- Maintain dashboards that connect technical health to search outcomes.
- Sample expensive diagnostics safely.

## Exceptions
Exceptions require observability gap, risk, alternate evidence, and remediation plan.

## Verification
Inspect dashboards, alert tests, trace coverage, log redaction, cardinality controls, and incident diagnostic evidence.