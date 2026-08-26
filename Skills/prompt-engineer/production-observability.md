# Prompt Production Observability

## Purpose
Make prompt behavior measurable in production so regressions, drift, cost changes, and failure clusters can be detected and diagnosed.

## When to use
Use for production AI systems beyond low-risk prototypes.

## Inputs
Prompt/model versions, request traces, quality signals, token/cost data, latency, tool traces, privacy requirements, and incident history.

## Context to inspect
Inspect existing logging, tracing, sampling, retention, redaction, dashboards, and alerting.

## Core knowledge
AI observability requires configuration provenance plus outcome signals. Logging all prompt content can create privacy/security risk; observability must minimize sensitive data.

## Procedure
1. Define key failure and health indicators.
2. Attach prompt, model, schema, and tool versions to traces.
3. Capture latency, tokens, errors, retries, tool outcomes, and terminal reason.
4. Sample outputs for quality review under approved privacy controls.
5. Redact or avoid sensitive prompt/context data.
6. Build dashboards by task slice and version.
7. Alert on meaningful threshold changes rather than raw noise.
8. Correlate regressions with deployments/provider changes.
9. Feed confirmed failures into evaluation datasets.
10. Periodically review telemetry usefulness and retention.

## Decision points
Prefer derived metrics over raw content when privacy risk is high. Use sampled human review where automated metrics cannot assess semantic quality.

## Common failure patterns
No version tags; logging secrets; monitoring only HTTP errors; averages hiding bad slices; alerts with no actionable threshold; telemetry never feeding regression tests.

## Verification
A known injected failure is detectable, traceable to effective configuration, and diagnosable without exposing unnecessary sensitive data.

## Expected output
Telemetry schema, dashboards, alerts, sampling policy, and failure-to-eval feedback loop.

## Stop conditions
Stop if telemetry would violate privacy/security policy or production outputs cannot be associated with their effective configuration.