# Production Incident Response

## Purpose
Diagnose and stabilize distributed database incidents while preserving evidence and avoiding actions that amplify data risk.

## When to use
Use for availability loss, latency spikes, replication failures, quorum loss, corruption indicators, or severe capacity events.

## Inputs
Incident symptoms, timeline, metrics, logs, topology, recent changes, runbooks, business impact.

## Context to inspect
Client errors, cluster events, leaders, lag, saturation, network health, shard distribution, deployments, and maintenance activity.

## Core knowledge
During distributed incidents, correlated symptoms can make healthy nodes appear faulty. Stabilization comes before optimization. Authority, quorum, and durability must be protected before aggressive recovery actions.

## Procedure
1. Declare scope, severity, and incident owner.
2. Freeze nonessential changes.
3. Establish a timestamped symptom timeline.
4. Determine whether data safety or only availability is threatened.
5. Check quorum, authority, replication, and saturation.
6. Apply the smallest reversible mitigation.
7. Observe results before stacking interventions.
8. Preserve logs and relevant state.
9. Restore redundancy and normal routing.
10. Perform evidence-based root-cause analysis and follow-up.

## Decision points
Prioritize fencing and data safety when split brain or corruption is possible; prioritize load shedding when capacity collapse is causal.

## Common failure patterns
Restarting many nodes simultaneously, deleting state to regain quorum, changing multiple variables, relying on stale dashboards, and declaring recovery before redundancy returns.

## Verification
Confirm client SLO recovery, stable quorum, acceptable lag, restored replication factor, and absence of continuing error-budget burn.

## Expected output
A stabilized service, incident timeline, verified recovery, root cause, and corrective actions.

## Stop conditions
Escalate before destructive repair, quorum override, forced promotion, or any action whose data-loss impact is uncertain.