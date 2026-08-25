# Schema Design Rules
## Purpose
Protect PostgreSQL data semantics, evolvability, and operational safety.
## Scope
Tables, columns, types, constraints, keys, and ownership boundaries.
## MUST
- Model invariants with database constraints when PostgreSQL can enforce them reliably.
- Define primary keys and nullability intentionally; document non-obvious type choices.
- Assess write amplification, table growth, locking, and migration impact before structural changes.
## MUST NOT
- Use unbounded or semantically vague structures to avoid understanding the domain.
- Encode critical integrity rules only in application code when concurrent writers can bypass them.
## SHOULD
- Prefer native PostgreSQL types that preserve domain meaning and validation.
- Keep schemas cohesive around clear data ownership boundaries.
## Exceptions
Exceptions require documented rationale, risks, alternatives, and verification evidence.
## Verification
Review DDL, catalog metadata, constraints, representative data, and migration tests.