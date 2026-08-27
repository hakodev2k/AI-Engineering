# Ransomware Recovery

## Purpose
Recover trustworthy systems and data after compromise without restoring malware, corrupted state, or compromised credentials.

## When to use
Use during ransomware preparedness and authorized incident recovery after containment decisions are made.

## Inputs
Incident timeline, compromise indicators, backup inventory, immutable copies, identity state, forensic findings, clean-room design, and business priorities.

## Context to inspect
Coordinate with incident response. Inspect likely initial compromise time, lateral movement, privileged identity exposure, backup-system access, persistence mechanisms, and data integrity indicators.

## Core knowledge
Fast restoration is unsafe if the recovery point or environment remains compromised. Recovery requires a trusted control plane, clean credentials, validated backups, and staged reintroduction of services.

## Procedure
1. Confirm incident-response authority and containment status.
2. Establish a clean recovery environment and independent administration identities.
3. Determine earliest trustworthy recovery points using forensic evidence.
4. Validate backup immutability and integrity.
5. Rebuild foundational identity, network, security, and monitoring controls.
6. Restore prioritized services in dependency order.
7. Scan and validate recovered systems before connection.
8. Rotate exposed credentials and keys.
9. Restore traffic gradually with enhanced monitoring.
10. Preserve evidence and document data loss against RPO.

## Decision points
Rebuild rather than restore system images when compromise persistence is uncertain. Select older recovery points when forensic confidence in recent backups is low.

## Common failure patterns
Restoring into compromised domain; reconnecting too early; using infected golden images; preserving compromised credentials; choosing newest backup without timeline analysis.

## Verification
Security and application teams jointly validate clean state, data integrity, credential rotation, monitoring coverage, and business acceptance.

## Expected output
A controlled, evidence-informed recovery to a trustworthy operating state.

## Stop conditions
Stop if containment is unconfirmed, recovery points cannot be trusted, forensic preservation would be compromised, or incident command has not authorized cutover.