# Partitioning Rules
## Purpose
Use PostgreSQL partitioning only where it improves lifecycle or access behavior.
## Scope
Partition keys, pruning, retention, maintenance, and partition operations.
## MUST
- Justify partitioning with measurable scale, retention, maintenance, or pruning requirements.
- Verify partition pruning for critical query shapes.
- Define partition creation, retention, indexing, and constraint operations before production adoption.
## MUST NOT
- Use partitioning as a substitute for missing indexes or poor queries.
- Create uncontrolled partition counts that impose planning or operational overhead.
## SHOULD
- Choose keys aligned with dominant lifecycle and access patterns.
## Exceptions
Specialized regulatory or tenancy partitioning requires documented non-performance rationale.
## Verification
Inspect plans, partition counts, pruning, maintenance automation, and retention tests.