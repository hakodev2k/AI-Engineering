# Testing and Determinism
## Purpose
Make streaming correctness reproducible under time, ordering, and failure variation.
## Scope
Unit, integration, replay, property, and failure tests.
## MUST
- Critical transformations MUST have deterministic tests covering ordering, duplicates, late data, and malformed events as applicable.
- Stateful logic MUST be tested across checkpoint/restore boundaries.
- Integration tests MUST exercise real serialization and representative source/sink semantics.
## MUST NOT
- Tests MUST NOT depend on uncontrolled wall-clock timing when virtual or injected time can provide determinism.
## SHOULD
- Property-based or invariant tests SHOULD cover large ordering and partition combinations.
## Exceptions
Nondeterministic integration tests require bounded tolerances and documented evidence criteria.
## Verification
Run tests repeatedly and under reordered, delayed, duplicated, and failure-injected input.