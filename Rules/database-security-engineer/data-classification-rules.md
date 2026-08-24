# Data Classification Rules

## Purpose
Make database protections proportional to the sensitivity, criticality, and legal obligations of stored data.

## Scope
Covers tables, columns, documents, indexes, caches, backups, replicas, exports, and derived datasets.

## MUST
- Sensitive and regulated data MUST have an identifiable classification and accountable owner.
- Security controls MUST reflect classification across primary storage, replicas, backups, logs, and exports.
- Classification changes MUST trigger review of access, retention, encryption, masking, monitoring, and sharing controls.
- Unknown data introduced into sensitive stores MUST be assessed before broad access is granted.

## MUST NOT
- Data MUST NOT be treated as non-sensitive solely because it lacks an explicit label.
- Derived datasets MUST NOT automatically inherit weaker controls when they remain re-identifiable or sensitive.
- Production data MUST NOT be copied to lower-trust environments without approved protection.

## SHOULD
- Classification SHOULD be machine-readable where feasible and integrated into schema/catalog workflows.
- Teams SHOULD minimize collection and persistence of data whose business purpose is unclear.

## Exceptions
Exceptions require documented data owner, purpose, risk, compensating controls, duration, and approval.

## Verification
Review schemas and catalogs, sampling metadata, data-flow documentation, access policies, retention settings, export paths, and environment copies. Compare discovered sensitive fields with declared classifications.