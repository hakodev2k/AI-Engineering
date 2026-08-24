# Telemetry and Privacy Rules
## Purpose
Measure developer experience without creating unjustified privacy or security risk.
## Scope
Tool usage telemetry, diagnostics, crash reports, workflow metrics, identifiers, retention, and access.
## MUST
- Telemetry MUST have a defined purpose, data classification, retention policy, and access boundary.
- Collection MUST minimize data to what is necessary for the stated purpose.
- Sensitive fields MUST be excluded or redacted before transmission and storage.
- Consent or notice requirements MUST follow applicable policy and law.
## MUST NOT
- MUST NOT collect source code, secrets, credentials, or personal content merely for convenience.
- MUST NOT repurpose identifiable telemetry beyond its disclosed purpose without review.
- MUST NOT use individual productivity metrics as a proxy for engineering performance without explicit governance.
## SHOULD
- Aggregate or pseudonymous signals SHOULD be preferred when individual identity is unnecessary.
- Instrumentation SHOULD include quality checks for missing or biased data.
## Exceptions
Expanded collection requires documented necessity, privacy/security review, controls, retention, and approval.
## Verification
Inspect schemas, payload samples, redaction tests, access controls, retention configuration, notices, and data-quality dashboards.