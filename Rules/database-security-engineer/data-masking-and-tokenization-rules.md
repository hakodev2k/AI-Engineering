# Data Masking and Tokenization Rules

## Purpose
Limit exposure of sensitive values when full plaintext is unnecessary.

## Scope
Covers non-production copies, support access, analytics, exports, UI/query results, tokenization, and pseudonymization.

## MUST
- Masking or tokenization MUST preserve only the data characteristics required by the approved use case.
- Non-production use of production-derived sensitive data MUST apply approved de-identification controls before broad access.
- Re-identification capability MUST be separately controlled and auditable.
- Masking transformations MUST be tested for completeness across related fields and derived values.

## MUST NOT
- Cosmetic redaction MUST NOT be represented as anonymization when source values remain recoverable.
- Deterministic tokens MUST NOT be assumed anonymous when linkage can identify individuals.
- Sensitive values MUST NOT leak through logs, indexes, caches, snapshots, or exports while the primary table is masked.

## SHOULD
- Prefer synthetic data when production realism is not required.
- Masking policies SHOULD be automated and repeatable.

## Exceptions
Plaintext access outside the primary production purpose requires documented necessity, limited scope, duration, monitoring, and approval.

## Verification
Sample transformed datasets, inspect mapping/key custody, test re-identification boundaries, scan secondary stores, and compare access permissions before and after masking.