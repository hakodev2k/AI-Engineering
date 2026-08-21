# Performance Observability Rules
## Purpose
Make production performance diagnosable with trustworthy telemetry.
## Scope
Metrics, traces, logs, profiles, dashboards, and alerts.
## MUST
- Instrument critical paths for latency, throughput, errors, saturation, and dependency timing.
- Preserve correlation across distributed operations where practical.
- Define telemetry cardinality and sampling so observability remains usable and affordable.
## MUST NOT
- Log secrets or sensitive payloads for performance diagnosis.
- Declare a bottleneck from one telemetry signal when corroborating evidence is available.
## SHOULD
- Maintain dashboards aligned with performance objectives and resource limits.
## Exceptions
Sampling reductions require documented diagnostic trade-offs.
## Verification
Inspect instrumentation, dashboards, trace coverage, alert rules, retention, and data quality.