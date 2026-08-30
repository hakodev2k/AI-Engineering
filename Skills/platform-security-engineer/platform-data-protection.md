# Platform Data Protection

## Purpose
Protect sensitive platform metadata, credentials, configuration, audit data, and tenant information throughout storage, transport, backup, processing, and deletion.

## When to use
Use when designing platform databases, state stores, backups, control-plane data flows, logs, or new features that collect tenant or operational data.

## Inputs
Data inventory, schemas, retention rules, encryption capabilities, backup design, access model, key-management system, compliance requirements, and deletion workflows.

## Context to inspect
Inspect databases, object stores, queues, caches, snapshots, replicas, logs, analytics pipelines, support exports, backups, and encryption-key boundaries.

## Core knowledge
Data protection requires knowing what is stored, why it exists, who can access it, how long it persists, and what happens in backups and replicas. Encryption helps only when key access is meaningfully separated from data access.

## Procedure
1. Inventory platform data stores and classify sensitive fields.
2. Minimize collection and persistence to operationally necessary data.
3. Separate tenant data and privileged metadata where blast radius requires it.
4. Enforce encryption in transit and at rest using managed key controls.
5. Restrict data and key access independently where feasible.
6. Avoid sensitive values in logs, traces, and error messages.
7. Define retention and deletion rules for primary, replicated, and backup data.
8. Protect exports, support bundles, and diagnostic snapshots.
9. Test restore paths without weakening access controls.
10. Monitor unusual reads, exports, and bulk-access patterns.
11. Verify deletion behavior across downstream copies.
12. Document residual data exposure and recovery trade-offs.

## Decision points
Use field-level or separate-key encryption when compromise of a general datastore would create unacceptable exposure. Prefer data minimization over encrypting data that is unnecessary to retain.

## Common failure patterns
Sensitive tokens in logs, backups with broader access than production, shared encryption keys across trust domains, indefinite retention, plaintext temporary files, and incomplete deletion from replicas.

## Verification
Verify encryption settings, access boundaries, redaction tests, retention jobs, restore procedures, deletion propagation, and audit records for sensitive data access.

## Expected output
A classified data inventory, protection controls, retention/deletion behavior, recovery plan, and evidence of enforcement.

## Stop conditions
Stop and escalate if highly sensitive data is exposed without adequate controls, key ownership is unknown, or legal/regulatory retention requirements conflict with the proposed design.