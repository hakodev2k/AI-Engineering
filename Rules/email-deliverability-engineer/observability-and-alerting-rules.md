# Observability and Alerting Rules

## Purpose
Make delivery health measurable from send request through receiver outcome.

## Scope
Metrics, logs, traces, dashboards, alerts, event pipelines, and service objectives.

## MUST
- Observability MUST distinguish queued, attempted, accepted, deferred, bounced, complained, suppressed, and provider-event states where available.
- Metrics MUST be segmentable by stream and major recipient domain without exposing unnecessary personal data.
- Alerts MUST cover material authentication failures, complaint spikes, bounce anomalies, sustained deferrals, queue age, and event-pipeline loss.
- Operational conclusions MUST use production evidence and state known telemetry gaps.
- Metric definitions and denominators MUST be documented and stable enough for trend comparison.

## MUST NOT
- MUST NOT log full message bodies, credentials, tokens, or recipient data unless explicitly required and protected.
- MUST NOT treat opens as definitive human engagement evidence where automated privacy features can distort them.
- MUST NOT suppress alerts simply to reduce noise without addressing threshold quality or ownership.

## SHOULD
- Use receiver-specific baselines and anomaly detection where volume supports it.
- Correlate deploys and configuration changes with delivery signals.

## Exceptions
Telemetry reductions require privacy/cost rationale, impact assessment, alternative evidence, and approval for critical gaps.

## Verification
Inspect dashboards, metric definitions, sampled logs, alert tests, event reconciliation, data retention, and incident timelines.