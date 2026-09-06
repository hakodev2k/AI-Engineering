# Privacy and Compliance Readiness Rules
## Purpose
Ensure production changes respect applicable privacy, retention, audit, and compliance obligations.
## Scope
Systems processing personal, regulated, confidential, or policy-controlled information.
## MUST
- Data collection and processing MUST be limited to defined purposes and approved requirements.
- Readiness MUST identify relevant data categories, retention, access paths, deletion obligations, and transfer boundaries.
- New sensitive-data flows MUST be reviewed for logging, analytics, backups, exports, and third-party exposure.
- Required audit events MUST be emitted and retained according to policy.
- Compliance-critical controls MUST have verifiable evidence before approval.
## MUST NOT
- Sensitive production data MUST NOT be copied into non-production without approved protection.
- Telemetry MUST NOT collect unnecessary personal or regulated data.
- Provider compliance MUST NOT be treated as proof that the application's obligations are satisfied.
## SHOULD
- Prefer data minimization and privacy-preserving defaults.
- Automate reliable retention and deletion controls.
## Exceptions
Exceptions require documented basis, safeguards, owner, expiry, and required approval.
## Verification
Inspect data-flow documentation, configuration, access controls, retention mechanisms, and audit evidence.