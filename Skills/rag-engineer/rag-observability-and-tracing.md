# RAG Observability and Tracing

## Purpose
Make retrieval and generation behavior diagnosable without exposing sensitive corpus content.

## When to use
Use for production readiness, incident response, quality monitoring, and cost analysis.

## Inputs
Pipeline stages, telemetry platform, privacy policy, SLOs, query metadata, evaluation signals.

## Context to inspect
Inspect current logs, trace propagation, model/retriever versions, token accounting, latency metrics, error taxonomy, and sensitive-data rules.

## Core knowledge
A RAG request spans ingestion state, query processing, retrieval, reranking, context assembly, and generation. Correlation IDs and version metadata are essential for reproducibility. Raw prompts and documents may be sensitive.

## Procedure
1. Define request-level correlation and stage spans.
2. Record model, index, embedding, parser, and prompt versions.
3. Capture stage latency, candidate counts, token use, cache status, and errors.
4. Record provenance IDs rather than raw sensitive content by default.
5. Define quality feedback and retrieval-miss events.
6. Build dashboards for latency, errors, cost, freshness, and quality proxies.
7. Alert on actionable SLO breaches and anomalous shifts.
8. Sample traces for deep debugging under controlled access.
9. Set retention and redaction policies.
10. Test telemetry during degraded dependencies.

## Decision points
Increase trace detail temporarily for investigations rather than permanently logging sensitive payloads. Use sampling when volume is high but preserve error traces preferentially.

## Common failure patterns
Only model latency measured; prompts logged indiscriminately; no version tags; cardinality explosion; alerts without actionable thresholds.

## Verification
Trace a request end-to-end, reproduce a failure from metadata, validate redaction, and test alerts.

## Expected output
Privacy-aware observability that supports quality and production debugging.

## Stop conditions
Stop telemetry expansion when it would violate data-handling or access policies.