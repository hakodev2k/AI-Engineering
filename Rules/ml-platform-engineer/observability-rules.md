# Observability

## Purpose
Make platform and ML workload failures diagnosable from operational evidence.

## Scope
Metrics, logs, traces, events, dashboards, and correlation metadata.

## MUST
- Critical platform paths MUST expose service health, latency, errors, saturation, and workload outcome signals.
- Telemetry MUST support correlation across orchestration, compute, artifact, and serving boundaries.
- Logs MUST preserve diagnostic context without exposing secrets or unnecessary sensitive data.
- SLO-impacting failures MUST be distinguishable from user workload failures.

## MUST NOT
- Production conclusions MUST NOT rely solely on anecdotal reports when telemetry exists.
- High-cardinality dimensions MUST NOT be introduced without cost and operability review.

## SHOULD
- Telemetry SHOULD identify model/version and platform component versions where safe.

## Exceptions
Telemetry omissions require documented privacy, cost, or technical rationale and alternate diagnostic evidence.

## Verification
Inspect dashboards, traces, log redaction, metric cardinality, synthetic failures, and incident diagnostic timelines.