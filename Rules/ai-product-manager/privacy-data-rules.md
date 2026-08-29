# Privacy and Data Rules

## Purpose
Protect user data and prevent product value from depending on unjustified data collection or use.

## Scope
Applies to data requirements, training and inference inputs, telemetry, personalization, retention, and vendor data flows.

## MUST
- Every material data field used by the product MUST have a documented purpose and lawful or authorized basis.
- Sensitive data use MUST be minimized, access-controlled, and reviewed for necessity.
- Retention and deletion behavior MUST be defined for user data, prompts, outputs, feedback, and derived artifacts when applicable.
- Product requirements MUST identify whether data is used for training, evaluation, personalization, or operations.
- User-facing controls and disclosures MUST match actual system behavior.

## MUST NOT
- MUST NOT collect data merely because it may become useful later.
- MUST NOT silently repurpose data beyond the scope communicated or approved.
- MUST NOT expose sensitive data in logs, analytics, prompts, or model outputs without required controls.

## SHOULD
- Prefer aggregate or de-identified data when individual-level data is unnecessary.
- Privacy impact SHOULD be reviewed before introducing new personalization signals.

## Exceptions
Exceptions require documented necessity, risk, retention, access controls, and approval where required.

## Verification
Inspect data-flow diagrams, schemas, telemetry, retention configuration, access policies, privacy review, and user disclosures.