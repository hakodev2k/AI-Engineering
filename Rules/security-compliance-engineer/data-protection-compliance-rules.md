# Data Protection Compliance Rules

## Purpose
Ensure regulated and sensitive data is handled according to approved security and privacy obligations.

## Scope
Applies to collection, processing, storage, transmission, sharing, retention, archival, and deletion of protected data.

## MUST
- Sensitive data classes MUST have defined handling, access, retention, transmission, and disposal requirements.
- Data flows MUST identify systems and third parties that receive protected data.
- Access controls and technical protections MUST match data classification and regulatory obligations.
- Retention and deletion behavior MUST be testable and evidenced.

## MUST NOT
- Protected data MUST NOT be copied into unapproved environments or tools.
- Sensitive datasets MUST NOT be retained indefinitely without documented legal or business basis.
- Masking, tokenization, or anonymization MUST NOT be claimed effective without validation.

## SHOULD
- Minimize collection and replication of sensitive data.
- Prefer automated classification and lifecycle enforcement where reliable.

## Exceptions
Exceptions require documented legal/compliance rationale, risk assessment, compensating controls, owner, expiry, and approval.

## Verification
Inspect data inventories, flow diagrams, access controls, retention jobs, deletion tests, environment scans, and samples of protected-data handling.