# Semantic Validity Rules

## Purpose
Ensure generated records are meaningful within the domain rather than merely statistically plausible.

## Scope
Applies to field semantics, cross-field relationships, domain logic, ontology constraints, units, temporal ordering, and scenario coherence.

## MUST
- Encode material domain invariants and validate every released dataset against them.
- Verify cross-field relationships, units, ranges, temporal order, and categorical semantics.
- Distinguish impossible records from rare but valid records.
- Use domain review for constraints that cannot be reliably inferred from data alone.
- Reject generated examples whose meaning conflicts with the intended label or scenario.

## MUST NOT
- Treat syntactic validity or schema conformance as semantic correctness.
- Invent domain rules when authoritative definitions are available.
- Silently repair invalid records in a way that changes labels or target behavior without recording the transformation.
- Keep impossible combinations simply to preserve aggregate distributions.

## SHOULD
- Represent domain constraints as executable validation where practical.
- Maintain test cases for known boundary conditions and historically common invalid combinations.
- Separate generator defects from accepted domain exceptions.

## Exceptions
Any accepted violation must be documented as an intentional scenario with its rationale and downstream interpretation.

## Verification
Run constraint validators, domain-specific property tests, sample-based expert review, temporal checks, and label-semantic consistency checks. Release gates SHOULD fail on unexplained invariant violations.