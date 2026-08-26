# Privacy and Security Rules
## Purpose
Prevent quality engineering from weakening data protection.
## Scope
Sensitive data, access, telemetry, test artifacts, exports, and debugging.
## MUST
- Quality tooling MUST apply least privilege and honor data classification requirements.
- Sensitive values MUST be minimized or redacted in logs, alerts, dashboards, and test reports.
- Access to restricted quality evidence MUST be auditable.
## MUST NOT
- MUST NOT expose credentials, tokens, personal data, or regulated attributes to unauthorized systems or personnel.
- MUST NOT disable security controls merely to inspect problematic data.
## SHOULD
- Aggregate or masked evidence SHOULD be preferred when raw records are unnecessary.
## Exceptions
Elevated access requires explicit authorization, bounded duration, purpose, and audit trail.
## Verification
Inspect permissions, data classifications, redaction tests, audit logs, secret scans, and artifact retention.