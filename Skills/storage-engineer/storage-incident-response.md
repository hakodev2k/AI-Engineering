# Storage Incident Response

## Purpose
Stabilize storage incidents, preserve data integrity, restore service, and produce evidence-based root-cause and prevention actions.

## When to use
Use for outages, severe latency, capacity exhaustion, path loss, corruption, quorum loss, replication failure, or unexplained storage errors.

## Inputs
Incident timeline, alerts, client symptoms, topology, logs, metrics, recent changes, recovery runbooks, and backups.

## Context to inspect
Control/data planes, capacity, latency, queueing, hardware health, network, replication, rebuilds, maintenance, and change history.

## Core knowledge
Data integrity outranks rapid but unsafe recovery. Stabilization should minimize writes and topology changes when state is ambiguous. Correlation is not causation; preserve evidence before destructive repair.

## Procedure
1. Establish incident command, scope, and user impact.
2. Protect data: pause risky automation or writes when integrity is uncertain.
3. Capture topology, health, logs, metrics, and recent changes.
4. Identify whether failure is client, network, control-plane, capacity, media, or replication related.
5. Apply the lowest-risk reversible mitigation.
6. Monitor recovery and secondary effects.
7. Validate data/application integrity before declaring restoration.
8. Preserve evidence and timeline.
9. Determine root cause and contributing factors.
10. Assign prevention, detection, and recovery improvements.

## Decision points
Fail over only when target consistency and fencing are known. Prefer reversible traffic reduction or isolation before destructive repair. Restore from backup only after corruption scope and recovery point are understood.

## Common failure patterns
Multiple simultaneous changes, reboot-first troubleshooting, deleting evidence, unsafe failover, ignoring capacity/rebuild interactions, and closing on symptom disappearance.

## Verification
Confirm client SLO recovery, integrity checks, redundancy restoration, backlog normalization, and absence of continuing errors.

## Expected output
Incident timeline, mitigation, validation evidence, root cause, contributing factors, and corrective actions.

## Stop conditions
Escalate immediately for suspected widespread corruption, split brain, unknown authoritative copy, or actions requiring destructive recovery.