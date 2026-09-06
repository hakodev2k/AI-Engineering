# Observability and Auditability

## Purpose
Make workflow behavior diagnosable in production and reconstructable for operational or compliance review without exposing sensitive data.

## When to use
Use for any production automation with external dependencies, business side effects, AI steps, SLAs, or regulated/audited actions.

## Inputs
Workflow states, business identifiers, dependencies, SLIs/SLOs, logging platform, tracing capabilities, data-classification rules, and audit requirements.

## Context to inspect
Inspect existing logs, metrics, trace propagation, dashboards, alert rules, execution history, PII exposure, and incident investigation gaps.

## Core knowledge
Logs explain discrete events, metrics reveal aggregate behavior, and traces connect causality across components. Audit records answer who/what/when/why for material actions. Observability data must have stable correlation IDs and controlled cardinality.

## Procedure
1. Define the questions operators must answer during failures.
2. Select stable workflow, correlation, tenant, and business-operation identifiers.
3. Emit structured events for state transitions and side effects.
4. Record dependency latency and categorized outcomes.
5. Track throughput, success rate, queue age, retry rate, and terminal failures.
6. Trace cross-system calls where supported.
7. Record AI model/version and evaluation-relevant metadata without sensitive prompt leakage.
8. Create immutable audit events for privileged or material actions.
9. Redact secrets and minimize personal data.
10. Build dashboards and symptom-based alerts.
11. Test that a failed execution can be reconstructed from telemetry.

## Decision points
Use high-cardinality identifiers in logs/traces rather than metric labels. Retain audit data according to policy, not indefinitely. Sample traces only when critical failure visibility remains adequate.

## Common failure patterns
Only logging exceptions, no correlation ID, secrets in payload logs, high-cardinality metrics, alerts on every transient retry, and audit records that omit decision context.

## Verification
Choose representative executions and reconstruct their path, inputs/outputs at safe metadata level, decisions, side effects, and failure causes from telemetry alone.

## Expected output
An observability specification with events, metrics, traces, dashboards, alerts, audit fields, redaction, and retention.

## Stop conditions
Stop when required telemetry would violate data-handling policy or when material actions cannot be attributed to an identity or workflow execution.