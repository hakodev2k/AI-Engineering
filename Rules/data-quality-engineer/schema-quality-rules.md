# Schema Quality Rules
## Purpose
Keep schemas structurally precise and evolvable.
## Scope
Types, keys, constraints, naming, optionality, and evolution.
## MUST
- Schemas MUST encode stable invariants with appropriate types and constraints.
- Primary/business keys MUST have explicit uniqueness semantics.
- Nullable fields MUST distinguish unknown, unavailable, and not-applicable when those states matter.
## MUST NOT
- MUST NOT use permissive string fields to bypass known domain constraints without justification.
- MUST NOT remove or narrow fields without compatibility analysis.
## SHOULD
- Schema checks SHOULD run automatically before publication.
## Exceptions
Relaxed schemas require documented reason, downstream risk, and compensating validation.
## Verification
Inspect schema definitions, constraint tests, compatibility checks, and representative invalid records.