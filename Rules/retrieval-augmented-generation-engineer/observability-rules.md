# Observability Rules

## Purpose
Make RAG behavior diagnosable across ingestion, retrieval, ranking, context assembly, generation, and grounding.

## Scope
Applies to logs, metrics, traces, evaluation telemetry, dashboards, and alerting for production RAG systems.

## MUST
- Requests MUST be traceable across query understanding, retrievers, filters, ranking, context assembly, generation, and response validation using correlation identifiers.
- Telemetry MUST expose retrieval latency, candidate counts, empty-retrieval rate, ranking failures, context size, model latency, grounding failures, and error rate where applicable.
- Logs and traces MUST preserve enough provenance to reproduce failures without exposing secrets or unauthorized content.
- Production dashboards MUST distinguish infrastructure failures from retrieval-quality and generation-quality failures.
- Alerts MUST target actionable user or system impact rather than raw event volume alone.
- Sampling policies MUST retain sufficient high-risk and error traffic for investigation.

## MUST NOT
- Secrets, credentials, authentication tokens, or unrestricted sensitive document content MUST NOT be logged.
- Aggregate success metrics MUST NOT conceal failures in critical tenants, sources, languages, or risk categories.
- Trace gaps across major RAG stages MUST NOT be accepted as normal when they prevent root-cause analysis.

## SHOULD
- Track retrieval and grounding quality indicators alongside system reliability metrics.
- Preserve version identifiers for prompts, models, indexes, and retrievers in diagnostic telemetry.
- Use structured logs and distributed tracing for multi-service pipelines.

## Exceptions
Exceptions require documented privacy or platform constraints, alternative evidence, and approval when observability is reduced for production-critical paths.

## Verification
Inspect dashboards, trace samples, log schemas, alert tests, redaction tests, incident investigations, and stage-level metrics for representative requests.