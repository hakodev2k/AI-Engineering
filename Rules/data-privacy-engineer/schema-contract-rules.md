# Privacy Schema Contract Rules

## Purpose
Make privacy-relevant data semantics explicit in schemas and contracts so changes can be reviewed and enforced.

## Scope
Applies to database schemas, API models, events, files, analytics contracts, and shared data structures containing personal data.

## MUST
- Privacy-sensitive fields MUST have stable semantics and documented classification where schema tooling supports it.
- Schema changes that add, broaden, or repurpose personal-data fields MUST receive privacy-impact review.
- Producers and consumers MUST agree on deletion, nullability, retention, and sensitivity semantics for shared fields.
- Backward-compatible migrations MUST preserve privacy controls during transition periods.
- Contract tests MUST detect accidental introduction of restricted fields into externally visible payloads where practical.

## MUST NOT
- Existing fields MUST NOT be silently repurposed to carry more sensitive data.
- Generic metadata bags MUST NOT be used to bypass schema review for personal attributes.
- Deprecated sensitive fields MUST NOT remain indefinitely without an owner and removal plan.

## SHOULD
- Schemas SHOULD encode classification or handling annotations suitable for automated policy checks.
- Shared contracts SHOULD minimize personal fields exposed across service boundaries.

## Exceptions
Exceptions require documented compatibility constraints, risk, temporary controls, owner, and planned remediation.

## Verification
Review schema diffs, contract tests, generated documentation, payload samples, migration plans, and downstream consumer mappings.