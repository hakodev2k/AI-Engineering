# Observability Privacy and Security Rules
## Purpose
Prevent telemetry from becoming a path for data leakage or privilege escalation.
## Scope
Sensitive data, access, encryption, redaction, and audit.
## MUST
- Classify telemetry data and apply least-privilege access.
- Redact or avoid secrets and sensitive personal data before export where practical.
- Encrypt telemetry in transit and at rest according to project policy.
- Audit privileged access to sensitive telemetry where required.
## MUST NOT
- Collect credentials, tokens, private keys, or unrestricted sensitive payloads for convenience.
- Weaken security controls merely to improve debugging without explicit approval.
## SHOULD
- Prefer allowlisted attributes over broad payload capture.
## Exceptions
Approved forensic collection requires scoped authority, duration, access controls, and deletion handling.
## Verification
Run secret/PII scans, inspect RBAC, transport/storage settings, redaction tests, and audit logs.