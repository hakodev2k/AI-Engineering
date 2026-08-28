# Privacy and Data Use Rules

## Purpose
Ensure personalization uses user and item data only within authorized, minimized, and auditable boundaries.

## Scope
Applies to identity signals, behavioral history, profile data, sensitive attributes, retention, access, deletion, and model-training use.

## MUST
- Every personal-data feature MUST have documented purpose, source, retention expectation, and access policy.
- Recommendation systems MUST honor applicable deletion, consent, and opt-out requirements within defined service-level expectations.
- Sensitive attributes MUST require explicit authorization before collection, training use, inference, or debugging.
- Data exported for offline analysis or model development MUST preserve the same or stronger access protections as production sources.
- Logs and diagnostics MUST minimize direct identifiers and sensitive content.

## MUST NOT
- MUST NOT repurpose personal data for a materially different recommendation objective without approved review.
- MUST NOT use deleted or revoked data in new training runs once removal obligations apply.
- MUST NOT expose raw personal histories in broad-access dashboards or logs.

## SHOULD
- Data minimization SHOULD remove features whose incremental value does not justify privacy risk.
- Aggregation or pseudonymization SHOULD be preferred when full identity is unnecessary.

## Exceptions
Exceptions require documented necessity, risk assessment, retention boundary, and authorized privacy or legal approval where applicable.

## Verification
Inspect feature catalogs, access controls, deletion tests, consent propagation, retention jobs, logging schemas, and training-data lineage.