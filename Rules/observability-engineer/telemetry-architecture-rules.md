# Telemetry Architecture Rules
## Purpose
Ensure telemetry supports reliable diagnosis and decisions across systems.
## Scope
Logs, metrics, traces, events, and telemetry pipelines.
## MUST
- Define telemetry goals from service risks, user journeys, and operational questions.
- Standardize service identity, environment, version, and correlation attributes.
- Design collection paths with known failure and backpressure behavior.
## MUST NOT
- Collect telemetry without an operational or analytical purpose.
- Treat telemetry availability as equivalent to service health.
## SHOULD
- Prefer interoperable schemas and vendor-neutral instrumentation where practical.
## Exceptions
Project constraints may require proprietary mechanisms when portability trade-offs are documented.
## Verification
Review telemetry diagrams, schemas, collectors, sample signals, and failure tests.