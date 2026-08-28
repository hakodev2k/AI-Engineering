# Observability Testing and Validation

## Purpose
Test telemetry and observability behavior as an engineering capability so dashboards, alerts, traces, and diagnostic queries remain trustworthy through change.

## When to use
Use when changing instrumentation, collector pipelines, alert rules, telemetry schemas, or observability backends.

## Inputs
Instrumentation code, pipeline configuration, alert rules, dashboards, SLO queries, test workloads, known failure scenarios.

## Context to inspect
Inspect existing telemetry tests, CI checks, synthetic probes, historical incidents, schema rules, and deployment gates.

## Core knowledge
Understand contract testing, synthetic telemetry, golden queries, alert-rule testing, failure injection, schema compatibility, and end-to-end validation.

## Procedure
1. Identify critical telemetry contracts and diagnostic workflows.
2. Create representative success, error, timeout, and dependency-failure scenarios.
3. Verify expected logs, metrics, traces, and correlation fields.
4. Test metric and trace cardinality limits.
5. Evaluate alert rules using historical or synthetic time series.
6. Validate dashboards and SLO queries against known scenarios.
7. Test collector/backend degradation and telemetry recovery.
8. Add automated schema and configuration checks to CI where practical.
9. Re-run end-to-end validation after platform upgrades.
10. Record known blind spots and accepted limitations.

## Decision points
Automate stable contracts and high-risk failure paths; use controlled manual validation for exploratory dashboards or backend-specific behaviors that are costly to simulate.

## Common failure patterns
Testing only configuration syntax, assuming emitted telemetry was successfully stored, no negative tests, brittle exact-value assertions, and never validating alert recovery.

## Verification
Evidence must show telemetry is emitted, transported, stored, queryable, correlated, and interpreted correctly under representative conditions.

## Expected output
A repeatable validation suite and evidence that critical observability workflows function end to end.

## Stop conditions
Stop release when critical observability contracts fail or required production failure behavior cannot be safely validated.