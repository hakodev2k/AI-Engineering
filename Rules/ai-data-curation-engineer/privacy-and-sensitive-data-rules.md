# Privacy and Sensitive Data Rules
## Purpose
Prevent inappropriate collection, retention, transformation, and exposure of personal or sensitive data.
## Scope
PII, sensitive attributes, regulated data, confidential data, and derived sensitive signals.
## MUST
- Sensitive data handling MUST follow documented classification, purpose, access, retention, and deletion requirements.
- Collection MUST be limited to data necessary for the approved use.
- Redaction, pseudonymization, or de-identification MUST be validated before release where required.
## MUST NOT
- Secrets, credentials, authentication tokens, or unnecessary personal identifiers MUST NOT remain in curated datasets.
- Sensitive data MUST NOT be copied into lower-control environments without authorization.
## SHOULD
- Privacy risk SHOULD be reassessed when new joins or derived features increase re-identification risk.
## Exceptions
Exceptions require documented legal or policy basis, risk, controls, and approval.
## Verification
Review scans, samples, access controls, retention settings, deletion tests, and privacy assessments.