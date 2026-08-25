# Storage Incident Response

## Purpose
Restore storage service safely during outages, latency events, capacity emergencies, corruption, and degraded redundancy while preserving data and evidence.

## When to use
Use when storage health threatens availability, integrity, recovery objectives, or dependent services.

## Inputs
Incident symptoms, timeline, SLO impact, telemetry, topology, recent changes, protection state, and recovery procedures.

## Preconditions
Assign incident command, identify data-integrity risk, and prevent uncontrolled concurrent changes.

## Context to inspect
Alerts, logs, host IO, network, storage health, capacity, replication, rebuilds, backups, recent deployments, and vendor events.

## Core knowledge
During storage incidents, data safety can conflict with rapid restoration. Stabilize before optimizing. Preserve the last good copy, avoid split brain, and distinguish capacity, performance, connectivity, and integrity failure modes.

## Procedure
1. State impact and affected scope.
2. Establish timeline and recent changes.
3. Check data-integrity and redundancy risk first.
4. Stabilize demand or isolate failing components where safe.
5. Correlate client, network, and backend evidence.
6. Form and test bounded hypotheses.
7. Apply reversible mitigations first.
8. Validate recovery from client perspective.
9. Monitor for recurrence.
10. Preserve evidence and complete root-cause follow-up.

## Decision points
Prefer service degradation or admission control over risky writes when integrity is uncertain. Fail over only when target state, fencing, and replication status are known.

## Common failure patterns
Rebooting evidence away, parallel uncoordinated changes, filling the last capacity reserve, premature failover, ignoring backup health, and declaring recovery from backend metrics alone.

## Verification
Application SLOs recover, redundancy/protection state is safe, integrity checks pass where relevant, and monitoring remains stable through a defined observation window.

## Expected output
An incident timeline, mitigation, recovery evidence, root cause or next investigation, and corrective actions.

## Stop conditions
Escalate immediately when no safe writable copy is known, corruption is expanding, destructive recovery is proposed, or authority for failover is missing.
