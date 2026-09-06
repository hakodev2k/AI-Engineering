# Sensitive Data and Privacy Rules

## Purpose
Prevent CDC from unintentionally expanding the exposure or retention of sensitive data.

## Scope
PII, secrets, regulated fields, masking, filtering, retention, deletion, and non-production use.

## MUST
- Captured fields MUST be classified before broad downstream distribution.
- Unneeded sensitive columns MUST be excluded as close to the source as safely possible.
- Sensitive payloads MUST be encrypted in transit and at rest according to applicable requirements.
- Retention MUST account for privacy deletion and legal obligations.
- Non-production CDC data MUST be masked, synthetic, or equivalently protected when required.

## MUST NOT
- MUST NOT capture credentials, tokens, or secret material merely because it exists in a source row.
- MUST NOT log raw sensitive payloads for troubleshooting by default.
- MUST NOT replicate restricted data into destinations lacking approved controls.

## SHOULD
- Minimize payload fields and retention duration.
- Maintain lineage for sensitive-field propagation.

## Exceptions
Sensitive-data inclusion requires documented purpose, controls, owner, and privacy/security approval where applicable.

## Verification
Inspect field filters, classifications, encryption settings, retention policies, logs, and destination controls.