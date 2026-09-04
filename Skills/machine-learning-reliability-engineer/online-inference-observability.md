# Online Inference Observability

## Purpose
Make online ML inference diagnosable end to end by connecting request behavior, feature health, model versions, latency, prediction outcomes, and dependency performance without creating unsafe or unbounded telemetry.

## When to use
Use when designing a real-time inference service, investigating production failures, establishing SLO monitoring, or improving incident response for an existing model endpoint.

## Inputs
- Serving architecture and request flow
- Model and feature metadata
- Existing logs, metrics, and traces
- SLOs and alerting requirements
- Privacy and retention constraints

## Context to inspect
Inspect request routing, preprocessing, feature retrieval, model execution, postprocessing, downstream calls, model/version selection, batching, caches, error handling, and current telemetry cardinality.

## Core knowledge
Useful ML observability joins software telemetry with model context. Critical signals include request count, errors, latency decomposition, queueing, feature freshness, missingness, model version, prediction distribution, fallback use, resource utilization, and dependency timing. High-cardinality identifiers and raw feature values can create cost and privacy risks, so tracing and sampling must be deliberate.

## Procedure
1. Map the full inference path from request arrival to final downstream decision.
2. Define service metrics for traffic, errors, saturation, and p50/p95/p99 latency.
3. Break latency into preprocessing, feature retrieval, model execution, postprocessing, and dependency spans.
4. Tag telemetry with stable model, configuration, route, and deployment versions.
5. Add feature-health indicators such as freshness, missingness, and contract violations without logging sensitive raw values unnecessarily.
6. Monitor prediction distributions and fallback/abstention rates by important cohorts.
7. Use structured logs with correlation IDs and bounded fields.
8. Add distributed traces for representative requests using sampling that preserves anomalous and failed requests.
9. Control metric cardinality; do not place unbounded entity IDs in metric labels.
10. Define dashboards that connect service health, feature health, model behavior, and deployment changes.
11. Validate alert thresholds against historical operating ranges and incident scenarios.
12. Document privacy, retention, and access controls for prediction telemetry.

## Decision points
Use metrics for aggregate health, traces for latency and dependency causality, and logs for detailed event evidence. Increase sampling around failures rather than retaining every request indefinitely. Store raw prediction examples only when justified by debugging value and privacy policy.

## Common failure patterns
- Model version is absent from telemetry.
- Metrics show total latency but not where time is spent.
- Raw sensitive features are logged for convenience.
- User IDs create explosive metric cardinality.
- Prediction distributions are monitored without traffic-segment context.
- Dashboards separate infrastructure and model signals so incidents are hard to correlate.

## Verification
Generate normal, slow, failed, stale-feature, fallback, and anomalous-prediction requests. Verify each can be localized through metrics, logs, and traces, model/version identity is preserved, cardinality remains bounded, and sensitive data controls are respected.

## Expected output
An inference observability specification with telemetry fields, metrics, traces, logs, dashboards, alert rules, sampling, privacy controls, and validation evidence.

## Stop conditions
Stop if required telemetry would violate privacy or retention requirements, if model/version identity cannot be established, or if observability overhead threatens the inference SLO without an acceptable sampling design.