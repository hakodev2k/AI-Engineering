# Privacy by Design Rules

## Purpose
Ensure privacy obligations are considered during design rather than added only after implementation.

## Scope
Applies to collection, processing, storage, sharing, derivation, retention, and deletion of personal or otherwise privacy-sensitive data.

## MUST
- Systems MUST define the purpose and minimum data needed for privacy-sensitive processing.
- New or materially changed data flows MUST be reviewed for collection, access, retention, sharing, and deletion impacts.
- Privacy controls MUST be enforceable in architecture and configuration where practical.
- User or subject rights supported by the product MUST map to tested system behavior.

## MUST NOT
- MUST NOT collect additional personal data merely because storage is available.
- MUST NOT expose sensitive fields to components that do not require them.

## SHOULD
- Prefer minimization, aggregation, pseudonymization, and short retention when compatible with requirements.

## Exceptions
Exceptions require documented necessity, lawful or contractual basis, safeguards, duration, and approval.

## Verification
Inspect data-flow diagrams, schemas, access paths, retention controls, rights-handling tests, and design reviews.