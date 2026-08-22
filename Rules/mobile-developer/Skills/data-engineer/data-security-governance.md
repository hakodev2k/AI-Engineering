# Data Security and Governance

## Purpose
Protect data throughout ingestion, storage, processing, and consumption while enforcing appropriate ownership, retention, and access controls.

## When to use
Use for sensitive data, new datasets, cross-team sharing, cloud migrations, external integrations, and governance reviews.

## Inputs
Data classification, identities, access requirements, retention policy, regulatory constraints, storage and compute topology.

## Context to inspect
Inspect where sensitive fields originate, copies and exports, encryption, service identities, permissions, audit logs, masking, deletion workflows, and non-production usage.

## Core knowledge
Apply least privilege, purpose limitation, defense in depth, encryption in transit and at rest, auditable access, data minimization, retention enforcement, and separation of duties.

## Procedure
1. Classify datasets and critical fields.
2. Map data flows and copies.
3. Define owners and approved purposes.
4. Minimize collection and propagation.
5. Apply role- or attribute-based access at suitable boundaries.
6. Protect secrets and service identities separately from data permissions.
7. Configure encryption, masking, and audit logging.
8. Define retention, deletion, and legal-hold behavior.
9. Restrict production data in development environments.
10. Review permissions and access evidence periodically.

## Decision points
Prefer coarse dataset controls when all fields share sensitivity; use column, row, or tokenization controls when mixed sensitivity or tenancy requires finer isolation.

## Common failure patterns
Shared service accounts, permanent broad grants, copies outside governed storage, sensitive values in logs, masking mistaken for authorization, and retention policies without enforcement.

## Verification
Test denied and allowed identities, inspect audit trails, scan for sensitive leakage, verify encryption settings, and exercise deletion/retention workflows.

## Expected output
A governed data flow with documented classification, access, audit, retention, and ownership controls.

## Stop conditions
Escalate when legal or regulatory interpretation is required, ownership cannot authorize access, or requested sharing violates policy.