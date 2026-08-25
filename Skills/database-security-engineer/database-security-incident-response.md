# Database Security Incident Response

## Purpose
Contain, investigate, eradicate, and recover from suspected database compromise while preserving evidence and availability.

## When to use
Use for suspicious privileged activity, credential compromise, injection exploitation, exfiltration, destructive changes, or audit tampering.

## Inputs
Incident report, logs, database state, identity events, network telemetry, backups, threat intelligence, and response authority.

## Context to inspect
Determine affected databases, identities, time window, sensitive assets, replication topology, current business impact, and evidence-retention requirements.

## Core knowledge
Containment must balance stopping attacker access with preserving evidence and service continuity. Database logs, transaction logs, snapshots, and identity records can establish scope, but invasive queries may alter evidence or load.

## Procedure
1. Establish incident ownership and severity.
2. Preserve volatile and durable evidence.
3. Identify suspected identities, sessions, sources, and objects.
4. Contain compromised access with the least destructive action that works.
5. Determine data read, changed, deleted, or exported.
6. Rotate affected credentials and close exploited paths.
7. Recover from known-good state where needed.
8. Validate integrity and security controls.
9. Monitor for recurrence.
10. Document timeline, root cause, impact, and corrective actions.

## Decision points
Terminate sessions immediately for active harm; otherwise coordinate evidence capture first. Restore only when integrity cannot be confidently repaired in place.

## Common failure patterns
Destroying logs during cleanup, rotating one credential while equivalent tokens remain valid, assuming no exfiltration because data was not modified, and restoring before closing the attack path.

## Verification
Confirm containment, credential revocation, integrity, control restoration, and heightened monitoring.

## Expected output
An evidence-backed incident record and securely recovered database service.

## Stop conditions
Escalate for legal/privacy notification decisions, destructive recovery, or evidence handling beyond authorized scope.