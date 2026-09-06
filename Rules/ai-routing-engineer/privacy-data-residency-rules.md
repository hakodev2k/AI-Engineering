# Privacy and Data Residency Rules

## Purpose
Keep request data within approved processing, storage, and geographic boundaries.

## Scope
Sensitive data classification, regional routing, retention, provider processing terms, logging, and cross-border transfer constraints.

## MUST
- Routing MUST enforce applicable data-residency and provider-processing restrictions before target selection.
- Sensitive request classes MUST identify which providers and regions are approved.
- Telemetry MUST minimize or redact sensitive request and response content.
- Data retention behavior relevant to provider selection MUST be documented and validated.
- New provider or regional routes for sensitive traffic MUST receive required privacy/security review before production use.

## MUST NOT
- MUST NOT fail over across prohibited geographic or contractual boundaries.
- MUST NOT send sensitive payloads to unapproved diagnostic or evaluation systems.
- MUST NOT assume zero retention without verified provider configuration or contractual evidence.

## SHOULD
- Prefer routing metadata over raw content for operational observability.
- Use regional isolation when it materially reduces privacy risk.

## Exceptions
Exceptions require documented legal/privacy basis, safeguards, duration, and authorized approval.

## Verification
Inspect provider configuration, residency policy tests, redaction tests, data-flow documentation, and audit records.