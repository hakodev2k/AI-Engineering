# Schema Design Rules
## Purpose
Keep database schemas semantically correct, evolvable, and enforceable.
## Scope
Relational schemas, keys, constraints, types, and ownership boundaries.
## MUST
- Model stable business invariants with appropriate keys, nullability, constraints, and data types.
- Define ownership and lifecycle for every persistent entity.
- Review schema choices for expected access patterns and future evolution.
## MUST NOT
- Use weak types or nullable columns merely to avoid modeling decisions.
- Encode critical integrity rules only in application convention when the database can safely enforce them.
## SHOULD
- Prefer simple normalized structures unless measured workloads justify another shape.
## Exceptions
Document the constraint, alternatives, operational risk, and migration implications.
## Verification
Inspect DDL, constraints, representative data, architecture decisions, and schema tests.