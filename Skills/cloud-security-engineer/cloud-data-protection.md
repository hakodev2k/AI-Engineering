# Cloud Data Protection

## Purpose
Protect cloud data according to sensitivity across storage, transit, processing, sharing, backup, and deletion.

## When to use
Use for new data stores, data migrations, analytics platforms, external sharing, or compliance reviews.

## Inputs
Data classification, flows, storage services, access patterns, retention rules, backup design, and legal/compliance requirements.

## Context to inspect
Inspect encryption, public access, ACLs/policies, replication, snapshots, exports, backups, logs, lifecycle rules, and downstream consumers.

## Core knowledge
Protection follows data lifecycle and threat model. Encryption is necessary but does not replace authorization, minimization, retention, and monitoring.

## Procedure
1. Classify data and owners.
2. Map storage and movement.
3. Minimize collected and retained data.
4. Restrict access by identity and purpose.
5. Enforce encryption in transit and at rest.
6. Control sharing, export, and replication.
7. Protect backups and snapshots equivalently.
8. Define retention and verified deletion.
9. Monitor sensitive access and bulk extraction.
10. Test restore without broadening access.

## Decision points
Use stronger key control or tokenization when threat/compliance needs justify complexity. Prefer service-native encryption for ordinary workloads.

## Common failure patterns
Public snapshots, forgotten replicas, broad analyst access, indefinite retention, unencrypted exports, and backups outside normal controls.

## Verification
Trace representative sensitive records through lifecycle, verify effective access, encryption, retention, deletion, and restore controls.

## Expected output
Documented data controls tied to classification and validated across primary and secondary copies.

## Stop conditions
Escalate if data ownership/classification is unknown, deletion conflicts with legal hold, or exposure suggests breach response.