# Tooling Observability and Support

## Purpose
Make developer tooling diagnosable and supportable through telemetry, structured errors, health signals, and ownership.

## When to use
Use for shared CLIs, build systems, CI services, portals, scaffolding, or platform workflows with material adoption.

## Inputs
Tool architecture, logs, support incidents, SLIs, dependency map, and privacy constraints.

## Context to inspect
Inspect failure modes, correlation identifiers, client/server boundaries, telemetry collection, retention, dashboards, alerts, and runbooks.

## Core knowledge
Tooling should expose enough context to distinguish user error, configuration error, dependency failure, and platform defect without leaking secrets or source data.

## Procedure
1. Enumerate critical user journeys and failure classes.
2. Define structured events and correlation IDs.
3. Instrument latency, success, dependency errors, and versions.
4. Redact sensitive values by design.
5. Create journey-level dashboards and actionable alerts.
6. Improve user-facing errors with remediation.
7. Write support/runbook paths for common failures.
8. Review incidents to close observability gaps.

## Decision points
Collect only telemetry needed for operation and improvement; prefer opt-in or aggregated signals when privacy risk is material.

## Common failure patterns
Logging secrets, telemetry without version context, alerting on noise, client errors hidden as server failures, and dashboards without owners.

## Verification
Inject representative failures and confirm both developers and support engineers can identify cause and remediation from available evidence.

## Expected output
Privacy-aware telemetry, dashboards, diagnostics, runbooks, and clear operational ownership.

## Stop conditions
Stop when privacy, retention, or security requirements for telemetry are unresolved.