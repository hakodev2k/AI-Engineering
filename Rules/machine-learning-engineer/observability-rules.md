# ML Observability Rules
## Purpose
Make production model behavior and failures diagnosable.
## Scope
Inference services, batch scoring, pipelines, and model-dependent workflows.
## MUST
- Capture model version, request correlation, latency, error class, prediction-health signals, and relevant feature-health metadata without exposing sensitive data.
- Make operational and model-quality failures distinguishable.
- Define dashboards and alerts for critical service and model indicators.
## MUST NOT
- Log secrets, raw sensitive payloads, or protected data without explicit authorization and controls.
- Rely on application uptime as the sole health signal for an ML system.
## SHOULD
- Link model, data, and infrastructure telemetry through traceable identifiers.
## Exceptions
Telemetry reductions require documented privacy or cost rationale and compensating evidence.
## Verification
Inspect logs, metrics, traces, dashboards, redaction tests, and alert exercises.