# SOC Change Risk Management

## Purpose
Introduce detection, telemetry, automation and response changes without silently degrading coverage or causing operational outages.

## When to use
Use for parser migrations, SIEM changes, EDR policy updates, automation releases, major rule tuning and security-tool upgrades.

## Inputs
Change scope, dependencies, test evidence, affected detections, rollback plan, maintenance window and owners.

## Context to inspect
Identify schema consumers, alert routing, API integrations, retention, dashboards, automation and critical response paths.

## Core knowledge
Security operations changes can fail silently: events still arrive while fields, semantics or routing break. Treat changes as production engineering with explicit blast-radius control.

## Procedure
1. Define desired outcome and affected components.
2. Map upstream/downstream dependencies.
3. Establish pre-change health baseline.
4. Create representative regression tests.
5. Define rollback trigger and mechanism.
6. Stage changes where possible.
7. Monitor ingestion, parsing, detection firing and routing during rollout.
8. Compare key health metrics with baseline.
9. Validate critical detections end-to-end.
10. Roll back on defined failure thresholds.
11. Record results and update dependency documentation.

## Decision points
Use canary deployment for high-blast-radius changes. Schedule risky changes when response coverage is strongest, not merely when engineering is convenient.

## Common failure patterns
Parser changes without rule tests; no rollback; simultaneous unrelated changes; relying on vendor upgrade success messages; ignoring cost spikes.

## Verification
Confirm critical telemetry and detections pass regression tests, operational metrics remain acceptable and rollback was proven or remains available.

## Expected output
A controlled change record with dependency map, test evidence, monitoring and rollback criteria.

## Stop conditions
Stop rollout on unexplained telemetry loss, critical detection failure, uncontrolled cost or inability to restore prior state.