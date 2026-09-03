# Observability Rules

## Purpose
Make serving behavior diagnosable from request admission through model execution.

## Scope
Applies to logs, metrics, traces, dashboards, and alerts for inference services.

## MUST
- Measure request rate, errors, latency, queue delay, concurrency, saturation, and model-specific execution metrics.
- Correlate requests across gateway, scheduler, worker, and dependency boundaries.
- Record model and runtime version identifiers in operational telemetry.
- Alert on user-impacting symptoms and resource exhaustion with actionable thresholds.

## MUST NOT
- Log prompts, outputs, tokens, credentials, or sensitive metadata by default.
- Treat aggregate averages as sufficient for tail-latency diagnosis.
- Declare incidents resolved without evidence that affected signals recovered.

## SHOULD
- Expose stage-level timing and accelerator utilization where available.
- Maintain dashboards aligned to SLOs and known failure modes.

## Exceptions
Additional sensitive telemetry requires explicit privacy/security review, restricted access, retention limits, and documented necessity.

## Verification
Inspect telemetry schemas, dashboards, alert rules, trace samples, log redaction tests, and incident evidence.