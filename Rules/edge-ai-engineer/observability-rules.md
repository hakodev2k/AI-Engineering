# Observability Rules

## Purpose
Make edge AI behavior diagnosable without violating privacy or exhausting device resources.

## Scope
Logs, metrics, traces, model/version identifiers, performance telemetry, and fleet health signals.

## MUST
- Operational telemetry MUST identify the active model, runtime, and relevant device class without exposing sensitive payloads.
- Metrics MUST cover failures, latency, fallback usage, update status, and resource pressure relevant to the feature.
- Telemetry volume MUST be bounded and designed for intermittent connectivity.
- Critical failure states MUST remain diagnosable even when upload is delayed.

## MUST NOT
- MUST NOT log raw sensitive inputs, outputs, credentials, or tokens unless explicitly authorized and protected.
- MUST NOT depend on continuous network access for all diagnostic evidence.

## SHOULD
- Aggregate locally where it reduces data volume without hiding important failures.

## Exceptions
Require privacy/cost rationale and alternative diagnostic evidence.

## Verification
Inspect telemetry schemas, sampling limits, redaction tests, offline buffering behavior, and fleet dashboards.