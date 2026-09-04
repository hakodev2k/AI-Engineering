# Observability and Operational Readiness

## Purpose
Ensure migrated workloads can be detected, diagnosed, operated, and supported immediately in the target environment.

## When to use
Use before production cutover and during stabilization whenever operational tooling or ownership changes.

## Inputs
SLOs, logs, metrics, traces, dashboards, alerts, runbooks, on-call model, incident history, health checks, backup procedures, and support escalation paths.

## Preconditions
Target telemetry services and operational owners must be available before production traffic arrives.

## Context to inspect
Inspect application/infrastructure telemetry, correlation IDs, retention, alert routing, synthetic checks, audit logs, dashboards, on-call schedules, runbooks, maintenance, backup, and capacity signals.

## Core knowledge
Telemetry must answer user-impact, dependency, saturation, and failure questions. Migrating dashboards without validating semantics can create blind spots because metric names and platform behavior change.

## Procedure
1. Identify critical user journeys and SLO indicators.
2. Map source telemetry to target signals.
3. Instrument gaps before cutover.
4. Validate log completeness, timestamps, correlation, and retention.
5. Build dashboards for health, dependencies, capacity, and business signals.
6. Configure actionable alerts with ownership and severity.
7. Validate synthetic monitoring from relevant locations.
8. Test traces across migrated and hybrid dependencies.
9. Update runbooks for target platform operations.
10. Test backup, restore, restart, scale, and failover procedures.
11. Run an operational-readiness review with on-call staff.
12. Monitor closely during stabilization and tune noisy/missing alerts.

## Decision points
Alert on symptoms tied to user impact where possible; use cause-oriented alerts when immediate action is required. Centralize telemetry when cross-service diagnosis benefits, while preserving team-specific views.

## Common failure patterns
Dashboards exist but no alerts; alerts route to old teams; missing correlation across hybrid calls; no audit retention; noisy thresholds copied from source; backup status monitored but restore never tested.

## Verification
Inject or simulate representative failures and confirm detection, routing, diagnosis, and runbook execution. Demonstrate dashboards and alerts during rehearsal.

## Expected output
Validated telemetry, dashboards, alerts, runbooks, ownership, and operational-readiness sign-off.

## Stop conditions
Do not cut over when critical failures would be invisible, alert ownership is absent, restore procedures are untested, or telemetry retention violates requirements.