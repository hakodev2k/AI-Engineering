# Backup and Disaster Recovery Security

## Purpose
Ensure Kubernetes recovery data and procedures are secure, complete, and usable after destructive or adversarial events.

## When to use
Use when designing cluster backups, ransomware resilience, etcd recovery, persistent-volume protection, or disaster exercises.

## Inputs
Recovery objectives, etcd/application backup design, storage locations, encryption/key management, access controls, and restore dependencies.

## Preconditions
Define which state is authoritative and what must be reconstructed versus restored.

## Context to inspect
Inspect etcd snapshots, persistent volumes, manifests/GitOps state, secrets, encryption keys, certificates, external databases, backup identities, retention, immutability, and cross-region/account copies.

## Core knowledge
A backup is both sensitive data and a recovery dependency. Attackers with backup deletion or encryption-key access can defeat disaster recovery even without destroying every production copy.

## Procedure
1. Map recovery-critical state and dependencies.
2. Encrypt backup data and transport.
3. Separate backup write/read/delete privileges.
4. Use immutable or protected retention where appropriate.
5. Protect recovery keys and credentials independently.
6. Define clean-room restore sequence.
7. Test restores on a scheduled basis.
8. Validate recovered security controls and credentials.
9. Record measured RPO/RTO and gaps.

## Decision points
Use cross-account/region copies when common-mode compromise risk justifies cost. Prefer rebuilding stateless cluster configuration from trusted source rather than restoring opaque state.

## Common failure patterns
Backups in same blast radius; untested snapshots; backup admins able to delete all copies; missing encryption keys; restoring compromised credentials.

## Verification
Perform a controlled restore and verify data integrity, application function, identity, policy, and audit controls.

## Expected output
A tested, access-controlled recovery design with measured recovery objectives.

## Stop conditions
Escalate when recovery cannot meet critical objectives or backup integrity/confidentiality is uncertain.