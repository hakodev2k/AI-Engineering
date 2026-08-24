# API Design Standards

## Purpose
Keep APIs predictable, evolvable, and usable across teams.

## Scope
Resource models, operations, naming, HTTP semantics, pagination, filtering, and errors.

## MUST
- APIs MUST use protocol semantics consistently and document deviations.
- Validation failures MUST produce stable, actionable error contracts.
- Collection endpoints MUST define bounded pagination when result size can grow.
- Naming and data types MUST be consistent within the platform.

## MUST NOT
- MUST NOT encode transport-specific accidents into domain contracts without justification.
- MUST NOT return ambiguous success for failed operations.

## SHOULD
- Designs SHOULD optimize for consumer comprehension and long-term evolution rather than local implementation convenience.

## Exceptions
A deviation requires rationale, affected consumers, interoperability impact, and review.

## Verification
Run API linting, specification review, examples, and consumer usability review.