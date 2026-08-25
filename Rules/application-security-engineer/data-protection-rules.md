# Data Protection Rules

## Purpose
Reduce confidentiality, integrity, and privacy risk by controlling sensitive data throughout its lifecycle.

## Scope
Applies to collection, processing, storage, transport, caching, export, backup, logging, and deletion of sensitive application data.

## MUST
- Sensitive data MUST be classified or otherwise identified sufficiently to determine required controls.
- Applications MUST collect, expose, and retain only data required for defined purposes and obligations.
- Sensitive data MUST be protected in transit across untrusted boundaries and at rest when threat and policy require it.
- Access to sensitive records and exports MUST be authorized at the appropriate object, tenant, and purpose boundary.
- Data deletion and retention behavior MUST account for caches, derived stores, backups, replicas, and downstream systems where applicable.
- Production data used outside production MUST have explicit authorization and protection appropriate to its sensitivity.

## MUST NOT
- MUST NOT log secrets, authentication tokens, full payment credentials, or other prohibited sensitive values.
- MUST NOT expose sensitive fields merely because the underlying object was authorized.
- MUST NOT copy production datasets into development or test environments by default.

## SHOULD
- SHOULD tokenize, redact, aggregate, or minimize sensitive data when full fidelity is unnecessary.
- SHOULD make sensitive exports auditable and bounded.

## Exceptions
Exceptions require purpose, data classes, exposure analysis, retention period, compensating controls, and approval from accountable security/privacy owners.

## Verification
Inspect schemas, data flows, API responses, logs, storage encryption, access policies, retention jobs, backups, test-data processes, and export audit evidence.