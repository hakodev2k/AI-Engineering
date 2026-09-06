# Context Observability Rules

## Purpose
Make context construction diagnosable in production without exposing restricted content unnecessarily.

## Scope
Metrics, traces, structured logs, source counts, token usage, retrieval outcomes, and context assembly events.

## MUST
- Production context pipelines MUST expose token usage, source counts, retrieval latency, truncation, cache behavior, and assembly failures.
- Traces MUST identify context stages and versions without requiring raw content disclosure.
- Observability MUST distinguish retrieval failure, empty results, filtering, truncation, and model-side failure.
- Sensitive fields MUST be redacted or represented by safe metadata.

## MUST NOT
- MUST NOT log full restricted context by default.
- MUST NOT hide context assembly failures behind generic model errors.
- MUST NOT rely on unstructured logs alone for critical diagnostics.

## SHOULD
- Record source categories and trust levels as structured dimensions.
- Correlate context metrics with model-quality regressions.

## Exceptions
Exceptions require documented diagnostic need and data-handling controls.

## Verification
Inspect dashboards, traces, log schemas, redaction tests, and incident evidence.