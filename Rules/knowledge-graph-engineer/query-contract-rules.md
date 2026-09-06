# Query Contract Rules

## Purpose
Keep graph query behavior stable, bounded, and understandable for consumers.

## Scope
SPARQL, Cypher, Gremlin, graph APIs, traversal contracts, pagination, filtering, and result semantics.

## MUST
- Public graph queries and APIs MUST define result shape, ordering guarantees, pagination semantics, and error behavior where applicable.
- Traversals over unbounded relationships MUST define limits, depth controls, or equivalent safeguards.
- Query changes that alter result semantics MUST be treated as contract changes.
- Parameterized query interfaces MUST validate inputs before execution.

## MUST NOT
- MUST NOT expose arbitrary unrestricted traversal to untrusted callers.
- MUST NOT depend on implicit ordering when deterministic results are required.
- MUST NOT change null, missing-node, or empty-result semantics silently.

## SHOULD
- Prefer reusable parameterized queries for common consumer contracts.
- Keep query plans observable for production-critical paths.

## Exceptions
Unbounded analytical queries require isolated execution controls and documented approval.

## Verification
Review query tests, API contracts, traversal limits, and representative result comparisons.