# Reliability Observability and Telemetry

## Purpose
Build telemetry that explains AI service reliability across application, model, retrieval, agent, tool, provider, and infrastructure layers.

## When to use
Use during production readiness, incident follow-up, architecture changes, or when operators cannot quickly localize failures.

## Inputs
Architecture, request flows, logs, metrics, traces, model metadata, retrieval events, tool actions, incident history.

## Preconditions
Telemetry can be collected without violating privacy, security, or data-retention requirements.

## Context to inspect
Correlation IDs, trace propagation, sampling, dashboards, alert rules, model/prompt versioning, tenant dimensions, provider metrics.

## Core knowledge
A technically successful request may still be unreliable because of invalid structure, poor grounding, policy failure, or tool error. Observability must connect user outcome to the exact model, prompt, retrieval context, dependency, and action path.

## Procedure
1. Map critical request paths and failure domains.
2. Define golden operational signals: rate, errors, duration, saturation, and queue age.
3. Add AI-specific dimensions: model, version, prompt, token usage, finish reason, retrieval status, tool outcome, safety decision.
4. Propagate correlation across async boundaries.
5. Log structured events with sensitive data minimized.
6. Add traces around external dependencies and long-running agent steps.
7. Build dashboards by user journey and failure domain.
8. Set actionable alerts tied to SLO burn or material failure.
9. Validate telemetry during synthetic faults.
10. Review signal usefulness after incidents.

## Decision points
Prefer high-cardinality identifiers in traces or logs rather than uncontrolled metric labels. Sample routine traffic more aggressively than failures, but preserve enough evidence for rare incidents.

## Common failure patterns
HTTP-only telemetry, no model or prompt version, broken trace context across queues, PII-heavy logging, alert noise, and dashboards without owners.

## Verification
Known fault scenarios produce enough correlated evidence to identify the failing layer and affected scope.

## Expected output
An observability design with metrics, logs, traces, dimensions, dashboards, alerts, retention, and ownership.

## Stop conditions
Escalate when required observability conflicts with privacy, security, or provider visibility limitations.