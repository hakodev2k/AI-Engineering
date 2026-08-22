# Data Protection Rules

## Purpose
Protect sensitive data throughout collection, processing, storage, transmission, retention, and deletion.

## Scope
Applies to personal, confidential, regulated, authentication, financial, and business-sensitive data.

## MUST
- Sensitive data MUST be classified and handled according to its classification.
- Data collection MUST be limited to what is required for the approved purpose.
- Sensitive data MUST be protected in transit and at rest using approved controls where applicable.
- Retention and deletion behavior MUST be defined for sensitive datasets.
- Access to sensitive data MUST be least-privilege and auditable.

## MUST NOT
- MUST NOT copy production-sensitive data into lower environments without approved protection.
- MUST NOT expose sensitive fields in logs, telemetry, URLs, or error messages.
- MUST NOT retain sensitive data indefinitely without a documented need.

## SHOULD
- Prefer tokenization, masking, anonymization, or minimization when full values are unnecessary.
- Prefer automated retention enforcement.

## Exceptions
Exceptions require data owner approval, documented risk, compensating controls, and expiration when applicable.

## Verification
Use data-flow review, storage inspection, access logs, retention tests, privacy/security review, and configuration checks.