# Observability Rules

## Purpose
Make flag behavior diagnosable without creating excessive cost or sensitive-data exposure.

## Scope
Metrics, logs, traces, evaluation events, and rollout dashboards.

## MUST
- High-impact rollouts MUST expose adoption and relevant health signals segmented by variant when practical.
- Evaluation failures, stale configuration, and SDK health MUST be observable.
- Telemetry MUST identify flag and version while minimizing personal data.
- Production conclusions MUST use evidence from relevant telemetry rather than operator confidence.

## MUST NOT
- Secrets, tokens, or unnecessary sensitive targeting attributes MUST NOT be logged.
- High-cardinality evaluation data MUST NOT be emitted without cost and privacy controls.
- Missing telemetry MUST NOT be interpreted as success.

## SHOULD
- Dashboards SHOULD connect exposure changes with service and business guardrails.

## Exceptions
Reduced telemetry requires documented privacy, cost, or technical justification and alternate evidence.

## Verification
Inspect dashboards, schemas, sampling, redaction, alert tests, and representative traces.