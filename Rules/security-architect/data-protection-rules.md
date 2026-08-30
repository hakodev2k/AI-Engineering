# Data Protection Rules

## Purpose
Ensure architecture protects sensitive data according to its classification, lifecycle, and exposure.

## Scope
Data at rest, in transit, in use, backups, replicas, exports, logs, caches, and derived datasets.

## MUST
- Data architecture MUST classify sensitive data and define approved storage, transmission, retention, and deletion controls.
- Sensitive data MUST be encrypted in transit and at rest where exposure risk warrants it, using approved cryptographic mechanisms.
- Data minimization MUST be applied to collection, replication, logging, and downstream sharing.
- Data ownership and access boundaries MUST be explicit across services and tenants.
- Retention and deletion requirements MUST account for backups and secondary copies.

## MUST NOT
- MUST NOT replicate sensitive data into less-controlled environments without equivalent safeguards and approval.
- MUST NOT place secrets, credentials, or regulated data in general-purpose logs.
- MUST NOT assume pseudonymized data is anonymous without re-identification analysis.

## SHOULD
- Prefer tokenization, field-level protection, and minimized exposure for high-value data.

## Exceptions
Require documented need, scope, residual risk, compensating controls, retention limit, and approval.

## Verification
Inspect data-flow diagrams, classifications, encryption configuration, access controls, retention jobs, logs, backup policy, and deletion tests.