# Observability and Operational Readiness

## Purpose
Ensure software is diagnosable, measurable, and supportable before production exposure.

## When to use
Use during feature design, release readiness, service onboarding, or after difficult incidents.

## Inputs
Architecture, critical journeys, SLOs, logs, metrics, traces, dashboards, alerts, runbooks.

## Context to inspect
Inspect failure modes, dependencies, asynchronous flows, correlation identifiers, sensitive data, and on-call expectations.

## Core knowledge
Observability should answer operational questions, not maximize telemetry volume. Signals need context, cardinality control, retention awareness, and actionable ownership.

## Procedure
1. Define critical user and system outcomes.
2. Identify failure modes requiring detection or diagnosis.
3. Define metrics for health, load, errors, latency, and saturation.
4. Add structured logs at meaningful state transitions.
5. Propagate trace/correlation context across boundaries.
6. Build dashboards around operator questions.
7. Alert on actionable symptoms tied to impact.
8. Document mitigation and ownership.
9. Exercise failure scenarios before release.
10. Tune noisy or blind signals from production evidence.

## Decision points
Prefer symptom-based alerts for paging and diagnostic signals for investigation. Sample high-volume traces while preserving rare critical paths.

## Common failure patterns
Logging everything, secrets in logs, alerting every exception, dashboards without owners, and telemetry added only after outages.

## Verification
Operators can detect, scope, and diagnose representative failures using available telemetry and runbooks.

## Expected output
Operationally ready software with useful telemetry, alerts, dashboards, and response guidance.

## Stop conditions
Stop release when critical failures cannot be detected or diagnosed to an acceptable level.