# Data Protection and Privacy Security

## Purpose
Design controls for sensitive data across collection, storage, processing, sharing, retention, deletion, and recovery.

## When to use
Use when systems handle personal, financial, regulated, confidential, or business-critical data, or when data flows change materially.

## Inputs
Data classification, data flows, legal/policy requirements, storage systems, integrations, retention rules, access model, backup design.

## Context to inspect
Collection points, databases, object storage, caches, logs, analytics pipelines, exports, backups, third parties, encryption, masking, retention, and deletion workflows.

## Core knowledge
Data protection requires minimization, purpose limitation, access control, encryption where appropriate, lifecycle governance, and recoverable but controlled backups. Security controls must cover copies and derived data, not only primary databases.

## Procedure
1. Inventory sensitive data classes and owners.
2. Map where data is collected, stored, copied, transformed, and exported.
3. Minimize collection and retention to justified needs.
4. Restrict access by role, purpose, and environment.
5. Protect data in transit and at rest using approved mechanisms.
6. Define masking or tokenization where full values are unnecessary.
7. Prevent sensitive values from leaking into logs and telemetry.
8. Define retention, deletion, backup, and restore behavior.
9. Review third-party sharing and cross-boundary transfers.
10. Test access restrictions, deletion workflows, and restore procedures.

## Decision points
Use tokenization or masking when consumers do not need original values. Stronger isolation is justified for highly sensitive or regulated datasets.

## Common failure patterns
Sensitive data in logs, indefinite retention, production data copied to development, orphaned backups, broad analytics access, and encryption without sound key management.

## Verification
Data-flow inventory matches actual systems, access tests pass, retention/deletion controls work, backups are protected, and sensitive values are absent from unauthorized telemetry.

## Expected output
A data-protection design with classification, lifecycle controls, access boundaries, encryption/masking decisions, and verification evidence.

## Stop conditions
Escalate when legal interpretation, data ownership, residency, retention, or deletion obligations are unresolved.