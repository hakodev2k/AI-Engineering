# Data Protection Rules

## Purpose
Protect sensitive and regulated data as it crosses system and organizational boundaries.

## Scope
Applies to data classification, transport, storage, logging, retention, masking, and cross-border or third-party transfer.

## MUST
- Data exchanged by an integration MUST be classified before production use when sensitivity is material.
- Sensitive data MUST be encrypted in transit and protected at rest according to project and regulatory requirements.
- Integrations MUST transfer only data required for the documented purpose.
- Retention and deletion behavior MUST be defined for persisted integration payloads, staging areas, queues, and diagnostic stores.
- Sensitive fields MUST be excluded or masked in logs and non-production data sets unless explicitly approved.

## MUST NOT
- MUST NOT replicate sensitive data merely because it is available in the source.
- MUST NOT weaken transport security to accommodate obsolete endpoints without approved risk acceptance.
- MUST NOT retain raw payloads indefinitely for troubleshooting convenience.

## SHOULD
- Tokenization or pseudonymization SHOULD be used where it reduces exposure without defeating the integration purpose.

## Exceptions
Document data categories, necessity, duration, risk, controls, legal/security review where applicable, and approval.

## Verification
Review schemas, network configuration, storage settings, logging, retention jobs, test data, and data-flow documentation.