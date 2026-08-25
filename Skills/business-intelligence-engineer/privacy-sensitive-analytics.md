# Privacy-Sensitive Analytics

## Purpose
Design BI solutions that minimize exposure of personal or sensitive data while preserving legitimate analytical utility.

## When to use
Use when datasets contain personal, confidential, regulated, or commercially sensitive attributes.

## Inputs
Data classification, business purpose, fields, user roles, retention rules, privacy/security policy, aggregation needs.

## Context to inspect
Inspect lineage, raw/curated layers, exports, row/object security, caches, logs, sharing, retention, and downstream extracts.

## Core knowledge
Apply data minimization, purpose limitation, least privilege, aggregation, masking/tokenization, retention, and auditable access according to applicable policy. Aggregation is not automatically anonymous when groups are small or dimensions permit re-identification.

## Procedure
1. Classify fields and document analytical purpose.
2. Remove fields not required for that purpose.
3. Determine minimum grain necessary for decisions.
4. Apply access controls at durable data/semantic boundaries.
5. Mask, tokenize, generalize, or aggregate identifiers where appropriate.
6. Define small-cell/suppression rules when re-identification risk exists.
7. Restrict exports and unmanaged sharing based on policy.
8. Ensure logs and telemetry do not leak sensitive values.
9. Apply retention/deletion requirements through derived datasets.
10. Test access, inference risk, and deletion/retention workflows.

## Decision points
Use de-identified aggregate data when user-level detail is unnecessary. Retain identifiers only when a legitimate use case requires them and controls are proportionate.

## Common failure patterns
Copying sensitive fields into marts by default, relying only on report filters, exporting unrestricted detail, small-group disclosure, and forgetting derived copies during deletion.

## Verification
Run authorized/unauthorized persona tests, inspect exports/logs, trace sensitive fields through lineage, and verify retention/deletion controls.

## Expected output
Minimized analytical dataset with documented purpose, controls, access tests, and lifecycle handling.

## Stop conditions
Stop when lawful/policy basis is unclear, requested access exceeds approved purpose, or required privacy controls cannot be enforced.