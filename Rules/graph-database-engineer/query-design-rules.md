# Graph Query Design Rules

## Purpose
Keep traversals correct, bounded, maintainable, and predictable.

## Scope
Graph query languages, pattern matching, traversals, path queries, and projections.

## MUST
- Anchor production queries with selective predicates or known starting entities whenever possible.
- Bound variable-length traversals unless an explicitly reviewed use case requires otherwise.
- Specify intended path semantics, direction, uniqueness, and result cardinality.
- Parameterize external values and validate query inputs.
- Review plans for latency-sensitive or high-volume queries.

## MUST NOT
- Construct executable graph queries by concatenating untrusted input.
- Use unbounded all-path enumeration in production without explicit risk analysis and controls.
- Return entire subgraphs when callers require only a projection.

## SHOULD
- Project only required fields and identifiers.
- Keep complex queries decomposable and accompanied by representative examples.

## Exceptions
Expensive exploratory traversal may be permitted in isolated analytical workloads with resource limits and documented operational impact.

## Verification
Inspect query text, parameters, execution plans/profiles, cardinality estimates, runtime metrics, and load tests. Tests MUST cover edge cases such as cycles, missing relationships, and unexpectedly dense nodes.