# Cloud Incident Response

## Purpose
Contain, investigate, eradicate, and recover from cloud security incidents while preserving evidence and business continuity.

## When to use
Use for suspected credential compromise, malicious cloud changes, data access anomalies, exposed resources, or confirmed intrusion.

## Inputs
Alert details, audit logs, asset inventory, identities, snapshots, network telemetry, timeline, and incident severity criteria.

## Context to inspect
Inspect control-plane events, identity sessions, resource changes, data access, network paths, CI/CD activity, and cross-account relationships.

## Core knowledge
Cloud containment often involves identity revocation and policy changes rather than host isolation alone. Preserve volatile and provider audit evidence before destructive cleanup when feasible.

## Procedure
1. Declare scope and incident leadership.
2. Preserve logs, snapshots, and relevant metadata.
3. Build an initial timeline.
4. Identify compromised identities and resources.
5. Contain sessions, credentials, exposure, and lateral paths.
6. Hunt for persistence and related accounts.
7. Eradicate malicious changes and rotate trust material.
8. Recover from known-good configuration.
9. Monitor for recurrence.
10. Document root cause and control improvements.

## Decision points
Balance immediate containment against evidence preservation and availability. Rebuild compromised compute when integrity cannot be established.

## Common failure patterns
Deleting evidence, rotating only one credential, missing federation sessions, restoring vulnerable configuration, and failing to search adjacent accounts.

## Verification
Confirm malicious access is revoked, persistence removed, expected services restored, detections active, and timeline supported by evidence.

## Expected output
Incident record with evidence, containment actions, recovery validation, and remediation owners.

## Stop conditions
Escalate according to legal, privacy, regulatory, or executive thresholds; do not perform destructive actions without required authority.