# Data Contract Rules
## Purpose
Protect producer-consumer agreements for data products.
## Scope
Schemas, semantics, ownership, compatibility, and service-level expectations.
## MUST
- Critical datasets MUST define owners, field semantics, nullability, keys, freshness expectations, and compatibility policy.
- Contract changes MUST be classified as compatible or breaking before release.
- Breaking changes MUST have an approved migration and consumer communication plan.
## MUST NOT
- MUST NOT infer semantic compatibility from schema compatibility alone.
- MUST NOT silently repurpose an existing field.
## SHOULD
- Contracts SHOULD be machine-testable and version controlled.
## Exceptions
Exceptions require documented consumers, risk, migration evidence, and accountable approval.
## Verification
Review contract diffs, compatibility tests, ownership metadata, and consumer impact evidence.