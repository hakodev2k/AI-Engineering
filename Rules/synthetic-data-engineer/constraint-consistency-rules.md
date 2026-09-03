# Constraint Consistency Rules

## Purpose
Keep generated datasets internally consistent with explicit business, physical, temporal, and relational constraints.

## Scope
Applies to row-level, cross-row, relational, temporal, hierarchical, and scenario-wide invariants.

## MUST
- Define critical constraints explicitly and version them with the generator or validation package.
- Validate referential integrity, ordering, uniqueness, cardinality, ranges, and cross-entity relationships where applicable.
- Detect contradictions introduced by multi-stage generation or post-processing.
- Fail release when mandatory invariants are violated beyond approved tolerance.
- Preserve evidence showing whether a constraint was enforced during generation, repaired afterward, or only checked at validation time.

## MUST NOT
- Rely on prompt wording or model instruction alone as proof that constraints will hold.
- Repair invalid records silently when the repair changes outcome semantics or downstream labels.
- Accept mutually inconsistent constraints without escalation.
- Disable validation checks simply to increase generation yield.

## SHOULD
- Enforce hard constraints as close to generation time as practical.
- Use property-based tests for broad invariant coverage.
- Separate hard domain constraints from soft distribution preferences.

## Exceptions
A tolerated constraint violation requires quantified frequency, impact analysis, rationale, and explicit approval when downstream correctness may be affected.

## Verification
Run deterministic validators, relational integrity checks, property-based tests, temporal consistency checks, and review repair logs and release thresholds.