# Production Troubleshooting

## Purpose
Diagnose PostgreSQL incidents systematically while minimizing additional production risk.

## When to use
Use for latency, errors, saturation, outages, connection failures, disk pressure, replication problems, or unexpected behavior.

## Inputs
Incident timeline, symptoms, metrics, logs, SQL activity, recent changes, topology.

## Context to inspect
Connections, waits, locks, top queries, CPU, memory, IO, disk, WAL, replicas, vacuum, checkpoints and deployments.

## Core knowledge
Incidents often combine workload and resource effects. Preserve evidence, distinguish symptom from cause, and prefer reversible mitigations before invasive changes.

## Procedure
1. Establish user impact and incident start time.
2. Freeze unnecessary changes.
3. Compare current telemetry with baseline.
4. Check resource saturation and connection health.
5. Inspect waits/blockers and top changed queries.
6. Review recent application/schema/config changes.
7. Form falsifiable hypotheses.
8. Apply the lowest-risk mitigation.
9. Verify recovery using user-facing and database signals.
10. Preserve evidence for RCA and follow-up.

## Decision points
Cancel/terminate sessions only after identifying impact. Fail over only when it improves the failure mode and replication state is understood.

## Common failure patterns
Random parameter tuning, restarting before evidence capture, treating correlation as causation, repeated unbounded retries, fixing only the visible slow query.

## Verification
Confirm service recovery, database stability, backlog drain and absence of hidden data inconsistency.

## Expected output
Timeline, evidence, root-cause hypothesis, mitigation and follow-up actions.

## Stop conditions
Escalate for suspected corruption, data loss, split brain, or actions requiring destructive recovery.