# Storage Observability

## Purpose
Build telemetry that explains storage health, demand, latency, saturation, errors, capacity risk, and protection state from application to media.

## When to use
Use when onboarding storage, defining SLOs, improving incident response, or replacing noisy alerts.

## Inputs
Architecture, SLOs, telemetry sources, incident history, capacity thresholds, and ownership model.

## Preconditions
Ensure clocks, labels, and resource identities can correlate metrics across layers.

## Context to inspect
Application traces, host IO, filesystem, network, controllers, pools, devices, replication, backup, capacity, logs, and alert routes.

## Core knowledge
Useful observability connects symptoms to constrained resources. Track latency distributions, demand, utilization/saturation, errors, queueing, capacity, replication lag, rebuilds, and recovery health. Alerts should be actionable and tied to user or risk impact.

## Procedure
1. Define storage SLIs/SLOs and risk indicators.
2. Inventory telemetry at each layer.
3. Normalize resource identity and timestamps.
4. Build dashboards from client to backend.
5. Add capacity and protection-state views.
6. Create symptom-based and risk-based alerts.
7. Set thresholds from evidence, not defaults.
8. Attach runbooks and ownership.
9. Test alerts with controlled events.
10. Review signal quality after incidents.

## Decision points
Prefer high-level SLO alerts for paging and lower-level component alerts for diagnosis unless a component condition requires immediate action.

## Common failure patterns
Alerting on every device counter, no tail latency, missing replication/backup health, inconsistent labels, dashboards without baselines, and alerts with no owner.

## Verification
Inject known conditions, confirm telemetry correlation and routing, and demonstrate that dashboards identify bottlenecks and capacity risks.

## Expected output
An observability baseline with SLIs, dashboards, actionable alerts, runbooks, and ownership.

## Stop conditions
Stop when telemetry gaps prevent reliable attribution or alert thresholds would create unsafe automation without validation.
