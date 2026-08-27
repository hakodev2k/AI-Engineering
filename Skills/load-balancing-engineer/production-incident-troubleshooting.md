# Production Incident Troubleshooting

## Purpose
Diagnose load-balancing incidents rapidly while minimizing risky changes and preserving evidence.

## When to use
Use for elevated errors, latency, imbalance, resets, failed health checks, saturation, or routing anomalies.

## Inputs
Incident timeline, alerts, metrics, logs, traces, recent changes, topology, and client reports.

## Preconditions
Establish incident ownership and change controls. Prefer reversible mitigations.

## Context to inspect
Inspect traffic, backend health, proxy saturation, connection errors, DNS, certificates, recent deployments, provider events, and dependency health.

## Core knowledge
Load-balancing symptoms can originate upstream or downstream. Compare healthy and unhealthy paths, correlate onset with changes, and separate control-plane from data-plane failure.

## Procedure
1. Define impact, scope, and start time.
2. Check recent configuration and deployment changes.
3. Compare regions, listeners, pools, and backend cohorts.
4. Inspect saturation, health ejections, resets, retries, and latency phases.
5. Validate DNS and TLS where relevant.
6. Trace representative failed requests.
7. Form ranked hypotheses tied to evidence.
8. Apply the lowest-risk mitigation.
9. Verify user impact recovers before deeper repair.
10. Preserve evidence and document root cause afterward.

## Decision points
Rollback when a recent change strongly correlates and rollback is safe. Shift traffic only after confirming destination capacity. Disable retries if they are amplifying overload.

## Common failure patterns
Changing several knobs simultaneously; draining traffic into an undersized region; treating all 5xx as backend errors; ignoring certificate or DNS changes; losing evidence after recovery.

## Verification
Confirm SLO recovery, error normalization, healthy distribution, and no new saturation in shifted paths.

## Expected output
Mitigation, evidence-backed root cause, corrective actions, and prevention items.

## Stop conditions
Escalate when mitigation requires destructive network changes, provider control-plane access is unavailable, or traffic movement risks wider outage.