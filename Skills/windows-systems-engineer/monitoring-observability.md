# Windows Monitoring and Observability

## Purpose
Design actionable Windows observability that detects service risk, accelerates diagnosis, and avoids alert noise.

## When to use
Use for new services, monitoring gaps, noisy alerts, capacity planning, SLO support, or incident improvement.

## Inputs
Service objectives, Windows roles, dependencies, telemetry platform, critical events/counters, ownership, and escalation paths.

## Preconditions
Define what user/service health means before choosing host metrics.

## Context to inspect
Existing metrics, event forwarding, logs, service checks, synthetic probes, dashboards, alert rules, retention, baselines, and incident history.

## Core knowledge
Host availability is not service availability. Combine resource telemetry, Windows events, service/process state, dependency health, and application transactions. Alerts should be actionable and tied to an owner/runbook.

## Procedure
1. Identify critical user journeys and service dependencies.
2. Define symptoms that require human action.
3. Select minimal high-signal metrics/events and application checks.
4. Establish normal baselines and capacity thresholds.
5. Add alerts based on sustained impact or leading indicators with clear response.
6. Correlate telemetry with host, identity, network, and deployment context.
7. Test alert generation and routing.
8. Review incidents for missed signals and noisy rules.
9. Tune thresholds and remove unactionable alerts.
10. Document dashboards and runbook links.

## Decision points
Use event-based alerts for discrete failures and metric-based alerts for trends/saturation. Prefer service-level checks over host-only alarms when business impact is the objective.

## Common failure patterns
Alerting every warning event, static thresholds without baselines, no ownership, monitoring only CPU/memory, dashboards without actionable alerts, and telemetry that disappears during outages.

## Verification
Inject or safely simulate representative failures, confirm detection/routing, validate dashboard correlation, and measure false-positive/false-negative behavior over time.

## Expected output
A high-signal observability design tied to operational decisions.

## Stop conditions
Stop when telemetry collection exposes sensitive data without controls, alert ownership is absent, or instrumentation could materially destabilize production.