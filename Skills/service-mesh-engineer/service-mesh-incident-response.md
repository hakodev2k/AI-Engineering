# Service Mesh Incident Response

## Purpose
Coordinate safe mitigation and recovery during mesh-related production incidents.

## When to use
Use when mesh failures materially affect availability, security or traffic integrity.

## Inputs
Incident severity, affected services, telemetry, recent changes, rollback options and stakeholder contacts.

## Context to inspect
Control-plane health, gateways, proxies, policy changes, certificates, discovery and underlying infrastructure.

## Core knowledge
Mesh incidents can have broad correlated blast radius. Response should separate mitigation from diagnosis and preserve security boundaries whenever possible.

## Procedure
1. Establish incident command and scope.
2. Freeze unrelated mesh changes.
3. Identify whether impact is control plane, data plane, gateway, identity or policy.
4. Choose the smallest reversible mitigation.
5. Roll back recent config/version changes when causal evidence supports it.
6. If bypass is necessary, time-box it and add compensating controls.
7. Monitor recovery by user-facing SLOs.
8. Preserve configs, logs and timelines.
9. Restore normal controls after stabilization.
10. Produce RCA and corrective actions with owners.

## Decision points
Prefer rollback over novel tuning during active impact. Security bypass requires explicit risk ownership and expiry.

## Common failure patterns
Simultaneous competing changes, deleting evidence, fleet restarts, indefinite permissive mTLS and declaring recovery from pod health alone.

## Verification
Confirm user-facing recovery, configuration convergence, security control restoration and no hidden degraded paths.

## Expected output
A controlled mitigation, evidence set and actionable post-incident record.

## Stop conditions
Escalate immediately for suspected CA/control-plane compromise or mitigations that materially weaken security.