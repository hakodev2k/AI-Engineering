# Observability Validation

## Purpose
Use controlled failures to prove that logs, metrics, traces, dashboards, and alerts reveal real failure modes quickly enough for operators.

## When to use
Use after adding telemetry, before relying on new alerts, and when incidents exposed visibility gaps.

## Inputs
Telemetry architecture, dashboards, alerts, SLOs, runbooks, and planned fault.

## Context to inspect
Inspect signal coverage across user requests, dependencies, queues, infrastructure, and correlation identifiers.

## Core knowledge
Observability should support detection, localization, impact assessment, and recovery verification. An alert that fires without actionable context is incomplete.

## Procedure
1. Define what operators should observe for the selected failure.
2. Record expected metrics, logs, traces, and alerts.
3. Inject a bounded fault.
4. Measure detection latency and signal quality.
5. Attempt diagnosis using normal operational tools only.
6. Identify blind spots and noisy signals.
7. Improve telemetry/runbooks and repeat.

## Decision points
Alert on user-impacting symptoms where possible; use cause-oriented alerts when they demand distinct immediate action. Prefer structured correlated telemetry over ad hoc logs.

## Common failure patterns
No correlation IDs, alerts on every replica failure, dashboards hiding tail latency, missing dependency spans, and telemetry failing with the service.

## Verification
Confirm operators can detect, scope, diagnose, and recognize recovery within target times.

## Expected output
Validated observability coverage and concrete telemetry improvements.

## Stop conditions
Stop if the experiment cannot be safely observed or telemetry loss prevents reliable impact assessment.