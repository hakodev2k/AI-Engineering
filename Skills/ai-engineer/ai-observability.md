# AI Observability

## Purpose
Make AI behavior diagnosable in production through traces, metrics, structured events, and quality signals.

## When to use
Use for every production AI workflow, especially RAG, agents, multi-model pipelines, and high-cost features.

## Inputs
Architecture, SLOs, model/tool calls, privacy rules, evaluation metrics, incident history.

## Preconditions
Define what can be logged safely and which identifiers allow end-to-end correlation.

## Context to inspect
Application telemetry, prompt/model versions, token usage, retrieval results, tool traces, error taxonomy, user feedback.

## Core knowledge
Traditional uptime metrics are insufficient. AI observability should capture model/version, latency, tokens, cost, schema failures, retrieval/tool behavior, safety outcomes, and sampled quality evidence without leaking sensitive data.

## Procedure
1. Define request and trace correlation IDs.
2. Record model, prompt, retrieval, and tool versions.
3. Emit latency, token, cost, retry, and error metrics by feature.
4. Capture structured failure categories rather than only exception text.
5. Trace multi-step agent and RAG stages.
6. Redact sensitive input/output before telemetry.
7. Connect production failures to evaluation cases.
8. Build alerts for material reliability, latency, cost, and quality regressions.
9. Review telemetry cardinality and storage cost.
10. Periodically validate that dashboards explain real incidents.

## Decision points
Sample full payloads only when privacy permits and diagnostic value justifies it. Prefer metadata for broad monitoring and targeted redacted traces for deep debugging.

## Common failure patterns
Logging secrets, no prompt/model version, high-cardinality labels, monitoring only HTTP status, and no link between incidents and evaluations.

## Verification
Trigger known failures and confirm traces expose the responsible stage while sensitive data remains protected.

## Expected output
Actionable dashboards, traces, alerts, and a safe telemetry contract.

## Stop conditions
Stop when telemetry design violates privacy policy or cannot correlate multi-stage requests.