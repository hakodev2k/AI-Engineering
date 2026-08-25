# Developer Telemetry Privacy Rules
## Purpose
Measure developer experience without collecting unnecessary sensitive information.
## Scope
IDE, CLI, CI, portal, build, and workflow telemetry.
## MUST
- Telemetry MUST have a defined purpose, retention policy, access boundary, and documented data fields.
- Collection MUST minimize source code, secrets, personal data, and raw command content.
- Identifiers MUST use the least identifying form sufficient for the stated metric.
- Access to sensitive telemetry MUST be auditable.
## MUST NOT
- MUST NOT collect credentials, private keys, authentication tokens, or arbitrary file contents.
- MUST NOT repurpose sensitive telemetry without appropriate review.
## SHOULD
- Aggregate metrics SHOULD be preferred when individual-level data is unnecessary.
## Exceptions
Higher-fidelity diagnostics require bounded duration, explicit justification, access controls, and approval.
## Verification
Inspect schemas, sample payloads, retention configuration, access logs, and redaction tests.