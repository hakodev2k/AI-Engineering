# Sensitive Data Governance Rules

## Purpose
Prevent unnecessary exposure of confidential, personal, regulated, or otherwise sensitive data across shared platform services.

## Scope
Applies to ingestion, storage, processing, metadata, logs, temporary data, exports, backups, and administrative tooling.

## MUST
- Sensitive data MUST be classified and handled according to applicable security, privacy, retention, and residency requirements.
- Collection and replication of sensitive fields MUST be limited to documented business or operational need.
- Sensitive data MUST be encrypted in transit and at rest where required by the platform security model.
- Logs, metrics, traces, error payloads, and samples MUST avoid secrets and unnecessary sensitive values.
- Deletion and retention controls MUST propagate to derived or replicated data where obligations require it.

## MUST NOT
- MUST NOT copy production-sensitive data into lower environments without approved masking, minimization, or equivalent safeguards.
- MUST NOT expose sensitive values through catalog previews, debug output, or unrestricted operational dashboards.
- MUST NOT weaken data-protection controls without explicit security or privacy approval.

## SHOULD
- Prefer tokenization, masking, aggregation, or synthetic data when full values are unnecessary.
- SHOULD automate classification and policy checks while retaining human review for material exceptions.

## Exceptions
Exceptions require purpose, scope, legal or policy context, risk, controls, retention period, verification, and accountable approval.

## Verification
Use classification scans, access tests, encryption configuration inspection, log sampling, retention tests, data-flow review, and privacy/security assessment evidence.