# Observability and Telemetry

## Purpose
Design telemetry that makes AI behavior, dependency health, model usage, retrieval quality, and business outcomes diagnosable in production.

## When to use
Use before production rollout or when failures cannot be traced across model, retrieval, orchestration, and integration layers.

## Inputs
Architecture, critical user journeys, SLOs, model calls, tool calls, retrieval stages, data policies, incident needs, and existing monitoring platform.

## Context to inspect
Inspect current logs, metrics, traces, dashboards, correlation identifiers, alerting, privacy constraints, and model/provider telemetry.

## Core knowledge
AI observability combines conventional service telemetry with model-specific signals such as token usage, model/version, prompt template version, retrieval results, tool outcomes, quality indicators, and fallback usage. Sensitive content should not be logged by default.

## Procedure
1. Map critical request paths and correlation boundaries.
2. Define service-level logs, metrics, and traces.
3. Record model and prompt versions without exposing sensitive content.
4. Measure token use, latency, errors, retries, and fallback rates.
5. Instrument retrieval queries, hit counts, ranking signals, and no-result cases.
6. Track tool invocation outcomes and workflow state transitions.
7. Connect technical signals to user and business outcomes.
8. Define dashboards and alerts for actionable conditions.
9. Establish sampling, retention, and redaction policies.
10. Test telemetry during simulated failures.

## Decision points
Prefer structured events and traces over verbose text logs. Capture payload samples only when governance permits and diagnostic value justifies the risk.

## Common failure patterns
Logging prompts indiscriminately, no correlation across AI stages, monitoring only HTTP availability, and alerting on noisy metrics with no operator action.

## Verification
Operators can trace representative failures end to end and identify model, retrieval, integration, or infrastructure causes from approved telemetry.

## Expected output
An observability design with signals, schemas, dashboards, alerts, privacy rules, and incident-use examples.

## Stop conditions
Stop when required telemetry would violate data policy, critical stages cannot be correlated, or alerts have no accountable response owner.