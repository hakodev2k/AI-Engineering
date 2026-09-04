# Data Exposure and Privacy Rules

## Purpose
Minimize unnecessary data exposure and preserve privacy obligations at API boundaries.

## Scope
Applies to request, response, event, export, and metadata fields that contain sensitive, regulated, personal, or confidential data.

## MUST
- APIs MUST expose only data required for the documented consumer use case.
- Sensitive fields MUST have documented classification, access conditions, and retention implications.
- Field-level redaction or omission MUST occur before data leaves the owning trust boundary when policy requires it.
- Data exports and bulk endpoints MUST receive elevated review when they materially increase disclosure risk.
- Privacy-impacting contract changes MUST be reviewed before production release.

## MUST NOT
- Internal diagnostic, security, or personal data MUST NOT be added to public responses for convenience.
- Sensitive values MUST NOT be placed in URLs when they can leak through logs, history, or intermediaries.
- Masking MUST NOT be represented as anonymization unless re-identification risk has been evaluated.

## SHOULD
- APIs SHOULD use purpose-specific views rather than broad reusable payloads when doing so reduces exposure.
- Sensitive-field usage SHOULD be auditable.

## Exceptions
Exceptions require documented purpose, legal or policy basis where applicable, risk, safeguards, approval, and review date.

## Verification
Inspect schemas, data classifications, authorization tests, sample payloads, logs, privacy reviews, and field-level access tests. Confirm unnecessary sensitive fields are absent.