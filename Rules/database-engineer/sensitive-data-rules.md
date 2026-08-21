# Sensitive Data Rules
## Purpose
Protect confidential, regulated, and personally identifiable database content.
## Scope
Classification, encryption, masking, retention, copies, exports, and non-production data.
## MUST
- Classify sensitive fields and apply required encryption, access, retention, and audit controls.
- Sanitize or protect production-derived data before use in lower-trust environments.
- Restrict exports and copies according to the source data classification.
## MUST NOT
- Copy sensitive production data into development or test systems without approved controls.
- Log secrets or sensitive values unnecessarily during database troubleshooting.
## SHOULD
- Minimize collection and retention of sensitive data.
## Exceptions
Require legal/security basis, owner, controls, duration, and approval.
## Verification
Inspect classifications, encryption settings, grants, retention jobs, export logs, and non-production datasets.