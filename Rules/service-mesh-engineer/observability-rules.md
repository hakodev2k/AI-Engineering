# Mesh Observability
## Purpose
Make service communication behavior diagnosable from evidence.
## Scope
Metrics, logs, traces, access telemetry, topology, and correlation.
## MUST
- Mesh telemetry MUST expose request rate, errors, latency, and saturation signals where available.
- Telemetry MUST preserve service identity and destination context needed for diagnosis.
- Sampling changes MUST consider incident and compliance requirements.
## MUST NOT
- MUST NOT emit secrets, credentials, or sensitive payloads into access telemetry.
- MUST NOT declare a mesh change healthy solely from proxy readiness.
- MUST NOT rely on dashboards without alert or query validation.
## SHOULD
- Trace propagation SHOULD remain consistent across proxy and application boundaries.
## Exceptions
Reduced telemetry requires documented cost/privacy reason and alternative evidence.
## Verification
Inspect telemetry pipelines, sample traces, metric labels, redaction behavior, dashboards, and alert tests.