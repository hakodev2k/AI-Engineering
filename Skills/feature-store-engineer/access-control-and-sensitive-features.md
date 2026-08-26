# Access Control and Sensitive Features

## Purpose
Protect sensitive feature data across offline training, online serving and operational tooling using least privilege.

## When to use
Use for PII, regulated attributes, tenant data, derived sensitive signals or new consumers.

## Inputs
Data classification, identities, purposes, environments, retention and regulatory requirements.

## Context to inspect
IAM roles, service identities, storage ACLs, secrets, logs, exports, notebooks and model pipelines.

## Core knowledge
Derived features can remain sensitive even after transformation. Authorization should be purpose- and environment-aware; service-to-service access must be auditable.

## Procedure
1. Classify feature sensitivity with data owners.
2. Minimize collected/stored attributes.
3. Map legitimate consumers and purposes.
4. Define least-privilege roles for offline and online paths.
5. Separate human and workload identities.
6. Encrypt in transit and at rest.
7. Prevent sensitive values from entering logs/metrics.
8. Apply retention/deletion requirements through derived data.
9. Audit access and unusual retrieval patterns.
10. Test revocation and tenant isolation.

## Decision points
Prefer aggregation/tokenization when raw identity is unnecessary. Deny cross-purpose reuse until policy owners approve it.

## Common failure patterns
Broad notebook access, secrets in config, PII in debug logs, derived data excluded from deletion and shared service credentials.

## Verification
Run permission tests for allowed/denied identities, inspect logs for leakage, and verify deletion/retention propagation.

## Expected output
A documented, auditable access model for sensitive features.

## Stop conditions
Stop if classification, legal basis or tenant boundary is unresolved.