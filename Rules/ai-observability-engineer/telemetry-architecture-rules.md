# Telemetry Architecture Rules

## Purpose
Define a production-grade observability architecture for AI systems so behavior can be reconstructed, measured, and governed across model, retrieval, agent, application, and infrastructure layers.

## Scope
Applies to telemetry schemas, collectors, pipelines, stores, correlation identifiers, and observability boundaries for production AI systems.

## MUST
- Every production AI request MUST have a stable correlation identifier propagated across application, model, retrieval, tool, queue, and downstream-service boundaries.
- Telemetry MUST distinguish request, model call, retrieval step, tool call, evaluation result, and user-visible outcome as separate event types.
- Telemetry schemas MUST be versioned and backward-compatible or migrated explicitly.
- Critical observability data MUST have documented ownership, retention, access control, and failure behavior.
- The architecture MUST define which signals are authoritative for latency, errors, quality, cost, and security investigation.

## MUST NOT
- Telemetry MUST NOT depend on free-form logs alone for critical production diagnosis.
- Schema changes MUST NOT silently break dashboards, alerts, or downstream analytics.
- Observability pipelines MUST NOT become required inline dependencies for serving user requests unless explicitly designed and tested as such.

## SHOULD
- Use structured events and standard trace context where practical.
- Prefer asynchronous export and bounded buffering for high-volume telemetry.

## Exceptions
Any exception requires documented rationale, risk, fallback evidence, and technical-owner approval when it weakens production diagnosability.

## Verification
Inspect telemetry schemas, trace propagation tests, pipeline topology, retention settings, failure tests, and sample end-to-end incidents to confirm a request can be reconstructed across system boundaries.