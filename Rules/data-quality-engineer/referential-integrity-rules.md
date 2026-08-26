# Referential Integrity Rules
## Purpose
Protect relationships among entities and facts.
## Scope
Foreign keys, logical references, orphan detection, and lifecycle ordering.
## MUST
- Critical relationships MUST define valid parent-child semantics and deletion behavior.
- Orphan records MUST be detected where physical constraints cannot enforce integrity.
- Late-arriving dimensions MUST have explicit handling semantics.
## MUST NOT
- MUST NOT silently drop unmatched facts during joins unless the contract explicitly permits it.
- MUST NOT assume database constraints cover cross-system references.
## SHOULD
- Integrity checks SHOULD quantify orphan rates and affected business value.
## Exceptions
Temporary orphans require bounded resolution windows and monitoring.
## Verification
Run referential tests, inspect join-loss metrics, constraints, and late-arrival handling.