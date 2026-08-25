# Migration Observability

## Purpose
Make migration state, health, and failure conditions visible.

## Scope
Covers metrics, logs, traces, dashboards, alerts, progress, and reconciliation signals.

## MUST
- Migration telemetry MUST expose progress, throughput, error rate, lag, resource pressure, and service impact where relevant.
- Alerts or operator gates MUST exist for conditions that require throttling, abort, or escalation.
- Correlation between migration activity and production health MUST be possible using timestamps or identifiers.

## MUST NOT
- MUST NOT log sensitive payloads merely to improve troubleshooting.
- MUST NOT declare success from process exit status alone when data or service validation is required.

## SHOULD
- Establish baseline metrics before migration starts.
- Retain enough telemetry for post-migration diagnosis and audit.

## Exceptions
Where instrumentation is constrained, equivalent human-observable evidence and tighter execution bounds are required.

## Verification
Inspect dashboards, alert tests, log redaction, baseline snapshots, progress counters, and post-cutover health evidence.