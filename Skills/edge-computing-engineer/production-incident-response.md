# Production Incident Response

## Purpose
Respond to edge production incidents across distributed fleets while containing blast radius, preserving local autonomy, and recovering safely.

## When to use
Use for fleet regressions, widespread disconnects, failed updates, data loss risk, gateway overload, security events, or site outages.

## Inputs
Incident symptoms, affected fleet scope, recent changes, telemetry, deployment history, network status, recovery options.

## Context to inspect
Inspect rollout rings, versions, site patterns, cloud health, broker queues, device resource pressure, configuration changes, certificates, and synchronization backlog.

## Core knowledge
Edge incidents require fleet segmentation, safe containment, awareness of offline nodes, version heterogeneity, delayed telemetry, and recovery procedures that do not assume immediate reachability.

## Procedure
1. Establish impact, severity, and affected fleet segments.
2. Freeze risky rollouts and configuration changes.
3. Separate cloud, network, gateway, device, and software hypotheses.
4. Preserve diagnostic evidence and identify last-known-good versions.
5. Contain blast radius using rollout rings, feature controls, or traffic isolation.
6. Restore critical local operation first.
7. Roll back or remediate reachable nodes safely.
8. Define behavior for offline nodes that reconnect later.
9. Reconcile fleet state and data backlog after recovery.
10. Document root cause, detection gaps, and preventive actions.

## Decision points
Prefer containment over immediate fleet-wide repair when root cause is uncertain. Roll back when reversibility is proven and the previous version is compatible with current data/state.

## Common failure patterns
Fleet-wide emergency changes, assuming telemetry is current, ignoring offline nodes, clearing queues to reduce symptoms, losing evidence, declaring recovery before fleet reconciliation.

## Verification
Confirm critical workflows, fleet health, version distribution, queue recovery, data integrity, and reconnect behavior for previously offline nodes.

## Expected output
A contained and recovered incident with evidence, reconciled fleet state, root cause, and durable follow-up actions.

## Stop conditions
Stop and escalate when recovery risks safety, irreversible data loss, credential compromise, or unsupported physical intervention.