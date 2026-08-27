# Network Automation Observability

## Purpose
Make automation executions traceable from request through device/API mutations and verification.

## When to use
Use for production automation platforms, troubleshooting, audit, SLOs, and workflow reliability improvement.

## Inputs
Workflow stages, correlation IDs, logs, metrics, traces, target inventory, error taxonomy, and retention requirements.

## Context to inspect
Orchestrator logs, API/device logs, CI/CD, secret redaction, dashboards, and alerting.

## Core knowledge
Operators need to distinguish transport failure, authentication, validation, device rejection, partial mutation, postcheck failure, and orchestration bugs. Structured correlation is essential.

## Procedure
1. Assign execution and per-target correlation IDs.
2. Emit structured stage transitions and durations.
3. Record intended target/action without secret material.
4. Classify failures consistently.
5. Measure success rate, latency, retries, rollback, and partial-state incidents.
6. Trace external API/device calls where feasible.
7. Build workflow and target dashboards.
8. Alert on systemic failure rates, queue backlog, and unsafe retry patterns.
9. Link evidence to change records.
10. Review telemetry after incidents.

## Decision points
Log enough payload metadata for diagnosis but redact credentials and sensitive configuration. Page on systemic automation risk, not every single device rejection.

## Common failure patterns
Plain-text logs, no correlation IDs, secret leakage, success metrics that ignore postchecks, and no visibility into stuck queues.

## Verification
Trace a test change end to end, simulate failures at each stage, and confirm dashboards/error classifications reflect reality.

## Expected output
Structured telemetry, dashboards, alerts, error taxonomy, and auditable execution history.

## Stop conditions
Stop production rollout when execution state cannot be reliably observed or sensitive data appears in telemetry.