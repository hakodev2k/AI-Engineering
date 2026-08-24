# Data Privacy and Lifecycle

## Purpose
Implement platform controls for sensitive-data discovery, minimization, retention, deletion, masking, and auditable lifecycle enforcement.

## When to use
Use when processing personal, confidential, regulated, or retention-bound data.

## Inputs
Data classifications, retention rules, legal requirements, subject identifiers, lineage, storage systems, backups, and consumer inventory.

## Context to inspect
Copies, caches, snapshots, exports, logs, backups, derived datasets, access policies, and existing deletion workflows.

## Core knowledge
Deletion and retention are end-to-end lineage problems. Derived data and backups may retain sensitive values after source deletion. Tokenization, masking, encryption, and anonymization solve different threats.

## Procedure
1. Identify sensitive fields and authoritative classifications.
2. Map propagation through lineage, caches, exports, and backups.
3. Minimize collection and retention where business value is absent.
4. Encode retention as automated lifecycle policy where possible.
5. Select masking/tokenization/encryption according to use case.
6. Design deletion propagation and tombstone semantics.
7. Define backup expiration and restoration behavior for deleted records.
8. Restrict sensitive values in logs and telemetry.
9. Record auditable evidence of lifecycle actions.
10. Test deletion and retention end-to-end with representative identities.

## Decision points
Tokenize when reversible controlled lookup is required; anonymize only when re-identification risk is acceptably reduced. Physical deletion may be delayed in immutable backups if policy explicitly permits expiration-based removal.

## Common failure patterns
Deleting only primary tables, retaining PII in logs, assuming encryption equals minimization, indefinite snapshots, undocumented exports, and restoring deleted records from backup without reapplying tombstones.

## Verification
Trace test records across all copies, execute deletion, verify masking and access behavior, restore a backup in a controlled environment, and confirm lifecycle policies reapply correctly.

## Expected output
Data lifecycle controls, deletion workflow, retention automation, masking strategy, audit evidence, and tests.

## Stop conditions
Stop and obtain privacy/legal guidance when requirements conflict, anonymization sufficiency is uncertain, or deletion would violate preservation obligations.